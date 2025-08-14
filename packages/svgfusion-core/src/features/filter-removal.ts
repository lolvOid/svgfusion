/**
 * Filter removal feature
 * Removes filter elements and their references from SVG content
 */

import type { SVGElement } from '../core/parser';

export interface FilterRemovalOptions {
  removeFilters?: boolean;
}

/**
 * Remove filter elements only under defs and their references
 */
export function removeFilters(element: SVGElement): SVGElement {
  // Create a deep copy of the element
  const result: SVGElement = {
    tag: element.tag,
    attributes: { ...element.attributes },
    children: [],
    content: element.content,
  };

  // If this is a defs element, filter out filter children
  if (element.tag === 'defs') {
    result.children = element.children.filter(child => child.tag !== 'filter');
  } else {
    // For non-defs elements, recursively process children
    result.children = element.children.map(child => removeFilters(child));
  }

  // Remove filter attribute references from any element
  if (result.attributes.filter) {
    delete result.attributes.filter;
  }

  return result;
}

/**
 * Apply filter removal transformation to SVG AST
 */
export function applyFilterRemoval(
  ast: { root: SVGElement },
  options: FilterRemovalOptions
): { root: SVGElement } {
  if (!options.removeFilters) {
    return ast;
  }

  return {
    root: removeFilters(ast.root),
  };
}
