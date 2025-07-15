// Tree-shakable exports for better bundling

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

// Colors (Node.js only)
export type { Colors } from './libs/colors';
export { ansiColors } from './libs/colors';

// Banner (Node.js only)
export { createBanner } from './libs/banner';

// File operations (Node.js only)
export {
  readSvgFile,
  writeSvgFile,
  writeComponentFile,
  readSvgDirectory,
  ensureDirectoryExists,
  ensureDir,
  getFileExtension,
  getComponentFilename,
} from './libs/files';

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
