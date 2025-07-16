/**
 * SVG parsing and AST (Abstract Syntax Tree) generation
 * Industry standard approach for parsing SVG content into a structured format
 */

export interface SVGElement {
  tag: string;
  attributes: Record<string, string>;
  children: SVGElement[];
  content?: string;
}

export interface SVGAst {
  root: SVGElement;
  viewBox?: string;
  width?: string;
  height?: string;
  namespace?: string;
}

export interface ParsedColor {
  value: string;
  type: 'fill' | 'stroke' | 'stop-color';
  element: SVGElement;
  attribute: string;
}

/**
 * Parse SVG content into an Abstract Syntax Tree
 */
export class SVGParser {
  /**
   * Parse SVG string into structured AST
   */
  parse(svgContent: string): SVGAst {
    // Remove XML declaration and comments
    const cleanContent = this.cleanSvgContent(svgContent);

    // Parse the SVG element and its children
    const root = this.parseElement(cleanContent);

    return {
      root,
      viewBox: root.attributes.viewBox,
      width: root.attributes.width,
      height: root.attributes.height,
      namespace: root.attributes.xmlns,
    };
  }

  /**
   * Extract all colors from the SVG AST
   */
  extractColors(ast: SVGAst): ParsedColor[] {
    const colors: ParsedColor[] = [];

    this.traverseElements(ast.root, element => {
      // Check fill colors
      if (
        element.attributes.fill &&
        this.isValidColor(element.attributes.fill)
      ) {
        colors.push({
          value: element.attributes.fill,
          type: 'fill',
          element,
          attribute: 'fill',
        });
      }

      // Check stroke colors
      if (
        element.attributes.stroke &&
        this.isValidColor(element.attributes.stroke)
      ) {
        colors.push({
          value: element.attributes.stroke,
          type: 'stroke',
          element,
          attribute: 'stroke',
        });
      }

      // Check stop-color for gradients
      if (
        element.attributes['stop-color'] &&
        this.isValidColor(element.attributes['stop-color'])
      ) {
        colors.push({
          value: element.attributes['stop-color'],
          type: 'stop-color',
          element,
          attribute: 'stop-color',
        });
      }
    });

    return colors;
  }

  /**
   * Clean SVG content by removing XML declarations and comments
   */
  private cleanSvgContent(content: string): string {
    return content
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .trim();
  }

  /**
   * Parse a single SVG element using proper XML parser
   */
  private parseElement(content: string): SVGElement {
    // Browser environment - use native DOMParser
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'image/svg+xml');

      // Check for parser errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG: XML parsing failed');
      }

      const svgElement = doc.documentElement;
      if (svgElement.tagName.toLowerCase() !== 'svg') {
        throw new Error('Invalid SVG: No svg element found');
      }

      return this.convertDOMToSVGElement(svgElement);
    }

    // Node.js environment - use jsdom fallback
    try {
      // Use dynamic import but handle it synchronously for now
      // This will work in Node.js environments where jsdom is available

      const jsdomModule = eval('require')('jsdom');
      const { JSDOM } = jsdomModule;
      const dom = new JSDOM(content, { contentType: 'image/svg+xml' });
      const svgElement = dom.window.document.documentElement;

      if (svgElement.tagName.toLowerCase() !== 'svg') {
        throw new Error('Invalid SVG: No svg element found');
      }

      return this.convertDOMToSVGElement(svgElement);
    } catch (_error) {
      // Fallback to regex parser if jsdom is not available
      return this.parseElementWithRegex(content);
    }
  }

  /**
   * Convert DOM element to SVGElement (works for both browser DOMParser and jsdom)
   */
  private convertDOMToSVGElement(domElement: Element): SVGElement {
    const element: SVGElement = {
      tag: this.preserveSvgTagCase(domElement.tagName),
      attributes: {},
      children: [],
    };

    // Copy attributes
    for (let i = 0; i < domElement.attributes.length; i++) {
      const attr = domElement.attributes[i];
      element.attributes[attr.name] = attr.value;
    }

    // Process child elements
    for (let i = 0; i < domElement.children.length; i++) {
      const child = domElement.children[i];
      element.children.push(this.convertDOMToSVGElement(child));
    }

    // Handle text content (for elements like <title>, <desc>)
    if (domElement.children.length === 0 && domElement.textContent?.trim()) {
      element.content = domElement.textContent.trim();
    }

    return element;
  }

  /**
   * Fallback: Parse SVG element using regex (original implementation)
   */
  private parseElementWithRegex(content: string): SVGElement {
    // Find the opening SVG tag
    const svgMatch = content.match(/<svg([^>]*)>/i);
    if (!svgMatch) {
      throw new Error('Invalid SVG: No svg element found');
    }

    const attributes = this.parseAttributes(svgMatch[1]);
    const children = this.parseChildren(content);

    return {
      tag: 'svg',
      attributes,
      children,
    };
  }

  /**
   * Parse attributes from an element string
   */
  private parseAttributes(attributeString: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g;

    let match;
    while ((match = attrRegex.exec(attributeString)) !== null) {
      attributes[match[1]] = match[2];
    }

    return attributes;
  }

  /**
   * Parse child elements from SVG content
   */
  private parseChildren(content: string): SVGElement[] {
    const children: SVGElement[] = [];

    // First find the SVG opening tag to get content inside it
    const svgContentMatch = content.match(/<svg[^>]*>(.*)<\/svg>/is);
    if (!svgContentMatch || !svgContentMatch[1]) {
      return children;
    }

    const innerContent = svgContentMatch[1];

    // Find all elements (both self-closing and with closing tags)
    // This regex handles both <element/> and <element>...</element>
    const elementRegex =
      /<(\w+(?::\w+)?)([^>]*?)(?:\s*\/\s*>|>(.*?)<\/\1\s*>)/gs;
    let match;

    while ((match = elementRegex.exec(innerContent)) !== null) {
      const [, tag, attributeString, elementContent] = match;

      const attributes = this.parseAttributes(attributeString);
      const element: SVGElement = {
        tag,
        attributes,
        children: [],
      };

      // If there's element content (not self-closing), process it
      if (elementContent !== undefined) {
        if (elementContent.includes('<')) {
          // Parse nested elements recursively
          element.children = this.parseNestedElements(elementContent);
        } else if (elementContent.trim()) {
          // Text content
          element.content = elementContent.trim();
        }
      }

      children.push(element);
    }

    return children;
  }

  /**
   * Parse nested elements (for complex SVGs with groups, etc.)
   */
  private parseNestedElements(content: string): SVGElement[] {
    const children: SVGElement[] = [];
    // Use the same improved regex that handles both self-closing and regular elements
    const elementRegex =
      /<(\w+(?::\w+)?)([^>]*?)(?:\s*\/\s*>|>(.*?)<\/\1\s*>)/gs;
    let match;

    while ((match = elementRegex.exec(content)) !== null) {
      const [, tag, attributeString, elementContent] = match;
      const attributes = this.parseAttributes(attributeString);

      const element: SVGElement = {
        tag,
        attributes,
        children: [],
      };

      // If there's element content, process it
      if (elementContent !== undefined) {
        if (elementContent.includes('<')) {
          // Parse nested elements recursively
          element.children = this.parseNestedElements(elementContent);
        } else if (elementContent.trim()) {
          // Text content
          element.content = elementContent.trim();
        }
      }

      children.push(element);
    }

    return children;
  }

  /**
   * Traverse all elements in the AST
   */
  private traverseElements(
    element: SVGElement,
    callback: (element: SVGElement) => void
  ): void {
    callback(element);
    element.children.forEach(child => this.traverseElements(child, callback));
  }

  /**
   * Preserve proper case for SVG elements
   */
  private preserveSvgTagCase(tagName: string): string {
    const lowerTag = tagName.toLowerCase();

    // Map of lowercase to proper case for SVG elements
    const svgTagCaseMap: Record<string, string> = {
      clippath: 'clipPath',
      defs: 'defs',
      foreignobject: 'foreignObject',
      lineargradient: 'linearGradient',
      radialgradient: 'radialGradient',
      textpath: 'textPath',
      use: 'use',
    };

    return svgTagCaseMap[lowerTag] || lowerTag;
  }

  /**
   * Check if a color value is valid and should be processed
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

    // Check for named colors (basic set)
    const namedColors = [
      'red',
      'green',
      'blue',
      'black',
      'white',
      'yellow',
      'cyan',
      'magenta',
    ];
    return namedColors.includes(color.toLowerCase());
  }
}
