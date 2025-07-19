/**
 * Stroke width splitting feature implementation
 * Handles extraction and replacement of stroke widths with React/Vue props
 */

import { SVGElement } from '../core/parser';

export interface ParsedStrokeWidth {
  value: string;
  element: SVGElement;
  attribute: 'stroke-width' | 'style';
  styleProperty?: string;
}

export interface StrokeWidthMapping {
  originalStrokeWidth: string;
  variableName: string;
}

export interface StrokeWidthSplittingOptions {
  preserveOriginalNames?: boolean;
  strokeWidthPrefix?: string;
  generateClasses?: boolean;
}

export interface StrokeWidthSplittingResult {
  mappings: StrokeWidthMapping[];
  processedElement: SVGElement;
  originalStrokeWidths: string[];
}

/**
 * Apply stroke width splitting transformation to SVG elements
 */
export class StrokeWidthSplittingFeature {
  private options: Required<StrokeWidthSplittingOptions>;

  constructor(options: StrokeWidthSplittingOptions = {}) {
    this.options = {
      preserveOriginalNames: options.preserveOriginalNames ?? false,
      strokeWidthPrefix: options.strokeWidthPrefix ?? 'strokeWidth',
      generateClasses: options.generateClasses ?? true,
    };
  }

  /**
   * Extract unique stroke widths from SVG elements
   */
  extractStrokeWidths(element: SVGElement): ParsedStrokeWidth[] {
    const strokeWidths: ParsedStrokeWidth[] = [];
    this.traverseElement(element, strokeWidths);

    // Remove duplicates and sort for consistent ordering
    const uniqueStrokeWidths = new Map<string, ParsedStrokeWidth>();
    strokeWidths.forEach(strokeWidth => {
      if (this.isValidStrokeWidth(strokeWidth.value)) {
        uniqueStrokeWidths.set(strokeWidth.value, strokeWidth);
      }
    });

    return Array.from(uniqueStrokeWidths.values()).sort((a, b) => {
      // Sort numerically, treating non-numeric values as highest priority
      const aNum = parseFloat(a.value);
      const bNum = parseFloat(b.value);

      if (isNaN(aNum) && isNaN(bNum)) {
        return a.value.localeCompare(b.value);
      }
      if (isNaN(aNum)) return 1;
      if (isNaN(bNum)) return -1;

      return aNum - bNum;
    });
  }

  /**
   * Apply stroke width splitting to an SVG element
   */
  apply(element: SVGElement): StrokeWidthSplittingResult {
    const strokeWidths = this.extractStrokeWidths(element);
    const mappings = this.generateStrokeWidthMappings(strokeWidths);
    const processedElement = this.replaceStrokeWidthsWithVariables(
      element,
      mappings
    );

    return {
      mappings,
      processedElement,
      originalStrokeWidths: strokeWidths.map(sw => sw.value),
    };
  }

  /**
   * Recursively traverse element tree to find stroke widths
   */
  private traverseElement(
    element: SVGElement,
    strokeWidths: ParsedStrokeWidth[]
  ): void {
    // Check stroke-width attribute
    if (element.attributes['stroke-width']) {
      strokeWidths.push({
        value: element.attributes['stroke-width'],
        element,
        attribute: 'stroke-width',
      });
    }

    // Check style attribute for stroke-width
    if (element.attributes.style) {
      const styleStrokeWidth = this.extractStrokeWidthFromStyle(
        element.attributes.style
      );
      if (styleStrokeWidth) {
        strokeWidths.push({
          value: styleStrokeWidth,
          element,
          attribute: 'style',
          styleProperty: 'stroke-width',
        });
      }
    }

    // Recursively process children
    element.children.forEach(child =>
      this.traverseElement(child, strokeWidths)
    );
  }

  /**
   * Extract stroke-width from CSS style string
   */
  private extractStrokeWidthFromStyle(style: string): string | null {
    const match = style.match(/stroke-width\s*:\s*([^;]+)/);
    return match ? match[1].trim() : null;
  }

  /**
   * Check if stroke width value is valid for transformation
   */
  private isValidStrokeWidth(value: string): boolean {
    // Skip inherited, none, or variable values
    if (
      value === 'inherit' ||
      value === 'none' ||
      value === 'initial' ||
      value === 'unset' ||
      value.includes('var(') ||
      value.includes('calc(')
    ) {
      return false;
    }

    // Accept numeric values (with or without units)
    return /^[\d.]+(?:px|pt|pc|in|cm|mm|em|rem|ex|ch|vw|vh|vmin|vmax|%)?$/.test(
      value.trim()
    );
  }

  /**
   * Generate stroke width mappings for replacement
   */
  private generateStrokeWidthMappings(
    strokeWidths: ParsedStrokeWidth[]
  ): StrokeWidthMapping[] {
    return strokeWidths.map((strokeWidth, index) => ({
      originalStrokeWidth: strokeWidth.value,
      variableName:
        index === 0
          ? this.options.strokeWidthPrefix
          : `${this.options.strokeWidthPrefix}${index + 1}`,
    }));
  }

  /**
   * Replace stroke widths in element with variable references
   */
  private replaceStrokeWidthsWithVariables(
    element: SVGElement,
    mappings: StrokeWidthMapping[]
  ): SVGElement {
    const strokeWidthMap = new Map(
      mappings.map(m => [m.originalStrokeWidth, m.variableName])
    );

    return this.transformElement(element, el => {
      const newAttributes = { ...el.attributes };

      // Replace stroke-width attribute
      if (
        newAttributes['stroke-width'] &&
        strokeWidthMap.has(newAttributes['stroke-width'])
      ) {
        newAttributes['stroke-width'] = `{${strokeWidthMap.get(
          newAttributes['stroke-width']
        )}}`;
      }

      // Replace stroke-width in style attribute
      if (newAttributes.style) {
        let updatedStyle = newAttributes.style;
        strokeWidthMap.forEach((variable, originalStrokeWidth) => {
          const regex = new RegExp(
            `stroke-width\\s*:\\s*${this.escapeRegExp(originalStrokeWidth)}`,
            'g'
          );
          updatedStyle = updatedStyle.replace(
            regex,
            `stroke-width: {${variable}}`
          );
        });
        newAttributes.style = updatedStyle;
      }

      return {
        ...el,
        attributes: newAttributes,
      };
    });
  }

  /**
   * Recursively transform elements
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
   * Escape special regex characters
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
