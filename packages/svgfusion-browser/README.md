<div align="center">
  <img src="https://i.ibb.co/TZFfpFL/logo.png" alt="SVGFusion Logo" width="120" height="120">

# SVGFusion Browser

🌐 Browser-optimized package for converting SVG files into React and Vue 3 components with TypeScript support and native SVG props inheritance.

</div>

## Installation

```bash
npm install svgfusion-browser
# or
yarn add svgfusion-browser
# or
pnpm add svgfusion-browser
```

## CDN Usage

```html
<script src="https://unpkg.com/svgfusion-browser@latest/dist/index.umd.js"></script>
```

## Quick Start

```javascript
import { convertSvg } from 'svgfusion-browser';

// Convert SVG to React component
const svgContent = `<svg viewBox="0 0 24 24">...</svg>`;
const reactComponent = convertSvg(svgContent, {
  framework: 'react',
  typescript: true,
});

console.log(reactComponent); // Generated component code
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
import { convertSvg, SvgFusionOptions } from 'svgfusion-browser';

const options = {
  framework: 'react', // or 'vue'
  typescript: true,
  componentName: 'MyIcon',
  template: 'functional',
};

const svgContent = `
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3l8 8v10h-6v-6H10v6H4V11l8-8z" />
  </svg>
`;

const componentCode = convertSvg(svgContent, options);
```

### React Component Generation

```javascript
const reactOptions = {
  framework: 'react',
  typescript: true,
  componentName: 'HomeIcon',
  template: 'functional',
  propsInterface: true,
};

const reactComponent = convertSvg(svgContent, reactOptions);
// Returns: Complete React component with TypeScript interfaces
```

### Vue Component Generation

```javascript
const vueOptions = {
  framework: 'vue',
  typescript: true,
  componentName: 'HomeIcon',
  template: 'composition',
  scriptSetup: true,
};

const vueComponent = convertSvg(svgContent, vueOptions);
// Returns: Complete Vue 3 component with Composition API
```

### Batch Conversion

```javascript
import { convertMultiple } from 'svgfusion-browser';

const svgFiles = [
  { name: 'home', content: '<svg>...</svg>' },
  { name: 'user', content: '<svg>...</svg>' },
  { name: 'settings', content: '<svg>...</svg>' },
];

const components = convertMultiple(svgFiles, {
  framework: 'react',
  typescript: true,
});

// Returns: Array of generated components
```

## API Reference

### `convertSvg(svgContent, options)`

Converts a single SVG string to a component.

**Parameters:**

- `svgContent` (string): The SVG content to convert
- `options` (SvgFusionOptions): Conversion options

**Returns:** String containing the generated component code

### `convertMultiple(svgFiles, options)`

Converts multiple SVG files to components.

**Parameters:**

- `svgFiles` (Array): Array of `{ name, content }` objects
- `options` (SvgFusionOptions): Conversion options

**Returns:** Array of generated component objects

### Options Interface

```typescript
interface SvgFusionOptions {
  framework: 'react' | 'vue';
  typescript?: boolean;
  componentName?: string;
  template?: 'functional' | 'class' | 'composition';
  propsInterface?: boolean;
  scriptSetup?: boolean; // Vue 3 only
  naming?: 'PascalCase' | 'camelCase' | 'kebab-case';
  transforms?: {
    removeIds?: boolean;
    addDisplayName?: boolean;
    optimizePaths?: boolean;
  };
}
```

## Browser Integration Examples

### Online Code Editor

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/svgfusion-browser@latest/dist/index.umd.js"></script>
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
import { convertSvg } from 'svgfusion-browser';
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
import { convertSvg } from 'svgfusion-browser';

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

- **Size**: ~15KB gzipped
- **Format**: UMD, ESM, CJS
- **Browser Support**: Modern browsers (ES2020+)
- **Dependencies**: Zero runtime dependencies

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation, live playground, and advanced examples.

## License

MIT © [lolvoid](https://github.com/lolvOid)
