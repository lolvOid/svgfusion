# SVGFusion Core

Core engine and utilities for SVGFusion - the foundation library that powers SVG to component conversion.

## Installation

```bash
npm install svgfusion-core
```

## Usage

```typescript
import { processeSvg, createComponent } from 'svgfusion-core';

// Process SVG and generate component
const svgContent = '<svg>...</svg>';
const component = createComponent(svgContent, options);
```

## Features

- SVG parsing and optimization
- Component generation engine
- Type-safe utilities
- Framework-agnostic core logic

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation.

## License

MIT
