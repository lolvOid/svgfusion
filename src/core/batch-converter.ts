import { readdir, stat } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import {
  BatchConversionOptions,
  BatchConversionResult,
  ConversionError,
  ConversionResult,
} from '../types/index';
import { ReactConverter } from './react-converter';
import { VueConverter } from './vue-converter';
import { generateIndexFile } from '../utils/index-generator';
import { ensureDir, writeComponentFile } from '../utils/files';
import {
  validateDuplicateNames,
  formatDuplicateErrors,
} from '../utils/duplicate-validator';

/**
 * Batch converter for processing multiple SVG files
 */
export class BatchConverter {
  private reactConverter = new ReactConverter();
  private vueConverter = new VueConverter();

  /**
   * Convert multiple SVG files to framework components
   */
  async convertBatch(
    options: BatchConversionOptions
  ): Promise<BatchConversionResult> {
    const {
      inputDir,
      outputDir,
      recursive = false,
      extensions = ['.svg'],
      generateIndex = false,
      framework = 'react',
      ...conversionOptions
    } = options;

    const results: ConversionResult[] = [];
    const errors: ConversionError[] = [];

    try {
      // Ensure output directory exists
      await ensureDir(outputDir);

      // Get all SVG files
      const svgFiles = await this.getSvgFiles(inputDir, recursive, extensions);

      // Validate for duplicate component names before processing
      const duplicateValidation = validateDuplicateNames(svgFiles, {
        prefix: conversionOptions.prefix,
        suffix: conversionOptions.suffix,
      });

      if (duplicateValidation.hasDuplicates) {
        const errorMessage = formatDuplicateErrors(duplicateValidation);
        throw new Error(
          `Duplicate component names detected:\n\n${errorMessage}`
        );
      }

      // Convert each file
      for (const filePath of svgFiles) {
        try {
          const { readSvgFile } = await import('../utils/files');
          const svgContent = await readSvgFile(filePath);
          const converter =
            framework === 'react' ? this.reactConverter : this.vueConverter;
          const componentName = await this.getComponentNameFromFile(
            filePath,
            options
          );
          const result = await converter.convert(svgContent, {
            ...conversionOptions,
            name: componentName,
          });

          // Write the converted component to output directory
          const outputPath = await this.getOutputPath(
            filePath,
            inputDir,
            outputDir,
            result.filename
          );
          await writeComponentFile(outputPath, result.code);

          results.push(result);
        } catch (error) {
          errors.push({
            file: filePath,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          });
        }
      }

      // Generate index file if requested
      if (generateIndex && results.length > 0) {
        await this.generateIndexFile(outputDir, results, options);
      }

      return {
        results,
        errors,
        summary: {
          total: svgFiles.length,
          successful: results.length,
          failed: errors.length,
        },
      };
    } catch (error) {
      throw new Error(
        `Batch conversion failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Get component names from batch conversion results
   */
  getComponentNames(results: BatchConversionResult): string[] {
    return results.results.map(result => result.componentName);
  }

  /**
   * Generate summary report of conversion results
   */
  generateSummaryReport(results: BatchConversionResult): string {
    const { summary, errors } = results;
    const componentNames = this.getComponentNames(results);

    let report = `\n=== SVG Conversion Summary ===\n`;
    report += `Total files processed: ${summary.total}\n`;
    report += `Successful conversions: ${summary.successful}\n`;
    report += `Failed conversions: ${summary.failed}\n`;

    if (componentNames.length > 0) {
      report += `\nGenerated components:\n`;
      componentNames.forEach(name => {
        report += `  - ${name}\n`;
      });
    }

    if (errors.length > 0) {
      report += `\nErrors:\n`;
      errors.forEach(error => {
        report += `  - ${error.file}: ${error.error}\n`;
      });
    }

    return report;
  }

  /**
   * Get all SVG files in directory
   */
  private async getSvgFiles(
    dir: string,
    recursive: boolean,
    extensions: string[]
  ): Promise<string[]> {
    const files: string[] = [];
    const items = await readdir(dir);

    for (const item of items) {
      const fullPath = join(dir, item);
      const stats = await stat(fullPath);

      if (stats.isDirectory() && recursive) {
        const subFiles = await this.getSvgFiles(
          fullPath,
          recursive,
          extensions
        );
        files.push(...subFiles);
      } else if (
        stats.isFile() &&
        extensions.includes(extname(item).toLowerCase())
      ) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Generate index file for tree-shaking
   */
  private async generateIndexFile(
    outputDir: string,
    results: ConversionResult[],
    options: BatchConversionOptions
  ): Promise<void> {
    const {
      indexFormat = 'ts',
      exportType = 'named',
      typescript = true,
    } = options;

    const indexContent = generateIndexFile(results, {
      format: indexFormat,
      exportType,
      typescript,
    });

    const indexFilename = `index.${indexFormat}`;
    const indexPath = join(outputDir, indexFilename);

    await writeComponentFile(indexPath, indexContent);
  }

  /**
   * Get component name from file path
   */
  private async getComponentNameFromFile(
    filePath: string,
    options: BatchConversionOptions
  ): Promise<string> {
    const filename = basename(filePath, extname(filePath));
    const { prefix = '', suffix = '' } = options;
    const { pascalCase } = await import('../utils/string');

    let componentName = pascalCase(filename);
    if (prefix) {
      componentName = `${pascalCase(prefix)}${componentName}`;
    }
    if (suffix) {
      componentName = `${componentName}${pascalCase(suffix)}`;
    }

    return componentName;
  }

  /**
   * Get output path for converted component
   */
  private async getOutputPath(
    inputPath: string,
    inputDir: string,
    outputDir: string,
    filename: string
  ): Promise<string> {
    // Get relative path from input directory
    const relativePath = inputPath.replace(inputDir, '').replace(/^[/\\]/, '');
    const relativeDirPath = relativePath.includes('/')
      ? relativePath.substring(0, relativePath.lastIndexOf('/'))
      : relativePath.includes('\\')
      ? relativePath.substring(0, relativePath.lastIndexOf('\\'))
      : '';

    // Create output path maintaining directory structure
    const outputPath = relativeDirPath
      ? join(outputDir, relativeDirPath, filename)
      : join(outputDir, filename);

    // Ensure the output directory exists
    await ensureDir(dirname(outputPath));

    return outputPath;
  }
}
