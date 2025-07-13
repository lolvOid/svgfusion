export const pascalCase = (str: string) => {
  // If the string is already in PascalCase and well-formed, preserve it
  if (/^[A-Z][a-zA-Z0-9]*$/.test(str) && /[a-z]/.test(str)) {
    return str;
  }

  // Handle camelCase input (starts with lowercase)
  if (/^[a-z][a-zA-Z0-9]*$/.test(str) && /[A-Z]/.test(str)) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Handle different input formats with separators
  return (
    str
      // Split on common separators (spaces, hyphens, underscores, dots)
      .split(/[\s\-_]+/)
      // Filter out empty strings
      .filter(Boolean)
      // Convert each word to PascalCase
      .map(word => {
        // If word is all uppercase and longer than 3 chars, it's likely a regular word in caps
        if (
          word.length > 3 &&
          word === word.toUpperCase() &&
          /^[A-Z]+$/.test(word)
        ) {
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        // If word is all uppercase and 1-3 chars (like "XML", "API", "iOS"), keep it as is
        if (
          word.length <= 3 &&
          word === word.toUpperCase() &&
          /^[A-Z]+$/.test(word)
        ) {
          return word;
        }
        // Otherwise, capitalize first letter and lowercase the rest
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('')
  );
};

/**
 * Convert kebab-case string to camelCase
 * @param str - The kebab-case string to convert
 * @returns The camelCase version of the string
 * @example
 * camelCase('stroke-width') // 'strokeWidth'
 * camelCase('fill-opacity') // 'fillOpacity'
 */
export const camelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert HTML/SVG attribute names to React JSX property names
 * Handles special cases and follows React's naming conventions
 * @param attrName - The HTML/SVG attribute name
 * @returns The React JSX property name
 * @example
 * toReactProp('class') // 'className'
 * toReactProp('stroke-width') // 'strokeWidth'
 * toReactProp('aria-label') // 'aria-label' (preserved)
 */
export const toReactProp = (attrName: string): string => {
  // Handle special HTML attribute mappings
  const mappings: Record<string, string> = {
    class: 'className',
    for: 'htmlFor',
    'accept-charset': 'acceptCharset',
    'http-equiv': 'httpEquiv',
  };

  if (mappings[attrName]) {
    return mappings[attrName];
  }

  // Preserve aria-* and data-* attributes as-is (React convention)
  if (attrName.startsWith('aria-') || attrName.startsWith('data-')) {
    return attrName;
  }

  // Convert kebab-case to camelCase for all other attributes
  return camelCase(attrName);
};
