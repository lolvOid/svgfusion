/**
 * Vue component generator
 * Generates production-ready Vue 3 components with TypeScript support
 */

import {
  ComponentGenerator,
  GeneratorOptions,
  ComponentResult,
} from '../core/generator';
import { TransformationResult, ColorMapping } from '../core/transformer';
import { SVGElement } from '../core/parser';

export interface VueGeneratorOptions extends GeneratorOptions {
  composition?: boolean;
  scriptSetup?: boolean;
  sfc?: boolean; // Single File Component
  defineComponent?: boolean;
}

/**
 * Vue component generator
 */
export class VueGenerator extends ComponentGenerator {
  private vueOptions: Required<VueGeneratorOptions>;

  constructor(options: VueGeneratorOptions = {}) {
    super(options);
    this.vueOptions = {
      ...this.options,
      composition: options.composition ?? true,
      scriptSetup: options.scriptSetup ?? true,
      sfc: options.sfc ?? true,
      defineComponent: options.defineComponent ?? false,
    };
  }

  /**
   * Generate Vue component from transformation result
   */
  generate(result: TransformationResult): ComponentResult {
    const componentName = this.getComponentName();

    let code: string;

    if (this.vueOptions.sfc) {
      // Generate Single File Component
      code = this.generateSFC(result);
    } else {
      // Generate separate .js/.ts file
      code = this.generateJSComponent(result);
    }

    const extension = this.vueOptions.sfc
      ? 'vue'
      : this.vueOptions.typescript
      ? 'ts'
      : 'js';
    const filename = this.generateFilename(componentName, extension);

    return {
      code,
      filename,
      componentName,
      dependencies: this.getDependencies(),
    };
  }

  /**
   * Generate Single File Component (.vue)
   */
  private generateSFC(result: TransformationResult): string {
    const template = this.generateTemplate(result);
    const script = this.generateScript(result);
    const style = this.generateStyle();

    return `<template>
${template}
</template>

<script${this.vueOptions.scriptSetup ? ' setup' : ''}${
      this.vueOptions.typescript ? ' lang="ts"' : ''
    }>
${
  this.vueOptions.scriptSetup
    ? 'defineOptions({ inheritAttrs: false });\n\n'
    : ''
}${script}
</script>

${style ? `<style scoped>\n${style}\n</style>` : ''}`;
  }

  /**
   * Generate separate JS/TS component file
   */
  private generateJSComponent(result: TransformationResult): string {
    if (this.vueOptions.composition) {
      return this.generateCompositionAPI(result);
    } else {
      return this.generateOptionsAPI(result);
    }
  }

  /**
   * Generate Vue template section
   */
  private generateTemplate(result: TransformationResult): string {
    // Generate the template using v-bind to spread all SVG attributes
    const { ast } = result;

    // Generate children
    const childrenJsx = ast.root.children
      .map(child => this.elementToVueTemplate(child, 2))
      .join('\n');

    return `  <svg v-bind="$attrs" :width="props.size || undefined" :height="props.size || undefined">
    <title v-if="props.title" :id="props.titleId">{{ props.title }}</title>
    <desc v-if="props.desc" :id="props.descId">{{ props.desc }}</desc>
${childrenJsx}
  </svg>`;
  }

  /**
   * Convert SVG element to Vue template syntax
   */
  private elementToVueTemplate(element: SVGElement, depth: number = 0): string {
    const indent = '  '.repeat(depth);
    const { tag, attributes, children, content } = element;

    // Convert attributes to Vue template format with color class logic
    const vueAttributes: string[] = [];

    Object.entries(attributes).forEach(([key, value]) => {
      // Check if value is a color variable (starts and ends with curly braces)
      if (value.startsWith('{') && value.endsWith('}')) {
        const variableName = value.slice(1, -1); // Remove the braces

        // Add the color attribute
        vueAttributes.push(`:${key}="props.${variableName}"`);

        // Add the corresponding class if it's a fill or stroke attribute
        if (key === 'fill' || key === 'stroke') {
          const classVar = `${variableName}Class`;
          vueAttributes.push(`:class="props.${classVar}"`);
        }
      } else {
        vueAttributes.push(`${key}="${value}"`);
      }
    });

    const attributeString =
      vueAttributes.length > 0 ? ' ' + vueAttributes.join(' ') : '';

    // Handle self-closing tags
    if (children.length === 0 && !content) {
      return `${indent}<${tag}${attributeString} />`;
    }

    // Handle tags with content or children
    let result = `${indent}<${tag}${attributeString}>`;

    if (content) {
      result += content;
    }

    if (children.length > 0) {
      result += '\n';
      result += children
        .map((child: SVGElement) => this.elementToVueTemplate(child, depth + 1))
        .join('\n');
      result += '\n' + indent;
    }

    result += `</${tag}>`;
    return result;
  }

  /**
   * Generate script section for SFC
   */
  private generateScript(result: TransformationResult): string {
    if (this.vueOptions.scriptSetup) {
      return this.generateScriptSetup(result);
    } else if (this.vueOptions.composition) {
      return this.generateCompositionAPI(result);
    } else {
      return this.generateOptionsAPI(result);
    }
  }

  /**
   * Generate <script setup> content
   */
  private generateScriptSetup(result: TransformationResult): string {
    const { colorMappings, metadata } = result;
    const lines: string[] = [];

    // Define props
    if (this.vueOptions.typescript) {
      lines.push('interface Props extends SVGAttributes {');
      lines.push('  title?: string;');
      lines.push('  titleId?: string;');
      lines.push('  desc?: string;');
      lines.push('  descId?: string;');
      lines.push('  size?: string;');

      // Add color props
      const colorProps = this.generateColorPropsInterface(colorMappings);
      if (colorProps) {
        lines.push(colorProps);
      }

      if (metadata.features.includes('fixed-stroke-width')) {
        lines.push('  isFixedStrokeWidth?: boolean;');
      }

      lines.push('}');
      lines.push('');
      lines.push('const props = withDefaults(defineProps<Props>(), {');
    } else {
      lines.push('const props = defineProps({');
      lines.push('  title: { type: String, default: undefined },');
      lines.push('  titleId: { type: String, default: undefined },');
      lines.push('  desc: { type: String, default: undefined },');
      lines.push('  descId: { type: String, default: undefined },');
      lines.push('  class: { type: String, default: undefined },');
      lines.push('  style: { type: Object, default: undefined },');
      lines.push('  width: { type: [String, Number], default: undefined },');
      lines.push('  height: { type: [String, Number], default: undefined },');
      lines.push('  size: { type: String, default: "20" },');
    }

    // Add size defaults for TypeScript
    if (this.vueOptions.typescript) {
      lines.push('  size: "20",');
    }

    // Add color defaults
    colorMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalColor;
      const className = `${propName}Class`;

      if (this.vueOptions.typescript) {
        lines.push(`  ${propName}: '${defaultValue}',`);
        lines.push(`  ${className}: undefined,`);
      } else {
        lines.push(
          `  ${propName}: { type: String, default: '${defaultValue}' },`
        );
        lines.push(`  ${className}: { type: String, default: undefined },`);
      }
    });

    if (metadata.features.includes('fixed-stroke-width')) {
      if (this.vueOptions.typescript) {
        lines.push('  isFixedStrokeWidth: false,');
      } else {
        lines.push('  isFixedStrokeWidth: { type: Boolean, default: false },');
      }
    }

    lines.push('});');

    return lines.join('\n');
  }

  /**
   * Generate Composition API script
   */
  private generateCompositionAPI(result: TransformationResult): string {
    const { colorMappings, metadata } = result;
    const componentName = this.getComponentName();
    const lines: string[] = [];

    lines.push("import { defineComponent } from 'vue';");
    lines.push('');
    lines.push(`export default defineComponent({`);
    lines.push(`  name: '${componentName}',`);
    lines.push('  props: {');
    lines.push('    title: { type: String, default: undefined },');
    lines.push('    titleId: { type: String, default: undefined },');
    lines.push('    desc: { type: String, default: undefined },');
    lines.push('    descId: { type: String, default: undefined },');
    lines.push('    class: { type: String, default: undefined },');
    lines.push('    style: { type: Object, default: undefined },');
    lines.push('    width: { type: [String, Number], default: undefined },');
    lines.push('    height: { type: [String, Number], default: undefined },');

    // Add color props
    colorMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalColor;
      const className = `${propName}Class`;

      lines.push(
        `    ${propName}: { type: String, default: '${defaultValue}' },`
      );
      lines.push(`    ${className}: { type: String, default: undefined },`);
    });

    if (metadata.features.includes('fixed-stroke-width')) {
      lines.push('    isFixedStrokeWidth: { type: Boolean, default: false },');
    }

    lines.push('  },');
    lines.push('  setup() {');
    lines.push('    return {};');
    lines.push('  },');
    lines.push('});');

    return lines.join('\n');
  }

  /**
   * Generate Options API script
   */
  private generateOptionsAPI(result: TransformationResult): string {
    const { colorMappings, metadata } = result;
    const componentName = this.getComponentName();
    const lines: string[] = [];

    lines.push('export default {');
    lines.push(`  name: '${componentName}',`);
    lines.push('  props: {');
    lines.push('    title: { type: String, default: undefined },');
    lines.push('    titleId: { type: String, default: undefined },');
    lines.push('    desc: { type: String, default: undefined },');
    lines.push('    descId: { type: String, default: undefined },');
    lines.push('    class: { type: String, default: undefined },');
    lines.push('    style: { type: Object, default: undefined },');
    lines.push('    width: { type: [String, Number], default: undefined },');
    lines.push('    height: { type: [String, Number], default: undefined },');

    // Add color props
    colorMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalColor;
      const className = `${propName}Class`;

      lines.push(
        `    ${propName}: { type: String, default: '${defaultValue}' },`
      );
      lines.push(`    ${className}: { type: String, default: undefined },`);
    });

    if (metadata.features.includes('fixed-stroke-width')) {
      lines.push('    isFixedStrokeWidth: { type: Boolean, default: false },');
    }

    lines.push('  },');
    lines.push('};');

    return lines.join('\n');
  }

  /**
   * Generate style section
   */
  private generateStyle(): string {
    // Optional: Add default styles
    return '';
  }

  /**
   * Generate TypeScript interface for color props
   */
  private generateColorPropsInterface(colorMappings: ColorMapping[]): string {
    if (colorMappings.length === 0) return '';

    return colorMappings
      .map(mapping => {
        const propName = mapping.variableName;
        const className = `${propName}Class`;
        return `  ${propName}?: string;\n  ${className}?: string;`;
      })
      .join('\n');
  }

  /**
   * Get list of dependencies
   */
  private getDependencies(): string[] {
    return ['vue'];
  }
}
