// Tree-shakable exports for better bundling

// Main engine
export { SVGFusion } from './engine';
export type { SVGFusionOptions, ConversionResult } from './engine';

// Core components
export { SVGParser } from './core/parser';
export type { SVGElement, SVGAst, ParsedColor } from './core/parser';

export { SVGTransformer } from './core/transformer';
export type {
  TransformationOptions,
  StrokeWidthMapping,
  ColorMapping,
  TransformationResult,
} from './core/transformer';

export { ComponentGenerator } from './core/generator';
export type { GeneratorOptions, ComponentResult } from './core/generator';

// Utilities
export {
  generateIndexFile,
  generateReadmeContent,
} from './utils/index-generator';
export type { IndexGenerationOptions } from './utils/index-generator';

export {
  extractColors,
  extractColorsWithElementMapping,
  replaceColorsWithProps,
  replaceCurrentColorWithVariables,
  generateColorProps,
  generateDefaultColors,
} from 'svgfusion-utils';
export type { ColorInfo } from 'svgfusion-utils';

// Types
export type {
  BatchConversionOptions,
  BatchConversionResult,
  Framework,
  ConversionError,
  ConversionOptions,
  ReactConversionOptions,
  VueConversionOptions,
} from './types';
