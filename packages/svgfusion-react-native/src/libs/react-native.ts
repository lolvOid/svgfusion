/**
 * React Native component generator
 * Generates React Native components using react-native-svg
 */

import {
  ComponentGenerator,
  GeneratorOptions,
  ComponentResult,
  TransformationResult,
  ColorMapping,
  StrokeWidthMapping,
  SVGElement,
  SVGAst,
} from 'svgfusion-core';
import { camelCase } from 'svgfusion-utils';

export interface ReactNativeGeneratorOptions extends GeneratorOptions {
  memo?: boolean;
  forwardRef?: boolean;
  useStyleSheet?: boolean;
  propTypes?: boolean;
  defaultProps?: boolean;
  namedExport?: boolean;
  platform?: 'expo' | 'bare' | 'both';
}

/**
 * React Native component generator
 */
export class ReactNativeGenerator extends ComponentGenerator {
  private reactNativeOptions: Required<ReactNativeGeneratorOptions>;

  // Map HTML/SVG elements to react-native-svg components
  private readonly SVG_ELEMENT_MAP: Record<string, string> = {
    svg: 'Svg',
    path: 'Path',
    circle: 'Circle',
    rect: 'Rect',
    g: 'G',
    line: 'Line',
    polyline: 'Polyline',
    polygon: 'Polygon',
    ellipse: 'Ellipse',
    text: 'Text',
    tspan: 'TSpan',
    defs: 'Defs',
    linearGradient: 'LinearGradient',
    radialGradient: 'RadialGradient',
    stop: 'Stop',
    clipPath: 'ClipPath',
    mask: 'Mask',
    use: 'Use',
    symbol: 'Symbol',
    image: 'Image',
    title: 'Title',
    desc: 'Desc',
  };

  constructor(options: ReactNativeGeneratorOptions = {}) {
    super(options);
    this.reactNativeOptions = {
      typescript: this.options.typescript,
      componentName: this.options.componentName,
      prefix: this.options.prefix,
      suffix: this.options.suffix,
      exportDefault: this.options.exportDefault,
      includeTypes: this.options.includeTypes,
      memo: options.memo ?? true,
      forwardRef: options.forwardRef ?? true,
      useStyleSheet: options.useStyleSheet ?? false,
      propTypes: options.propTypes ?? false,
      defaultProps: options.defaultProps ?? false,
      namedExport: options.namedExport ?? false,
      platform: options.platform ?? 'both',
    };
  }

  /**
   * Dynamically load prettier for code formatting
   */
  private async formatCode(code: string, parser: string): Promise<string> {
    try {
      // Dynamic import of prettier to avoid bundling it
      const { format } = await import('prettier');

      return await format(code, {
        parser,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        printWidth: 80,
        bracketSpacing: true,
        arrowParens: 'avoid',
      });
    } catch (error) {
      // Fallback to unformatted code if prettier is not available or fails
      console.warn(
        'Prettier formatting failed or not available, using unformatted code:',
        error
      );
      return code;
    }
  }

  /**
   * Generate React Native component from transformation result
   */
  async generate(result: TransformationResult): Promise<ComponentResult> {
    const componentName = this.getComponentName();
    const { colorMappings, strokeWidthMappings, metadata } = result;

    // Build the component code
    const imports = this.generateImports(result);
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

    const extension = this.reactNativeOptions.typescript ? 'tsx' : 'jsx';
    const filename = this.generateFilename(componentName, extension);

    // Format the code with prettier
    const parser = extension === 'tsx' ? 'typescript' : 'babel';
    const code = await this.formatCode(rawCode, parser);

    return {
      code,
      filename,
      componentName,
      dependencies: this.getDependencies(),
    };
  }

  /**
   * Collect SVG components used in the AST
   */
  private collectSvgImports(result: TransformationResult): string[] {
    const usedElements = new Set<string>();

    const collectFromElement = (element: SVGElement) => {
      const mappedTag = this.SVG_ELEMENT_MAP[element.tag];
      if (mappedTag) {
        usedElements.add(mappedTag);
      }
      element.children.forEach(collectFromElement);
    };

    // Always import Svg
    usedElements.add('Svg');

    // Collect from root children
    result.ast.root.children.forEach(collectFromElement);

    // Add Title and Desc if they might be used (for accessibility)
    usedElements.add('Title');
    usedElements.add('Desc');

    return Array.from(usedElements).sort();
  }

  /**
   * Generate import statements
   */
  private generateImports(result: TransformationResult): string {
    const imports: string[] = [];

    if (this.reactNativeOptions.typescript) {
      // Collect all React imports in one statement
      const reactImports = [];
      if (this.reactNativeOptions.forwardRef) {
        reactImports.push('Ref');
        reactImports.push('forwardRef');
      }
      if (this.reactNativeOptions.memo) {
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
      if (this.reactNativeOptions.forwardRef) {
        reactImports.push('forwardRef');
      }
      if (this.reactNativeOptions.memo) {
        reactImports.push('memo');
      }

      if (reactImports.length > 0) {
        imports.push(
          `import React, { ${reactImports.join(', ')} } from 'react';`
        );
      } else {
        imports.push("import React from 'react';");
      }

      if (this.reactNativeOptions.propTypes) {
        imports.push("import PropTypes from 'prop-types';");
      }
    }

    // Import react-native-svg components
    const svgImports = this.collectSvgImports(result);
    imports.push(`import { ${svgImports.join(', ')} } from 'react-native-svg';`);

    // Import StyleSheet if needed
    if (this.reactNativeOptions.useStyleSheet) {
      imports.push("import { StyleSheet } from 'react-native';");
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
    if (!this.reactNativeOptions.typescript && !this.reactNativeOptions.propTypes) {
      return '';
    }

    if (this.reactNativeOptions.typescript) {
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

    // Add color props (NO className props for React Native)
    const colorProps = this.generateColorProps(colorMappings, false);
    if (colorProps) {
      customProps.push(colorProps);
    }

    // Add stroke width props (NO className props)
    const strokeWidthProps = this.generateStrokeWidthProps(
      strokeWidthMappings,
      false
    );
    if (strokeWidthProps) {
      customProps.push(strokeWidthProps);
    }

    // Add fixed stroke width prop if feature is enabled
    if (features.includes('fixed-stroke-width')) {
      customProps.push('isFixedStrokeWidth?: boolean;');
    }

    const componentName = this.getComponentName();
    // Use SvgProps from react-native-svg, but omit width/height to allow our custom sizing
    return `interface ${componentName}Props extends Omit<React.ComponentProps<typeof Svg>, 'width' | 'height'> {\n  ${customProps.join(
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
    const componentName = this.getComponentName();
    const props = [
      'title: PropTypes.string,',
      'titleId: PropTypes.string,',
      'desc: PropTypes.string,',
      'descId: PropTypes.string,',
      'size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
      'style: PropTypes.object,',
      'width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
      'height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
    ];

    const colorProps = this.generateColorProps(colorMappings, false);
    if (colorProps) {
      props.push(colorProps);
    }

    const strokeWidthProps = this.generateStrokeWidthProps(
      strokeWidthMappings,
      false
    );
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

    // Generate props destructuring for custom props only (NO className props)
    const customProps = ['title', 'titleId', 'desc', 'descId', 'size'];
    const colorProps = colorMappings.map((m: ColorMapping) => m.variableName);
    const strokeWidthProps = strokeWidthMappings.map((m: StrokeWidthMapping) => m.variableName);

    const allCustomProps = [...customProps, ...colorProps, ...strokeWidthProps];

    // Generate props destructuring with default values
    const colorDefaults = this.generateColorDefaults(colorMappings);
    const strokeWidthDefaults =
      this.generateStrokeWidthDefaults(strokeWidthMappings);
    const sizeDefault = 'size';
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

    // Add title and desc elements (using Title and Desc components from react-native-svg)
    const titleElement =
      '{title ? <Title id={titleId}>{title}</Title> : null}';
    const descElement = '{desc ? <Desc id={descId}>{desc}</Desc> : null}';

    if (this.reactNativeOptions.typescript) {
      const propsType = `${componentName}Props`;
      const refType = this.reactNativeOptions.forwardRef
        ? `, ref: Ref<Svg>`
        : '';

      // Extract children JSX
      const childrenJsx = result.ast.root.children
        .map((child: SVGElement) => this.elementToJsx(child, 1))
        .join('\n');

      // Get viewBox dimensions as fallback
      const viewBoxDimensions = this.getViewBoxDimensions(result.ast);

      return `const ${componentName} = (${customPropsDestructure}: ${propsType}${refType}) => {
  const computedSize = {
    width: svgProps.width || size || ${viewBoxDimensions.width},
    height: svgProps.height || size || ${viewBoxDimensions.height}
  };

  return (
    <Svg
      ${
        this.reactNativeOptions.forwardRef ? 'ref={ref}\n      ' : ''
      }${rootAttributes}
      {...svgProps}
      {...computedSize}
    >
      ${titleElement}
      ${descElement}
${childrenJsx}
    </Svg>
  );
};`;
    } else {
      // For non-TypeScript, generate simpler component
      const childrenJsx = result.ast.root.children
        .map((child: SVGElement) => this.elementToJsx(child, 1))
        .join('\n');

      // Get viewBox dimensions as fallback
      const viewBoxDimensions = this.getViewBoxDimensions(result.ast);

      return `const ${componentName} = (${customPropsDestructure}) => {
  const computedSize = {
    width: svgProps.width || size || ${viewBoxDimensions.width},
    height: svgProps.height || size || ${viewBoxDimensions.height}
  };

  return (
    <Svg ${rootAttributes}{...svgProps} {...computedSize}>
      ${titleElement}
      ${descElement}
${childrenJsx}
    </Svg>
  );
};`;
    }
  }

  /**
   * Override elementToJsx to map elements to react-native-svg components
   */
  protected elementToJsx(element: SVGElement, depth: number = 0): string {
    const indent = '  '.repeat(depth + 1);
    const { tag, attributes, children, content } = element;

    // Map to React Native SVG component
    const rnTag = this.SVG_ELEMENT_MAP[tag] || tag;

    // Convert attributes with RN-specific logic
    const jsxAttributes = this.attributesToJsxRN(attributes, tag);
    const attributeString =
      jsxAttributes.length > 0 ? ' ' + jsxAttributes.join(' ') : '';

    // Handle self-closing tags
    if (children.length === 0 && !content) {
      return `${indent}<${rnTag}${attributeString} />`;
    }

    // Handle tags with content or children
    let result = `${indent}<${rnTag}${attributeString}>`;

    if (content) {
      result += content;
    }

    if (children.length > 0) {
      result += '\n';
      result += children.map((child: SVGElement) => this.elementToJsx(child, depth + 1)).join('\n');
      result += '\n' + indent;
    }

    result += `</${rnTag}>`;
    return result;
  }

  /**
   * Convert attributes to React Native JSX attributes
   */
  private attributesToJsxRN(
    attributes: Record<string, string>,
    _tag: string
  ): string[] {
    const jsxAttributes: string[] = [];

    Object.entries(attributes).forEach(([key, value]) => {
      // Skip className - React Native doesn't support it
      if (key === 'class' || key === 'className') {
        return;
      }

      // Convert attribute name to camelCase
      const jsxKey = this.convertAttributeNameRN(key);

      // Handle numeric attributes (width, height, x, y, r, cx, cy, etc.)
      if (this.isNumericAttribute(key, value)) {
        const numValue = parseFloat(value);
        jsxAttributes.push(`${jsxKey}={${numValue}}`);
      }
      // Handle color/strokeWidth props (dynamic values with curly braces)
      else if (value.startsWith('{') && value.endsWith('}')) {
        jsxAttributes.push(`${jsxKey}=${value}`);
      }
      // Handle regular string values
      else {
        jsxAttributes.push(`${jsxKey}="${value}"`);
      }
    });

    return jsxAttributes;
  }

  /**
   * Check if an attribute should be a number in React Native
   */
  private isNumericAttribute(key: string, value: string): boolean {
    const numericAttrs = [
      'width',
      'height',
      'x',
      'y',
      'r',
      'cx',
      'cy',
      'rx',
      'ry',
      'strokeWidth',
      'x1',
      'y1',
      'x2',
      'y2',
      'offset',
      'opacity',
      'fillOpacity',
      'strokeOpacity',
      'strokeMiterlimit',
    ];
    return numericAttrs.includes(key) && !isNaN(parseFloat(value)) && value.trim() !== '';
  }

  /**
   * Convert attribute names to React Native conventions
   */
  private convertAttributeNameRN(name: string): string {
    // React Native uses camelCase for SVG props
    if (name === 'stroke-width') return 'strokeWidth';
    if (name === 'stroke-linecap') return 'strokeLinecap';
    if (name === 'stroke-linejoin') return 'strokeLinejoin';
    if (name === 'fill-opacity') return 'fillOpacity';
    if (name === 'stroke-opacity') return 'strokeOpacity';
    if (name === 'stop-color') return 'stopColor';
    if (name === 'stop-opacity') return 'stopOpacity';
    if (name === 'stroke-dasharray') return 'strokeDasharray';
    if (name === 'stroke-dashoffset') return 'strokeDashoffset';
    if (name === 'stroke-miterlimit') return 'strokeMiterlimit';
    if (name === 'fill-rule') return 'fillRule';
    if (name === 'clip-path') return 'clipPath';
    if (name === 'clip-rule') return 'clipRule';

    // Handle aria- and data- attributes (keep as-is)
    if (name.startsWith('aria-') || name.startsWith('data-')) {
      return name;
    }

    // Handle other SVG attributes with hyphens (convert to camelCase)
    if (name.includes('-')) {
      return camelCase(name);
    }

    return name;
  }

  /**
   * Generate export statements
   */
  private generateExports(componentName: string): string {
    const exports: string[] = [];

    if (this.reactNativeOptions.forwardRef) {
      exports.push(`const ForwardRef = forwardRef(${componentName});`);
      if (this.reactNativeOptions.memo) {
        exports.push('const Memo = memo(ForwardRef);');
        exports.push(`Memo.displayName = '${componentName}';`);
        exports.push('export { Memo };');
        exports.push(`export default Memo;`);
      } else {
        exports.push(`ForwardRef.displayName = '${componentName}';`);
        exports.push('export { ForwardRef };');
        exports.push(`export default ForwardRef;`);
      }
    } else if (this.reactNativeOptions.memo) {
      exports.push(`const Memo = memo(${componentName});`);
      exports.push(`Memo.displayName = '${componentName}';`);
      exports.push('export { Memo };');
      exports.push(`export default Memo;`);
    } else {
      exports.push(`${componentName}.displayName = '${componentName}';`);
      exports.push(`export { ${componentName} };`);
      exports.push(`export default ${componentName};`);
    }

    return exports.join('\n');
  }

  /**
   * Get dependencies for the component
   */
  private getDependencies(): string[] {
    const deps = ['react', 'react-native-svg'];

    if (this.reactNativeOptions.propTypes) {
      deps.push('prop-types');
    }

    return deps;
  }

  /**
   * Generate SVG root attributes as string
   */
  private generateSvgAttributes(ast: SVGAst): string {
    const attributes = ast.root.attributes;
    const jsxAttributes: string[] = [];

    Object.entries(attributes).forEach(([key, value]) => {
      // Skip width and height as they're handled by computedSize
      if (key === 'width' || key === 'height') {
        return;
      }

      const jsxKey = this.convertAttributeNameRN(key);

      // Special handling for aria-labelledby with multiple IDs
      if (key === 'aria-labelledby' && value.includes('{') && value.includes('}')) {
        // Extract variable names from {titleId} {descId} format
        const ids = value.match(/\{(\w+)\}/g)?.map(match => match.slice(1, -1));
        if (ids && ids.length > 0) {
          const joinedIds = ids.map(id => id).join(', ');
          jsxAttributes.push(`${jsxKey}={[${joinedIds}].filter(Boolean).join(' ')}`);
        }
        return;
      }

      // Handle dynamic values
      if (value.startsWith('{') && value.endsWith('}')) {
        jsxAttributes.push(`${jsxKey}=${value}`);
      } else {
        jsxAttributes.push(`${jsxKey}="${value}"`);
      }
    });

    return jsxAttributes.length > 0 ? jsxAttributes.join('\n      ') : '';
  }

  /**
   * Extract viewBox dimensions for fallback sizing
   */
  private getViewBoxDimensions(ast: SVGAst): { width: number; height: number } {
    const viewBox = ast.root.attributes.viewBox;

    if (viewBox) {
      const parts = viewBox.split(/\s+/);
      if (parts.length === 4) {
        return {
          width: parseFloat(parts[2]) || 24,
          height: parseFloat(parts[3]) || 24,
        };
      }
    }

    // Fallback to width/height attributes
    const width = ast.root.attributes.width;
    const height = ast.root.attributes.height;

    return {
      width: width ? parseFloat(width) : 24,
      height: height ? parseFloat(height) : 24,
    };
  }
}
