import { pascalCase } from './string';

/**
 * Convert SVG filename to a valid React component name
 * @param filename - The SVG filename
 * @returns PascalCase component name
 */
export function svgToComponentName(filename: string): string {
  // Remove file extension
  let baseName = filename.replace(/\.svg$/i, '');

  // Handle complex filenames with metadata
  baseName = processComplexFilename(baseName);

  // Convert to PascalCase
  return pascalCase(baseName);
}

/**
 * Process complex filenames with metadata and special characters
 * @param filename - The filename to process
 * @returns Cleaned filename
 */
function processComplexFilename(filename: string): string {
  // Handle files with metadata like "User Profile Avatar, Type=Solid" or "Size=xl, Color=Brand, Type=Glass"

  // Lowercase the filename, remove all non-alphanumeric characters and spaces
  let processed = filename.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ');
  processed = processed.replace(/\s+/g, ' ').trim();
  return processed;
}

/**
 * Sanitize component name to ensure it's valid
 * @param name - The component name to sanitize
 * @returns Sanitized component name
 */
export function sanitizeComponentName(name: string): string {
  // Remove invalid characters and convert to PascalCase
  return pascalCase(name.replace(/[^a-zA-Z0-9]/g, ' '));
}

/**
 * Convert a string to PascalCase using just-pascal-case library
 * @param str - The string to convert
 * @returns PascalCase string
 */
export { pascalCase };

/**
 * Add prefix/suffix to component name
 * @param name - Base component name
 * @param prefix - Optional prefix
 * @param suffix - Optional suffix
 * @returns Component name with prefix/suffix
 */
export function formatComponentName(
  name: string,
  prefix?: string,
  suffix?: string
): string {
  const prefixPart = prefix ? pascalCase(prefix) : '';
  const suffixPart = suffix ? pascalCase(suffix) : '';
  const baseName = pascalCase(name);

  return `${prefixPart}${baseName}${suffixPart}`;
}
