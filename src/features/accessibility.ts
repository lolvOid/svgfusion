/**
 * Accessibility feature implementation
 * Adds ARIA attributes, roles, and semantic improvements
 */

import { SVGElement } from '../core/parser';

export interface AccessibilityOptions {
  addRole?: boolean;
  addAriaHidden?: boolean;
  addTitle?: boolean;
  addDesc?: boolean;
  defaultRole?: string;
  preserveExisting?: boolean;
}

export interface AccessibilityResult {
  processedElement: SVGElement;
  attributesAdded: string[];
}

/**
 * Apply accessibility enhancements to SVG elements
 */
export class AccessibilityFeature {
  private options: Required<AccessibilityOptions>;

  constructor(options: AccessibilityOptions = {}) {
    this.options = {
      addRole: options.addRole ?? true,
      addAriaHidden: options.addAriaHidden ?? false,
      addTitle: options.addTitle ?? true,
      addDesc: options.addDesc ?? true,
      defaultRole: options.defaultRole ?? 'img',
      preserveExisting: options.preserveExisting ?? true,
    };
  }

  /**
   * Apply accessibility enhancements to an SVG element
   */
  apply(element: SVGElement): AccessibilityResult {
    const attributesAdded: string[] = [];

    if (element.tag !== 'svg') {
      return { processedElement: element, attributesAdded };
    }

    const newAttributes = { ...element.attributes };

    // Add role attribute
    if (
      this.options.addRole &&
      (!this.options.preserveExisting || !newAttributes.role)
    ) {
      newAttributes.role = this.options.defaultRole;
      attributesAdded.push('role');
    }

    // Add aria-hidden if specified
    if (
      this.options.addAriaHidden &&
      (!this.options.preserveExisting || !newAttributes['aria-hidden'])
    ) {
      newAttributes['aria-hidden'] = 'true';
      attributesAdded.push('aria-hidden');
    }

    // Add title support (will be handled by component generator)
    if (this.options.addTitle) {
      attributesAdded.push('title-support');
    }

    // Add description support (will be handled by component generator)
    if (this.options.addDesc) {
      attributesAdded.push('desc-support');
    }

    // Add aria-labelledby if title/desc are enabled
    if (
      this.options.addTitle &&
      this.options.addDesc &&
      (!this.options.preserveExisting || !newAttributes['aria-labelledby'])
    ) {
      newAttributes['aria-labelledby'] = '{titleId} {descId}';
      attributesAdded.push('aria-labelledby');
    } else if (
      this.options.addTitle &&
      (!this.options.preserveExisting || !newAttributes['aria-labelledby'])
    ) {
      newAttributes['aria-labelledby'] = '{titleId}';
      attributesAdded.push('aria-labelledby');
    }

    const processedElement: SVGElement = {
      ...element,
      attributes: newAttributes,
    };

    return {
      processedElement,
      attributesAdded,
    };
  }

  /**
   * Generate accessibility-related props for component interface
   */
  generateProps(): string[] {
    const props: string[] = [];

    if (this.options.addTitle) {
      props.push('title?: string', 'titleId?: string');
    }

    if (this.options.addDesc) {
      props.push('desc?: string', 'descId?: string');
    }

    return props;
  }

  /**
   * Generate accessibility elements for component JSX
   */
  generateJSXElements(framework: 'react' | 'vue'): string {
    const elements: string[] = [];

    if (framework === 'react') {
      if (this.options.addDesc) {
        elements.push('{desc ? <desc id={descId}>{desc}</desc> : null}');
      }
      if (this.options.addTitle) {
        elements.push('{title ? <title id={titleId}>{title}</title> : null}');
      }
    } else {
      // Vue
      if (this.options.addDesc) {
        elements.push('<desc v-if="desc" :id="descId">{{ desc }}</desc>');
      }
      if (this.options.addTitle) {
        elements.push('<title v-if="title" :id="titleId">{{ title }}</title>');
      }
    }

    return elements.join('\n    ');
  }
}
