# API Reference

Use SVGFusion in your Node.js applications to convert SVG files into React and Vue components. Works great with complex SVGs, gradients, and Figma exports.

## Installation

```bash
npm install svgfusion
```

## Functions

### convertToReact

Turn your SVG into a React component with TypeScript support.

```typescript
function convertToReact(
  svgContent: string,
  options?: ReactConversionOptions
): Promise<ConversionResult>;
```

**Parameters:**

- `svgContent` - Your SVG as a string
- `options` - How you want the component generated (optional)

**Options:**

```typescript
{
  name?: string              // Component name like "StarIcon"
  prefix?: string            // Add prefix like "Icon" → "IconStar"
  suffix?: string            // Add suffix like "Star" → "StarIcon"
  optimize?: boolean         // Clean up SVG (default: true)
  typescript?: boolean       // Generate .tsx file (default: true)
  memo?: boolean            // Wrap with React.memo (default: true)
  ref?: boolean             // Add ref support (default: true)
  titleProp?: boolean       // Add title prop (default: true)
  descProp?: boolean        // Add description prop (default: true)
  icon?: boolean            // Optimize for icons (default: true)
  dimensions?: boolean      // Keep width/height (default: false)
  nativeProps?: boolean     // Support width, height, style props (default: true)
  replaceAttrValues?: {...} // Replace colors like { "#000": "currentColor" }
  svgProps?: {...}          // Add extra props to <svg>
  expandProps?: boolean     // Where to put ...props
  // Accessibility (WCAG compliant)
  ariaLabelledBy?: boolean  // Link title/desc with aria-labelledby (default: true)
  ariaHidden?: boolean      // Hide decorative SVGs from screen readers
  role?: string             // ARIA role: 'img', 'graphics-symbol', etc (default: 'img')
}
```

#### Returns

```typescript
interface ConversionResult {
  code: string; // Generated component code
  filename: string; // Suggested filename
  componentName: string; // Component name
}
```

#### Example

```typescript
import { convertToReact } from 'svgfusion';

const svgContent = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
`;

const result = await convertToReact(svgContent, {
  name: 'StarIcon',
  typescript: true,
  memo: true,
  nativeProps: true, // Enables width, height, style props
  replaceAttrValues: { '#000': 'currentColor' },
});

console.log(result.code);
// Generated component accepts: width, height, style, className, ref, title, desc
// Includes WCAG-compliant accessibility: role="img", aria-labelledby, title/desc support
```

### convertToVue

Convert SVG content to Vue 3 component.

```typescript
function convertToVue(
  svgContent: string,
  options?: VueConversionOptions
): ConversionResult;
```

#### Parameters

- `svgContent` (string): The SVG content to convert
- `options` (VueConversionOptions, optional): Conversion options

#### Options

```typescript
interface VueConversionOptions {
  name?: string; // Component name (default: "icon")
  prefix?: string; // Component name prefix
  suffix?: string; // Component name suffix
  optimize?: boolean; // Enable SVG optimization (default: true)
  typescript?: boolean; // Generate TypeScript (default: true)
  compositionApi?: boolean; // Use Composition API (default: true)
  scriptSetup?: boolean; // Use script setup (default: true)
}
```

#### Returns

Same as `convertToReact` - returns a `ConversionResult` object.

#### Example

```typescript
import { convertToVue } from 'svgfusion';

const svgContent = `
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
</svg>
`;

const result = convertToVue(svgContent, {
  name: 'StarIcon',
  typescript: true,
  scriptSetup: true,
});

console.log(result.code);
```

## Utility Functions

### optimizeSvg

Optimize SVG content using SVGO.

```typescript
function optimizeSvg(svgContent: string, config?: OptimizeOptions): string;
```

#### Parameters

- `svgContent` (string): The SVG content to optimize
- `config` (OptimizeOptions, optional): SVGO configuration

#### Example

```typescript
import { optimizeSvg } from 'svgfusion';

const svgContent = `<svg>...</svg>`;
const optimized = optimizeSvg(svgContent);
```

### File Utilities

#### readSvgFile

Read SVG file from filesystem.

```typescript
function readSvgFile(filePath: string): Promise<string>;
```

#### readSvgDirectory

Read all SVG files from directory.

```typescript
function readSvgDirectory(
  dirPath: string,
  recursive?: boolean
): Promise<string[]>;
```

#### writeComponentFile

Write component code to file.

```typescript
function writeComponentFile(filePath: string, content: string): Promise<void>;
```

## Types

### ConversionResult

```typescript
interface ConversionResult {
  code: string; // Generated component code
  filename: string; // Suggested filename
  componentName: string; // Component name
}
```

### ReactConversionOptions

```typescript
interface ReactConversionOptions {
  name?: string;
  prefix?: string;
  suffix?: string;
  optimize?: boolean;
  typescript?: boolean;
  memo?: boolean;
  ref?: boolean;
  titleProp?: boolean;
  descProp?: boolean;
}
```

### VueConversionOptions

```typescript
interface VueConversionOptions {
  name?: string;
  prefix?: string;
  suffix?: string;
  optimize?: boolean;
  typescript?: boolean;
  compositionApi?: boolean;
  scriptSetup?: boolean;
}
```

## Error Handling

All functions may throw errors. Always wrap calls in try-catch blocks:

```typescript
try {
  const result = await convertToReact(svgContent);
  console.log(result.code);
} catch (error) {
  console.error('Conversion failed:', error.message);
}
```

## Integration Examples

### Build Script

```typescript
import {
  readSvgDirectory,
  convertToReact,
  writeComponentFile,
} from 'svgfusion';
import { join } from 'path';

async function buildComponents() {
  const svgFiles = await readSvgDirectory('./icons');

  for (const filePath of svgFiles) {
    const svgContent = await readSvgFile(filePath);
    const result = await convertToReact(svgContent, {
      typescript: true,
      name: getBasename(filePath),
    });

    await writeComponentFile(
      join('./src/components', result.filename),
      result.code
    );
  }
}
```

### Webpack Loader

```javascript
module.exports = function (source) {
  const callback = this.async();

  convertToReact(source, {
    typescript: true,
    name: getComponentName(this.resourcePath),
  })
    .then(result => {
      callback(null, result.code);
    })
    .catch(callback);
};
```
