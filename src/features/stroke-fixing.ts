/**
 * Fixed stroke width feature implementation
 * Adds vector-effect="non-scaling-stroke" to stroke elements
 */

import { SVGElement } from '../core/parser';

export interface StrokeFixingOptions {
  preserveExisting?: boolean;
  onlyIfStrokePresent?: boolean;
}

export interface StrokeFixingResult {
  processedElement: SVGElement;
  elementsModified: number;
}

/**
 * Apply fixed stroke width transformation to SVG elements
 */
export class StrokeFixingFeature {
  private options: Required<StrokeFixingOptions>;

  constructor(options: StrokeFixingOptions = {}) {
    this.options = {
      preserveExisting: options.preserveExisting ?? true,
      onlyIfStrokePresent: options.onlyIfStrokePresent ?? true,
    };
  }

  /**
   * Apply stroke fixing to an SVG element
   */
  apply(element: SVGElement): StrokeFixingResult {
    let elementsModified = 0;

    const processedElement = this.transformElement(element, el => {
      if (this.shouldAddVectorEffect(el)) {
        elementsModified++;
        return {
          ...el,
          attributes: {
            ...el.attributes,
            'vector-effect': 'non-scaling-stroke',
          },
        };
      }
      return el;
    });

    return {
      processedElement,
      elementsModified,
    };
  }

  /**
   * Check if element should have vector-effect added
   */
  private shouldAddVectorEffect(element: SVGElement): boolean {
    // Skip if vector-effect already exists and we're preserving existing
    if (this.options.preserveExisting && element.attributes['vector-effect']) {
      return false;
    }

    // Only add to elements that have stroke if option is enabled
    if (this.options.onlyIfStrokePresent) {
      const hasStroke =
        element.attributes.stroke &&
        element.attributes.stroke !== 'none' &&
        element.attributes.stroke !== 'transparent';
      if (!hasStroke) {
        return false;
      }
    }

    // Add to stroke-capable elements
    const strokeElements = [
      'path',
      'line',
      'polyline',
      'polygon',
      'rect',
      'circle',
      'ellipse',
    ];

    return strokeElements.includes(element.tag);
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
}
