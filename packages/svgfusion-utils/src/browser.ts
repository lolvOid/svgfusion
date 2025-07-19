// Browser-compatible utilities - only includes essential utilities for browser usage

// Formatter exports
export { prettierConfig } from './libs/formatter';

// String utilities
export { pascalCase, camelCase, toReactProp } from './libs/string';

// Name utilities
export {
  svgToComponentName,
  sanitizeComponentName,
  formatComponentName,
} from './libs/name';

// Note: Duplicate validator functions require Node.js path utilities
// and are not included in browser build

// Color extractor
export type { ColorInfo } from './libs/color-extractor';
export {
  extractColors,
  extractColorsWithElementMapping,
  replaceColorsWithProps,
  replaceCurrentColorWithVariables,
  generateColorProps,
  generateDefaultColors,
} from './libs/color-extractor';
