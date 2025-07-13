/**
 * Abstract component generator base class
 * Provides common functionality for all component generators
 */

import { SVGAst, SVGElement } from './parser';
import {
  ColorMapping,
  StrokeWidthMapping,
  TransformationResult,
} from './transformer';
import { svgToComponentName } from '../utils/name';

export interface GeneratorOptions {
  typescript?: boolean;
  memo?: boolean;
  forwardRef?: boolean;
  exportDefault?: boolean;
  componentName?: string;
  prefix?: string;
  suffix?: string;
  includeTypes?: boolean;
}

export interface ComponentResult {
  code: string;
  filename: string;
  componentName: string;
  dependencies: string[];
}

/**
 * Abstract base class for component generators
 */
export abstract class ComponentGenerator {
  protected options: Required<GeneratorOptions>;

  constructor(options: GeneratorOptions = {}) {
    this.options = {
      typescript: true,
      memo: true,
      forwardRef: true,
      exportDefault: true,
      componentName: 'Icon',
      prefix: '',
      suffix: '',
      includeTypes: true,
      ...options,
    };
  }

  /**
   * Generate component code from transformation result
   */
  abstract generate(
    result: TransformationResult
  ): ComponentResult | Promise<ComponentResult>;

  /**
   * Convert SVG AST to JSX string
   */
  protected astToJsx(ast: SVGAst): string {
    return this.elementToJsx(ast.root, 0);
  }

  /**
   * Convert SVG element to JSX
   */
  protected elementToJsx(element: SVGElement, depth: number = 0): string {
    const indent = '  '.repeat(depth + 1);
    const { tag, attributes, children, content } = element;

    // Convert attributes to JSX format
    const jsxAttributes = this.attributesToJsx(attributes);
    const attributeString =
      jsxAttributes.length > 0 ? ' ' + jsxAttributes.join(' ') : '';

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
        .map(child => this.elementToJsx(child, depth + 1))
        .join('\n');
      result += '\n' + indent;
    }

    result += `</${tag}>`;
    return result;
  }

  /**
   * Convert attributes object to JSX attributes array
   */
  protected attributesToJsx(attributes: Record<string, string>): string[] {
    return Object.entries(attributes).map(([key, value]) => {
      // Handle special React attributes
      const jsxKey = this.convertAttributeName(key);

      // Handle dynamic values (wrapped in {})
      if (value.startsWith('{') && value.endsWith('}')) {
        return `${jsxKey}=${value}`;
      }

      // Handle regular string values
      return `${jsxKey}="${value}"`;
    });
  }

  /**
   * Convert HTML attribute names to JSX equivalents
   */
  protected convertAttributeName(name: string): string {
    // Common HTML to JSX attribute conversions
    const conversions: Record<string, string> = {
      class: 'className',
      for: 'htmlFor',
      tabindex: 'tabIndex',
      readonly: 'readOnly',
      maxlength: 'maxLength',
      cellpadding: 'cellPadding',
      cellspacing: 'cellSpacing',
      rowspan: 'rowSpan',
      colspan: 'colSpan',
      usemap: 'useMap',
      frameborder: 'frameBorder',
      contenteditable: 'contentEditable',
    };

    // Handle aria- and data- attributes (keep as-is)
    if (name.startsWith('aria-') || name.startsWith('data-')) {
      return name;
    }

    // Handle SVG attributes with hyphens (convert to camelCase)
    if (name.includes('-')) {
      return name.replace(/-([a-z])/g, (match, letter) =>
        (letter as string).toUpperCase()
      );
    }

    return conversions[name] || name;
  }

  /**
   * Generate color props interface/type definitions
   */
  protected generateColorProps(
    colorMappings: ColorMapping[],
    includeClassProps: boolean = true
  ): string {
    if (colorMappings.length === 0) return '';

    return colorMappings
      .map(mapping => {
        const propName = mapping.variableName;
        const className = `${propName}Class`;

        if (this.options.typescript) {
          let props = `  ${propName}?: string;`;
          if (includeClassProps) {
            props += `\n  ${className}?: string;`;
          }
          return props;
        } else {
          let props = `  ${propName}: PropTypes.string,`;
          if (includeClassProps) {
            props += `\n  ${className}: PropTypes.string,`;
          }
          return props;
        }
      })
      .join('\n');
  }

  /**
   * Generate default props for colors
   */
  protected generateColorDefaults(colorMappings: ColorMapping[]): string {
    if (colorMappings.length === 0) return '';

    return colorMappings
      .map(mapping => {
        const propName = mapping.variableName;
        const defaultValue = mapping.originalColor;
        return `${propName} = "${defaultValue}"`;
      })
      .join(', ');
  }

  /**
   * Generate stroke width props interface/type definitions
   */
  protected generateStrokeWidthProps(
    strokeWidthMappings: StrokeWidthMapping[],
    includeClassProps: boolean = true
  ): string {
    if (strokeWidthMappings.length === 0) return '';

    return strokeWidthMappings
      .map(mapping => {
        const propName = mapping.variableName;
        const className = `${propName}Class`;

        if (this.options.typescript) {
          let props = `  ${propName}?: string | number;`;
          if (includeClassProps) {
            props += `\n  ${className}?: string;`;
          }
          return props;
        } else {
          let props = `  ${propName}: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),`;
          if (includeClassProps) {
            props += `\n  ${className}: PropTypes.string,`;
          }
          return props;
        }
      })
      .join('\n');
  }

  /**
   * Generate default props for stroke widths
   */
  protected generateStrokeWidthDefaults(
    strokeWidthMappings: StrokeWidthMapping[]
  ): string {
    if (strokeWidthMappings.length === 0) return '';

    return strokeWidthMappings
      .map(mapping => {
        const propName = mapping.variableName;
        const defaultValue = mapping.originalStrokeWidth;
        return `${propName} = "${defaultValue}"`;
      })
      .join(', ');
  }

  /**
   * Generate component name from options
   */
  protected getComponentName(): string {
    return svgToComponentName(
      this.options.componentName,
      this.options.prefix,
      this.options.suffix
    );
  }

  /**
   * Generate filename with appropriate extension
   */
  protected generateFilename(componentName: string, extension: string): string {
    return `${componentName}.${extension}`;
  }

  /**
   * Sanitize component name to be valid JavaScript identifier
   */
  protected sanitizeComponentName(name: string): string {
    // Remove invalid characters and ensure it starts with a letter or underscore
    return name.replace(/[^a-zA-Z0-9_$]/g, '').replace(/^[0-9]/, '_$&');
  }
}
