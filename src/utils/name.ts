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

  let processed = filename;

  // Handle simple patterns like "User Profile Avatar, Type=Solid" first
  const simpleMatch = processed.match(/^([^,]+),\s*Type=([^,]+)/i);
  if (simpleMatch) {
    processed = `${simpleMatch[1]} ${simpleMatch[2]}`;
    return processed;
  }

  // Check for metadata patterns
  const sizeMatch = processed.match(/Size=(\w+)/i);
  const colorMatch = processed.match(/Color=(\w+)/i);
  const typeMatch = processed.match(/Type=(\w+)/i);

  // If it has metadata, construct a meaningful name
  if (sizeMatch || colorMatch || typeMatch) {
    const parts = [];
    if (typeMatch) parts.push(typeMatch[1]);
    if (colorMatch) parts.push(colorMatch[1]);
    if (sizeMatch) parts.push(sizeMatch[1]);

    if (parts.length > 0) {
      processed = parts.join(' ');
      return processed;
    }
  }

  // If no metadata patterns found, just clean up the filename
  processed = processed
    .replace(/\b\w+=\w+\b/g, '') // Remove key=value patterns
    .replace(/,\s*/g, ' ') // Replace commas with spaces
    .replace(/[=]/g, ' ') // Replace equals with spaces
    .replace(/\s+/g, ' ') // Normalize multiple spaces
    .trim();

  // If the result is empty or too short, use original filename as fallback
  if (!processed || processed.length < 2) {
    processed = filename;
  }

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
 * Convert a string to PascalCase
 * @param str - The string to convert
 * @returns PascalCase string
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ') // Remove ALL symbols and special characters, keep only letters and numbers
    .split(/\s+/) // Split on any whitespace
    .filter(word => word.length > 0) // Remove empty strings
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

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
