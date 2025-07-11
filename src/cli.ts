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
  dim: '\x1b[2m',
  // Bold gradient colors with dramatic artistic accents
  darkBlue: '\x1b[38;2;0;100;255m', // Electric blue (bold)
  mediumBlue: '\x1b[38;2;50;150;255m', // Bright blue
  lightBlue: '\x1b[38;2;100;200;255m', // Vivid sky blue
  blueCyan: '\x1b[38;2;0;150;255m', // Electric blue-cyan
  mediumCyan: '\x1b[38;2;0;255;255m', // Pure cyan (bold)
  darkCyan: '\x1b[38;2;0;200;200m', // Electric turquoise
  softTeal: '\x1b[38;2;0;255;150m', // Electric teal
  tealGreen: '\x1b[38;2;0;200;100m', // Vivid teal green
  softGreen: '\x1b[38;2;50;255;100m', // Electric green
  mediumGreen: '\x1b[38;2;0;255;50m', // Pure green (bold)
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
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  });

  // Split title into lines for gradient effect
  const lines = title.split('\n');
  const totalLines = lines.length;
  const gradientTitle = lines
    .map((line, lineIndex) => {
      // Process each character for 45-degree gradient
      const chars = line.split('');
      const processedLine = chars
        .map((char, charIndex) => {
          // Calculate 45-degree diagonal position from bottom-left
          // Normalize coordinates: lineIndex (0 to totalLines-1), charIndex (0 to line.length-1)
          const y = (totalLines - 1 - lineIndex) / (totalLines - 1); // 0 = top, 1 = bottom (reversed)
          const x = charIndex / (line.length - 1 || 1); // 0 = left, 1 = right

          // For 45-degree gradient from bottom-left to top-right
          // The diagonal progress is (x + y) / 2, where bottom-left is 0 and top-right is 1
          const diagonalProgress = (x + y) / 2;

          if (char.trim() === '') {
            return char; // Keep whitespace as-is
          }

          // Create sophisticated gradient with soft accent transitions (blue-dominant progression)
          if (diagonalProgress <= 0.1) {
            // 0-10% - Dark blue (bottom-left)
            return `${colors.darkBlue}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.2) {
            // 10-20% - Light blue accent
            return `${colors.lightBlue}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.32) {
            // 20-32% - Medium blue
            return `${colors.mediumBlue}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.42) {
            // 32-42% - Blue-cyan blend
            return `${colors.blueCyan}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.52) {
            // 42-52% - Medium cyan accent
            return `${colors.mediumCyan}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.62) {
            // 52-62% - Dark cyan (center transition)
            return `${colors.darkCyan}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.72) {
            // 62-72% - Soft teal accent
            return `${colors.softTeal}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.82) {
            // 72-82% - Teal green
            return `${colors.tealGreen}${char}${colors.reset}`;
          } else if (diagonalProgress <= 0.92) {
            // 82-92% - Soft green accent
            return `${colors.softGreen}${char}${colors.reset}`;
          } else {
            // 92-100% - Medium green (top-right)
            return `${colors.mediumGreen}${char}${colors.reset}`;
          }
        })
        .join('');

      return processedLine;
    })
    .join('\n');

  return `
${gradientTitle}

  ${colors.gray}Transform SVG files into production-ready components${colors.reset}
            ${colors.blue}React${colors.reset} ${colors.gray}•${colors.reset} ${colors.green}Vue 3${colors.reset} ${colors.gray}•${colors.reset} ${colors.blue}TypeScript${colors.reset}
  
${colors.gray}─────────────────────────────────────────────────────────${colors.reset}
`;
}

const program = new Command();

// Show banner when running without arguments or via npx
const isNpxCall =
  process.argv[1]?.includes('npx') || process.argv[1]?.includes('_npx');
if (process.argv.length === 2 || (isNpxCall && process.argv.length === 3)) {
  console.log(createBanner());
}

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

        // eslint-disable-next-line no-console
        console.log(
          `${colors.dim}📁 Output location: ${colors.reset}${colors.cyan}${output}${colors.reset}`
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
