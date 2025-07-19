// Re-exports from core (main exports, avoid color utils since they're duplicated)
export {
  SVGFusion,
  SVGParser,
  SVGTransformer,
  ComponentGenerator,
  generateIndexFile,
  generateReadmeContent,
  extractColors,
  extractColorsWithElementMapping,
  replaceColorsWithProps,
  replaceCurrentColorWithVariables,
  generateColorProps,
  generateDefaultColors,
} from 'svgfusion-core';
export type {
  SVGFusionOptions,
  ConversionResult,
  SVGElement,
  SVGAst,
  ParsedColor,
  TransformationOptions,
  StrokeWidthMapping,
  ColorMapping,
  TransformationResult,
  GeneratorOptions,
  ComponentResult,
  IndexGenerationOptions,
  ColorInfo,
  BatchConversionOptions,
  BatchConversionResult,
  Framework,
  ConversionError,
  ConversionOptions,
  ReactConversionOptions,
  VueConversionOptions,
} from 'svgfusion-core';

// Direct re-exports - all from framework generators
export * from 'svgfusion-react';
export * from 'svgfusion-vue';

// Re-exports from utils (only non-color utilities to avoid duplicates)
export {
  prettierConfig,
  pascalCase,
  camelCase,
  toReactProp,
  svgToComponentName,
  sanitizeComponentName,
  formatComponentName,
  ansiColors,
  createBanner,
  readSvgFile,
  writeSvgFile,
  writeComponentFile,
  readSvgDirectory,
  ensureDirectoryExists,
  ensureDir,
  getFileExtension,
  getComponentFilename,
  validateDuplicateNames,
  formatDuplicateErrors,
  generateConflictResolutions,
} from 'svgfusion-utils';
export type {
  Colors,
  DuplicateNameInfo,
  DuplicateValidationResult,
} from 'svgfusion-utils';

// Import only what we need for convenience functions
import { ConversionResult, SVGFusion, SVGFusionOptions } from 'svgfusion-core';
import { ReactGenerator } from 'svgfusion-react';
import { VueGenerator } from 'svgfusion-vue';

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
