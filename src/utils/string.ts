export const pascalCase = (str: string) => {
  return (
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*[a-z]*|[A-Z]|[0-9]+[a-z]*/g
      )
      ?.map(x => x.charAt(0).toUpperCase() + x.slice(1).toLowerCase())
      .join('') || ''
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
