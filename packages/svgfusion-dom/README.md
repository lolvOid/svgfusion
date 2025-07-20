<div align="center">
  <img src="https://i.ibb.co/TZFfpFL/logo.png" alt="SVGFusion Logo" width="120" height="120">

# SVGFusion Browser

🌐 Browser-optimized package for converting SVG files into React and Vue 3 components with TypeScript support and native SVG props inheritance.

</div>

## Installation

```bash
npm install svgfusion-dom
# or
yarn add svgfusion-dom
# or
pnpm add svgfusion-dom
```

## CDN Usage

```html
<script type="module">
  import svgfusionDom from 'https://cdn.jsdelivr.net/npm/svgfusion-dom@1.3.4/+esm';
</script>
```

## Quick Start

```javascript
import { convertToReact } from 'svgfusion-dom';

// Convert SVG to React component
const svgContent = `<svg viewBox="0 0 24 24">...</svg>`;
const reactComponent = await convertToReact(svgContent, {
  typescript: true,
});

console.log(reactComponent.code); // Generated component code
```

## TypeScript Usage

```typescript
import {
  convertToReact,
  convertToVue,
  type BrowserConversionOptions,
  type BrowserConversionResult,
} from 'svgfusion-dom';

// Type-safe React conversion
const reactOptions: BrowserConversionOptions = {
  framework: 'react',
  typescript: true,
  componentName: 'MyIcon',
  memo: true,
  forwardRef: true,
};

const reactResult: BrowserConversionResult = await convertToReact(
  svgContent,
  reactOptions
);

// Type-safe Vue conversion
const vueResult: BrowserConversionResult = await convertToVue(svgContent, {
  typescript: true,
  sfc: true,
  scriptSetup: true,
});
```

### Available Types

```typescript
// Core types
type BrowserConversionOptions
type BrowserConversionResult
type SVGFusionOptions
type ConversionResult

// Framework-specific
type ReactGeneratorOptions
type VueGeneratorOptions

// Functions
convertToReact, convertToVue, convertBatch
extractColors, validateSvg
SVGFusionBrowser
```

## Features

- **Browser Native** - Works directly in the browser without Node.js
- **Lightweight** - Optimized bundle size for web applications
- **Framework Support** - React and Vue 3 components
- **TypeScript Ready** - Generate components with full type support
- **Real-time Conversion** - Perfect for online editors and playgrounds
- **Zero Dependencies** - Standalone browser library
- **Customizable** - Extensive configuration options

## Usage

### Basic Conversion

```javascript
import { convertToReact, convertToVue } from 'svgfusion-dom';

// React component
const reactResult = await convertToReact(svgContent, {
  typescript: true,
  componentName: 'MyIcon',
});

// Vue component
const vueResult = await convertToVue(svgContent, {
  typescript: true,
  componentName: 'MyIcon',
  sfc: true,
  scriptSetup: true,
//

const svgContent = `
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3l8 8v10h-6v-6H10v6H4V11l8-8z" />
  </svg>
`;
```

### React Component Generation

```javascript
import { convertToReact } from 'svgfusion-dom';

const reactResult = await convertToReact(svgContent, {
  typescript: true,
  componentName: 'HomeIcon',
  memo: true,
  forwardRef: true,
});

console.log(reactResult.code); // Complete React component with TypeScript
```

### Vue Component Generation

```javascript
import { convertToVue } from 'svgfusion-dom';

const vueResult = await convertToVue(svgContent, {
  typescript: true,
  componentName: 'HomeIcon',
  sfc: true,
  scriptSetup: true,
});

console.log(vueResult.code); // Complete Vue 3 component with Composition API
```

### Batch Conversion

```javascript
import { convertBatch } from 'svgfusion-dom';

const svgFiles = [
  { name: 'home', content: '<svg>...</svg>' },
  { name: 'user', content: '<svg>...</svg>' },
  { name: 'settings', content: '<svg>...</svg>' },
];

const components = await convertBatch(svgFiles, {
  framework: 'react',
  typescript: true,
});

// Returns: Array of generated components
```

## API Reference

### `convertToReact(svgContent, options?)`

Converts SVG to React component.

**Parameters:**

- `svgContent` (string): The SVG content to convert
- `options` (BrowserConversionOptions): Conversion options

**Returns:** `Promise<BrowserConversionResult>`

### `convertToVue(svgContent, options?)`

Converts SVG to Vue component.

**Parameters:**

- `svgContent` (string): The SVG content to convert
- `options` (BrowserConversionOptions): Conversion options

**Returns:** `Promise<BrowserConversionResult>`

### `convertBatch(svgContents, options)`

Converts multiple SVG files to components.

**Parameters:**

- `svgContents` (Array): Array of `{ content: string, name: string }` objects
- `options` (BrowserConversionOptions): Conversion options

**Returns:** `Promise<BrowserConversionResult[]>`

### `extractColors(svgContent)`

Extracts unique colors from SVG content.

**Returns:** `string[]`

### `validateSvg(svgContent)`

Validates SVG content structure.

**Returns:** `{ valid: boolean, errors: string[] }`

### Types Interface

```typescript
interface BrowserConversionOptions {
  framework: 'react' | 'vue';
  typescript?: boolean;
  componentName?: string;
  prefix?: string;
  suffix?: string;
  splitColors?: boolean;
  splitStrokeWidths?: boolean;
  fixedStrokeWidth?: boolean;
  normalizeFillStroke?: boolean;
  memo?: boolean; // React only
  forwardRef?: boolean; // React only
  sfc?: boolean; // Vue only
  scriptSetup?: boolean; // Vue only
  optimize?: boolean;
}
```

## Browser Integration Examples

### Online Code Editor

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/svgfusion-dom@latest/dist/index.umd.js"></script>
  </head>
  <body>
    <textarea id="svg-input" placeholder="Paste SVG here..."></textarea>
    <button onclick="convertToReact()">Convert to React</button>
    <pre id="output"></pre>

    <script>
      function convertToReact() {
        const svgContent = document.getElementById('svg-input').value;
        const result = SVGFusion.convertSvg(svgContent, {
          framework: 'react',
          typescript: true,
        });
        document.getElementById('output').textContent = result;
      }
    </script>
  </body>
</html>
```

### React Playground Integration

```jsx
import { convertSvg } from 'svgfusion-dom';
import { useState } from 'react';

function SvgConverter() {
  const [svgInput, setSvgInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    const result = convertSvg(svgInput, {
      framework: 'react',
      typescript: true,
      componentName: 'GeneratedIcon',
    });
    setOutput(result);
  };

  return (
    <div>
      <textarea
        value={svgInput}
        onChange={e => setSvgInput(e.target.value)}
        placeholder="Paste your SVG here..."
      />
      <button onClick={handleConvert}>Convert to React</button>
      <pre>{output}</pre>
    </div>
  );
}
```

### Vue Playground Integration

```vue
<template>
  <div>
    <textarea v-model="svgInput" placeholder="Paste your SVG here..." />
    <button @click="handleConvert">Convert to Vue</button>
    <pre>{{ output }}</pre>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { convertSvg } from 'svgfusion-dom';

const svgInput = ref('');
const output = ref('');

const handleConvert = () => {
  output.value = convertSvg(svgInput.value, {
    framework: 'vue',
    typescript: true,
    componentName: 'GeneratedIcon',
  });
};
</script>
```

## Bundle Information

- **Format**: UMD, ESM, CJS
- **Browser Support**: Modern browsers (ES2020+)
- **Dependencies**: Zero runtime dependencies

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation, live playground, and advanced examples.

## License

MIT © [lolvoid](https://github.com/lolvOid)
