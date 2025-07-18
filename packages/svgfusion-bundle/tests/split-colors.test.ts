import { extractColors, replaceColorsWithProps } from 'svgfusion-core';

describe('Split Colors Feature', () => {
  // Test 1: Basic color extraction
  test('should extract fill and stroke colors separately', () => {
    const svg = `<svg><path fill="#FF0000" stroke="#00FF00" /></svg>`;
    const colorInfo = extractColors(svg);

    expect(colorInfo.fillColors).toEqual(['#ff0000']);
    expect(colorInfo.strokeColors).toEqual(['#00ff00']);
    expect(colorInfo.fillColorMap.get('#ff0000')).toBe('color2');
    expect(colorInfo.strokeColorMap.get('#00ff00')).toBe('color');

    // Snapshot test for color extraction result
    expect(colorInfo).toMatchSnapshot();
  });

  // Test 2: Gradient color extraction
  test('should extract gradient stop colors', () => {
    const svg = `<svg><linearGradient><stop stop-color="#FF0000"/><stop stop-color="#0000FF"/></linearGradient></svg>`;
    const colorInfo = extractColors(svg);

    expect(colorInfo.gradientColors).toEqual(['#0000ff', '#ff0000']);
    expect(colorInfo.gradientColorMap.get('#ff0000')).toBe('color2');
    expect(colorInfo.gradientColorMap.get('#0000ff')).toBe('color');

    // Snapshot test for gradient color extraction
    expect(colorInfo).toMatchSnapshot();
  });

  // Test 3: Same color in different contexts
  test('should handle same color in fill and stroke separately', () => {
    const svg = `<svg><path fill="#000000" stroke="#000000" /></svg>`;
    const colorInfo = extractColors(svg);

    expect(colorInfo.fillColors).toEqual(['#000000']);
    expect(colorInfo.strokeColors).toEqual(['#000000']);
    expect(colorInfo.fillColorMap.get('#000000')).toBe('color');
    expect(colorInfo.strokeColorMap.get('#000000')).toBe('color');

    // Snapshot test for same color in different contexts
    expect(colorInfo).toMatchSnapshot();
  });

  // Test 4: React prop replacement
  test('should replace colors with React props', () => {
    const svg = `<path fill="#FF0000" stroke="#00FF00" />`;
    const colorInfo = extractColors(svg);
    const result = replaceColorsWithProps(svg, colorInfo, 'react');

    expect(result).toContain('fill={color2}');
    expect(result).toContain('stroke={color}');
    // Note: No className should be added since original SVG had no class attribute

    // Snapshot test for React prop replacement
    expect(result).toMatchSnapshot();
  });

  // Test 5: Vue prop replacement
  test('should replace colors with Vue props', () => {
    const svg = `<stop stop-color="#FF0000" />`;
    const colorInfo = extractColors(svg);
    const result = replaceColorsWithProps(svg, colorInfo, 'vue');

    expect(result).toContain('stop-color="color"');
    // Note: No :class should be added since original SVG had no class attribute

    // Snapshot test for Vue prop replacement
    expect(result).toMatchSnapshot();
  });

  // Test 6: Complex SVG with mixed colors
  test('should handle complex SVG with mixed fill, stroke, and gradient colors', () => {
    const svg = `
      <svg>
        <path fill="#FF0000" stroke="#00FF00" />
        <circle fill="#0000FF" stroke="#FF0000" />
        <linearGradient>
          <stop stop-color="#FFFF00" />
          <stop stop-color="#FF00FF" />
        </linearGradient>
      </svg>
    `;
    const colorInfo = extractColors(svg);

    // Snapshot test for complex color extraction
    expect(colorInfo).toMatchSnapshot();
  });

  // Test 7: Edge cases with invalid colors
  test('should handle invalid and special color values', () => {
    const svg = `
      <svg>
        <path fill="none" stroke="transparent" />
        <circle fill="currentColor" stroke="#invalid" />
        <rect fill="rgb(255, 0, 0)" stroke="hsl(120, 100%, 50%)" />
      </svg>
    `;
    const colorInfo = extractColors(svg);

    // Snapshot test for edge cases
    expect(colorInfo).toMatchSnapshot();
  });
});
