import * as vscode from 'vscode';

export class SvgHoverProvider implements vscode.HoverProvider {
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    if (!document.fileName.endsWith('.svg')) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position);
    if (!range) {
      return null;
    }

    const hoveredText = document.getText(range);

    // Check if we're hovering over SVG-related content
    if (this.isSvgElement(hoveredText) || this.isSvgAttribute(hoveredText)) {
      return this.createSvgHover(hoveredText, range);
    }

    // Always show SVGFusion actions for SVG files
    return this.createSvgFusionHover(range);
  }

  private isSvgElement(text: string): boolean {
    const svgElements = [
      'svg',
      'path',
      'rect',
      'circle',
      'ellipse',
      'line',
      'polyline',
      'polygon',
      'g',
      'defs',
      'use',
      'symbol',
      'marker',
      'clipPath',
      'mask',
      'pattern',
      'image',
      'text',
      'tspan',
      'textPath',
      'foreignObject',
    ];
    return svgElements.includes(text.toLowerCase());
  }

  private isSvgAttribute(text: string): boolean {
    const svgAttributes = [
      'viewBox',
      'width',
      'height',
      'fill',
      'stroke',
      'stroke-width',
      'd',
      'cx',
      'cy',
      'r',
      'rx',
      'ry',
      'x',
      'y',
      'x1',
      'y1',
      'x2',
      'y2',
      'points',
      'transform',
      'opacity',
      'fill-opacity',
      'stroke-opacity',
    ];
    return svgAttributes.includes(text.toLowerCase());
  }

  private createSvgHover(text: string, range: vscode.Range): vscode.Hover {
    const contents = new vscode.MarkdownString();
    contents.isTrusted = true;

    contents.appendMarkdown(`**SVG Element: \`${text}\`**\n\n`);
    contents.appendMarkdown(this.getSvgDocumentation(text));
    contents.appendMarkdown('\n\n---\n\n');
    contents.appendMarkdown('**SVGFusion Actions:**\n\n');
    contents.appendMarkdown(
      `[$(symbol-file) Convert to Component](command:svgfusion.convertSvg) | `
    );
    contents.appendMarkdown(
      `[$(eye) Preview](command:svgfusion.showPreview) | `
    );
    contents.appendMarkdown(
      `[$(play) Open Playground](command:svgfusion.openPlayground)`
    );

    return new vscode.Hover(contents, range);
  }

  private createSvgFusionHover(range: vscode.Range): vscode.Hover {
    const contents = new vscode.MarkdownString();
    contents.isTrusted = true;

    contents.appendMarkdown('**🎨 SVGFusion**\n\n');
    contents.appendMarkdown('Convert this SVG to React or Vue components\n\n');
    contents.appendMarkdown(
      `[$(symbol-file) Convert to Component](command:svgfusion.convertSvg) | `
    );
    contents.appendMarkdown(
      `[$(eye) Preview](command:svgfusion.showPreview) | `
    );
    contents.appendMarkdown(
      `[$(play) Open Playground](command:svgfusion.openPlayground)`
    );

    return new vscode.Hover(contents, range);
  }

  private getSvgDocumentation(element: string): string {
    const docs: Record<string, string> = {
      svg: 'The root SVG element defines a new coordinate system and viewport.',
      path: 'Defines a path using a series of path data commands.',
      rect: 'Draws a rectangle with optional rounded corners.',
      circle: 'Draws a circle with a center point and radius.',
      ellipse: 'Draws an ellipse with center point and two radii.',
      line: 'Draws a straight line between two points.',
      g: 'Groups SVG elements together for styling and transformations.',
      viewBox: 'Defines the coordinate system for the SVG viewport.',
      fill: 'Sets the fill color of the element.',
      stroke: 'Sets the stroke color of the element.',
      d: 'Contains the path data for a path element.',
      width: 'Specifies the width of the element.',
      height: 'Specifies the height of the element.',
    };

    return docs[element.toLowerCase()] || 'SVG element or attribute.';
  }
}
