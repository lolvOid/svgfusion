/**
 * Browser-compatible SVGFusion API
 * Returns converted component strings instead of writing to files
 */

import {
  SVGFusion,
  SVGFusionOptions,
  ConversionResult,
} from 'svgfusion-core/browser';
import { ReactGenerator, ReactGeneratorOptions } from 'svgfusion-react';
import { VueGenerator, VueGeneratorOptions } from 'svgfusion-vue';

export interface BrowserConversionOptions extends SVGFusionOptions {
  framework: 'react' | 'vue';
  typescript?: boolean;
  componentName?: string;
  prefix?: string;
  suffix?: string;
  splitColors?: boolean;
  splitStrokeWidths?: boolean;
  fixedStrokeWidth?: boolean;
  normalizeFillStroke?: boolean;
  memo?: boolean;
  forwardRef?: boolean;
  sfc?: boolean; // For Vue Single File Components
  scriptSetup?: boolean; // For Vue <script setup>
  optimize?: boolean;
}

export interface BrowserConversionResult extends ConversionResult {
  framework: 'react' | 'vue';
  typescript: boolean;
  dependencies: string[];
}

/**
 * Browser-compatible SVGFusion class
 */
export class SVGFusionBrowser {
  private engine: SVGFusion;

  constructor() {
    this.engine = new SVGFusion();
  }

  /**
   * Convert SVG content to component string (browser-compatible)
   */
  async convert(
    svgContent: string,
    options: BrowserConversionOptions
  ): Promise<BrowserConversionResult> {
    const {
      framework,
      typescript = true,
      componentName = 'Icon',
      prefix,
      suffix,
      splitColors = false,
      splitStrokeWidths = false,
      fixedStrokeWidth = false,
      normalizeFillStroke = false,
      memo = true,
      forwardRef = true,
      sfc = true,
      scriptSetup = true,
      optimize = true,
    } = options;

    // Build SVGFusion options
    const fusionOptions: SVGFusionOptions = {
      framework,
      transformation: {
        splitColors,
        splitStrokeWidths,
        fixedStrokeWidth,
        normalizeFillStroke,
        optimize,
        accessibility: true,
      },
      generator:
        framework === 'react'
          ? ({
              typescript,
              componentName,
              prefix,
              suffix,
              memo,
              forwardRef,
              exportDefault: true,
              namedExport: false,
            } as ReactGeneratorOptions)
          : ({
              typescript,
              componentName,
              prefix,
              suffix,
              sfc,
              scriptSetup,
              composition: true,
              exportDefault: true,
            } as VueGeneratorOptions),
    };

    // Convert using the engine
    const generators = {
      react: ReactGenerator,
      vue: VueGenerator,
    };
    const result = await this.engine.convert(
      svgContent,
      fusionOptions,
      generators[framework]
    );

    return {
      code: result.code,
      componentName: result.componentName,
      filename: result.filename,
      framework,
      typescript,
      metadata: result.metadata,
      dependencies: result.dependencies,
    };
  }

  /**
   * Extract colors from SVG (browser-compatible)
   */
  extractColors(svgContent: string): string[] {
    return this.engine.extractColors(svgContent);
  }

  /**
   * Validate SVG content - focused on XML structure validation only
   */
  validate(svgContent: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic checks
    const trimmed = svgContent.trim();
    if (!trimmed) {
      return { valid: false, errors: ['SVG content is empty'] };
    }

    if (!trimmed.includes('<svg')) {
      return { valid: false, errors: ['No <svg> element found'] };
    }

    // XML structure validation using DOMParser (browser environment)
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(trimmed, 'application/xml');

      // Check for parser errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        errors.push(
          'Invalid XML/SVG structure: ' +
            (parserError.textContent?.trim() || 'XML parsing failed')
        );
        return { valid: false, errors };
      }

      // Additional checks for malformed XML that DOMParser might miss
      this.validateXMLStructure(trimmed, errors);
    } else {
      // Fallback for Node.js environment - regex-based validation
      this.validateWithRegex(trimmed, errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Basic XML structure validation for critical malformed cases
   */
  private validateXMLStructure(svgContent: string, errors: string[]): void {
    // Only check for the most critical malformed XML patterns

    // Pattern 1: Attribute values that contain unescaped '<' followed by tag names
    const malformedAttributePattern = /\w+\s*=\s*"[^"]*<[a-zA-Z]/g;
    if (malformedAttributePattern.test(svgContent)) {
      errors.push('Invalid XML/SVG structure: Malformed attribute syntax');
      return;
    }

    // Pattern 2: Check for invalid characters in attribute values (like quotes followed by < > without proper closing)
    const invalidAttributeChars = /\w+\s*=\s*"[^"]*"[^>\s]*<[^>]*>/g;
    if (invalidAttributeChars.test(svgContent)) {
      errors.push(
        'Invalid XML/SVG structure: Invalid characters in attributes'
      );
      return;
    }

    // Pattern 3: Check for orphaned attributes only if they're clearly malformed
    // This pattern is more specific to avoid false positives with multiline SVGs
    const orphanedAttributePattern = /^\s*[a-zA-Z-]+\s*=\s*"/gm;
    if (orphanedAttributePattern.test(svgContent)) {
      // Only flag if it's clearly malformed (not just multiline attributes)
      const lines = svgContent.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (/^[a-zA-Z-]+\s*=\s*"/.test(line)) {
          // Check if this looks like an orphaned attribute
          // Look back through ALL previous lines to find opening tag context
          let hasOpeningTagContext = false;
          for (let j = i - 1; j >= 0; j--) {
            const prevLine = lines[j].trim();
            if (
              prevLine.includes('<svg') ||
              (prevLine.includes('<') && prevLine.includes('='))
            ) {
              hasOpeningTagContext = true;
              break;
            }
            // If we hit a closing tag before an opening tag, it's likely orphaned
            if (prevLine.includes('</') || prevLine.includes('/>')) {
              break;
            }
          }

          if (!hasOpeningTagContext) {
            errors.push('Invalid XML/SVG structure: Malformed tag structure');
            return;
          }
        }
      }
    }
  }

  /**
   * Fallback validation using regex patterns (for Node.js environment)
   */
  private validateWithRegex(svgContent: string, errors: string[]): void {
    // Use the same basic validation as browser environment
    this.validateXMLStructure(svgContent, errors);
  }

  /**
   * Convert multiple SVG contents to components (browser-compatible)
   */
  async convertBatch(
    svgContents: Array<{ content: string; name: string }>,
    options: BrowserConversionOptions
  ): Promise<BrowserConversionResult[]> {
    const results: BrowserConversionResult[] = [];

    for (const { content, name } of svgContents) {
      const result = await this.convert(content, {
        ...options,
        componentName: name,
      });
      results.push(result);
    }

    return results;
  }

  /**
   * Generate index file content for multiple components (browser-compatible)
   */
  generateIndexFile(
    results: BrowserConversionResult[],
    options: {
      exportType?: 'named' | 'default';
      typescript?: boolean;
    } = {}
  ): string {
    const { exportType = 'named', typescript = true } = options;
    const framework = results[0]?.framework || 'react';

    // Sort results by component name for consistent output
    const sortedResults = [...results].sort((a, b) =>
      a.componentName.localeCompare(b.componentName)
    );

    let content = '';

    if (exportType === 'named') {
      // Add header comment
      content += `// Auto-generated index file for tree-shaking\n`;
      content += `// This file exports all components for optimal bundling\n\n`;

      // Add individual exports
      for (const result of sortedResults) {
        const importPath = this.getImportPath(result.filename, framework);
        content += `export { default as ${result.componentName} } from './${importPath}';\n`;
      }

      // Add TypeScript types export if needed
      if (typescript) {
        content += `\n// TypeScript component types\n`;

        if (framework === 'vue') {
          content += `export type IconComponent = any;\n`;
        } else {
          content += `export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;\n`;
        }

        content += `export type IconComponents = {\n`;
        for (const result of sortedResults) {
          content += `  ${result.componentName}: IconComponent;\n`;
        }
        content += `};\n`;
      }
    } else {
      // Default exports (less tree-shakeable)
      content += `// Auto-generated index file\n`;
      content += `// Warning: Default exports are less tree-shakeable\n\n`;

      // Import all components
      for (const result of sortedResults) {
        const importPath = this.getImportPath(result.filename, framework);
        content += `import ${result.componentName} from './${importPath}';\n`;
      }

      // Export as object
      content += `\nexport default {\n`;
      for (const result of sortedResults) {
        content += `  ${result.componentName},\n`;
      }
      content += `};\n`;

      // Also export individual components for flexibility
      content += `\n// Individual exports for flexibility\n`;
      for (const result of sortedResults) {
        content += `export { default as ${result.componentName} } from './${this.getImportPath(result.filename, framework)}';\n`;
      }
    }

    return content;
  }

  /**
   * Get import path from filename
   */
  private getImportPath(filename: string, framework: 'react' | 'vue'): string {
    if (framework === 'vue' && filename.endsWith('.vue')) {
      return filename;
    }
    return filename.replace(/\.(tsx?|jsx?|vue)$/, '');
  }
}

// Convenience functions for browser usage
export async function convertToReact(
  svgContent: string,
  options: Omit<BrowserConversionOptions, 'framework'> = {}
): Promise<BrowserConversionResult> {
  const browser = new SVGFusionBrowser();
  return browser.convert(svgContent, { ...options, framework: 'react' });
}

export async function convertToVue(
  svgContent: string,
  options: Omit<BrowserConversionOptions, 'framework'> = {}
): Promise<BrowserConversionResult> {
  const browser = new SVGFusionBrowser();
  return browser.convert(svgContent, { ...options, framework: 'vue' });
}

export async function convertBatch(
  svgContents: Array<{ content: string; name: string }>,
  options: BrowserConversionOptions
): Promise<BrowserConversionResult[]> {
  const browser = new SVGFusionBrowser();
  return browser.convertBatch(svgContents, options);
}

export function extractColors(svgContent: string): string[] {
  const browser = new SVGFusionBrowser();
  return browser.extractColors(svgContent);
}

export function validateSvg(svgContent: string): {
  valid: boolean;
  errors: string[];
} {
  const browser = new SVGFusionBrowser();
  return browser.validate(svgContent);
}

// Export additional types for browser usage
export type {
  SVGFusionOptions,
  ConversionResult,
  ReactGeneratorOptions,
  VueGeneratorOptions,
};

import {
  svgToComponentName,
  sanitizeComponentName,
  pascalCase,
  formatComponentName,
} from 'svgfusion-utils/browser';

export {
  svgToComponentName,
  sanitizeComponentName,
  pascalCase,
  formatComponentName,
};
