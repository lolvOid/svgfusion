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

// Duplicate validator
export type {
  DuplicateNameInfo,
  DuplicateValidationResult,
} from './libs/duplicate-validator';
export {
  validateDuplicateNames,
  formatDuplicateErrors,
  generateConflictResolutions,
} from './libs/duplicate-validator';
