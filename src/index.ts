// New SVGFusion Architecture Exports
export {
  SVGFusion,
  type SVGFusionOptions,
  type ConversionResult,
} from './engine';
export {
  SVGParser,
  type SVGAst,
  type SVGElement,
  type ParsedColor,
} from './core/parser';
export {
  SVGTransformer,
  type TransformationOptions,
  type TransformationResult,
  type ColorMapping,
} from './core/transformer';
export { ReactGenerator, type ReactGeneratorOptions } from './generators/react';
export { VueGenerator, type VueGeneratorOptions } from './generators/vue';
export {
  ComponentGenerator,
  type GeneratorOptions,
  type ComponentResult,
} from './core/generator';

// Feature exports
export { ColorSplittingFeature } from './features/color-splitting';
export { StrokeFixingFeature } from './features/stroke-fixing';
export { AccessibilityFeature } from './features/accessibility';

// Legacy type exports (for backward compatibility)
export type {
  ConversionOptions,
  ReactConversionOptions,
  VueConversionOptions,
  ConversionError,
  Framework,
  CliOptions,
} from './types/index';

// Utility exports
export { optimizeSvg, createSvgoConfig } from './utils/svgo';
export {
  readSvgFile,
  writeSvgFile,
  readSvgDirectory,
  writeComponentFile,
} from './utils/files';
export {
  svgToComponentName,
  sanitizeComponentName,
  pascalCase,
  formatComponentName,
} from './utils/name';

export {
  generateIndexFile,
  type IndexGenerationOptions,
} from './utils/index-generator';

export {
  extractColors,
  generateColorProps,
  extractColorsWithElementMapping,
  replaceCurrentColorWithVariables,
} from './utils/color-extractor';

// Backward compatibility functions (re-export from engine)
export { convertToReact, convertToVue } from './engine';
