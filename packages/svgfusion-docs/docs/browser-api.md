# Browser API

This document explains how to use SVGFusion in the browser to convert SVG strings to component code without writing files.

## Usage for Development (TypeScript & Imports)

Both `svgfusion/browser` and `svgfusion-dom` are designed for easy development and type-safe usage:

- **TypeScript Support:** All main types (conversion options, results, framework-specific options, etc.) are exported for direct use in your code and IDE.
- **Consistent API:** Both packages export the same API and types, so you can switch between them without changing your code.
- **Import Examples:**

```typescript
// For the main bundle (includes Node.js and browser support)
import {
  convertToReact,
  convertToVue,
  extractColors,
  validateSvg,
  SVGFusionBrowser,
  type BrowserConversionOptions,
  type BrowserConversionResult,
  type ReactGeneratorOptions,
  type VueGeneratorOptions,
} from 'svgfusion/browser';

// For browser-optimized usage (smaller bundle)
import {
  convertSvg,
  extractColors,
  validateSvg,
  type BrowserConversionOptions,
  type BrowserConversionResult,
  type ReactGeneratorOptions,
  type VueGeneratorOptions,
} from 'svgfusion-dom';
```

> **Tip:** Use these type exports for type-safe options, results, and framework-specific settings in your development workflow. Both packages are fully compatible with modern TypeScript tooling and IDEs.

## Available Types

### Core Types

```typescript
// Main interfaces
type BrowserConversionOptions
type BrowserConversionResult
type SVGFusionOptions
type ConversionResult

// Framework-specific
type ReactGeneratorOptions
type VueGeneratorOptions

// Utility functions
formatComponentName, pascalCase, sanitizeComponentName, svgToComponentName

// Classes and functions
SVGFusionBrowser
convertToReact, convertToVue, convertBatch
extractColors, validateSvg
```

### Usage Pattern

```typescript
import {
  convertToReact,
  type BrowserConversionOptions,
  type BrowserConversionResult,
} from 'svgfusion/browser'; // or 'svgfusion-dom'

const options: BrowserConversionOptions = {
  framework: 'react',
  typescript: true,
};
const result: BrowserConversionResult = await convertToReact(
  svgContent,
  options
);
```

## Package Options

SVGFusion provides two approaches for browser usage:

### Option 1: `svgfusion` (Main Package)

The complete toolkit including browser support:

```bash
npm install svgfusion
```

```javascript
import { convertToReact, convertToVue } from 'svgfusion/browser';
```

### Option 2: `svgfusion-dom` (Browser-Optimized)

Dedicated browser package with smaller bundle size:

```bash
npm install svgfusion-dom
```

```javascript
import { convertSvg } from 'svgfusion-dom';
```

> **Recommendation**: Use `svgfusion-dom` for web applications where bundle size matters. Use `svgfusion/browser` when you also need Node.js features in the same project.

## Browser Usage with Main Package (`svgfusion/browser`)

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

## TypeScript Support

Both `svgfusion/browser` and `svgfusion-dom` packages provide comprehensive TypeScript support with shared type definitions.

> **Note**: Both packages use identical TypeScript types since `svgfusion/browser` re-exports everything from `svgfusion-dom`.

## Core Types

### `BrowserConversionOptions`

Main configuration interface for browser conversions:

```typescript
interface BrowserConversionOptions extends SVGFusionOptions {
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
  sfc?: boolean; // Vue only - Single File Component
  scriptSetup?: boolean; // Vue only - <script setup>
  optimize?: boolean;
}
```

### `BrowserConversionResult`

Result interface with browser-specific metadata:

```typescript
interface BrowserConversionResult extends ConversionResult {
  code: string;
  componentName: string;
  filename: string;
  framework: 'react' | 'vue';
  typescript: boolean;
  dependencies: string[];
  metadata: {
    originalColors: string[];
    originalStrokeWidths: string[];
    optimizationApplied: boolean;
    features: string[];
  };
}
```

## Framework-Specific Types

### React Generator Options

```typescript
interface ReactGeneratorOptions extends GeneratorOptions {
  memo?: boolean; // Use React.memo()
  forwardRef?: boolean; // Use forwardRef()
  propTypes?: boolean; // Generate PropTypes
  defaultProps?: boolean; // Generate defaultProps
  namedExport?: boolean; // Export as named export
}
```

### Vue Generator Options

```typescript
interface VueGeneratorOptions extends GeneratorOptions {
  composition?: boolean; // Use Composition API
  scriptSetup?: boolean; // Use <script setup>
  sfc?: boolean; // Single File Component format
  defineComponent?: boolean; // Wrap with defineComponent()
  useDefineOptions?: boolean; // Vue 3.3+ compatibility
}
```

## Core Engine Types

### `SVGFusionOptions`

Base configuration interface:

```typescript
interface SVGFusionOptions {
  framework: 'react' | 'vue';
  transformation?: TransformationOptions;
  generator?: GeneratorOptions;
}
```

### `TransformationOptions`

Controls SVG processing and optimization:

```typescript
interface TransformationOptions {
  optimize?: boolean; // Apply SVGO optimizations
  splitColors?: boolean; // Extract colors as props
  splitStrokeWidths?: boolean; // Extract stroke widths as props
  fixedStrokeWidth?: boolean; // Fix stroke width scaling
  normalizeFillStroke?: boolean; // Normalize fill/stroke attributes
  accessibility?: boolean; // Add accessibility features
  removeComments?: boolean; // Remove SVG comments
  removeDuplicates?: boolean; // Remove duplicate elements
  minifyPaths?: boolean; // Minify path data
}
```

## SVG AST Types

### `SVGElement`

Basic SVG element structure:

```typescript
interface SVGElement {
  tag: string;
  attributes: Record<string, string>;
  children: SVGElement[];
  content?: string;
}
```

### `SVGAst`

Complete SVG document structure:

```typescript
interface SVGAst {
  root: SVGElement;
  viewBox?: string;
  width?: string;
  height?: string;
  namespace?: string;
}
```

## Feature Types

### `ColorMapping`

For color splitting functionality:

```typescript
interface ColorMapping {
  originalColor: string;
  variableName: string;
  type: 'fill' | 'stroke' | 'stop-color';
}
```

### `StrokeWidthMapping`

For stroke width splitting:

```typescript
interface StrokeWidthMapping {
  originalStrokeWidth: string;
  variableName: string;
}
```

### `ParsedColor`

Color extraction data:

```typescript
interface ParsedColor {
  value: string;
  type: 'fill' | 'stroke' | 'stop-color';
  element: SVGElement;
  attribute: string;
}
```

## Validation Types

### `ValidationResult`

SVG validation result:

```typescript
interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
```

## Utility Types

### Type Helpers

```typescript
// Component naming utilities
type ComponentName = string;
type PascalCase<T extends string> = string;
type CamelCase<T extends string> = string;

// Framework discrimination
type FrameworkOptions<T extends 'react' | 'vue'> = T extends 'react'
  ? ReactGeneratorOptions
  : VueGeneratorOptions;

// Result type based on framework
type FrameworkResult<T extends 'react' | 'vue'> = BrowserConversionResult & {
  framework: T;
};
```

## API Type Examples

### svgfusion-dom Usage

```typescript
import {
  convertSvg,
  BrowserConversionOptions,
  BrowserConversionResult,
  ValidationResult,
} from 'svgfusion-dom';

// Type-safe conversion
const options: BrowserConversionOptions = {
  framework: 'react',
  typescript: true,
  splitColors: true,
  memo: true, // Only available for React
};

const result: BrowserConversionResult = await convertSvg(svgContent, options);

// Validation with types
const validation: ValidationResult = validateSvg(svgContent);
```

### svgfusion/browser Usage

```typescript
import {
  convertToReact,
  convertToVue,
  BrowserConversionOptions,
  BrowserConversionResult,
} from 'svgfusion/browser';

// React-specific conversion
const reactOptions: BrowserConversionOptions = {
  framework: 'react',
  typescript: true,
  memo: true,
  forwardRef: true,
};

const reactResult: BrowserConversionResult = await convertToReact(
  svgContent,
  reactOptions
);

// Vue-specific conversion
const vueOptions: BrowserConversionOptions = {
  framework: 'vue',
  typescript: true,
  sfc: true,
  scriptSetup: true,
};

const vueResult: BrowserConversionResult = await convertToVue(
  svgContent,
  vueOptions
);
```

## Importing Types

Both packages export all TypeScript types for external use:

### From `svgfusion-dom`:

```typescript
import type {
  // Main API types
  BrowserConversionOptions,
  BrowserConversionResult,
  SVGFusionOptions,
  ConversionResult,

  // Framework-specific types
  ReactGeneratorOptions,
  VueGeneratorOptions,
  GeneratorOptions,

  // Transformation types
  TransformationOptions,
  TransformationResult,

  // SVG AST types
  SVGElement,
  SVGAst,

  // Feature types
  ColorMapping,
  StrokeWidthMapping,
  ParsedColor,

  // Validation types
  ValidationResult,

  // Utility types
  ComponentName,
  FrameworkType,
} from 'svgfusion-dom';
```

### From `svgfusion/browser`:

```typescript
import type {
  // All types are re-exported from svgfusion-dom
  BrowserConversionOptions,
  BrowserConversionResult,
  SVGFusionOptions,
  ReactGeneratorOptions,
  VueGeneratorOptions,
  TransformationOptions,
  ValidationResult,
  // ... all other types
} from 'svgfusion/browser';
```

## Type Definitions Reference

### Enums and Literal Types

```typescript
// Framework types
type FrameworkType = 'react' | 'vue';

// Color types
type ColorType = 'fill' | 'stroke' | 'stop-color';

// Export types
type ExportType = 'default' | 'named';

// Component casing
type ComponentCasing = 'PascalCase' | 'camelCase' | 'kebab-case';
```

### Advanced Types

```typescript
// Conditional types based on framework
type FrameworkSpecificOptions<T extends FrameworkType> = T extends 'react'
  ? ReactGeneratorOptions
  : T extends 'vue'
    ? VueGeneratorOptions
    : never;

// Result types with framework discrimination
type TypedConversionResult<T extends FrameworkType> =
  BrowserConversionResult & { framework: T };

// Options with framework validation
type ValidatedOptions<T extends FrameworkType> = BrowserConversionOptions & {
  framework: T;
};
```

### Complete Type Exports

```typescript
// All available exports for TypeScript users
export type {
  // Core API
  BrowserConversionOptions,
  BrowserConversionResult,
  SVGFusionOptions,
  ConversionResult,

  // Framework options
  ReactGeneratorOptions,
  VueGeneratorOptions,
  GeneratorOptions,

  // Transformation
  TransformationOptions,
  TransformationResult,

  // SVG structures
  SVGElement,
  SVGAst,
  ParsedSVG,

  // Feature mapping
  ColorMapping,
  StrokeWidthMapping,
  ParsedColor,

  // Validation
  ValidationResult,
  ValidationError,

  // Utilities
  ComponentName,
  FrameworkType,
  ColorType,
  ExportType,
  ComponentCasing,

  // Advanced
  FrameworkSpecificOptions,
  TypedConversionResult,
  ValidatedOptions,
};
```

## Type Usage Examples

### Type-safe Component Creation

```typescript
import type {
  BrowserConversionOptions,
  BrowserConversionResult,
  FrameworkType,
} from 'svgfusion-dom';

// Generic function with type safety
async function createComponent<T extends FrameworkType>(
  svgContent: string,
  framework: T,
  options?: Partial<BrowserConversionOptions>
): Promise<BrowserConversionResult & { framework: T }> {
  const fullOptions: BrowserConversionOptions = {
    framework,
    typescript: true,
    ...options,
  };

  return (await convertSvg(
    svgContent,
    fullOptions
  )) as BrowserConversionResult & { framework: T };
}

// Usage with type inference
const reactComponent = await createComponent(svgContent, 'react', {
  memo: true,
});
const vueComponent = await createComponent(svgContent, 'vue', { sfc: true });
```

### Custom Type Guards

```typescript
import type { ValidationResult, BrowserConversionResult } from 'svgfusion-dom';

// Type guard for validation
function isValidSvg(
  result: ValidationResult
): result is ValidationResult & { valid: true } {
  return result.valid === true;
}

// Type guard for framework
function isReactResult(
  result: BrowserConversionResult
): result is BrowserConversionResult & { framework: 'react' } {
  return result.framework === 'react';
}

function isVueResult(
  result: BrowserConversionResult
): result is BrowserConversionResult & { framework: 'vue' } {
  return result.framework === 'vue';
}
```

### Advanced Type Patterns

```typescript
import type {
  BrowserConversionOptions,
  ReactGeneratorOptions,
  VueGeneratorOptions,
} from 'svgfusion-dom';

// Discriminated union for framework-specific options
type FrameworkOptions =
  | (BrowserConversionOptions & { framework: 'react' } & ReactGeneratorOptions)
  | (BrowserConversionOptions & { framework: 'vue' } & VueGeneratorOptions);

// Helper type for extracting framework from options
type ExtractFramework<T> = T extends { framework: infer F } ? F : never;

// Utility type for framework-specific results
type ResultForFramework<T extends FrameworkOptions> =
  BrowserConversionResult & { framework: ExtractFramework<T> };
```

## Type Safety Features

1. **Framework Discrimination**: TypeScript ensures React-only options (like `memo`) aren't used with Vue
2. **Optional Configuration**: All options have sensible defaults with optional typing
3. **Rich Metadata**: Detailed transformation tracking with type safety
4. **Utility Function Types**: Full TypeScript support for helper functions
5. **Validation Types**: Structured error reporting with proper typing
6. **Generic Type Support**: Advanced TypeScript patterns for complex use cases
7. **Type Guards**: Runtime type checking with TypeScript integration

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

## Browser Usage with Dedicated Package (`svgfusion-dom`)

The `svgfusion-dom` package provides a streamlined API optimized for browser usage:

### Basic Usage

```javascript
import { convertSvg } from 'svgfusion-dom';

const svgContent = `<svg viewBox="0 0 24 24"><path d="M12 2l10 5v10l-10 5L2 17V7z" fill="#3B82F6"/></svg>`;

// Convert to React component
const reactResult = await convertSvg(svgContent, {
  framework: 'react',
  componentName: 'MyIcon',
  typescript: true,
  splitColors: true,
});

console.log(reactResult); // Generated React component code as string

// Convert to Vue component
const vueResult = await convertSvg(svgContent, {
  framework: 'vue',
  componentName: 'MyIcon',
  typescript: true,
  sfc: true,
  scriptSetup: true,
  splitColors: true,
});

console.log(vueResult); // Generated Vue component code as string
```

### Advanced Features

```javascript
import {
  convertSvg,
  extractColors,
  validateSvg,
  convertBatch,
} from 'svgfusion-dom';

// Extract colors from SVG
const colors = extractColors(svgContent);
console.log(colors); // ['#3B82F6', '#1E40AF', ...]

// Validate SVG content
const validation = validateSvg(svgContent);
console.log(validation); // { valid: true, errors: [] }

// Batch conversion
const svgContents = [
  { content: '<svg>...</svg>', name: 'IconHome' },
  { content: '<svg>...</svg>', name: 'IconUser' },
];

const results = await convertBatch(svgContents, {
  framework: 'react',
  typescript: true,
  splitColors: true,
});
```

### CDN Usage

Both packages support CDN usage:

#### Main Package

```html
<script type="module">
  import {
    convertToReact,
    convertToVue,
  } from 'https://cdn.skypack.dev/svgfusion/browser';

  // Your code here
</script>
```

#### Dedicated Package

```html
<script type="module">
  import { convertSvg } from 'https://cdn.skypack.dev/svgfusion-dom';

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
