/**
 * Color extraction utility for SVG split colors feature
 */

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
        fillColors.add(color);
        allColors.add(color);
      }
    }
  });

  // Extract stroke colors
  strokeRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(svgContent)) !== null) {
      const color = match[1].trim();
      if (isValidColor(color)) {
        strokeColors.add(color);
        allColors.add(color);
      }
    }
  });

  // Extract gradient colors
  gradientRegexes.forEach(regex => {
    let match;
    while ((match = regex.exec(svgContent)) !== null) {
      const color = match[1].trim();
      if (isValidColor(color)) {
        gradientColors.add(color);
        allColors.add(color);
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

  // Replace fill colors
  colorInfo.fillColorMap.forEach((propName, originalColor) => {
    // Escape special regex characters in color values
    const escapedColor = originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace in fill attributes
    const fillRegex = new RegExp(`fill="${escapedColor}"`, 'g');
    const fillSingleQuoteRegex = new RegExp(`fill='${escapedColor}'`, 'g');
    const fillStyleRegex = new RegExp(`fill:\\s*${escapedColor}`, 'g');

    if (framework === 'react') {
      // React JSX syntax
      modifiedContent = modifiedContent
        .replace(fillRegex, `fill={${propName}}`)
        .replace(fillSingleQuoteRegex, `fill={${propName}}`)
        .replace(fillStyleRegex, `fill: {${propName}}`);

      // Add className for fill
      const classVar = `${propName}Class`;
      modifiedContent = modifiedContent.replace(
        new RegExp(`fill={${propName}}`, 'g'),
        `fill={${propName}} className={${classVar}}`
      );
    } else {
      // Vue template syntax
      modifiedContent = modifiedContent
        .replace(fillRegex, `:fill="${propName}"`)
        .replace(fillSingleQuoteRegex, `:fill="${propName}"`)
        .replace(fillStyleRegex, `fill: {{ ${propName} }}`);

      // Add class for fill
      const classVar = `${propName}Class`;
      modifiedContent = modifiedContent.replace(
        new RegExp(`:fill="${propName}"`, 'g'),
        `:fill="${propName}" :class="${classVar}"`
      );
    }
  });

  // Replace stroke colors
  colorInfo.strokeColorMap.forEach((propName, originalColor) => {
    // Escape special regex characters in color values
    const escapedColor = originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace in stroke attributes
    const strokeRegex = new RegExp(`stroke="${escapedColor}"`, 'g');
    const strokeSingleQuoteRegex = new RegExp(`stroke='${escapedColor}'`, 'g');
    const strokeStyleRegex = new RegExp(`stroke:\\s*${escapedColor}`, 'g');

    if (framework === 'react') {
      // React JSX syntax
      modifiedContent = modifiedContent
        .replace(strokeRegex, `stroke={${propName}}`)
        .replace(strokeSingleQuoteRegex, `stroke={${propName}}`)
        .replace(strokeStyleRegex, `stroke: {${propName}}`);

      // Add className for stroke
      const classVar = `${propName}Class`;
      modifiedContent = modifiedContent.replace(
        new RegExp(`stroke={${propName}}`, 'g'),
        `stroke={${propName}} className={${classVar}}`
      );
    } else {
      // Vue template syntax
      modifiedContent = modifiedContent
        .replace(strokeRegex, `:stroke="${propName}"`)
        .replace(strokeSingleQuoteRegex, `:stroke="${propName}"`)
        .replace(strokeStyleRegex, `stroke: {{ ${propName} }}`);

      // Add class for stroke
      const classVar = `${propName}Class`;
      modifiedContent = modifiedContent.replace(
        new RegExp(`:stroke="${propName}"`, 'g'),
        `:stroke="${propName}" :class="${classVar}"`
      );
    }
  });

  // Replace gradient colors
  colorInfo.gradientColorMap.forEach((propName, originalColor) => {
    // Escape special regex characters in color values
    const escapedColor = originalColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Replace in stop-color attributes
    const stopColorRegex = new RegExp(`stop-color="${escapedColor}"`, 'g');
    const stopColorSingleQuoteRegex = new RegExp(
      `stop-color='${escapedColor}'`,
      'g'
    );
    const stopColorStyleRegex = new RegExp(
      `stop-color:\\s*${escapedColor}`,
      'g'
    );

    if (framework === 'react') {
      // React JSX syntax
      modifiedContent = modifiedContent
        .replace(stopColorRegex, `stopColor={${propName}}`)
        .replace(stopColorSingleQuoteRegex, `stopColor={${propName}}`)
        .replace(stopColorStyleRegex, `stopColor: {${propName}}`);

      // Add className for gradient
      const classVar = `${propName}Class`;
      modifiedContent = modifiedContent.replace(
        new RegExp(`stopColor={${propName}}`, 'g'),
        `stopColor={${propName}} className={${classVar}}`
      );
    } else {
      // Vue template syntax
      modifiedContent = modifiedContent
        .replace(stopColorRegex, `:stop-color="${propName}"`)
        .replace(stopColorSingleQuoteRegex, `:stop-color="${propName}"`)
        .replace(stopColorStyleRegex, `stop-color: {{ ${propName} }}`);

      // Add class for gradient
      const classVar = `${propName}Class`;
      modifiedContent = modifiedContent.replace(
        new RegExp(`:stop-color="${propName}"`, 'g'),
        `:stop-color="${propName}" :class="${classVar}"`
      );
    }
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
