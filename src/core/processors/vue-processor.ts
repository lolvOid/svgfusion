import { VueConversionOptions } from '../../types/index.js';
import { formatComponentName } from '../../utils/name.js';
import {
  extractColors,
  replaceColorsWithProps,
  generateColorProps,
} from '../../utils/color-extractor.js';

/**
 * Generate Vue 3 component from SVG
 */
export function generateVueComponent(
  svgContent: string,
  options: VueConversionOptions
): { code: string; componentName: string } {
  const {
    name,
    prefix,
    suffix,
    props = true,
    replaceAttrValues = { '#000': 'currentColor', '#000000': 'currentColor' },
  } = options;

  // Generate component name
  const baseName = name || 'Icon';
  const componentName = formatComponentName(baseName, prefix, suffix);

  // Clean and transform SVG
  let processedSvg = cleanSvgForVue(svgContent);

  // Apply attribute value replacements
  processedSvg = applyAttributeReplacements(processedSvg, replaceAttrValues);

  // Handle ID collision prevention for complex SVGs
  if (hasComplexFeatures(processedSvg)) {
    processedSvg = addUniqueIds(processedSvg, componentName);
  }

  // Handle split colors feature
  if (options.splitColors) {
    const colorInfo = extractColors(processedSvg);
    if (colorInfo.colors.length > 0) {
      processedSvg = replaceColorsWithProps(processedSvg, colorInfo, 'vue');
    }
  }

  // Handle fixed stroke width feature
  if (options.isFixedStrokeWidth) {
    // Add vector-effect conditionally to stroke elements
    processedSvg = processedSvg.replace(/(<[^>]+stroke[^>]*>)/g, match => {
      if (match.includes('vector-effect')) {
        return match; // Don't add if already present
      }
      return match.replace(
        '>',
        ' :vector-effect="isFixedStrokeWidth ? \'non-scaling-stroke\' : undefined">'
      );
    });
  }

  // Add Vue-specific attributes
  processedSvg = addVueAttributes(processedSvg, props);

  // Generate component code
  const code = generateVueComponentCode(processedSvg, componentName, options);

  return { code, componentName };
}

/**
 * Clean SVG content for Vue
 */
function cleanSvgForVue(svgContent: string): string {
  return svgContent
    .replace(/<\?xml[^>]*\?>\s*/, '') // Remove XML declaration
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/xmlns="[^"]*"/g, '') // Remove default namespace
    .trim();
}

/**
 * Apply attribute value replacements (e.g., #000 -> currentColor)
 */
function applyAttributeReplacements(
  svg: string,
  replacements: Record<string, string>
): string {
  let processedSvg = svg;

  for (const [from, to] of Object.entries(replacements)) {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    processedSvg = processedSvg.replace(regex, to);
  }

  return processedSvg;
}

/**
 * Detect if SVG has complex features that require unique IDs
 */
function hasComplexFeatures(svg: string): boolean {
  const complexFeatures = [
    'linearGradient',
    'radialGradient',
    'pattern',
    'mask',
    'filter',
    'clipPath',
    'marker',
    'symbol',
    'use',
  ];

  return complexFeatures.some(
    feature => svg.includes(`<${feature}`) || svg.includes(`</${feature}`)
  );
}

/**
 * Add unique IDs to prevent collisions between components
 */
function addUniqueIds(svg: string, componentName: string): string {
  const uniquePrefix = `${componentName.toLowerCase()}_`;

  // Replace id attributes
  svg = svg.replace(/id="([^"]+)"/g, `id="${uniquePrefix}$1"`);

  // Replace url() references
  svg = svg.replace(/url\(#([^)]+)\)/g, `url(#${uniquePrefix}$1)`);

  // Replace href references
  svg = svg.replace(/href="#([^"]+)"/g, `href="#${uniquePrefix}$1"`);

  return svg;
}

/**
 * Add Vue-specific attributes to SVG
 */
function addVueAttributes(svg: string, enableProps: boolean): string {
  if (!enableProps) return svg;

  // Add v-bind for class and style
  return svg.replace(
    '<svg',
    '<svg :class="className" :style="style" v-bind="$attrs"'
  );
}

/**
 * Generate complete Vue component code
 */
function generateVueComponentCode(
  svg: string,
  componentName: string,
  options: VueConversionOptions
): string {
  const { typescript, compositionApi, props, splitColors, isFixedStrokeWidth } =
    options;

  // Extract colors if splitColors is enabled
  const colorInfo = splitColors ? extractColors(svg) : { colors: [] };
  const colorProps = splitColors
    ? generateColorProps(colorInfo.colors, 'vue')
    : '';

  // Script section
  const scriptLang = typescript ? ' lang="ts"' : '';
  const scriptSetup = compositionApi ? ' setup' : '';

  let script = `<script${scriptLang}${scriptSetup}>`;

  if (compositionApi) {
    // Composition API
    if (props) {
      script += `
interface Props {
  className?: string;
  style?: Record<string, any>;
${
  colorProps
    ? colorProps
        .split('\n')
        .map(line => `  ${line.trim()}`)
        .join('\n')
    : ''
}
${isFixedStrokeWidth ? '  isFixedStrokeWidth?: boolean;' : ''}
}

defineProps<Props>();
`;
    }
  } else {
    // Options API
    script += `
export default {
  name: '${componentName}',
  props: {
    className: String,
    style: Object,
${colorProps}
${
  isFixedStrokeWidth
    ? '    isFixedStrokeWidth: { type: Boolean, default: false },'
    : ''
}
  },
};
`;
  }

  script += `</script>`;

  // Template section
  const template = `
<template>
  ${svg}
</template>`;

  return [script, template].filter(Boolean).join('\n');
}
