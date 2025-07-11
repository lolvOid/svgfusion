import { Command } from 'commander';
import {
  readSvgFile,
  readSvgDirectory,
  writeComponentFile,
} from './utils/files.js';
import { stat } from 'fs/promises';
import { extname, basename } from 'path';
import { svgToComponentName } from './utils/name.js';
import { formatComponentName } from './utils/name.js';
import { convertToReact } from './core/react-converter.js';
import { convertToVue } from './core/vue-converter.js';
import { optimizeSvg } from './utils/svgo.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { createBanner } from './utils/banner.js';
import { colors } from './utils/colors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
) as { version: string };

const program = new Command();

// Show banner when running without arguments or via npx
const isNpxCall =
  process.argv[1]?.includes('npx') || process.argv[1]?.includes('_npx');
if (process.argv.length === 1 || (isNpxCall && process.argv.length === 2)) {
  console.log(createBanner(colors));
}

program
  .name('svgfusion')
  .description(
    'Transform SVG files into production-ready React and Vue 3 components'
  )
  .version(packageJson.version);

program
  .argument('[input]', 'Input SVG file or directory')
  .option('-o, --output <output>', 'Output directory', './components')
  .option(
    '-f, --framework <framework>',
    'Target framework (react|vue)',
    'react'
  )
  .option('-t, --typescript', 'Generate TypeScript files', false)
  .option(
    '-r, --recursive',
    'Recursively scan input directory for SVG files',
    false
  )
  .option('--no-optimize', 'Skip SVG optimization')
  .option('--prefix <prefix>', 'Add prefix to component name')
  .option('--suffix <suffix>', 'Add suffix to component name')
  .option('--index', 'Generate index file for tree-shaking', false)
  .option('--index-format <format>', 'Index file format (ts|js)', 'ts')
  .option('--export-type <type>', 'Export type (named|default)', 'named')
  .action(
    async (
      input?: string,
      options?: {
        framework: string;
        output: string;
        typescript: boolean;
        recursive: boolean;
        optimize: boolean;
        prefix?: string;
        suffix?: string;
        index: boolean;
        indexFormat: string;
        exportType: string;
      }
    ) => {
      // Show help if no input provided
      if (!input) {
        program.outputHelp();
        process.exit(0);
      }

      console.log(createBanner(colors));

      console.log(`${colors.blue}🔄 Processing SVG files...${colors.reset}`);

      try {
        const {
          framework,
          output,
          typescript,
          recursive,
          optimize,
          prefix,
          suffix,
          index: generateIndex,
          indexFormat,
          exportType,
        } = options!;

        if (framework !== 'react' && framework !== 'vue') {
          throw new Error('Framework must be either "react" or "vue"');
        }

        // Read input files
        const inputStat = await stat(input);
        let svgFiles: string[];

        if (inputStat.isFile()) {
          // Single file input
          if (extname(input).toLowerCase() === '.svg') {
            svgFiles = [input];
          } else {
            throw new Error('Input file must be an SVG file');
          }
        } else if (inputStat.isDirectory()) {
          // Directory input
          svgFiles = await readSvgDirectory(input, recursive);
        } else {
          throw new Error('Input must be a file or directory');
        }

        if (svgFiles.length === 0) {
          throw new Error('No SVG files found in the input path');
        }

        console.log(
          `${colors.blue}🔄 Converting ${svgFiles.length} SVG file(s)...${colors.reset}`
        );

        const results = [];

        for (const filePath of svgFiles) {
          const svgContent = await readSvgFile(filePath);

          // Optimize SVG if requested
          const optimizedSvg = optimize ? optimizeSvg(svgContent) : svgContent;

          // Generate component name from filename
          const filename = basename(filePath);
          const componentName = formatComponentName(
            svgToComponentName(filename),
            prefix,
            suffix
          );

          // Convert based on framework
          const result =
            framework === 'react'
              ? await convertToReact(optimizedSvg, {
                  typescript,
                  name: componentName,
                })
              : await convertToVue(optimizedSvg, {
                  typescript,
                  name: componentName,
                });

          // Write component file
          const outputPath = join(output, result.filename);
          await writeComponentFile(outputPath, result.code);

          results.push(result);
        }

        // Generate index file if requested
        if (generateIndex && results.length > 0) {
          const { generateIndexFile } = await import(
            './utils/index-generator.js'
          );
          const indexContent = generateIndexFile(results, {
            format: indexFormat as 'ts' | 'js',
            exportType: exportType as 'named' | 'default',
            typescript,
          });

          const indexFilename = `index.${indexFormat}`;
          const indexPath = join(output, indexFilename);
          await writeComponentFile(indexPath, indexContent);

          console.log(
            `${colors.green}📄 Generated ${indexFilename} for tree-shaking${colors.reset}`
          );
        }

        console.log(
          `${colors.green}✅ Successfully converted ${svgFiles.length} SVG file(s) to ${framework} components${colors.reset}`
        );

        console.log(
          `${colors.dim}📁 Output location: ${colors.reset}${colors.cyan}${output}${colors.reset}`
        );

        // Display component names
        const componentNames = results.map(r => r.componentName);
        console.log(
          `${colors.dim}📦 Generated components: ${
            colors.reset
          }${componentNames.join(', ')}`
        );
      } catch (error) {
        console.error(
          `${colors.red}❌ Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }${colors.reset}`
        );
        process.exit(1);
      }
    }
  )
  .addHelpText('before', createBanner(colors))
  .addHelpText(
    'after',
    `\n${colors.gray}Examples:${colors.reset}\n` +
      `  ${colors.blue}svgfusion src/icons -o src/components${colors.reset}\n` +
      `  ${colors.blue}svgfusion src/icons --framework vue --typescript${colors.reset}\n` +
      `  ${colors.blue}svgfusion src/icons --recursive --index${colors.reset}\n` +
      `  ${colors.blue}svgfusion src/icons --prefix Icon --suffix Component --index${colors.reset}\n` +
      `  ${colors.blue}svgfusion src/icons --framework react --typescript --optimize${colors.reset}\n`
  );

// Show help by default if no arguments provided
if (process.argv.length === 2) {
  program.outputHelp();
  process.exit(0);
}

program.parse();
