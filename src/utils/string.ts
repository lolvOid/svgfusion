export const pascalCase = (str: string) => {
  // If the string is already in PascalCase and well-formed, check for acronyms
  if (/^[A-Z][a-zA-Z0-9]*$/.test(str) && /[a-z]/.test(str)) {
    // Apply Microsoft .NET guidelines to existing PascalCase strings
    // Only convert standalone 3+ letter acronyms (like XML in XMLHttpRequest → XmlHttpRequest)
    // Keep 2-letter acronyms like iOS → IOS, macOS → MacOS unchanged
    return str.replace(
      /(^|[a-z])([A-Z]{3,})(?=[A-Z][a-z]|$)/g,
      (_, before, acronym) => {
        const convertedAcronym =
          acronym.charAt(0).toUpperCase() + acronym.slice(1).toLowerCase();
        return before + convertedAcronym;
      }
    );
  }

  // Handle camelCase input (starts with lowercase)
  if (/^[a-z][a-zA-Z0-9]*$/.test(str) && /[A-Z]/.test(str)) {
    // Apply Microsoft .NET standard: treat acronyms according to length
    let result = str.charAt(0).toUpperCase() + str.slice(1);

    // Convert trailing acronyms following Microsoft .NET guidelines
    result = result.replace(/([a-z])([A-Z]{2,})$/, (_, lower, upper) => {
      // Microsoft .NET guidelines: All trailing acronyms become title case (flagUS → FlagUs, macOS → MacOs)
      return lower + upper.charAt(0) + upper.slice(1).toLowerCase();
    });

    // Also handle internal acronyms like "getUserIDFromDB" → "GetUserIdFromDb"
    result = result.replace(
      /([a-z])([A-Z]{2,})([A-Z][a-z])/g,
      (_, before, acronym, after) => {
        // Microsoft .NET guidelines: Internal acronyms also become title case
        return (
          before + acronym.charAt(0) + acronym.slice(1).toLowerCase() + after
        );
      }
    );

    return result;
  }

  // Handle different input formats with separators
  return (
    str
      // Split on common separators (spaces, hyphens, underscores, dots)
      .split(/[\s\-_]+/)
      // Filter out empty strings
      .filter(Boolean)
      // Convert each word to PascalCase
      .map((word, index, array) => {
        // Microsoft .NET Framework Design Guidelines: 2-letter acronyms both uppercase, 3+ only first letter
        if (word === word.toUpperCase() && /^[A-Z]+$/.test(word)) {
          // Special handling for compound words (multiple parts)
          if (array.length > 1) {
            // In compound words, ALL acronyms (including 2-letter) become title case except the first one
            if (index === 0 && word.length === 2) {
              return word; // First 2-letter acronym stays uppercase (IOStream)
            }
            // All other positions: convert to title case (FlagUS → FlagUs)
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          } else {
            // Single word: preserve 2-letter acronyms
            if (word.length <= 2) {
              return word; // Keep 1-2 letter acronyms uppercase (A, IO, UI, OS, DB, etc.)
            }
            // 3+ character acronyms: only first letter uppercase (XML→Xml, JSON→Json, HTML→Html)
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
          }
        }
        // Otherwise, capitalize first letter and preserve existing case if it's camelCase
        if (/[a-z][A-Z]/.test(word)) {
          // Handle trailing acronyms following Microsoft .NET guidelines
          if (/[a-z][A-Z]{2,}$/.test(word)) {
            return word.replace(/([a-z])([A-Z]{2,})$/, (_, lower, upper) => {
              // Microsoft .NET guidelines: All trailing acronyms become title case
              return lower + upper.charAt(0) + upper.slice(1).toLowerCase();
            });
          }
          // It's camelCase, preserve the case
          return word.charAt(0).toUpperCase() + word.slice(1);
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
