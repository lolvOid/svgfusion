/**
 * Color splitting feature implementation
 * Handles extraction and replacement of colors with React/Vue props
 */

import { SVGElement, ParsedColor } from '../core/parser';
import { ColorMapping } from '../core/transformer';

export interface ColorSplittingOptions {
  preserveOriginalNames?: boolean;
  generateClasses?: boolean;
  colorPrefix?: string;
}

export interface ColorSplittingResult {
  mappings: ColorMapping[];
  processedElement: SVGElement;
  originalColors: string[];
}

/**
 * Apply color splitting transformation to SVG elements
 */
export class ColorSplittingFeature {
  private options: Required<ColorSplittingOptions>;

  constructor(options: ColorSplittingOptions = {}) {
    this.options = {
      preserveOriginalNames: options.preserveOriginalNames ?? false,
      generateClasses: options.generateClasses ?? true,
      colorPrefix: options.colorPrefix ?? 'color',
    };
  }

  /**
   * Extract unique colors from SVG elements
   */
  extractColors(element: SVGElement): ParsedColor[] {
    const colors: ParsedColor[] = [];
    this.traverseElement(element, colors);

    // Remove duplicates and sort for consistent ordering
    const uniqueColors = new Map<string, ParsedColor>();
    colors.forEach(color => {
      if (this.isValidColor(color.value)) {
        uniqueColors.set(color.value, color);
      }
    });

    return Array.from(uniqueColors.values()).sort((a, b) =>
      a.value.localeCompare(b.value)
    );
  }

  /**
   * Apply color splitting to an SVG element
   */
  apply(element: SVGElement): ColorSplittingResult {
    const originalColors = this.extractColors(element);
    const mappings = this.generateColorMappings(originalColors);
    const processedElement = this.replaceColorsWithVariables(element, mappings);

    return {
      mappings,
      processedElement,
      originalColors: originalColors.map(c => c.value),
    };
  }

  /**
   * Generate color mappings for replacement
   */
  private generateColorMappings(colors: ParsedColor[]): ColorMapping[] {
    return colors.map((color, index) => ({
      originalColor: color.value,
      variableName:
        index === 0
          ? this.options.colorPrefix
          : `${this.options.colorPrefix}${index + 1}`,
      type: color.type,
    }));
  }

  /**
   * Replace colors in element with variable references
   */
  private replaceColorsWithVariables(
    element: SVGElement,
    mappings: ColorMapping[]
  ): SVGElement {
    const colorMap = new Map(
      mappings.map(m => [m.originalColor, m.variableName])
    );

    return this.transformElement(element, el => {
      const newAttributes = { ...el.attributes };

      // Replace fill colors
      if (newAttributes.fill && colorMap.has(newAttributes.fill)) {
        newAttributes.fill = `{${colorMap.get(newAttributes.fill)}}`;
      }

      // Replace stroke colors
      if (newAttributes.stroke && colorMap.has(newAttributes.stroke)) {
        newAttributes.stroke = `{${colorMap.get(newAttributes.stroke)}}`;
      }

      // Replace stop-color in gradients
      if (
        newAttributes['stop-color'] &&
        colorMap.has(newAttributes['stop-color'])
      ) {
        newAttributes['stop-color'] = `{${colorMap.get(
          newAttributes['stop-color']
        )}}`;
      }

      // Add missing attributes with "none" when color splitting is enabled
      // Rule: If element has one meaningful attribute (fill OR stroke), add the other as "none"
      // Don't add anything if element has neither fill nor stroke or has empty values
      if (this.isDrawableElement(el.tag)) {
        const originalHadFill =
          el.attributes.fill !== undefined && el.attributes.fill !== '';
        const originalHadStroke =
          el.attributes.stroke !== undefined && el.attributes.stroke !== '';

        // If had meaningful fill but no stroke, add stroke="none"
        if (originalHadFill && !originalHadStroke && !newAttributes.stroke) {
          newAttributes.stroke = 'none';
        }

        // If had meaningful stroke but no fill, add fill="none"
        if (originalHadStroke && !originalHadFill && !newAttributes.fill) {
          newAttributes.fill = 'none';
        }

        // If had neither fill nor stroke (or empty values), don't add anything
      }

      return { ...el, attributes: newAttributes };
    });
  }

  /**
   * Recursively traverse element tree to find colors
   */
  private traverseElement(element: SVGElement, colors: ParsedColor[]): void {
    // Check fill attribute
    if (element.attributes.fill) {
      colors.push({
        value: element.attributes.fill,
        type: 'fill',
        element,
        attribute: 'fill',
      });
    }

    // Check stroke attribute
    if (element.attributes.stroke) {
      colors.push({
        value: element.attributes.stroke,
        type: 'stroke',
        element,
        attribute: 'stroke',
      });
    }

    // Check stop-color for gradients
    if (element.attributes['stop-color']) {
      colors.push({
        value: element.attributes['stop-color'],
        type: 'stop-color',
        element,
        attribute: 'stop-color',
      });
    }

    // Traverse children
    element.children.forEach(child => this.traverseElement(child, colors));
  }

  /**
   * Transform element and all its children
   */
  private transformElement(
    element: SVGElement,
    transformer: (el: SVGElement) => SVGElement
  ): SVGElement {
    const transformed = transformer(element);

    return {
      ...transformed,
      children: transformed.children.map(child =>
        this.transformElement(child, transformer)
      ),
    };
  }

  /**
   * Check if an element is a drawable SVG element that can have fill/stroke
   */
  private isDrawableElement(tag: string): boolean {
    const drawableElements = [
      'path',
      'circle',
      'ellipse',
      'line',
      'rect',
      'polygon',
      'polyline',
      'text',
      'tspan',
      'use',
    ];
    return drawableElements.includes(tag);
  }

  /**
   * Check if a color value is valid and should be replaced
   */
  private isValidColor(color: string): boolean {
    if (
      !color ||
      color === 'none' ||
      color === 'transparent' ||
      color === 'currentColor'
    ) {
      return false;
    }

    // Check for hex colors
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color)) {
      return true;
    }

    // Check for rgb/rgba colors
    if (
      /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)$/.test(color)
    ) {
      return true;
    }

    // Check for hsl/hsla colors
    if (
      /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)$/.test(color)
    ) {
      return true;
    }

    // Check for named colors (basic ones)
    const namedColors = [
      'red',
      'green',
      'blue',
      'yellow',
      'orange',
      'purple',
      'pink',
      'brown',
      'black',
      'white',
      'gray',
      'grey',
      'cyan',
      'magenta',
      'lime',
      'navy',
    ];

    return namedColors.includes(color.toLowerCase());
  }
}
