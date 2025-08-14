import { program } from 'commander';
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
} from 'fs';
import { resolve, basename, extname, join } from 'path';
import { Framework, SVGFusion, SVGFusionOptions } from 'svgfusion-core';
import { ReactGenerator } from 'svgfusion-react';
import { createBanner, ansiColors } from 'svgfusion-utils';
import { VueGenerator } from 'svgfusion-vue';

const TITLE = 'SVGfusion';
// Use existing banner system instead of hardcoded ASCII
function showBanner() {
  console.log(createBanner(ansiColors, TITLE));
}

export interface CliOptions {
  framework: Framework;
  input: string;
  output?: string;
  name?: string;
  prefix?: string;
  suffix?: string;
  optimize?: boolean;
  typescript?: boolean;
  javascript?: boolean; // For CLI parsing
  format?: 'esm' | 'cjs';
  recursive?: boolean;
  verbose?: boolean;
  generateIndex?: boolean;
  indexFormat?: 'ts' | 'js';
  exportType?: 'named' | 'default';
  splitColors?: boolean;
  splitStrokeWidths?: boolean;
  fixedStrokeWidth?: boolean;
  normalizeFillStroke?: boolean;
  accessibility?: boolean;
  removeComments?: boolean;
  removeDuplicates?: boolean;
  removeFilters?: boolean;
  forwardRef?: boolean;
  memo?: boolean;
  minifyPaths?: boolean;
  index: boolean;
  // Legacy support
  isFixedStrokeWidth?: boolean;
}

async function convertSvgFile(
  filePath: string,
  options: CliOptions
): Promise<void> {
  try {
    // Read SVG file
    const svgContent = readFileSync(filePath, 'utf8');

    console.log(
      `🔄 Converting: ${basename(filePath)}`,
      options.prefix,
      options.suffix
    );
    // Generate component name from filename if not provided
    const fileName = basename(filePath, extname(filePath));
    const componentName = options.name || fileName;
    const fusionOptions: SVGFusionOptions = {
      framework: options.framework || 'react',
      transformation: {
        optimize: options.optimize ?? true,
        splitColors: options.splitColors,
        splitStrokeWidths: options.splitStrokeWidths,
        fixedStrokeWidth: options.fixedStrokeWidth,
        normalizeFillStroke: options.normalizeFillStroke,
        accessibility: true,
        removeFilters: options.removeFilters,
      },
      generator: {
        prefix: options.prefix || '',
        suffix: options.suffix || '',
        typescript: options.typescript ?? true,
        memo: options.memo ?? true,
        forwardRef: options.forwardRef ?? true,
        componentName,
      },
    };

    // Convert SVG
    const fusion = new SVGFusion();
    const generator =
      options.framework === 'react' ? ReactGenerator : VueGenerator;
    const result = await fusion.convert(svgContent, fusionOptions, generator);

    // Determine output directory
    const outputDir = options.output || './components';

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write component file
    const outputPath = resolve(outputDir, result.filename);
    writeFileSync(outputPath, result.code, 'utf8');

    console.log(
      `✅ Successfully converted SVG to ${options.framework} component`
    );
    console.log(`📁 Output location: ${outputDir}`);
    console.log(`📦 Generated component: ${result.componentName}`);

    // Show additional info for split colors
    if (options.splitColors && result.metadata.originalColors.length > 0) {
      console.log(
        `🎨 Colors extracted: ${result.metadata.originalColors.join(', ')}`
      );
    }

    // Show additional info for split stroke widths
    if (
      options.splitStrokeWidths &&
      result.metadata.originalStrokeWidths.length > 0
    ) {
      console.log(
        `📏 Stroke widths extracted: ${result.metadata.originalStrokeWidths.join(', ')}`
      );
    }
  } catch (error) {
    console.error(
      '❌ Conversion failed:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

function findSvgFiles(dirPath: string, recursive: boolean = false): string[] {
  const svgFiles: string[] = [];

  try {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && recursive) {
        svgFiles.push(...findSvgFiles(fullPath, recursive));
      } else if (stat.isFile() && item.toLowerCase().endsWith('.svg')) {
        svgFiles.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return svgFiles;
}

async function processInput(input: string, options: CliOptions): Promise<void> {
  const inputPath = resolve(input);

  if (!existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    process.exit(1);
  }

  const stat = statSync(inputPath);

  if (stat.isFile()) {
    if (!inputPath.toLowerCase().endsWith('.svg')) {
      console.error('❌ Input file must be an SVG file');
      process.exit(1);
    }
    await convertSvgFile(inputPath, options);
  } else if (stat.isDirectory()) {
    const svgFiles = findSvgFiles(inputPath, options.recursive);

    if (svgFiles.length === 0) {
      console.error('❌ No SVG files found in the specified directory');
      process.exit(1);
    }

    console.log(`🔄 Processing ${svgFiles.length} SVG file(s)...`);

    for (const svgFile of svgFiles) {
      console.log(`\n📄 Processing: ${basename(svgFile)}`);
      await convertSvgFile(svgFile, options);
    }

    if (options.index) {
      generateIndexFile(options.output || './components', options);
    }

    console.log(
      `\n✅ Successfully converted ${svgFiles.length} SVG file(s) to ${options.framework} components`
    );
  }
}

function generateIndexFile(outputDir: string, _options: CliOptions): void {
  try {
    const files = readdirSync(outputDir);
    const componentFiles = files.filter(
      file =>
        file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.vue')
    );

    if (componentFiles.length === 0) {
      return;
    }

    const exports = componentFiles
      .map(file => {
        const name = basename(file, extname(file));
        return `export { default as ${name} } from './${name}';`;
      })
      .join('\n');

    const indexContent = `// Auto-generated index file\n${exports}\n`;
    const indexPath = join(outputDir, 'index.ts');

    writeFileSync(indexPath, indexContent, 'utf8');
    console.log('📄 Generated index.ts for tree-shaking');
  } catch (error) {
    console.error('Warning: Failed to generate index file:', error);
  }
}

async function main() {
  showBanner();

  program
    .name('svgfusion')
    .description(
      'Transform SVG files into production-ready React/Vue components'
    )
    .version('2.0.0')
    .argument('<input>', 'SVG file or directory to convert')
    .option(
      '-o, --output <dir>',
      'Output directory for generated components',
      './components'
    )
    .option(
      '-f, --framework <framework>',
      'Target framework: react or vue',
      'react'
    )
    .option('--typescript', 'Generate TypeScript components')
    .option('--javascript', 'Generate JavaScript components')
    .option('--split-colors', 'Enable color splitting feature')
    .option('--split-stroke-widths', 'Enable stroke width splitting feature')
    .option('--fixed-stroke-width', 'Enable fixed stroke width feature')
    .option('--memo', 'Wrap component with React.memo')
    .option('--no-memo', 'Disable React.memo wrapping')
    .option('--forward-ref', 'Enable forwardRef support')
    .option('--no-forward-ref', 'Disable forwardRef support')
    .option('-n, --name <name>', 'Custom component name')
    .option('--optimize', 'Enable SVG optimization')
    .option('--no-optimize', 'Disable SVG optimization')
    .option('--recursive', 'Process directories recursively')
    .option('--prefix <prefix>', 'Add prefix to component names')
    .option('--suffix <suffix>', 'Add suffix to component names')
    .option('--index', 'Generate index.ts file for directory processing')
    .option(
      '--normalize-fill-stroke',
      'Normalize fill and stroke attributes for consistency'
    )
    .option('--remove-filters', 'Remove filter elements from defs')
    .addHelpText(
      'after',
      `
${ansiColors.darkBlue}
Examples:
  $ svgfusion icon.svg                                    # Convert single file
  $ svgfusion ./icons --output ./components               # Convert directory
  $ svgfusion ./icons --framework vue --typescript        # Vue with TypeScript
  $ svgfusion ./icons --prefix Icon --suffix Component    # Add prefix/suffix
  $ svgfusion ./icons --split-colors --fixed-stroke-width # Advanced features
  $ svgfusion ./icons --recursive --index                 # Recursive with index
${ansiColors.reset}
`
    )
    .action(async (input: string, rawOptions: Record<string, unknown>) => {
      const options = rawOptions as unknown as CliOptions;

      // Process TypeScript/JavaScript option
      if (options.javascript) {
        options.typescript = false;
      } else if (options.typescript === undefined) {
        options.typescript = true;
      }

      // Process the input (file or directory)
      await processInput(input, options);
    });

  // Show help if no arguments provided
  if (process.argv.length <= 2) {
    program.help();
  }

  program.parse();
}

export function runCli() {
  main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

export default runCli;
