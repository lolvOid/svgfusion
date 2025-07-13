/**
 * Main SVGFusion engine
 * Orchestrates parsing, transformation, and code generation
 */

import { SVGParser } from './core/parser';
import { SVGTransformer, TransformationOptions } from './core/transformer';
import { ReactGenerator, ReactGeneratorOptions } from './generators/react';
import { VueGenerator, VueGeneratorOptions } from './generators/vue';

export interface SVGFusionOptions {
  framework: 'react' | 'vue';
  transformation?: TransformationOptions;
  generator?: ReactGeneratorOptions | VueGeneratorOptions;
}

export interface ConversionResult {
  code: string;
  filename: string;
  componentName: string;
  dependencies: string[];
  metadata: {
    originalColors: string[];
    originalStrokeWidths: string[];
    optimizationApplied: boolean;
    features: string[];
  };
}

/**
 * Main SVGFusion engine
 */
export class SVGFusion {
  private parser: SVGParser;
  private transformer: SVGTransformer;

  constructor() {
    this.parser = new SVGParser();
    this.transformer = new SVGTransformer();
  }

  /**
   * Convert SVG content to component code
   */
  async convert(
    svgContent: string,
    options: SVGFusionOptions
  ): Promise<ConversionResult> {
    try {
      // Parse SVG content into AST
      const ast = this.parser.parse(svgContent);

      // Transform AST based on options
      const transformationResult = this.transformer.transform(
        ast,
        options.transformation
      );

      // Generate component code
      let generator;
      if (options.framework === 'react') {
        generator = new ReactGenerator(
          options.generator as ReactGeneratorOptions
        );
      } else {
        generator = new VueGenerator(options.generator as VueGeneratorOptions);
      }

      const componentResult = await generator.generate(transformationResult);

      return {
        ...componentResult,
        metadata: transformationResult.metadata,
      };
    } catch (error) {
      throw new Error(
        `SVG conversion failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Extract colors from SVG for preview/analysis
   */
  extractColors(svgContent: string): string[] {
    const ast = this.parser.parse(svgContent);
    const colors = this.parser.extractColors(ast);
    return Array.from(new Set(colors.map(c => c.value))).sort();
  }

  /**
   * Validate SVG content
   */
  validate(svgContent: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const ast = this.parser.parse(svgContent);

      // Basic validation
      if (!ast.root) {
        errors.push('No root SVG element found');
      }

      if (!ast.viewBox && !ast.width && !ast.height) {
        errors.push('SVG should have viewBox or width/height attributes');
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export convenience functions
export async function convertToReact(
  svgContent: string,
  options: Omit<SVGFusionOptions, 'framework'> = {}
): Promise<ConversionResult> {
  const fusion = new SVGFusion();
  return fusion.convert(svgContent, { ...options, framework: 'react' });
}

export async function convertToVue(
  svgContent: string,
  options: Omit<SVGFusionOptions, 'framework'> = {}
): Promise<ConversionResult> {
  const fusion = new SVGFusion();
  return fusion.convert(svgContent, { ...options, framework: 'vue' });
}

// Export all types and classesx
export * from './core/parser';
export * from './core/transformer';
export * from './core/generator';
export * from './generators/react';
export * from './generators/vue';
