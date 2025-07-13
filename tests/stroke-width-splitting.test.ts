/**
 * Tests for stroke width splitting feature
 */

import { SVGFusion } from '../src/index';

describe('Stroke Width Splitting Feature', () => {
  let svgfusion: SVGFusion;

  beforeEach(() => {
    svgfusion = new SVGFusion();
  });

  const testSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path stroke-width="2" d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="red" stroke="blue"/>
      <circle cx="12" cy="12" r="4" stroke-width="1" fill="green" stroke="yellow"/>
      <rect x="8" y="8" width="8" height="8" style="stroke-width: 3; fill: purple;" stroke="orange"/>
    </svg>
  `;

  describe('React Components', () => {
    it('should generate React component with stroke width splitting', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
          splitColors: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.code).toContain('strokeWidth?: string | number');
      expect(result.code).toContain('strokeWidth2?: string | number');
      expect(result.code).toContain('strokeWidth3?: string | number');
      expect(result.code).toContain('strokeWidthClass?: string');
      expect(result.code).toContain('strokeWidth2Class?: string');
      expect(result.code).toContain('strokeWidth3Class?: string');
      expect(result.metadata.originalStrokeWidths).toEqual(['1', '2', '3']);
      expect(result.metadata.features).toContain('split-stroke-widths');
    });

    it('should handle stroke width variables in attributes', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.code).toContain('strokeWidth={strokeWidth}');
      expect(result.code).toContain('strokeWidth={strokeWidth2}');
    });

    it('should handle stroke width variables in style attributes', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.code).toContain('strokeWidth: strokeWidth3');
      expect(result.code).toContain('strokeWidth3Class');
    });

    it('should generate default props for stroke widths', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.code).toContain("strokeWidth = '1'");
      expect(result.code).toContain("strokeWidth2 = '2'");
      expect(result.code).toContain("strokeWidth3 = '3'");
    });
  });

  describe('Vue Components', () => {
    it('should generate Vue component with stroke width splitting', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'vue',
        transformation: {
          splitStrokeWidths: true,
          splitColors: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
          sfc: true,
          scriptSetup: true,
        },
      });

      expect(result.code).toContain('strokeWidth?: string | number');
      expect(result.code).toContain('strokeWidth2?: string | number');
      expect(result.code).toContain('strokeWidth3?: string | number');
      expect(result.code).toContain('strokeWidthClass?: string');
      expect(result.code).toContain('strokeWidth2Class?: string');
      expect(result.code).toContain('strokeWidth3Class?: string');
      expect(result.metadata.originalStrokeWidths).toEqual(['1', '2', '3']);
      expect(result.metadata.features).toContain('split-stroke-widths');
    });

    it('should handle stroke width variables in Vue template', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'vue',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
          sfc: true,
          scriptSetup: true,
        },
      });

      expect(result.code).toContain(':stroke-width="props.strokeWidth"');
      expect(result.code).toContain(':stroke-width="props.strokeWidth2"');
      expect(result.code).toContain('props.strokeWidthClass');
      expect(result.code).toContain('props.strokeWidth2Class');
      expect(result.code).toContain('props.strokeWidth3Class');
    });

    it('should generate Vue composition API props', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'vue',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: false,
          componentName: 'TestIcon',
          sfc: false,
          composition: true,
        },
      });

      expect(result.code).toContain(
        "strokeWidth: { type: [String, Number], default: '1' }"
      );
      expect(result.code).toContain(
        "strokeWidth2: { type: [String, Number], default: '2' }"
      );
      expect(result.code).toContain(
        "strokeWidth3: { type: [String, Number], default: '3' }"
      );
    });
  });

  describe('Feature Integration', () => {
    it('should work with both color and stroke width splitting', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'react',
        transformation: {
          splitColors: true,
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      // Check color props
      expect(result.code).toContain('color?: string');
      expect(result.code).toContain('color2?: string');
      expect(result.code).toContain('color3?: string');
      expect(result.code).toContain('color4?: string');

      // Check stroke width props
      expect(result.code).toContain('strokeWidth?: string | number');
      expect(result.code).toContain('strokeWidth2?: string | number');
      expect(result.code).toContain('strokeWidth3?: string | number');

      // Check metadata
      expect(result.metadata.features).toContain('split-colors');
      expect(result.metadata.features).toContain('split-stroke-widths');
    });

    it('should work with fixed stroke width feature', async () => {
      const result = await svgfusion.convert(testSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
          fixedStrokeWidth: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.code).toContain('isFixedStrokeWidth?: boolean');
      expect(result.code).toContain(
        "vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : 'none'}"
      );
      expect(result.metadata.features).toContain('split-stroke-widths');
      expect(result.metadata.features).toContain('fixed-stroke-width');
    });
  });

  describe('Edge Cases', () => {
    it('should handle SVG without stroke widths', async () => {
      const simpleSvg =
        '<svg xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="10" height="10" fill="red"/></svg>';

      const result = await svgfusion.convert(simpleSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.metadata.originalStrokeWidths).toEqual([]);
      expect(result.metadata.features).toContain('split-stroke-widths');
      expect(result.code).not.toContain('strokeWidth?: string | number');
    });

    it('should skip invalid stroke width values', async () => {
      const invalidSvg = `
        <svg xmlns="http://www.w3.org/2000/svg">
          <path stroke-width="inherit" d="M0 0L10 10"/>
          <path stroke-width="var(--custom)" d="M0 0L10 10"/>
          <path stroke-width="calc(100% - 10px)" d="M0 0L10 10"/>
          <path stroke-width="2" d="M0 0L10 10"/>
        </svg>
      `;

      const result = await svgfusion.convert(invalidSvg, {
        framework: 'react',
        transformation: {
          splitStrokeWidths: true,
        },
        generator: {
          typescript: true,
          componentName: 'TestIcon',
        },
      });

      expect(result.metadata.originalStrokeWidths).toEqual(['2']);
      expect(result.code).toContain("strokeWidth = '2'");
      // Invalid stroke widths should remain as literal values in the SVG
      expect(result.code).toContain('strokeWidth="inherit"');
      expect(result.code).toContain('strokeWidth="var(--custom)"');
      expect(result.code).toContain('strokeWidth="calc(100% - 10px)"');
    });
  });
});
