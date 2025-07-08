import { VueConversionOptions, ConversionResult } from '../types/index.js';
import { optimizeSvg } from '../utils/svgo.js';
import { formatComponentName } from '../utils/name.js';
import { getFileExtension, getComponentFilename } from '../utils/files.js';

/**
 * Convert SVG to Vue 3 component
 * @param svgContent - SVG content string
 * @param options - Conversion options
 * @returns Conversion result with Vue component code
 */
export function convertToVue(
  svgContent: string,
  options: VueConversionOptions = {}
): ConversionResult {
  const {
    name,
    prefix,
    suffix,
    optimize = true,
    typescript = true,
    compositionApi: _compositionApi = true, // eslint-disable-line @typescript-eslint/no-unused-vars
    scriptSetup = true,
  } = options;

  try {
    // Optimize SVG if requested
    let processedSvg = svgContent;
    if (optimize) {
      processedSvg = optimizeSvg(svgContent);
    }

    // Generate component name
    const baseName = name || 'icon';
    const componentName = formatComponentName(baseName, prefix, suffix);

    // Clean up SVG - remove XML declaration and add props binding
    const cleanedSvg = processedSvg
      .replace(/<\?xml[^>]*\?>\s*/, '')
      .replace(/xmlns="[^"]*"/g, '')
      .replace(/width="[^"]*"/g, '')
      .replace(/height="[^"]*"/g, '')
      .replace(/<svg/, '<svg v-bind="$attrs"')
      .replace(/class="([^"]*)"/g, 'class="$1"') // Keep class as is, don't convert to :class
      .replace(/currentColor/g, 'currentColor');

    // Generate Vue SFC
    const scriptTag = scriptSetup
      ? generateScriptSetup(typescript, componentName)
      : generateCompositionScript(componentName, typescript);

    const template = `<template>
  ${cleanedSvg}
</template>`;

    const style = `<style scoped>
/* Add component-specific styles here */
</style>`;

    const vueComponent = `${scriptTag}

${template}

${style}`;

    // Generate filename
    const extension = getFileExtension('vue', typescript);
    const filename = getComponentFilename('icon.svg', componentName, extension);

    return {
      code: vueComponent,
      filename,
      componentName,
    };
  } catch (error) {
    throw new Error(`Failed to convert SVG to Vue: ${error}`);
  }
}

/**
 * Generate script setup block for Vue 3
 */
function generateScriptSetup(
  typescript: boolean,
  componentName: string
): string {
  const lang = typescript ? ' lang="ts"' : '';
  const propsType = typescript
    ? `
interface Props {
  class?: string;
  style?: string | Record<string, any>;
}`
    : '';

  const propsDefinition = typescript
    ? `
const props = withDefaults(defineProps<Props>(), {
  class: '',
  style: undefined,
});`
    : `
const props = withDefaults(defineProps(), {
  class: '',
  style: undefined,
});`;

  return `<script setup${lang}>${propsType}${propsDefinition}

// Component name for debugging
const __name = '${componentName}';
</script>`;
}

/**
 * Generate composition API script for Vue 3
 */
function generateCompositionScript(
  componentName: string,
  typescript: boolean
): string {
  const lang = typescript ? ' lang="ts"' : '';
  const propsType = typescript
    ? `
interface Props {
  class?: string;
  style?: string | Record<string, any>;
}`
    : '';

  const exportStatement = typescript
    ? `
const ${componentName} = defineComponent({
  name: '${componentName}',
  props: {
    class: {
      type: String,
      default: '',
    },
    style: {
      type: [String, Object],
      default: undefined,
    },
  },
  setup(props: Props) {
    return {};
  },
});

export default ${componentName};
export { ${componentName} };`
    : `
const ${componentName} = defineComponent({
  name: '${componentName}',
  props: {
    class: {
      type: String,
      default: '',
    },
    style: {
      type: [String, Object],
      default: undefined,
    },
  },
  setup(props) {
    return {};
  },
});

export default ${componentName};
export { ${componentName} };`;

  return `<script${lang}>
import { defineComponent } from 'vue';${propsType}${exportStatement}
</script>`;
}
