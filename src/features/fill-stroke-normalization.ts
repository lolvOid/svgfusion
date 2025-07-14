/**
 * Fill/Stroke Normalization Feature
 * Adds explicit none values to prevent browser defaults
 */

import { SVGElement } from '../core/parser';

export interface FillStrokeNormalizationOptions {
  enabled: boolean;
}

/**
 * Normalizes fill and stroke attributes by adding explicit "none" values
 */
export class FillStrokeNormalization {
  constructor(private options: FillStrokeNormalizationOptions) {}

  /**
   * Apply fill/stroke normalization to SVG elements
   */
  apply(elements: SVGElement[]): SVGElement[] {
    if (!this.options.enabled) {
      return elements;
    }

    return this.normalizeElements(elements);
  }

  /**
   * Normalize elements by adding missing fill/stroke "none" attributes
   */
  private normalizeElements(elements: SVGElement[]): SVGElement[] {
    return elements.map(element =>
      this.transformElement(element, el => {
        const newAttributes = { ...el.attributes };

        // Add missing attributes with "none" for drawable elements
        if (this.isDrawableElement(el.tag)) {
          const hasFill =
            el.attributes.fill !== undefined && el.attributes.fill !== '';
          const hasStroke =
            el.attributes.stroke !== undefined && el.attributes.stroke !== '';

          // If has meaningful fill but no stroke, add stroke="none"
          if (hasFill && !hasStroke) {
            newAttributes.stroke = 'none';
          }

          // If has meaningful stroke but no fill, add fill="none"
          if (hasStroke && !hasFill) {
            newAttributes.fill = 'none';
          }
        }

        return { ...el, attributes: newAttributes };
      })
    );
  }

  /**
   * Recursively transform elements
   */
  private transformElement(
    element: SVGElement,
    transform: (el: SVGElement) => SVGElement
  ): SVGElement {
    const transformed = transform(element);

    if (transformed.children) {
      transformed.children = transformed.children.map(child =>
        this.transformElement(child, transform)
      );
    }

    return transformed;
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
}
