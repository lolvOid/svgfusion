/**
 * Vue component generator
 * Generates production-ready Vue 3 components with TypeScript support
 */

import {
  ComponentGenerator,
  GeneratorOptions,
  ComponentResult,
} from '../core/generator';
import {
  TransformationResult,
  ColorMapping,
  StrokeWidthMapping,
} from '../core/transformer';
import { SVGElement } from '../core/parser';
import { format } from 'prettier';

export interface VueGeneratorOptions extends GeneratorOptions {
  composition?: boolean;
  scriptSetup?: boolean;
  sfc?: boolean; // Single File Component
  defineComponent?: boolean;
  useDefineOptions?: boolean; // For Vue 3.3+ compatibility
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
      useDefineOptions: options.useDefineOptions ?? false,
    };
  }

  /**
   * Generate Vue component from transformation result
   */
  async generate(result: TransformationResult): Promise<ComponentResult> {
    const componentName = this.getComponentName();

    let rawCode: string;

    if (this.vueOptions.sfc) {
      // Generate Single File Component
      rawCode = this.generateSFC(result);
    } else {
      // Generate separate .js/.ts file
      rawCode = this.generateJSComponent(result);
    }

    const extension = this.vueOptions.sfc
      ? 'vue'
      : this.vueOptions.typescript
        ? 'ts'
        : 'js';
    const filename = this.generateFilename(componentName, extension);

    // Format the code with prettier
    let code: string;
    try {
      const parser = this.vueOptions.sfc
        ? 'vue'
        : this.vueOptions.typescript
          ? 'typescript'
          : 'babel';

      code = await format(rawCode, {
        parser,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
        htmlWhitespaceSensitivity: 'ignore',
        vueIndentScriptAndStyle: true,
      });
    } catch (error) {
      // Fallback to unformatted code if prettier fails
      console.warn(
        'Prettier formatting failed, using unformatted code:',
        error
      );
      code = rawCode;
    }

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
  this.vueOptions.scriptSetup && this.vueOptions.useDefineOptions
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

    // Generate SVG root attributes
    const rootAttributes = this.generateSvgAttributes(ast);

    // Generate children
    const children = ast.root.children
      .map(child => this.elementToVueTemplate(child, 2))
      .join('\n');

    return `  <svg${rootAttributes} v-bind="$attrs" :width="computedWidth" :height="computedHeight">
    <title v-if="props.title" :id="props.titleId">{{ props.title }}</title>
    <desc v-if="props.desc" :id="props.descId">{{ props.desc }}</desc>
${children}
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
    const classVars: string[] = [];
    const hasOriginalClass = 'class' in attributes;

    Object.entries(attributes).forEach(([key, value]) => {
      // Handle vector-effect attribute conditionally based on isFixedStrokeWidth
      if (key === 'vector-effect' && value === 'non-scaling-stroke') {
        vueAttributes.push(
          `:vector-effect="props.isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'"`
        );
      }
      // Handle style attribute with color variables
      else if (key === 'style') {
        const parsedStyle = this.parseStyleStringForVue(value);
        vueAttributes.push(`:style="${parsedStyle}"`);

        // Also collect class variables from style attribute variables
        const styleClassVars = this.extractClassVarsFromStyle(value);
        classVars.push(...styleClassVars);
      }
      // Check if value is a color or stroke-width variable (starts and ends with curly braces)
      else if (value.startsWith('{') && value.endsWith('}')) {
        const variableName = value.slice(1, -1); // Remove the braces

        // Add the attribute
        vueAttributes.push(`:${key}="props.${variableName}"`);

        // Always collect class variables for fill, stroke, or stroke-width attributes when splitting is enabled
        if (key === 'fill' || key === 'stroke' || key === 'stroke-width') {
          const classVar = `${variableName}Class`;
          classVars.push(`props.${classVar}`);
        }
      } else {
        vueAttributes.push(`${key}="${value}"`);
      }
    });

    // Add combined class attribute if there are any class variables
    if (classVars.length > 0) {
      const originalClass = attributes.class;
      if (originalClass) {
        vueAttributes.push(
          `:class="[${classVars.join(', ')}, '${originalClass}']"`
        );
      } else {
        vueAttributes.push(`:class="[${classVars.join(', ')}]"`);
      }
    } else if (hasOriginalClass) {
      // Keep original class if no color classes
      const originalClass = attributes.class;
      if (originalClass) {
        vueAttributes.push(`class="${originalClass}"`);
      }
    }

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
    const { colorMappings, strokeWidthMappings, metadata } = result;
    const lines: string[] = [];

    // Add required imports for TypeScript
    if (this.vueOptions.typescript) {
      lines.push('import type { SVGAttributes } from "vue";');
      lines.push('import { computed } from "vue";');
      lines.push('');
    } else {
      lines.push('import { computed } from "vue";');
      lines.push('');
    }

    // Define props
    if (this.vueOptions.typescript) {
      lines.push('interface Props extends /* @vue-ignore */ SVGAttributes {');
      lines.push('  title?: string;');
      lines.push('  titleId?: string;');
      lines.push('  desc?: string;');
      lines.push('  descId?: string;');
      lines.push('  width?: string | number;');
      lines.push('  height?: string | number;');
      lines.push('  size?: string | number;');

      // Add color props
      const colorProps = this.generateColorPropsInterface(colorMappings);
      if (colorProps) {
        lines.push(colorProps);
      }

      // Add stroke width props
      const strokeWidthProps =
        this.generateStrokeWidthPropsInterface(strokeWidthMappings);
      if (strokeWidthProps) {
        lines.push(strokeWidthProps);
      }

      if (metadata.features.includes('fixed-stroke-width')) {
        lines.push('  isFixedStrokeWidth?: boolean;');
      }

      lines.push('}');
      lines.push('');
      lines.push('const props = withDefaults(defineProps<Props>(), {');
    } else {
      lines.push('const props = defineProps({');
      lines.push("  title: { type: String, default: '' },");
      lines.push("  titleId: { type: String, default: '' },");
      lines.push("  desc: { type: String, default: '' },");
      lines.push("  descId: { type: String, default: '' },");
      lines.push("  class: { type: String, default: '' },");
      lines.push("  style: { type: Object, default: '' },");
      lines.push("  width: { type: [String, Number], default: '' },");
      lines.push("  height: { type: [String, Number], default: '' },");
      lines.push('  size: { type: [String, Number], default: "24" },');
    }

    // Add size defaults for TypeScript
    if (this.vueOptions.typescript) {
      lines.push('  size: "24",');
    }

    // Add color defaults
    colorMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalColor;
      const className = `${propName}Class`;

      if (this.vueOptions.typescript) {
        lines.push(`  ${propName}: '${defaultValue}',`);
        lines.push(`  ${className}: "",`);
      } else {
        lines.push(
          `  ${propName}: { type: String, default: '${defaultValue}' },`
        );
        lines.push(`  ${className}: { type: String, default: "" },`);
      }
    });

    // Add stroke width defaults
    strokeWidthMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalStrokeWidth;
      const className = `${propName}Class`;

      if (this.vueOptions.typescript) {
        lines.push(`  ${propName}: '${defaultValue}',`);
        lines.push(`  ${className}: "",`);
      } else {
        lines.push(
          `  ${propName}: { type: [String, Number], default: '${defaultValue}' },`
        );
        lines.push(`  ${className}: { type: String, default: "" },`);
      }
    });

    if (metadata.features.includes('fixed-stroke-width')) {
      if (this.vueOptions.typescript) {
        lines.push('  isFixedStrokeWidth: true,');
      } else {
        lines.push('  isFixedStrokeWidth: { type: Boolean, default: true },');
      }
    }

    lines.push('});');
    lines.push('');
    lines.push(
      'const computedWidth = computed(() => props.width || props.size);'
    );
    lines.push(
      'const computedHeight = computed(() => props.height || props.size);'
    );

    return lines.join('\n');
  }

  /**
   * Generate Composition API script
   */
  private generateCompositionAPI(result: TransformationResult): string {
    const { colorMappings, strokeWidthMappings, metadata } = result;
    const componentName = this.getComponentName();
    const lines: string[] = [];

    lines.push("import { defineComponent, computed } from 'vue';");
    lines.push('');
    lines.push(`export default defineComponent({`);
    lines.push(`  name: '${componentName}',`);
    lines.push('  props: {');
    lines.push("    title: { type: String, default: '' },");
    lines.push("    titleId: { type: String, default: '' },");
    lines.push("    desc: { type: String, default: '' },");
    lines.push("    descId: { type: String, default: '' },");
    lines.push("    class: { type: String, default: '' },");
    lines.push("    style: { type: Object, default: '' },");
    lines.push("    width: { type: [String, Number], default: '' },");
    lines.push("    height: { type: [String, Number], default: '' },");
    lines.push('    size: { type: [String, Number], default: "24" },');

    // Add color props
    colorMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalColor;
      const className = `${propName}Class`;

      lines.push(
        `    ${propName}: { type: String, default: '${defaultValue}' },`
      );
      lines.push(`    ${className}: { type: String, default: "" },`);
    });

    // Add stroke width props
    strokeWidthMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalStrokeWidth;
      const className = `${propName}Class`;

      lines.push(
        `    ${propName}: { type: [String, Number], default: '${defaultValue}' },`
      );
      lines.push(`    ${className}: { type: String, default: "" },`);
    });

    if (metadata.features.includes('fixed-stroke-width')) {
      lines.push('    isFixedStrokeWidth: { type: Boolean, default: true },');
    }

    lines.push('  },');
    lines.push('  setup(props) {');
    lines.push(
      '    const computedWidth = computed(() => props.width || props.size);'
    );
    lines.push(
      '    const computedHeight = computed(() => props.height || props.size);'
    );
    lines.push('    return { computedWidth, computedHeight };');
    lines.push('  },');
    lines.push('});');

    return lines.join('\n');
  }

  /**
   * Generate Options API script
   */
  private generateOptionsAPI(result: TransformationResult): string {
    const { colorMappings, strokeWidthMappings, metadata } = result;
    const componentName = this.getComponentName();
    const lines: string[] = [];

    lines.push('export default {');
    lines.push(`  name: '${componentName}',`);
    lines.push('  props: {');
    lines.push("    title: { type: String, default: '' },");
    lines.push("    titleId: { type: String, default: '' },");
    lines.push("    desc: { type: String, default: '' },");
    lines.push("    descId: { type: String, default: '' },");
    lines.push("    class: { type: String, default: '' },");
    lines.push("    style: { type: Object, default: '' },");
    lines.push("    width: { type: [String, Number], default: '' },");
    lines.push("    height: { type: [String, Number], default: '' },");
    lines.push('    size: { type: [String, Number], default: "24" },');

    // Add color props
    colorMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalColor;
      const className = `${propName}Class`;

      lines.push(
        `    ${propName}: { type: String, default: '${defaultValue}' },`
      );
      lines.push(`    ${className}: { type: String, default: "" },`);
    });

    // Add stroke width props
    strokeWidthMappings.forEach(mapping => {
      const propName = mapping.variableName;
      const defaultValue = mapping.originalStrokeWidth;
      const className = `${propName}Class`;

      lines.push(
        `    ${propName}: { type: [String, Number], default: '${defaultValue}' },`
      );
      lines.push(`    ${className}: { type: String, default: "" },`);
    });

    if (metadata.features.includes('fixed-stroke-width')) {
      lines.push('    isFixedStrokeWidth: { type: Boolean, default: true },');
    }

    lines.push('  },');
    lines.push('  computed: {');
    lines.push('    computedWidth() {');
    lines.push('      return this.width || this.size;');
    lines.push('    },');
    lines.push('    computedHeight() {');
    lines.push('      return this.height || this.size;');
    lines.push('    },');
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
   * Generate TypeScript interface for stroke width props
   */
  private generateStrokeWidthPropsInterface(
    strokeWidthMappings: StrokeWidthMapping[]
  ): string {
    if (strokeWidthMappings.length === 0) return '';

    return strokeWidthMappings
      .map(mapping => {
        const propName = mapping.variableName;
        const className = `${propName}Class`;
        return `  ${propName}?: string | number;\n  ${className}?: string;`;
      })
      .join('\n');
  }

  /**
   * Parse style string for Vue template syntax
   */
  private parseStyleStringForVue(styleStr: string): string {
    const styleEntries: string[] = [];

    // Split by semicolon and process each declaration
    styleStr.split(';').forEach(declaration => {
      const colonIndex = declaration.indexOf(':');
      if (colonIndex > 0) {
        const property = declaration.slice(0, colonIndex).trim();
        const value = declaration.slice(colonIndex + 1).trim();

        if (property && value) {
          // Handle color variables - if value is wrapped in braces, it's a variable
          if (value.startsWith('{') && value.endsWith('}')) {
            const variableName = value.slice(1, -1); // Remove braces
            styleEntries.push(`'${property}': props.${variableName}`);
          } else {
            styleEntries.push(`'${property}': '${value}'`);
          }
        }
      }
    });

    return `{ ${styleEntries.join(', ')} }`;
  }

  /**
   * Generate SVG root attributes for Vue template
   */
  private generateSvgAttributes(ast: {
    root: any;
    viewBox?: string;
    width?: string;
    height?: string;
    namespace?: string;
  }): string {
    const attributes: string[] = [];

    // Add viewBox from root element attributes or AST
    const viewBox = ast.root.attributes?.viewBox || ast.viewBox;
    if (viewBox) {
      attributes.push(` viewBox="${viewBox}"`);
    }

    // Add xmlns if present
    const xmlns =
      ast.root.attributes?.xmlns ||
      ast.namespace ||
      'http://www.w3.org/2000/svg';
    if (xmlns) {
      attributes.push(` xmlns="${xmlns}"`);
    }

    // Add width and height if present and no viewBox
    if (!viewBox) {
      const width = ast.root.attributes?.width || ast.width;
      const height = ast.root.attributes?.height || ast.height;

      if (width) {
        attributes.push(` width="${width}"`);
      }
      if (height) {
        attributes.push(` height="${height}"`);
      }
    }

    return attributes.join('');
  }

  /**
   * Get list of dependencies
   */
  private getDependencies(): string[] {
    return ['vue'];
  }

  /**
   * Extract class variables from style attribute value
   */
  private extractClassVarsFromStyle(styleStr: string): string[] {
    const classVars: string[] = [];

    // Split by semicolon and process each declaration
    styleStr.split(';').forEach(declaration => {
      const colonIndex = declaration.indexOf(':');
      if (colonIndex > 0) {
        const property = declaration.slice(0, colonIndex).trim();
        const value = declaration.slice(colonIndex + 1).trim();

        if (property && value && value.startsWith('{') && value.endsWith('}')) {
          const variableName = value.slice(1, -1); // Remove braces

          // Add class variable for fill, stroke, or stroke-width properties
          if (
            property === 'fill' ||
            property === 'stroke' ||
            property === 'stroke-width'
          ) {
            const classVar = `props.${variableName}Class`;
            classVars.push(classVar);
          }
        }
      }
    });

    return classVars;
  }
}
