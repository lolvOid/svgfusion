# Getting Started

SVGFusion is a powerful Node.js CLI tool and library that transforms SVG files into production-ready React and Vue 3 components with complex SVG support, TypeScript integration, and automatic optimization.

## Installation

### CLI Installation

Install SVGFusion globally to use the command line interface:

```bash
npm install -g svgfusion
```

Or use it with npx without installation:

```bash
npx svgfusion input.svg --output ./components
```

### Library Installation

Install SVGFusion as a dependency in your project:

```bash
npm install svgfusion
```

## Quick Start

### Using the CLI

Convert a single SVG file to React component:

```bash
svgfusion icon.svg --output ./components
```

Convert all SVG files in a directory to Vue components:

```bash
svgfusion ./icons --framework vue --output ./components
```

Enable color splitting for custom color props:

```bash
svgfusion ./icons --split-colors --output ./components
```

Add prefixes and generate index file:

```bash
svgfusion ./icons --prefix Icon --suffix Component --index
```

### Using the Library

```typescript
import { SVGFusion } from 'svgfusion';
import { readFileSync } from 'fs';

const svgContent = readFileSync('icon.svg', 'utf-8');
const engine = new SVGFusion();

// Convert to React
const result = await engine.convert(svgContent, {
  framework: 'react',
  transformation: {
    splitColors: true,
    fixedStrokeWidth: true,
  },
  generator: {
    typescript: true,
    componentName: 'MyIcon',
  },
});

console.log(result.code);

// Convert to Vue
const vueResult = await engine.convert(svgContent, {
  framework: 'vue',
  generator: { componentName: 'MyIcon' },
});
```

## Key Features

- **React & Vue 3 Support** - Generate components for both frameworks
- **TypeScript Ready** - Full TypeScript support with proper typing
- **Complex SVG Support** - Handles gradients, masks, filters, and Figma exports
- **Color Splitting** - Extract individual color props with smart fill/stroke handling
- **Fixed Stroke Width** - Non-scaling stroke support for consistent appearance
- **WCAG Accessibility** - Built-in accessibility features and ARIA support
- **SVG Optimization** - Automatic optimization with SVGO
- **Batch Processing** - Convert entire directories at once
- **Production Ready** - Optimized components for production use

## Next Steps

- [CLI Reference](https://svgfusion.netlify.app/docs/cli-usage) - Learn all CLI commands and options
- [Node API Reference](./node-api) - Explore the SVGFusion Node API
- [Browser API Reference](./browser-api.md) - Explore the SVGFusion Browser API

## Quick Examples

### CLI with Color Splitting

```bash
# Extract colors as props for Tailwind CSS
npx svgfusion ./icons --split-colors --prefix Icon --output ./components
```

### Programmatic Usage

```typescript
import { convertToReact } from 'svgfusion';

const result = await convertToReact(svgContent, {
  name: 'StarIcon',
  splitColors: true,
  typescript: true,
});
```
