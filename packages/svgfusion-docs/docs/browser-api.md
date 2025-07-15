# Browser API

This document explains how to use SVGFusion in the browser to convert SVG strings to component code without writing files.

## Installation

```bash
npm install svgfusion
```

## Browser Usage

### Basic Usage

```javascript
import { convertToReact, convertToVue, extractColors } from 'svgfusion/browser';

// Convert to React component
const svgContent = `<svg viewBox="0 0 24 24"><path d="M12 2l10 5v10l-10 5L2 17V7z" fill="#3B82F6"/></svg>`;

const reactResult = await convertToReact(svgContent, {
  componentName: 'MyIcon',
  prefix: 'UI',
  suffix: 'Component',
  typescript: true,
  splitColors: true,
  memo: true,
});

console.log(reactResult.code);
// Generated React component code as string

// Convert to Vue component
const vueResult = await convertToVue(svgContent, {
  componentName: 'MyIcon',
  prefix: 'My',
  suffix: 'Widget',
  typescript: true,
  sfc: true,
  scriptSetup: true,
});

console.log(vueResult.code);
// Generated Vue component code as string

// Note: The library automatically adds hyphen separators
// 'UI' + 'MyIcon' + 'Component' becomes 'UI-MyIcon-Component' then 'UIMyIconComponent'
```

### Advanced Usage with SVGFusionBrowser Class

```javascript
import { SVGFusionBrowser } from 'svgfusion/browser';

const browser = new SVGFusionBrowser();

// Convert single SVG
const result = await browser.convert(svgContent, {
  framework: 'react',
  typescript: true,
  componentName: 'MyIcon',
  splitColors: true,
  fixedStrokeWidth: true,
  memo: true,
  forwardRef: true,
});

// Extract colors from SVG
const colors = browser.extractColors(svgContent);
console.log(colors); // ['#3B82F6', '#1E40AF', ...]

// Validate SVG
const validation = browser.validate(svgContent);
console.log(validation); // { valid: true, errors: [] }
```

### Batch Conversion

```javascript
import { convertBatch } from 'svgfusion/browser';

const svgContents = [
  { content: '<svg>...</svg>', name: 'IconHome' },
  { content: '<svg>...</svg>', name: 'IconUser' },
  { content: '<svg>...</svg>', name: 'IconStar' },
];

const results = await convertBatch(svgContents, {
  framework: 'react',
  typescript: true,
  splitColors: true,
});

results.forEach(result => {
  console.log(`${result.componentName}: ${result.code}`);
});
```

### Generate Index Files

```javascript
import { SVGFusionBrowser } from 'svgfusion/browser';

const browser = new SVGFusionBrowser();

// Convert multiple SVGs
const results = await browser.convertBatch(svgContents, options);

// Generate index file content
const indexContent = browser.generateIndexFile(results, {
  exportType: 'named', // or 'default'
  typescript: true,
});

console.log(indexContent);
// Generated index.ts content for tree-shaking
```

## API Reference

### `convertToReact(svgContent, options)`

Converts SVG to React component string.

**Parameters:**

- `svgContent` (string): SVG content to convert
- `options` (BrowserConversionOptions): Conversion options

**Returns:** `Promise<BrowserConversionResult>`

### `convertToVue(svgContent, options)`

Converts SVG to Vue component string.

**Parameters:**

- `svgContent` (string): SVG content to convert
- `options` (BrowserConversionOptions): Conversion options

**Returns:** `Promise<BrowserConversionResult>`

### `convertBatch(svgContents, options)`

Converts multiple SVGs to components.

**Parameters:**

- `svgContents` (Array): Array of `{ content: string, name: string }`
- `options` (BrowserConversionOptions): Conversion options

**Returns:** `Promise<BrowserConversionResult[]>`

### `extractColors(svgContent)`

Extracts unique colors from SVG.

**Parameters:**

- `svgContent` (string): SVG content to analyze

**Returns:** `string[]` - Array of color values

### `validateSvg(svgContent)`

Validates SVG content.

**Parameters:**

- `svgContent` (string): SVG content to validate

**Returns:** `{ valid: boolean, errors: string[] }`

## Types

### `BrowserConversionOptions`

```typescript
interface BrowserConversionOptions {
  framework: 'react' | 'vue';
  typescript?: boolean;
  componentName?: string;
  splitColors?: boolean;
  fixedStrokeWidth?: boolean;
  memo?: boolean; // React only
  forwardRef?: boolean; // React only
  sfc?: boolean; // Vue only
  scriptSetup?: boolean; // Vue only
  optimize?: boolean;
}
```

### `BrowserConversionResult`

```typescript
interface BrowserConversionResult {
  code: string;
  componentName: string;
  filename: string;
  framework: 'react' | 'vue';
  typescript: boolean;
  metadata: {
    originalColors: string[];
    optimizationApplied: boolean;
    features: string[];
  };
  dependencies: string[];
}
```

## Usage Examples

### React Component Generation

```javascript
const svgContent = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
  <path d="M12 8L8 10V14L12 16L16 14V10L12 8Z" fill="#EF4444" stroke="#DC2626" stroke-width="1"/>
</svg>
`;

const result = await convertToReact(svgContent, {
  componentName: 'DiamondIcon',
  typescript: true,
  splitColors: true,
  memo: true,
  forwardRef: true,
});

// result.code contains:
// import React, { Ref, forwardRef, memo } from 'react';
// import * as React from 'react';
//
// interface DiamondIconProps extends React.SVGProps<SVGSVGElement> {
//   title?: string;
//   titleId?: string;
//   desc?: string;
//   descId?: string;
//   size?: string;
//   color?: string;
//   colorClass?: string;
//   color2?: string;
//   color2Class?: string;
//   color3?: string;
//   color3Class?: string;
//   color4?: string;
//   color4Class?: string;
// }
//
// const DiamondIcon = (props: DiamondIconProps, ref: Ref<SVGSVGElement>) => {
//   // Component implementation...
// };
//
// const ForwardRef = forwardRef(DiamondIcon);
// const Memo = memo(ForwardRef);
// export default Memo;
```

### Vue Component Generation

```javascript
const result = await convertToVue(svgContent, {
  componentName: 'DiamondIcon',
  typescript: true,
  sfc: true,
  scriptSetup: true,
  splitColors: true,
});

// result.code contains:
// <template>
//   <svg
//     viewBox="0 0 24 24"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     :width="size"
//     :height="size"
//     v-bind="$attrs"
//   >
//     <title v-if="title" :id="titleId">{{ title }}</title>
//     <desc v-if="desc" :id="descId">{{ desc }}</desc>
//     <!-- SVG content with dynamic colors -->
//   </svg>
// </template>
//
// <script setup lang="ts">
// import type { SVGAttributes } from 'vue';
//
// interface Props extends SVGAttributes {
//   title?: string;
//   titleId?: string;
//   desc?: string;
//   descId?: string;
//   size?: string;
//   color?: string;
//   colorClass?: string;
//   // ... other color props
// }
//
// const props = withDefaults(defineProps<Props>(), {
//   size: '24',
//   color: '#3B82F6',
//   // ... other defaults
// });
// </script>
```

## Browser Compatibility

The browser version of SVGFusion works in all modern browsers that support:

- ES2020 features
- Promise/async-await
- ES modules

## CDN Usage

You can also use SVGFusion directly from a CDN:

```html
<script type="module">
  import {
    convertToReact,
    convertToVue,
  } from 'https://cdn.skypack.dev/svgfusion/browser';

  // Your code here
</script>
```

## Differences from Node.js Version

The browser version:

- Returns component code as strings instead of writing files
- Supports all conversion features (color splitting, stroke fixing, etc.)
- Includes validation and color extraction
- Supports batch conversion
- Can generate index file content
- Cannot read from or write to the filesystem
- Does not include CLI functionality
- Cannot process entire directories

For file-based operations, use the Node.js version of SVGFusion.
