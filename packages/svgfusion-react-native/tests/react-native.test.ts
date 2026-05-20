/**
 * Comprehensive tests for React Native generator
 */

import { SVGFusion } from 'svgfusion-core';
import {
  ReactNativeGenerator,
  ReactNativeGeneratorOptions,
} from '../src/index';

describe('React Native Generator', () => {
  let svgfusion: SVGFusion;

  beforeEach(() => {
    svgfusion = new SVGFusion();
  });

  const simpleSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#ff0000" stroke="#0000ff"/>
    </svg>
  `;

  const complexSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path stroke-width="2" d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="red" stroke="blue"/>
      <circle cx="12" cy="12" r="4" stroke-width="1" fill="green" stroke="yellow"/>
      <rect x="8" y="8" width="8" height="8" style="stroke-width: 3; fill: purple;" stroke="orange"/>
      <line x1="0" y1="0" x2="24" y2="24" stroke="black"/>
      <ellipse cx="12" cy="12" rx="6" ry="4" fill="pink"/>
    </svg>
  `;

  describe('Basic Component Generation', () => {
    it('should generate TypeScript React Native component', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check TypeScript imports (should include React and necessary hooks)
      expect(result.code).toContain("import React");
      expect(result.code).toContain("from 'react'");
      expect(result.code).toContain('Ref');
      expect(result.code).toContain("from 'react-native-svg'");
      expect(result.code).toContain('Svg');
      expect(result.code).toContain('Path');

      // Check TypeScript interface
      expect(result.code).toContain('interface TestIconProps');
      expect(result.code).toContain('title?: string');
      expect(result.code).toContain('titleId?: string');
      expect(result.code).toContain('size?: string | number');

      // Check component definition with forwardRef
      expect(result.code).toContain('ref: Ref<Svg>');

      // Check Svg component usage
      expect(result.code).toContain('<Svg');
      expect(result.code).toContain('ref={ref}');
      expect(result.code).toContain('viewBox="0 0 24 24"');

      // Check metadata
      expect(result.componentName).toBe('TestIcon');
      expect(result.filename).toBe('TestIcon.tsx');
    });

    it('should generate JavaScript React Native component', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: false,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check JavaScript imports
      expect(result.code).toContain("import React");
      expect(result.code).toContain("from 'react'");
      expect(result.code).toContain("from 'react-native-svg'");
      expect(result.code).toContain('Svg');
      expect(result.code).toContain('Path');

      // Should not have TypeScript types
      expect(result.code).not.toContain('interface TestIconProps');
      expect(result.code).not.toContain('Ref<Svg>');
      expect(result.code).not.toContain(': TestIconProps');

      // Check component definition
      expect(result.code).toContain('const TestIcon =');

      // Check filename
      expect(result.filename).toBe('TestIcon.jsx');
    });

    it('should handle memo wrapper', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
            memo: true,
          } as ReactNativeGeneratorOptions,
        },
        ReactNativeGenerator
      );

      expect(result.code).toContain('memo');
      expect(result.code).toContain("Memo.displayName = 'TestIcon'");
    });

    it('should handle forwardRef', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
            forwardRef: true,
          } as ReactNativeGeneratorOptions,
        },
        ReactNativeGenerator
      );

      expect(result.code).toContain('forwardRef');
      expect(result.code).toContain('Ref<Svg>');
      expect(result.code).toContain('ref={ref}');
    });

    it('should generate component without forwardRef when disabled', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
            forwardRef: false,
            memo: false,
          } as ReactNativeGeneratorOptions,
        },
        ReactNativeGenerator
      );

      expect(result.code).not.toContain('forwardRef');
      expect(result.code).not.toContain('ref: Ref<Svg>');
      expect(result.code).not.toContain('ref={ref}');
      expect(result.code).toContain('const TestIcon =');
    });
  });

  describe('SVG Element Mapping', () => {
    it('should map all SVG elements to react-native-svg components', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check imports for all used elements
      expect(result.code).toContain('Svg');
      expect(result.code).toContain('Path');
      expect(result.code).toContain('Circle');
      expect(result.code).toContain('Rect');
      expect(result.code).toContain('Line');
      expect(result.code).toContain('Ellipse');

      // Check JSX uses capitalized elements
      expect(result.code).toContain('<Svg');
      expect(result.code).toContain('<Path');
      expect(result.code).toContain('<Circle');
      expect(result.code).toContain('<Rect');
      expect(result.code).toContain('<Line');
      expect(result.code).toContain('<Ellipse');

      // Should not contain lowercase HTML elements
      expect(result.code).not.toContain('<svg>');
      expect(result.code).not.toContain('<path>');
      expect(result.code).not.toContain('<circle>');
    });

    it('should import only used SVG elements', async () => {
      const pathOnlySvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="red"/>
        </svg>
      `;

      const result = await svgfusion.convert(
        pathOnlySvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Should import Svg and Path (also Title and Desc for accessibility)
      expect(result.code).toContain("from 'react-native-svg'");
      expect(result.code).toContain('Svg');
      expect(result.code).toContain('Path');

      // Should not import unused shape elements in the import statement
      const importMatch = result.code.match(/import\s+\{([^}]+)\}\s+from\s+'react-native-svg'/);
      if (importMatch) {
        const imports = importMatch[1];
        expect(imports).not.toContain('Circle,');
        expect(imports).not.toContain('Rect,');
        expect(imports).not.toContain('Line,');
      }
    });
  });

  describe('Numeric Attribute Conversion', () => {
    it('should convert numeric attributes to numbers in JSX', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check numeric attributes are wrapped in braces
      expect(result.code).toContain('cx={12}');
      expect(result.code).toContain('cy={12}');
      expect(result.code).toContain('r={4}');
      expect(result.code).toContain('x={8}');
      expect(result.code).toContain('y={8}');
      expect(result.code).toContain('width={8}');
      expect(result.code).toContain('height={8}');
      expect(result.code).toContain('rx={6}');
      expect(result.code).toContain('ry={4}');
      expect(result.code).toContain('x1={0}');
      expect(result.code).toContain('y1={0}');
      expect(result.code).toContain('x2={24}');
      expect(result.code).toContain('y2={24}');
    });

    it('should keep string attributes as strings', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // String attributes should remain as strings
      expect(result.code).toMatch(/fill="[^"]+"/);
      expect(result.code).toMatch(/stroke="[^"]+"/);
    });
  });

  describe('Color Splitting (No className)', () => {
    it('should generate color props without className', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check color props in interface
      expect(result.code).toContain('color?: string');
      expect(result.code).toContain('color2?: string');
      expect(result.code).toContain('color3?: string');
      expect(result.code).toContain('color4?: string');
      expect(result.code).toContain('color5?: string');

      // Should NOT have className props (React Native doesn't support className)
      expect(result.code).not.toContain('colorClass');
      expect(result.code).not.toContain('color2Class');
      expect(result.code).not.toContain('className');

      // Check metadata
      expect(result.metadata.features).toContain('split-colors');
      expect(result.metadata.originalColors.length).toBeGreaterThan(0);
    });

    it('should use color variables in JSX', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Color variables should be used in JSX
      expect(result.code).toMatch(/fill=\{color\d*\}/);
      expect(result.code).toMatch(/stroke=\{color\d*\}/);
    });
  });

  describe('Stroke Width Splitting (No className)', () => {
    it('should generate stroke width props without className', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check stroke width props in interface
      expect(result.code).toContain('strokeWidth?: string | number');
      expect(result.code).toContain('strokeWidth2?: string | number');
      expect(result.code).toContain('strokeWidth3?: string | number');

      // Should NOT have strokeWidthClass props
      expect(result.code).not.toContain('strokeWidthClass');
      expect(result.code).not.toContain('strokeWidth2Class');
      expect(result.code).not.toContain('strokeWidth3Class');

      // Check metadata
      expect(result.metadata.features).toContain('split-stroke-widths');
      expect(result.metadata.originalStrokeWidths).toEqual(['1', '2', '3']);
    });

    it('should use stroke width variables in JSX', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Stroke width variables should be used in JSX as numbers
      expect(result.code).toMatch(/strokeWidth=\{strokeWidth\d*\}/);
    });

    it('should generate default stroke width values', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check default values in destructuring
      expect(result.code).toContain("strokeWidth = '1'");
      expect(result.code).toContain("strokeWidth2 = '2'");
      expect(result.code).toContain("strokeWidth3 = '3'");
    });
  });

  describe('Size Prop Handling', () => {
    it('should support size prop for component dimensions', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check size prop in interface
      expect(result.code).toContain('size?: string | number');

      // Check size computation
      expect(result.code).toContain('const computedSize = {');
      expect(result.code).toContain(
        'width: svgProps.width || size || 24'
      );
      expect(result.code).toContain(
        'height: svgProps.height || size || 24'
      );

      // Check size is spread onto Svg component
      expect(result.code).toContain('{...computedSize}');
    });

    it('should use viewBox dimensions as fallback', async () => {
      const customViewBoxSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="red"/>
        </svg>
      `;

      const result = await svgfusion.convert(
        customViewBoxSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Fallback should use viewBox dimensions
      expect(result.code).toContain(
        'width: svgProps.width || size || 48'
      );
      expect(result.code).toContain(
        'height: svgProps.height || size || 48'
      );
    });
  });

  describe('Accessibility Support', () => {
    it('should support title and desc props', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check accessibility props in interface
      expect(result.code).toContain('title?: string');
      expect(result.code).toContain('titleId?: string');
      expect(result.code).toContain('desc?: string');
      expect(result.code).toContain('descId?: string');

      // Check Title and Desc are imported if used
      if (result.code.includes('title ?')) {
        expect(result.code).toMatch(/import.*\bTitle\b.*from 'react-native-svg'/);
      }
      if (result.code.includes('desc ?')) {
        expect(result.code).toMatch(/import.*\bDesc\b.*from 'react-native-svg'/);
      }

      // Check conditional rendering
      expect(result.code).toContain('title ?');
      expect(result.code).toContain('desc ?');
    });
  });

  describe('Fixed Stroke Width Feature', () => {
    it('should support fixed stroke width prop', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            fixedStrokeWidth: true,
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check isFixedStrokeWidth prop
      expect(result.code).toContain('isFixedStrokeWidth?: boolean');

      // Check vectorEffect usage
      expect(result.code).toContain('vectorEffect=');
      expect(result.code).toContain('non-scaling-stroke');

      // Check metadata
      expect(result.metadata.features).toContain('fixed-stroke-width');
    });
  });

  describe('Combined Features', () => {
    it('should work with both color and stroke width splitting', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check color props (no className)
      expect(result.code).toContain('color?: string');
      expect(result.code).toContain('color2?: string');
      expect(result.code).not.toContain('colorClass');

      // Check stroke width props (no className)
      expect(result.code).toContain('strokeWidth?: string | number');
      expect(result.code).toContain('strokeWidth2?: string | number');
      expect(result.code).not.toContain('strokeWidthClass');

      // Check metadata
      expect(result.metadata.features).toContain('split-colors');
      expect(result.metadata.features).toContain('split-stroke-widths');
    });

    it('should work with all features combined', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
            splitStrokeWidths: true,
            fixedStrokeWidth: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
            memo: true,
            forwardRef: true,
          } as ReactNativeGeneratorOptions,
        },
        ReactNativeGenerator
      );

      // Check all features are present
      expect(result.code).toContain('color?: string');
      expect(result.code).toContain('strokeWidth?: string | number');
      expect(result.code).toContain('isFixedStrokeWidth?: boolean');
      expect(result.code).toContain('size?: string | number');
      expect(result.code).toContain('memo');
      expect(result.code).toContain('forwardRef');
      expect(result.code).toContain('Ref<Svg>');

      // Check metadata includes all features
      expect(result.metadata.features).toContain('split-colors');
      expect(result.metadata.features).toContain('split-stroke-widths');
      expect(result.metadata.features).toContain('fixed-stroke-width');
    });
  });

  describe('Edge Cases', () => {
    it('should handle SVG without colors', async () => {
      const noColorSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect x="0" y="0" width="10" height="10"/>
        </svg>
      `;

      const result = await svgfusion.convert(
        noColorSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      expect(result.metadata.originalColors).toEqual([]);
      expect(result.metadata.features).toContain('split-colors');
      expect(result.code).not.toContain('color?: string');
    });

    it('should handle SVG without stroke widths', async () => {
      const noStrokeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <rect x="0" y="0" width="10" height="10" fill="red"/>
        </svg>
      `;

      const result = await svgfusion.convert(
        noStrokeSvg,
        {
          framework: 'react-native',
          transformation: {
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      expect(result.metadata.originalStrokeWidths).toEqual([]);
      expect(result.metadata.features).toContain('split-stroke-widths');
      expect(result.code).not.toContain('strokeWidth?: string | number');
    });

    it('should handle gradients', async () => {
      const gradientSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
              <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
            </linearGradient>
          </defs>
          <ellipse cx="12" cy="12" rx="10" ry="5" fill="url(#grad1)" />
        </svg>
      `;

      const result = await svgfusion.convert(
        gradientSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check gradient-related imports
      expect(result.code).toContain('Defs');
      expect(result.code).toContain('LinearGradient');
      expect(result.code).toContain('Stop');
      expect(result.code).toContain('<Defs>');
      expect(result.code).toContain('<LinearGradient');
      expect(result.code).toContain('<Stop');
    });

    it('should handle groups', async () => {
      const groupSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g transform="translate(12, 12)">
            <circle r="5" fill="red"/>
            <circle r="3" fill="blue"/>
          </g>
        </svg>
      `;

      const result = await svgfusion.convert(
        groupSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check G component is imported and used
      expect(result.code).toContain('G');
      expect(result.code).toContain('<G');
    });
  });

  describe('Snapshot Tests', () => {
    it('should match snapshot for basic TypeScript component', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      expect(result.code).toMatchSnapshot();
    });

    it('should match snapshot for JavaScript component', async () => {
      const result = await svgfusion.convert(
        simpleSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: false,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      expect(result.code).toMatchSnapshot();
    });

    it('should match snapshot for component with all features', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
            splitStrokeWidths: true,
            fixedStrokeWidth: true,
          },
          generator: {
            typescript: true,
            componentName: 'ComplexIcon',
            memo: true,
            forwardRef: true,
          } as ReactNativeGeneratorOptions,
        },
        ReactNativeGenerator
      );

      expect(result.code).toMatchSnapshot();
      expect(result.metadata).toMatchSnapshot();
    });
  });

  describe('Attribute Name Conversion', () => {
    it('should convert hyphenated attributes to camelCase', async () => {
      const attrSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill-opacity="0.5" d="M12 2L2 7V17L12 22L22 17V7L12 2Z"/>
        </svg>
      `;

      const result = await svgfusion.convert(
        attrSvg,
        {
          framework: 'react-native',
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Check camelCase conversion
      expect(result.code).toContain('strokeWidth');
      expect(result.code).toContain('strokeLinecap');
      expect(result.code).toContain('strokeLinejoin');
      expect(result.code).toContain('fillOpacity');

      // Should not contain hyphenated versions
      expect(result.code).not.toContain('stroke-width');
      expect(result.code).not.toContain('stroke-linecap');
      expect(result.code).not.toContain('fill-opacity');
    });
  });

  describe('No className Support', () => {
    it('should not generate className-related props or attributes', async () => {
      const result = await svgfusion.convert(
        complexSvg,
        {
          framework: 'react-native',
          transformation: {
            splitColors: true,
            splitStrokeWidths: true,
          },
          generator: {
            typescript: true,
            componentName: 'TestIcon',
          },
        },
        ReactNativeGenerator
      );

      // Verify no className anywhere in the code
      expect(result.code).not.toContain('className');
      expect(result.code).not.toContain('class=');
      expect(result.code).not.toContain('colorClass');
      expect(result.code).not.toContain('strokeWidthClass');
    });
  });
});
