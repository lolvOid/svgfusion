import { Command } from 'commander';
import {
  readSvgFile,
  readSvgDirectory,
  writeComponentFile,
} from './utils/files.js';
import { stat } from 'fs/promises';
import { extname, basename } from 'path';
import { svgToComponentName } from './utils/name.js';
import { convertToReact } from './core/react-converter.js';
import { convertToVue } from './core/vue-converter.js';
import { optimizeSvg } from './utils/svgo.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import figlet from 'figlet';

// ANSI color codes
const colors = {
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  reset: '\x1b[0m',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
) as { version: string };

// Create ASCII art banner
function createBanner(): string {
  const title = figlet.textSync('SVGfusion', {
    font: 'Bloody',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  });

  return `
${colors.cyan}${title}${colors.reset}

  ${colors.gray}Transform SVG files into production-ready components${colors.reset}
            ${colors.blue}React${colors.reset} ${colors.gray}•${colors.reset} ${colors.green}Vue 3${colors.reset} ${colors.gray}•${colors.reset} ${colors.blue}TypeScript${colors.reset}
  
${colors.gray}─────────────────────────────────────────────────────────${colors.reset}
`;
}

const program = new Command();

// Show banner when running without arguments
console.log(createBanner());

program
  .name('svgfusion')
  .description(
    'Transform SVG files into production-ready React and Vue 3 components'
  )
  .version(packageJson.version);

program
  .command('convert')
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
  .action(
    async (
      input: string,
      options: {
        framework: string;
        output: string;
        typescript: boolean;
        optimize: boolean;
      }
    ) => {
      // eslint-disable-next-line no-console
      console.log(createBanner());

      // eslint-disable-next-line no-console
      console.log(`${colors.blue}🔄 Processing SVG files...${colors.reset}`);

      try {
        const { framework, output, typescript, optimize } = options;

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

        // eslint-disable-next-line no-console
        console.log(
          `${colors.blue}🔄 Converting ${svgFiles.length} SVG file(s)...${colors.reset}`
        );

        for (const filePath of svgFiles) {
          const svgContent = await readSvgFile(filePath);

          // Optimize SVG if requested
          const optimizedSvg = optimize ? optimizeSvg(svgContent) : svgContent;

          // Generate component name from filename
          const filename = basename(filePath);
          const componentName = svgToComponentName(filename);

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

        // eslint-disable-next-line no-console
        console.log(
          `${colors.green}✅ Successfully converted ${svgFiles.length} SVG file(s) to ${framework} components${colors.reset}`
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `${colors.red}❌ Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }${colors.reset}`
        );
        process.exit(1);
      }
    }
  );

program.parse();
