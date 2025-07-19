/**
 * Browser-specific entry point for svgfusion-core
 * This excludes Node.js specific dependencies like jsdom
 */

// Export main engine class
export { SVGFusion } from './engine';

// Export types
export type {
  SVGFusionOptions,
  ConversionResult,
  ComponentResult,
  TransformationResult,
  TransformationOptions,
} from './engine';

export type {
  ConversionOptions,
  ReactConversionOptions,
  VueConversionOptions,
  BatchConversionOptions,
} from './types';
