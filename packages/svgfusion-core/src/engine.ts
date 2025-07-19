/**
 * Main SVGFusion engine
 * Orchestrates parsing, transformation, and code generation
 */

import { SVGParser } from './core/parser';
import { SVGTransformer, TransformationOptions } from './core/transformer';
import { GeneratorOptions } from './core/generator';

export interface SVGFusionOptions {
  framework: 'react' | 'vue';
  transformation?: TransformationOptions;
  generator?: GeneratorOptions;
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
  /**
   * Initialize SVGFusion engine
   */
  constructor() {
    this.parser = new SVGParser();
    this.transformer = new SVGTransformer();
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

  /**
   * Convert SVG content to component code
   */
  async convert(
    svgContent: string,
    options: SVGFusionOptions,
    generatorConstructor: new (options: GeneratorOptions) => any
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
      const generator = new generatorConstructor(options.generator as any);

      const componentResult = await generator.generate(transformationResult);

      // Return final result with metadata
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
}

// Export all types and classesx
export * from './core/parser';
export * from './core/transformer';
export * from './core/generator';
