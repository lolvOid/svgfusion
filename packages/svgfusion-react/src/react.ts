/**
 * React component generator
 * Generates production-ready React components with TypeScript support
 */

import {
  ComponentGenerator,
  GeneratorOptions,
  ComponentResult,
  TransformationResult,
  ColorMapping,
  StrokeWidthMapping,
  SVGElement,
} from 'svgfusion-core';
import { format } from 'prettier';
import { toReactProp, camelCase } from 'svgfusion-utils';

export interface ReactGeneratorOptions extends GeneratorOptions {
  memo?: boolean;
  forwardRef?: boolean;
  propTypes?: boolean;
  defaultProps?: boolean;
  namedExport?: boolean;
}

/**
 * React component generator
 */
export class ReactGenerator extends ComponentGenerator {
  private reactOptions: Required<ReactGeneratorOptions>;

  constructor(options: ReactGeneratorOptions = {}) {
    super(options);
    this.reactOptions = {
      ...this.options,
      memo: options.memo ?? true,
      forwardRef: options.forwardRef ?? true,
      propTypes: options.propTypes ?? false,
      defaultProps: options.defaultProps ?? false,
      namedExport: options.namedExport ?? false,
    };
  }

  /**
   * Generate React component from transformation result
   */
  async generate(result: TransformationResult): Promise<ComponentResult> {
    const componentName = this.getComponentName();
    const { colorMappings, strokeWidthMappings, metadata } = result;

    // Build the component code
    const imports = this.generateImports();
    const interfaces = this.generateInterfaces(
      colorMappings,
      strokeWidthMappings,
      metadata.features
    );
    const component = this.generateComponent(result);
    const exports = this.generateExports(componentName);

    const rawCode = [imports, interfaces, component, exports]
      .filter(Boolean)
      .join('\n\n');

    const extension = this.reactOptions.typescript ? 'tsx' : 'jsx';
    const filename = this.generateFilename(componentName, extension);

    // Format the code with prettier
    let code: string;
    try {
      code = await format(rawCode, {
        parser: extension === 'tsx' ? 'typescript' : 'babel',
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
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
   * Generate import statements
   */
  private generateImports(): string {
    const imports: string[] = [];

    if (this.reactOptions.typescript) {
      // Collect all React imports in one statement
      const reactImports = [];
      if (this.reactOptions.forwardRef) {
        reactImports.push('Ref');
        reactImports.push('forwardRef');
      }
      if (this.reactOptions.memo) {
        reactImports.push('memo');
      }
      if (reactImports.length > 0) {
        imports.push(
          `import React, { ${reactImports.join(', ')} } from 'react';`
        );
      } else {
        imports.push("import React from 'react';");
      }
    } else {
      // JavaScript imports
      const reactImports = [];
      if (this.reactOptions.forwardRef) {
        reactImports.push('forwardRef');
      }
      if (this.reactOptions.memo) {
        reactImports.push('memo');
      }

      if (reactImports.length > 0) {
        imports.push(
          `import React, { ${reactImports.join(', ')} } from 'react';`
        );
      } else {
        imports.push("import React from 'react';");
      }

      if (this.reactOptions.propTypes) {
        imports.push("import PropTypes from 'prop-types';");
      }
    }

    return imports.join('\n');
  }

  /**
   * Generate TypeScript interfaces or PropTypes
   */
  private generateInterfaces(
    colorMappings: ColorMapping[],
    strokeWidthMappings: StrokeWidthMapping[],
    features: string[]
  ): string {
    if (!this.reactOptions.typescript && !this.reactOptions.propTypes) {
      return '';
    }

    if (this.reactOptions.typescript) {
      return this.generateTypeScriptInterface(
        colorMappings,
        strokeWidthMappings,
        features
      );
    } else {
      return this.generatePropTypes(
        colorMappings,
        strokeWidthMappings,
        features
      );
    }
  }

  /**
   * Generate TypeScript interface
   */
  private generateTypeScriptInterface(
    colorMappings: ColorMapping[],
    strokeWidthMappings: StrokeWidthMapping[],
    features: string[]
  ): string {
    const customProps = [
      'title?: string;',
      'titleId?: string;',
      'desc?: string;',
      'descId?: string;',
      'size?: string | number;',
    ];

    // Add color props
    const colorProps = this.generateColorProps(colorMappings);
    if (colorProps) {
      customProps.push(colorProps);
    }

    // Add stroke width props
    const strokeWidthProps = this.generateStrokeWidthProps(strokeWidthMappings);
    if (strokeWidthProps) {
      customProps.push(strokeWidthProps);
    }

    // Add fixed stroke width prop if feature is enabled
    if (features.includes('fixed-stroke-width')) {
      customProps.push('isFixedStrokeWidth?: boolean;');
    }

    const componentName = this.getComponentName();
    return `interface ${componentName}Props extends React.SVGProps<SVGSVGElement> {\n  ${customProps.join(
      '\n  '
    )}\n}`;
  }

  /**
   * Generate PropTypes
   */
  private generatePropTypes(
    colorMappings: ColorMapping[],
    strokeWidthMappings: StrokeWidthMapping[],
    features: string[]
  ): string {
    // Implementation for PropTypes (for non-TypeScript projects)
    const componentName = this.getComponentName();
    const props = [
      'title: PropTypes.string,',
      'titleId: PropTypes.string,',
      'desc: PropTypes.string,',
      'descId: PropTypes.string,',
      'size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
      'className: PropTypes.string,',
      'style: PropTypes.object,',
      'width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
      'height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
    ];

    const colorProps = this.generateColorProps(colorMappings);
    if (colorProps) {
      props.push(colorProps);
    }

    const strokeWidthProps = this.generateStrokeWidthProps(strokeWidthMappings);
    if (strokeWidthProps) {
      props.push(strokeWidthProps);
    }

    if (features.includes('fixed-stroke-width')) {
      props.push('isFixedStrokeWidth: PropTypes.bool,');
    }

    return `${componentName}.propTypes = {\n  ${props.join('\n  ')}\n};`;
  }

  /**
   * Generate the main component
   */
  private generateComponent(result: TransformationResult): string {
    const componentName = this.getComponentName();
    const { colorMappings, strokeWidthMappings, metadata } = result;

    // Generate props destructuring for custom props only
    const customProps = ['title', 'titleId', 'desc', 'descId', 'size'];
    const colorProps = colorMappings.map(m => m.variableName);
    const colorClassProps = colorMappings.map(m => `${m.variableName}Class`);
    const strokeWidthProps = strokeWidthMappings.map(m => m.variableName);
    const strokeWidthClassProps = strokeWidthMappings.map(
      m => `${m.variableName}Class`
    );

    const allCustomProps = [
      ...customProps,
      ...colorProps,
      ...colorClassProps,
      ...strokeWidthProps,
      ...strokeWidthClassProps,
    ];

    // if (metadata.features.includes('fixed-stroke-width')) {
    //   allCustomProps.push('isFixedStrokeWidth');
    // }

    // Generate props destructuring with default values
    const colorDefaults = this.generateColorDefaults(colorMappings);
    const strokeWidthDefaults =
      this.generateStrokeWidthDefaults(strokeWidthMappings);
    const sizeDefault = 'size = "24"';
    const isFixedStrokeWidthDefault = metadata.features.includes(
      'fixed-stroke-width'
    )
      ? 'isFixedStrokeWidth = true'
      : '';
    const allDefaults = [
      sizeDefault,
      colorDefaults,
      strokeWidthDefaults,
      isFixedStrokeWidthDefault,
    ]
      .filter(Boolean)
      .join(', ');

    // Separate props with defaults from props without defaults
    const propsWithDefaults = allDefaults
      .split(', ')
      .map(def => def.split(' = ')[0]);
    const propsWithoutDefaults = allCustomProps.filter(
      prop => !propsWithDefaults.includes(prop)
    );

    const customPropsDestructure = `{
    ${propsWithoutDefaults.join(',\n    ')},
    ${allDefaults},
    ...svgProps
  }`;

    // Get root SVG attributes
    const rootAttributes = this.generateSvgAttributes(result.ast);

    // Add title and desc elements if needed
    const titleElement = '{title ? <title id={titleId}>{title}</title> : null}';
    const descElement = '{desc ? <desc id={descId}>{desc}</desc> : null}';

    if (this.reactOptions.typescript) {
      const propsType = `${componentName}Props`;
      const refType = this.reactOptions.forwardRef
        ? `, ref: Ref<SVGSVGElement>`
        : '';

      // Extract children JSX
      const childrenJsx = result.ast.root.children
        .map(child => this.elementToJsx(child, 1))
        .join('\n');

      return `const ${componentName} = (${customPropsDestructure}: ${propsType}${refType}) => {
  const computedSize = {
    width: svgProps.width || size,
    height: svgProps.height || size
  };
  
  return (
    <svg
      ${
        this.reactOptions.forwardRef ? 'ref={ref}\n      ' : ''
      }${rootAttributes}
      {...svgProps}
      {...computedSize}
    >
      ${titleElement}
      ${descElement}
${childrenJsx}
    </svg>
  );
};`;
    } else {
      // For non-TypeScript, generate simpler component
      const childrenJsx = result.ast.root.children
        .map(child => this.elementToJsx(child, 1))
        .join('\n');

      return `const ${componentName} = (${customPropsDestructure}) => {
  const computedSize = size ? { width: size, height: size } : {};
  
  return (
    <svg ${rootAttributes}{...computedSize} {...svgProps}>
      ${titleElement}
      ${descElement}
${childrenJsx}
    </svg>
  );
};`;
    }
  }

  /**
   * Generate export statements
   */
  private generateExports(componentName: string): string {
    const exports: string[] = [];

    if (this.reactOptions.forwardRef) {
      exports.push(`const ForwardRef = forwardRef(${componentName});`);
      if (this.reactOptions.memo) {
        exports.push('const Memo = memo(ForwardRef);');
        if (this.reactOptions.exportDefault) {
          exports.push('export default Memo;');
        }
        if (this.reactOptions.namedExport) {
          exports.push(`export { Memo as ${componentName} };`);
        }
      } else {
        if (this.reactOptions.exportDefault) {
          exports.push('export default ForwardRef;');
        }
        if (this.reactOptions.namedExport) {
          exports.push(`export { ForwardRef as ${componentName} };`);
        }
      }
    } else if (this.reactOptions.memo) {
      exports.push(`const Memo = memo(${componentName});`);
      if (this.reactOptions.exportDefault) {
        exports.push('export default Memo;');
      }
      if (this.reactOptions.namedExport) {
        exports.push(`export { Memo as ${componentName} };`);
      }
    } else {
      if (this.reactOptions.exportDefault) {
        exports.push(`export default ${componentName};`);
      }
      if (this.reactOptions.namedExport) {
        exports.push(`export { ${componentName} };`);
      }
    }

    return exports.join('\n');
  }

  /**
   * Get list of dependencies
   */
  private getDependencies(): string[] {
    const deps = ['react'];

    if (this.reactOptions.propTypes) {
      deps.push('prop-types');
    }

    return deps;
  }

  /**
   * Generate SVG root attributes
   */
  private generateSvgAttributes(ast: {
    root: any;
    viewBox?: string;
    width?: string;
    height?: string;
    namespace?: string;
  }): string {
    const attributes: string[] = [];

    // Add all attributes from the root element, prioritizing AST-level overrides
    const rootAttrs = ast.root.attributes || {};
    const allAttributes = {
      ...rootAttrs,
      // Override with AST-level attributes if present
      ...(ast.viewBox && { viewBox: ast.viewBox }),
      ...(ast.namespace && { xmlns: ast.namespace }),
      ...(ast.width && { width: ast.width }),
      ...(ast.height && { height: ast.height }),
    };

    // Skip width/height if viewBox is present (they'll be handled by computed size)
    const hasViewBox = allAttributes.viewBox;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Object.entries(allAttributes).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Skip width/height when viewBox is present (handled separately)
        if (hasViewBox && (key === 'width' || key === 'height')) {
          return;
        }

        // Handle special attributes that need JSX formatting
        if (
          key === 'aria-labelledby' &&
          typeof value === 'string' &&
          value.includes('{')
        ) {
          // Convert template strings like '{titleId} {descId}' to JSX expressions
          const jsxValue = value.replace(/\{(\w+)\}/g, '${$1}');
          attributes.push(`aria-labelledby={\`${jsxValue}\`}`);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          attributes.push(`${key}="${value}"`);
        }
      }
    });

    return attributes.length > 0
      ? attributes.join('\n      ') + '\n      '
      : '';
  }

  /**
   * Override to add color class logic for React
   */
  protected elementToJsx(element: SVGElement, depth: number = 0): string {
    const indent = '  '.repeat(depth + 1);
    const { tag, attributes, children, content } = element;

    // Convert attributes to JSX format with color class logic
    const jsxAttributes = this.attributesToJsxWithClasses(attributes);
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
   * Convert attributes to JSX with color class logic
   */
  private attributesToJsxWithClasses(
    attributes: Record<string, string>
  ): string[] {
    const jsxAttributes: string[] = [];
    const classNames: string[] = [];
    const hasOriginalClass = 'class' in attributes || 'className' in attributes;

    // Process all attributes
    Object.entries(attributes).forEach(([key, value]) => {
      const jsxKey = toReactProp(key);

      // Handle vector-effect attribute conditionally based on isFixedStrokeWidth
      if (key === 'vector-effect' && value === 'non-scaling-stroke') {
        jsxAttributes.push(
          `vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}`
        );
      }
      // Handle dynamic color values - always add colorClass when color splitting is enabled
      else if (
        (key === 'fill' || key === 'stroke') &&
        value.startsWith('{') &&
        value.endsWith('}')
      ) {
        const colorVar = value.slice(1, -1); // Remove braces

        // Add the color attribute
        jsxAttributes.push(`${jsxKey}=${value}`);

        // Always collect class name for color splitting
        const classVar = `${colorVar}Class`;
        classNames.push(classVar);
      }
      // Handle dynamic stroke-width values - always add strokeWidthClass when stroke width splitting is enabled
      else if (
        key === 'stroke-width' &&
        value.startsWith('{') &&
        value.endsWith('}')
      ) {
        const strokeWidthVar = value.slice(1, -1); // Remove braces

        // Add the stroke-width attribute
        jsxAttributes.push(`${jsxKey}=${value}`);

        // Always collect class name for stroke width splitting
        const classVar = `${strokeWidthVar}Class`;
        classNames.push(classVar);
      } else if (key === 'style') {
        // Convert HTML style string to JSX style object
        const styleObj = this.parseStyleString(value);

        // Convert the style object to JSX format and collect class names for stroke-width variables
        const styleEntries = Object.entries(styleObj).map(([prop, val]) => {
          if (
            typeof val === 'string' &&
            val.startsWith('{') &&
            val.endsWith('}')
          ) {
            // This is a variable reference, don't quote it
            const varName = val.slice(1, -1);

            // If this is a stroke-width variable, collect the class name
            if (prop === 'strokeWidth') {
              const classVar = `${varName}Class`;
              classNames.push(classVar);
            }

            return `${prop}: ${varName}`;
          } else {
            // This is a literal value, quote it
            return `${prop}: '${val}'`;
          }
        });

        jsxAttributes.push(`style={{ ${styleEntries.join(', ')} }}`);
      } else {
        // Handle regular attributes
        if (value.startsWith('{') && value.endsWith('}')) {
          jsxAttributes.push(`${jsxKey}=${value}`);
        } else {
          jsxAttributes.push(`${jsxKey}="${value}"`);
        }
      }
    });

    // Add combined className if any color classes were found
    if (classNames.length > 0) {
      // Get the original class value
      const originalClass = attributes.class || attributes.className;

      if (classNames.length === 1) {
        if (originalClass) {
          jsxAttributes.push(
            `className={\`${originalClass} \${${classNames[0]}}\`}`
          );
        } else {
          jsxAttributes.push(`className={${classNames[0]}}`);
        }
      } else {
        const combinedClasses = classNames.map(cls => `\${${cls}}`).join(' ');
        if (originalClass) {
          jsxAttributes.push(
            `className={\`${originalClass} ${combinedClasses}\`}`
          );
        } else {
          jsxAttributes.push(`className={\`${combinedClasses}\`}`);
        }
      }
    } else if (hasOriginalClass) {
      // Keep original class if no color classes
      const originalClass = attributes.class || attributes.className;
      if (originalClass) {
        jsxAttributes.push(`className="${originalClass}"`);
      }
    }

    return jsxAttributes;
  }

  /**
   * Parse CSS style string into style object for JSX
   */
  private parseStyleString(styleStr: string): Record<string, any> {
    const styleObj: Record<string, any> = {};

    // Split by semicolon and process each declaration
    styleStr.split(';').forEach(declaration => {
      const colonIndex = declaration.indexOf(':');
      if (colonIndex > 0) {
        const property = declaration.slice(0, colonIndex).trim();
        const value = declaration.slice(colonIndex + 1).trim();

        if (property && value) {
          // Convert kebab-case CSS properties to camelCase for JSX
          const camelProperty = camelCase(property);
          styleObj[camelProperty] = value;
        }
      }
    });

    return styleObj;
  }
}
