# Getting Started

SVGFusion is a powerful CLI tool and library that transforms SVG files into production-ready React and Vue 3 components with TypeScript support and automatic optimization.

## Installation

### CLI Installation

Install SVGFusion globally to use the command line interface:

```bash
npm install -g svgfusion
```

Or use it with npx without installation:

```bash
npx svgfusion convert input.svg
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
svgfusion convert icon.svg -f react -t
```

Convert all SVG files in a directory to Vue components:

```bash
svgfusion convert ./icons -f vue -o ./components
```

### Using the Library

```typescript
import { convertToReact, convertToVue } from 'svgfusion';
import { readFileSync } from 'fs';

// Convert to React
const svgContent = readFileSync('icon.svg', 'utf-8');
const reactComponent = await convertToReact(svgContent, {
  typescript: true,
  name: 'MyIcon',
});

console.log(reactComponent.code);
```

## Features

- ✅ **React & Vue 3 Support** - Generate components for both frameworks
- ✅ **TypeScript Support** - Full TypeScript support with proper typing
- ✅ **SVG Optimization** - Automatic optimization with SVGO
- ✅ **Batch Processing** - Convert entire directories at once
- ✅ **Customizable** - Configure output format, naming, and optimization
- ✅ **Production Ready** - Optimized components for production use

## Next Steps

- [CLI Usage](./cli-usage) - Learn all CLI commands and options
- [Library API](./api-reference) - Explore the programmatic API
- [Playground](/playground) - Try the interactive playground
