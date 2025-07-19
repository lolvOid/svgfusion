import { pascalCase } from './string';

/**
 * Convert SVG filename to a valid React component name
 * @param filename - The SVG filename
 * @returns PascalCase component name
 */
export function svgToComponentName(
  filename: string,
  prefix?: string,
  suffix?: string
): string;
export function svgToComponentName(filename: string): string;
export function svgToComponentName(
  filename: string,
  prefix?: string,
  suffix?: string
): string {
  // Remove file extension
  let baseName = filename.replace(/\.svg$/i, '');

  // Handle complex filenames with metadata
  baseName = processComplexFilename(baseName);

  // Always use formatComponentName for consistent behavior
  // This ensures the same PascalCase logic is applied regardless of prefix/suffix presence
  return formatComponentName(baseName, prefix, suffix);
}

/**
 * Process complex filenames with metadata and special characters
 * @param filename - The filename to process
 * @returns Cleaned filename
 */
function processComplexFilename(filename: string): string {
  // Check if filename is already clean PascalCase or camelCase (no special characters)
  const isCleanCase = /^[a-zA-Z][a-zA-Z0-9]*$/.test(filename);

  // If it's already clean PascalCase/camelCase, return as-is
  if (isCleanCase) {
    return filename;
  }

  // Handle files with special characters, paths, or metadata
  // Replace all non-alphanumeric characters with spaces (preserve case)
  let processed = filename.replace(/[^a-zA-Z0-9]/g, ' ');
  processed = processed.replace(/\s+/g, ' ').trim();
  return processed;
}

/**
 * Sanitize component name to ensure it's valid
 * @param name - The component name to sanitize
 * @param type - The type of component part: 'main', 'prefix', or 'suffix'
 * @returns Sanitized component name
 */
export function sanitizeComponentName(
  name: string,
  type: 'main' | 'prefix' | 'suffix' = 'main'
): string {
  // First, clean special characters but keep alphanumeric and preserve case
  let sanitized = name
    // Replace equals signs with spaces (Type=Filled -> Type Filled)
    .replace(/=/g, ' ')
    // Replace commas with spaces (Magic, Type -> Magic Type)
    .replace(/,/g, ' ')
    // Replace any other non-alphanumeric characters with spaces
    .replace(/[^a-zA-Z0-9]/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim whitespace
    .trim();

  // Apply different validation rules based on type
  if (type === 'prefix') {
    // Prefix: Must start with a letter, but can contain numbers after letters
    // For '123$' -> remove all since it starts with number
    // For 'My123' -> keep 'My123' since it starts with letter
    if (!/^[a-zA-Z]/.test(sanitized)) {
      return ''; // If doesn't start with letter, return empty
    }
  } else if (type === 'suffix') {
    // Suffix: Remove leading symbols, but preserve leading numbers
    // For '456!' -> becomes '456'
    // For '$2' -> becomes '2'
    sanitized = sanitized.replace(/^[^a-zA-Z0-9]+/, '');
  } else {
    // Main component: Must start with a letter (remove leading numbers and symbols)
    sanitized = sanitized.replace(/^[^a-zA-Z]+/, '');
  }

  // Then convert to PascalCase
  return pascalCase(sanitized);
}

/**
 * Convert a string to PascalCase
 * @param str - The string to convert
 * @returns PascalCase string
 */
export { pascalCase };

/**
 * Ensures proper PascalCase for final component names by handling word boundaries
 * @param str - The concatenated component name string
 * @returns Properly formatted PascalCase string
 */
function finalPascalCase(str: string): string {
  if (!str) return str;

  // First, use the standard pascalCase function to handle hyphens and basic word boundaries
  const standardPascal = pascalCase(str);

  // Then apply our enhanced logic for number boundaries
  // Split on boundaries where lowercase meets number, or number meets uppercase letter
  const parts = standardPascal.split(/(?<=[a-z])(?=[0-9])|(?<=[0-9])(?=[A-Z])/);

  return parts
    .map(part => {
      if (!part) return part;

      // If part starts with number, capitalize the first letter after the number
      if (/^\d/.test(part)) {
        return part.replace(/^(\d+)([a-z])/, (_, numbers, firstLetter) => {
          return numbers + firstLetter.toUpperCase();
        });
      }

      // Otherwise, it's already properly PascalCased by the standard function
      return part;
    })
    .join('');
}

/**
 * Add prefix/suffix to component name with automatic hyphen separators
 * @param name - Base component name
 * @param prefix - Optional prefix (hyphen will be added after)
 * @param suffix - Optional suffix (hyphen will be added before)
 * @returns Component name with prefix/suffix in proper PascalCase
 */
export function formatComponentName(
  name: string,
  prefix?: string,
  suffix?: string
): string {
  // Build the full name with automatic hyphen separators first
  let fullName = name;

  if (prefix) {
    fullName = `${prefix}-${fullName}`;
  }

  if (suffix) {
    fullName = `${fullName}-${suffix}`;
  }

  // Now sanitize the entire concatenated string as one unit
  // This preserves the hyphens we added as separators
  const sanitized = sanitizeComponentName(fullName, 'main');

  // Apply enhanced PascalCase formatting that handles hyphens and number boundaries
  return finalPascalCase(sanitized);
}
