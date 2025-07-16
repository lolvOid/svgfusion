/**
 * Color extraction utility for SVG split colors feature
 */

import { colord } from 'colord';

export interface ColorInfo {
  colors: string[];
  colorMap: Map<string, string>;
  fillColors: string[];
  strokeColors: string[];
  gradientColors: string[];
  fillColorMap: Map<string, string>;
  strokeColorMap: Map<string, string>;
  gradientColorMap: Map<string, string>;
}

/**
 * Convert any color format to hex
 */
function convertToHex(color: string): string {
  try {
    // Handle special cases
    if (
      color === 'none' ||
      color === 'transparent' ||
      color === 'currentColor'
    ) {
      return color;
    }

    // Try to parse and convert to hex
    const colorObj = colord(color);
    return colorObj.toHex();
  } catch (_error) {
    // If parsing fails, return original color
    return color;
  }
}

/**
 * Extract unique colors from SVG content
 */
export function extractColors(svgContent: string): ColorInfo {
  const fillColors = new Set<string>();
  const strokeColors = new Set<string>();
  const gradientColors = new Set<string>();
  const allColors = new Set<string>();

  // Regular expressions to match fill colors
  const fillRegexes = [
    /fill="([^"]*?)"/g,
    /fill='([^']*?)'/g,
    /fill:\s*([^;}\s]+)/g,
  ];

  // Regular expressions to match stroke colors
  const strokeRegexes = [
    /stroke="([^"]*?)"/g,
    /stroke='([^']*?)'/g,
    /stroke:\s*([^;}\s]+)/g,
  ];

  // Regular expressions to match gradient stop colors
  const gradientRegexes = [
    /stop-color="([^"]*?)"/g,
    /stop-color='([^']*?)'/g,
    /stop-color:\s*([^;}\s]+)/g,
  ];

  // Extract fill colors
  fillRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(svgContent)) !== null) {
      const color = match[1].trim();
      if (isValidColor(color)) {
        const hexColor = convertToHex(color);
        fillColors.add(hexColor);
        allColors.add(hexColor);
      }
    }
  });

  // Extract stroke colors
  strokeRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(svgContent)) !== null) {
      const color = match[1].trim();
      if (isValidColor(color)) {
        const hexColor = convertToHex(color);
        strokeColors.add(hexColor);
        allColors.add(hexColor);
      }
    }
  });

  // Extract gradient colors
  gradientRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(svgContent)) !== null) {
      const color = match[1].trim();
      if (isValidColor(color)) {
        const hexColor = convertToHex(color);
        gradientColors.add(hexColor);
        allColors.add(hexColor);
      }
    }
  });

  // Convert to arrays and sort for consistent ordering
  const uniqueFillColors = Array.from(fillColors).sort();
  const uniqueStrokeColors = Array.from(strokeColors).sort();
  const uniqueGradientColors = Array.from(gradientColors).sort();
  const uniqueAllColors = Array.from(allColors).sort();

  // Create color mappings
  const fillColorMap = new Map<string, string>();
  const strokeColorMap = new Map<string, string>();
  const gradientColorMap = new Map<string, string>();
  const allColorMap = new Map<string, string>();

  // Create unified color mapping (color, color2, color3, etc.)
  uniqueAllColors.forEach((color, index) => {
    const colorVar = index === 0 ? 'color' : `color${index + 1}`;
    allColorMap.set(color, colorVar);

    // Also set in individual maps using unified naming
    if (uniqueFillColors.includes(color)) {
      fillColorMap.set(color, colorVar);
    }
    if (uniqueStrokeColors.includes(color)) {
      strokeColorMap.set(color, colorVar);
    }
    if (uniqueGradientColors.includes(color)) {
      gradientColorMap.set(color, colorVar);
    }
  });

  return {
    colors: uniqueAllColors,
    colorMap: allColorMap,
    fillColors: uniqueFillColors,
    strokeColors: uniqueStrokeColors,
    gradientColors: uniqueGradientColors,
    fillColorMap,
    strokeColorMap,
    gradientColorMap,
  };
}

/**
 * Extract colors with element mapping for precise replacement
 */
export function extractColorsWithElementMapping(svgContent: string): {
  colorInfo: ColorInfo;
  elementColorMap: Map<string, string>;
} {
  const colorInfo = extractColors(svgContent);
  const elementColorMap = new Map<string, string>();

  // Find all elements with colors and map them to their path data or unique identifier
  const elementRegex =
    /<(path|circle|rect|ellipse|line|polyline|polygon)[^>]*>/g;
  let match;

  while ((match = elementRegex.exec(svgContent)) !== null) {
    const element = match[0];

    // Extract unique identifier (use 'd' attribute for paths, or other unique attributes)
    const pathData = element.match(/d="([^"]*?)"/);
    const fillColor = element.match(/fill="([^"]*?)"/);

    if (pathData && fillColor) {
      const pathId = pathData[1].substring(0, 50); // Use first 50 chars as unique identifier
      const color = fillColor[1];
      const colorVar = colorInfo.colorMap.get(color);

      if (colorVar) {
        elementColorMap.set(pathId, colorVar);
      }
    }
  }

  return { colorInfo, elementColorMap };
}

/**
 * Replace colors in SVG content with prop references
 */
export function replaceColorsWithProps(
  svgContent: string,
  colorInfo: ColorInfo,
  framework: 'react' | 'vue'
): string {
  let modifiedContent = svgContent;

  // Create a map of original colors to their hex equivalents and variable names
  const colorReplacements = new Map<
    string,
    { hex: string; variableName: string }
  >();

  // Fill color replacements
  colorInfo.fillColorMap.forEach((variableName, hexColor) => {
    colorReplacements.set(hexColor, { hex: hexColor, variableName });
  });

  // Stroke color replacements
  colorInfo.strokeColorMap.forEach((variableName, hexColor) => {
    colorReplacements.set(hexColor, { hex: hexColor, variableName });
  });

  // Gradient color replacements
  colorInfo.gradientColorMap.forEach((variableName, hexColor) => {
    colorReplacements.set(hexColor, { hex: hexColor, variableName });
  });

  // Find and replace colors in the SVG content
  const colorRegexPatterns = [
    /fill="([^"]*?)"/g,
    /fill='([^']*?)'/g,
    /stroke="([^"]*?)"/g,
    /stroke='([^']*?)'/g,
    /stop-color="([^"]*?)"/g,
    /stop-color='([^']*?)'/g,
  ];

  colorRegexPatterns.forEach(regex => {
    modifiedContent = modifiedContent.replace(
      regex,
      (match, colorValue: string) => {
        const attribute = match.split('=')[0];
        const quote = match.includes('"') ? '"' : "'";

        // Convert the found color to hex to match our color maps
        const hexColor = convertToHex(colorValue);

        // Check if this hex color exists in our replacements
        const replacement = colorReplacements.get(hexColor);
        if (replacement) {
          if (framework === 'react') {
            return `${attribute}={${replacement.variableName}}`;
          } else {
            return `${attribute}=${quote}${replacement.variableName}${quote}`;
          }
        }

        return match; // Return original if no replacement found
      }
    );
  });

  return modifiedContent;
}

/**
 * Replace currentColor with appropriate color variables in React/Vue components
 */
export function replaceCurrentColorWithVariables(
  componentCode: string,
  elementColorMap: Map<string, string>,
  framework: 'react' | 'vue'
): string {
  let modifiedCode = componentCode;

  // Find all fill="currentColor" or fill={currentColor} and replace based on path context
  const fillRegex =
    framework === 'react'
      ? /(<path[^>]*d="([^"]{1,50})[^"]*"[^>]*fill=){[^}]*currentColor[^}]*}([^>]*>)/g
      : /(<path[^>]*d="([^"]{1,50})[^"]*"[^>]*fill=)"currentColor"([^>]*>)/g;

  modifiedCode = modifiedCode.replace(
    fillRegex,
    (match: string, prefix: string, pathPrefix: string, suffix: string) => {
      const colorVar = elementColorMap.get(pathPrefix);
      if (colorVar) {
        if (framework === 'react') {
          return `${prefix}{${colorVar}}${suffix}`;
        } else {
          return `${prefix}"${colorVar}"${suffix}`;
        }
      }
      return match;
    }
  );

  return modifiedCode;
}

/**
 * Generate color props for component interfaces
 */
export function generateColorProps(
  colors: string[],
  framework: 'react' | 'vue'
): string {
  if (colors.length === 0) return '';

  const props = colors
    .map((_, index) => {
      const colorVar = index === 0 ? 'color' : `color${index + 1}`;
      const classVar = `${colorVar}Class`;

      if (framework === 'react') {
        return `  ${colorVar}?: string;\n  ${classVar}?: string;`;
      } else {
        return `    ${colorVar}: { type: String, default: 'currentColor' },\n    ${classVar}: { type: String, default: '' },`;
      }
    })
    .join('\n');

  return props;
}

/**
 * Check if a color value is valid and should be replaced
 */
function isValidColor(color: string): boolean {
  if (
    !color ||
    color === 'none' ||
    color === 'transparent' ||
    color === 'currentColor'
  ) {
    return false;
  }

  // Check for hex colors
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
    return true;
  }

  // Check for rgb/rgba colors
  if (
    /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(color)
  ) {
    return true;
  }

  // Check for hsl/hsla colors
  if (
    /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)$/.test(color)
  ) {
    return true;
  }

  // Check for named colors (basic set)
  const namedColors = [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
    'gray',
    'grey',
    'cyan',
    'magenta',
    'lime',
    'maroon',
    'navy',
    'olive',
    'silver',
    'teal',
    'aqua',
    'fuchsia',
  ];

  return namedColors.includes(color.toLowerCase());
}

/**
 * Generate default color values for component
 */
export function generateDefaultColors(
  colors: string[]
): Record<string, string> {
  const defaults: Record<string, string> = {};

  colors.forEach((color, index) => {
    const colorVar = `color${index + 1}`;
    defaults[colorVar] = color;
  });

  return defaults;
}
