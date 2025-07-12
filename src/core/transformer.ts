/**
 * Core transformation engine for SVG processing
 * Handles optimization, color manipulation, and feature application
 */

import { SVGAst, SVGElement } from './parser';
import { ColorSplittingFeature } from '../features/color-splitting';
import { StrokeFixingFeature } from '../features/stroke-fixing';
import { AccessibilityFeature } from '../features/accessibility';

export interface TransformationOptions {
  optimize?: boolean;
  splitColors?: boolean;
  fixedStrokeWidth?: boolean;
  accessibility?: boolean;
  removeComments?: boolean;
  removeDuplicates?: boolean;
  minifyPaths?: boolean;
}

export interface ColorMapping {
  originalColor: string;
  variableName: string;
  type: 'fill' | 'stroke' | 'stop-color';
}

export interface TransformationResult {
  ast: SVGAst;
  colorMappings: ColorMapping[];
  metadata: {
    originalColors: string[];
    optimizationApplied: boolean;
    features: string[];
    hasClassAttributes: boolean;
  };
}

/**
 * Core SVG transformation engine
 */
export class SVGTransformer {
  /**
   * Transform SVG AST based on provided options
   */
  transform(
    ast: SVGAst,
    options: TransformationOptions = {}
  ): TransformationResult {
    const {
      optimize = true,
      splitColors = false,
      fixedStrokeWidth = false,
      accessibility = true,
      removeComments = true,
      removeDuplicates = true,
      minifyPaths = false,
    } = options;

    // Create a deep copy to avoid mutating the original AST
    const transformedAst = this.deepCloneAst(ast);
    const features: string[] = [];
    let colorMappings: ColorMapping[] = [];

    // Apply optimizations if requested
    if (optimize) {
      this.applyOptimizations(transformedAst, {
        removeComments,
        removeDuplicates,
        minifyPaths: minifyPaths && !splitColors, // Don't minify paths if split colors is enabled
      });
      features.push('optimization');
    }

    // Handle color splitting
    if (splitColors) {
      colorMappings = this.applySplitColors(transformedAst);
      features.push('split-colors');
    }

    // Apply fixed stroke width
    if (fixedStrokeWidth) {
      this.applyFixedStrokeWidth(transformedAst);
      features.push('fixed-stroke-width');
    }

    // Apply accessibility features
    if (accessibility) {
      this.applyAccessibility(transformedAst);
      features.push('accessibility');
    }

    return {
      ast: transformedAst,
      colorMappings,
      metadata: {
        originalColors: colorMappings.map(m => m.originalColor),
        optimizationApplied: optimize,
        features,
        hasClassAttributes: this.hasClassAttributes(transformedAst),
      },
    };
  }

  /**
   * Apply color splitting transformation
   */
  private applySplitColors(ast: SVGAst): ColorMapping[] {
    const colorSplittingFeature = new ColorSplittingFeature({
      generateClasses: true,
      colorPrefix: 'color',
    });

    const result = colorSplittingFeature.apply(ast.root);

    // Update the AST with the processed element
    ast.root = result.processedElement;

    return result.mappings;
  }

  /**
   * Apply fixed stroke width transformation
   */
  private applyFixedStrokeWidth(ast: SVGAst): void {
    const strokeFixingFeature = new StrokeFixingFeature({
      onlyIfStrokePresent: true,
      preserveExisting: true,
    });

    const result = strokeFixingFeature.apply(ast.root);
    ast.root = result.processedElement;
  }

  /**
   * Apply accessibility enhancements
   */
  private applyAccessibility(ast: SVGAst): void {
    const accessibilityFeature = new AccessibilityFeature({
      addRole: true,
      addTitle: true,
      addDesc: true,
      defaultRole: 'img',
      preserveExisting: true,
    });

    const result = accessibilityFeature.apply(ast.root);
    ast.root = result.processedElement;
  }

  /**
   * Apply various optimizations
   */
  private applyOptimizations(
    ast: SVGAst,
    options: {
      removeComments: boolean;
      removeDuplicates: boolean;
      minifyPaths: boolean;
    }
  ): void {
    if (options.removeDuplicates) {
      this.removeDuplicateElements(ast);
    }

    if (options.minifyPaths) {
      this.minifyPaths(ast);
    }

    // Remove empty groups and unnecessary nesting
    this.removeEmptyGroups(ast);
  }

  /**
   * Remove duplicate elements (same tag and attributes)
   */
  private removeDuplicateElements(_ast: SVGAst): void {
    // Implementation for removing duplicate elements
    // This is a simplified version - in production, you'd want more sophisticated deduplication
  }

  /**
   * Minify path data
   */
  private minifyPaths(ast: SVGAst): void {
    this.traverseElements(ast.root, element => {
      if (element.tag === 'path' && element.attributes.d) {
        // Basic path minification (remove extra spaces, etc.)
        element.attributes.d = element.attributes.d
          .replace(/\s+/g, ' ')
          .replace(/([MLHVCSQTAZ])\s+/gi, '$1')
          .trim();
      }
    });
  }

  /**
   * Remove empty groups and unnecessary nesting
   */
  private removeEmptyGroups(ast: SVGAst): void {
    const removeEmpty = (element: SVGElement): boolean => {
      // First, recursively process children
      element.children = element.children.filter(removeEmpty);

      // Remove empty groups
      if (
        element.tag === 'g' &&
        element.children.length === 0 &&
        !element.content
      ) {
        return false;
      }

      return true;
    };

    ast.root.children = ast.root.children.filter(removeEmpty);
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
   * Check if a color value is valid
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

    return (
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(color) ||
      /^rgba?\(.+\)$/.test(color) ||
      /^hsla?\(.+\)$/.test(color)
    );
  }

  /**
   * Deep clone AST to avoid mutations
   */
  private deepCloneAst(ast: SVGAst): SVGAst {
    return {
      ...ast,
      root: this.deepCloneElement(ast.root),
    };
  }

  /**
   * Deep clone SVG element
   */
  private deepCloneElement(element: SVGElement): SVGElement {
    return {
      ...element,
      attributes: { ...element.attributes },
      children: element.children.map(child => this.deepCloneElement(child)),
    };
  }

  /**
   * Check if the SVG has any class attributes in its elements
   */
  private hasClassAttributes(ast: SVGAst): boolean {
    const checkElement = (element: SVGElement): boolean => {
      // Check if this element has a class attribute
      if (element.attributes.class || element.attributes.className) {
        return true;
      }

      // Recursively check children
      return element.children.some(child => checkElement(child));
    };

    return checkElement(ast.root);
  }
}
