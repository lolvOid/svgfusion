# SVGFusion Utils

Shared utilities and helper functions for SVGFusion packages.

## Installation

```bash
npm install svgfusion-utils
```

## Usage

```typescript
import { validateSvg, normalizePath, formatOutput } from 'svgfusion-utils';

// Utility functions
const isValid = validateSvg(svgContent);
const cleanPath = normalizePath('./icons/');
const formatted = formatOutput(content, 'typescript');
```

## Features

- File system utilities
- SVG validation helpers
- Path normalization
- Output formatting
- Common type definitions

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation.

## License

MIT
