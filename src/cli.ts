import { Command } from 'commander';
import {
  readSvgFile,
  readSvgDirectory,
  writeComponentFile,
} from './utils/files.js';
import { convertToReact } from './converters/react.js';
import { convertToVue } from './converters/vue.js';
import { optimizeSvg } from './utils/svgo.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
) as { version: string };

const program = new Command();

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
      console.log('🔄 Processing SVG files...');

      try {
        const { framework, output, typescript, optimize } = options;

        if (framework !== 'react' && framework !== 'vue') {
          throw new Error('Framework must be either "react" or "vue"');
        }

        // Read input files
        const svgFiles = await readSvgDirectory(input);

        if (svgFiles.length === 0) {
          throw new Error('No SVG files found in the input path');
        }

        // eslint-disable-next-line no-console
        console.log(`🔄 Converting ${svgFiles.length} SVG file(s)...`);

        for (const filePath of svgFiles) {
          const svgContent = await readSvgFile(filePath);

          // Optimize SVG if requested
          const optimizedSvg = optimize ? optimizeSvg(svgContent) : svgContent;

          // Convert based on framework
          const result =
            framework === 'react'
              ? await convertToReact(optimizedSvg, { typescript })
              : convertToVue(optimizedSvg, { typescript });

          // Write component file
          const outputPath = join(output, result.filename);
          await writeComponentFile(outputPath, result.code);
        }

        // eslint-disable-next-line no-console
        console.log(
          `✅ Successfully converted ${svgFiles.length} SVG file(s) to ${framework} components`
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          `❌ Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
        process.exit(1);
      }
    }
  );

program.parse();
