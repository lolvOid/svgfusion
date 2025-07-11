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
  .description('Convert SVG files to React or Vue components')
  .argument('<input>', 'Input SVG file or directory')
  .option('-o, --output <output>', 'Output directory', './components')
  .option(
    '-f, --framework <framework>',
    'Target framework (react|vue)',
    'react'
  )
  .option('-t, --typescript', 'Generate TypeScript files', false)
  .option('--no-optimize', 'Skip SVG optimization')
  .option('--prefix <prefix>', 'Add prefix to component name')
  .option('--suffix <suffix>', 'Add suffix to component name')
  .action(
    async (
      input: string,
      options: {
        framework: string;
        output: string;
        typescript: boolean;
        optimize: boolean;
        prefix?: string;
        suffix?: string;
      }
    ) => {
      console.log(createBanner(colors));

      console.log(`${colors.blue}🔄 Processing SVG files...${colors.reset}`);

      try {
        const { framework, output, typescript, optimize, prefix, suffix } =
          options;

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
          svgFiles = await readSvgDirectory(input);
        } else {
          throw new Error('Input must be a file or directory');
        }

        if (svgFiles.length === 0) {
          throw new Error('No SVG files found in the input path');
        }

        console.log(
          `${colors.blue}🔄 Converting ${svgFiles.length} SVG file(s)...${colors.reset}`
        );

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
        }

        console.log(
          `${colors.green}✅ Successfully converted ${svgFiles.length} SVG file(s) to ${framework} components${colors.reset}`
        );

        console.log(
          `${colors.dim}📁 Output location: ${colors.reset}${colors.cyan}${output}${colors.reset}`
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
      `  ${colors.blue}svgfusion convert src/icons -o src/components${colors.reset}\n` +
      `  ${colors.blue}svgfusion convert src/icons --framework vue --typescript${colors.reset}\n` +
      `  ${colors.blue}svgfusion convert src/icons --optimize --prefix My --suffix Widget${colors.reset}\n` +
      `  ${colors.blue}svgfusion convert src/icons --framework react --typescript --optimize${colors.reset}\n`
  )
  .outputHelp();
program.parse();
