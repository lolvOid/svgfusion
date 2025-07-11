/**
 * React component generator
 * Generates production-ready React components with TypeScript support
 */

import {
  ComponentGenerator,
  GeneratorOptions,
  ComponentResult,
} from '../core/generator';
import { TransformationResult, ColorMapping } from '../core/transformer';

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
  generate(result: TransformationResult): ComponentResult {
    const componentName = this.getComponentName();
    const { colorMappings, metadata } = result;

    // Build the component code
    const imports = this.generateImports();
    const interfaces = this.generateInterfaces(
      colorMappings,
      metadata.features
    );
    const component = this.generateComponent(result);
    const exports = this.generateExports(componentName);

    const code = [imports, interfaces, component, exports]
      .filter(Boolean)
      .join('\n\n');

    const extension = this.reactOptions.typescript ? 'tsx' : 'jsx';
    const filename = this.generateFilename(componentName, extension);

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
      imports.push("import * as React from 'react';");
      if (this.reactOptions.forwardRef) {
        imports.push("import { Ref, forwardRef, memo } from 'react';");
      } else if (this.reactOptions.memo) {
        imports.push("import { memo } from 'react';");
      }
    } else {
      imports.push("import React from 'react';");
      if (this.reactOptions.propTypes) {
        imports.push("import PropTypes from 'prop-types';");
      }
    }

    return imports.join('\n');
  }

  /**
   * Generate TypeScript interfaces or PropTypes
   */
  private generateInterfaces(colorMappings: ColorMapping[], features: string[]): string {
    if (!this.reactOptions.typescript && !this.reactOptions.propTypes) {
      return '';
    }

    if (this.reactOptions.typescript) {
      return this.generateTypeScriptInterface(colorMappings, features);
    } else {
      return this.generatePropTypes(colorMappings, features);
    }
  }

  /**
   * Generate TypeScript interface
   */
  private generateTypeScriptInterface(
    colorMappings: ColorMapping[],
    features: string[]
  ): string {
    const customProps = [
      'title?: string;',
      'titleId?: string;',
      'desc?: string;',
      'descId?: string;',
    ];

    // Add color props
    const colorProps = this.generateColorProps(colorMappings);
    if (colorProps) {
      customProps.push(colorProps);
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
  private generatePropTypes(colorMappings: ColorMapping[], features: string[]): string {
    // Implementation for PropTypes (for non-TypeScript projects)
    const componentName = this.getComponentName();
    const props = [
      'title: PropTypes.string,',
      'titleId: PropTypes.string,',
      'desc: PropTypes.string,',
      'descId: PropTypes.string,',
      'className: PropTypes.string,',
      'style: PropTypes.object,',
      'width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
      'height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),',
    ];

    const colorProps = this.generateColorProps(colorMappings);
    if (colorProps) {
      props.push(colorProps);
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
    const { colorMappings, metadata } = result;

    // Generate props destructuring for custom props only
    const customProps = ['title', 'titleId', 'desc', 'descId'];
    const colorProps = colorMappings.map(m => m.variableName);
    const colorClassProps = colorMappings.map(m => `${m.variableName}Class`);

    const allCustomProps = [...customProps, ...colorProps, ...colorClassProps];

    if (metadata.features.includes('fixed-stroke-width')) {
      allCustomProps.push('isFixedStrokeWidth');
    }

    const customPropsDestructure = `{ ${allCustomProps.join(
      ', '
    )}, ...svgProps }`;

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

      return `const ${componentName} = (${customPropsDestructure}: ${propsType}${refType}) => (
  <svg
    ${this.reactOptions.forwardRef ? 'ref={ref}\n    ' : ''}...svgProps
  >
    ${titleElement}
    ${descElement}
${childrenJsx}
  </svg>
);`;
    } else {
      // For non-TypeScript, generate simpler component
      const childrenJsx = result.ast.root.children
        .map(child => this.elementToJsx(child, 1))
        .join('\n');

      return `const ${componentName} = (${customPropsDestructure}) => (
  <svg {...svgProps}>
    ${titleElement}
    ${descElement}
${childrenJsx}
  </svg>
);`;
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
}
