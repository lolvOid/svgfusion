import { ConversionResult, SVGFusion, SVGFusionOptions } from 'svgfusion-core';
import { ReactGenerator } from 'svgfusion-react';
import { VueGenerator } from 'svgfusion-vue';

// New SVGFusion Architecture Exports
export {
  SVGFusion,
  type SVGFusionOptions,
  type ConversionResult,
  SVGParser,
  type SVGAst,
  type SVGElement,
  type ParsedColor,
  SVGTransformer,
  type TransformationOptions,
  type TransformationResult,
  type ColorMapping,
  type StrokeWidthMapping,
  ComponentGenerator,
  type GeneratorOptions,
  type ComponentResult,
  generateIndexFile,
  type IndexGenerationOptions,
} from 'svgfusion-core';
export { ReactGenerator, type ReactGeneratorOptions } from 'svgfusion-react';
export { VueGenerator, type VueGeneratorOptions } from 'svgfusion-vue';

export {
  readSvgFile,
  writeSvgFile,
  readSvgDirectory,
  writeComponentFile,
  svgToComponentName,
  sanitizeComponentName,
  pascalCase,
  formatComponentName,
} from 'svgfusion-utils/node';

// Export convenience functions
export async function convertToReact(
  svgContent: string,
  options: Omit<SVGFusionOptions, 'framework'> = {}
): Promise<ConversionResult> {
  const fusion = new SVGFusion();
  return fusion.convert(
    svgContent,
    { ...options, framework: 'react' },
    ReactGenerator
  );
}

export async function convertToVue(
  svgContent: string,
  options: Omit<SVGFusionOptions, 'framework'> = {}
): Promise<ConversionResult> {
  const fusion = new SVGFusion();
  return fusion.convert(
    svgContent,
    { ...options, framework: 'vue' },
    VueGenerator
  );
}
