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
  // 🚀 Advanced Features
  splitColors?: boolean     // Extract individual color props (default: false)
  isFixedStrokeWidth?: boolean // Add fixed stroke width support (default: false)
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
  colors?: string[]; // Extracted colors (when splitColors is enabled)
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

#### Advanced Example with Split Colors

```typescript
import { convertToReact } from 'svgfusion';

const colorfulSvg = `
<svg viewBox="0 0 24 24">
  <path fill="#FF0000" stroke="#00FF00" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  <circle fill="#0000FF" cx="12" cy="12" r="2"/>
  <linearGradient id="grad">
    <stop offset="0%" stop-color="#FFFF00"/>
    <stop offset="100%" stop-color="#FF00FF"/>
  </linearGradient>
</svg>
`;

const result = await convertToReact(colorfulSvg, {
  name: 'MultiColorIcon',
  splitColors: true,
  isFixedStrokeWidth: true,
  typescript: true,
});

console.log(result.colors);
// ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']

console.log(result.code);
// Generated component includes props:
// - fillColor1, fillColor2 (for fill colors)
// - strokeColor1 (for stroke colors)
// - gradientColor1, gradientColor2 (for gradient colors)
// - fillColor1Class, strokeColor1Class, etc. (for CSS classes)
// - isFixedStrokeWidth (for non-scaling stroke)
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
  // 🚀 Advanced Features
  splitColors?: boolean; // Extract individual color props (default: false)
  isFixedStrokeWidth?: boolean; // Add fixed stroke width support (default: false)
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

## Batch Processing

### BatchConverter

Process multiple SVG files in batch operations with automatic duplicate detection.

```typescript
import { BatchConverter } from 'svgfusion';

const batchConverter = new BatchConverter();
```

#### convertBatch

```typescript
async function convertBatch(
  options: BatchConversionOptions
): Promise<BatchConversionResult>;
```

**Options:**

```typescript
interface BatchConversionOptions {
  inputDir: string; // Input directory path
  outputDir: string; // Output directory path
  framework?: 'react' | 'vue'; // Target framework (default: 'react')
  recursive?: boolean; // Recursively scan directories (default: false)
  extensions?: string[]; // File extensions to process (default: ['.svg'])
  generateIndex?: boolean; // Generate index file (default: false)
  indexFormat?: 'ts' | 'js'; // Index file format (default: 'ts')
  exportType?: 'named' | 'default'; // Export type (default: 'named')
  prefix?: string; // Add prefix to component names
  suffix?: string; // Add suffix to component names
  typescript?: boolean; // Generate TypeScript components (default: true)
  // 🚀 Advanced Features
  splitColors?: boolean; // Extract individual color props (default: false)
  isFixedStrokeWidth?: boolean; // Add fixed stroke width support (default: false)
  // All other conversion options from convertToReact/convertToVue
}
```

**Returns:**

```typescript
interface BatchConversionResult {
  results: ConversionResult[]; // Successfully converted files
  errors: ConversionError[]; // Failed conversions
  summary: {
    total: number; // Total files processed
    successful: number; // Successfully converted
    failed: number; // Failed conversions
  };
}
```

#### Example

```typescript
import { BatchConverter } from 'svgfusion';

const batchConverter = new BatchConverter();

try {
  const result = await batchConverter.convertBatch({
    inputDir: './icons',
    outputDir: './components',
    framework: 'react',
    recursive: true,
    generateIndex: true,
    splitColors: true,
    isFixedStrokeWidth: true,
    prefix: 'Icon',
    suffix: 'Component',
    typescript: true,
  });

  console.log(`✅ Successfully converted ${result.summary.successful} files`);
  console.log(`❌ Failed to convert ${result.summary.failed} files`);

  // Get component names
  const componentNames = batchConverter.getComponentNames(result);
  console.log('Generated components:', componentNames);
} catch (error) {
  if (error.message.includes('Duplicate component names')) {
    console.error('❌ Duplicate component names detected!');
    console.error(error.message);
  } else {
    console.error('❌ Batch conversion failed:', error.message);
  }
}
```

#### Duplicate Detection

The BatchConverter automatically validates for duplicate component names and throws an error if conflicts are detected:

```typescript
// These files would generate the same component name "Icon"
// ./icons/icon.svg
// ./assets/icon.svg

try {
  await batchConverter.convertBatch({
    inputDir: './icons',
    outputDir: './components',
  });
} catch (error) {
  console.error(error.message);
  // Error: Duplicate component names detected:
  // Component name "Icon" conflicts:
  //   - ./icons/icon.svg
  //   - ./assets/icon.svg
}
```

#### Helper Methods

```typescript
// Get component names from batch results
const componentNames = batchConverter.getComponentNames(result);

// Generate detailed summary report
const report = batchConverter.generateSummaryReport(result);
console.log(report);
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

### Color Extraction Utilities

#### extractColors

Extract color information from SVG content for split colors feature.

```typescript
function extractColors(svgContent: string): ColorInfo;
```

**Returns:**

```typescript
interface ColorInfo {
  colors: string[]; // All unique colors
  colorMap: Map<string, string>; // Color to prop name mapping
  fillColors: string[]; // Fill colors only
  strokeColors: string[]; // Stroke colors only
  gradientColors: string[]; // Gradient colors only
  fillColorMap: Map<string, string>; // Fill color mappings
  strokeColorMap: Map<string, string>; // Stroke color mappings
  gradientColorMap: Map<string, string>; // Gradient color mappings
}
```

#### replaceColorsWithProps

Replace colors in SVG content with framework-specific prop references.

```typescript
function replaceColorsWithProps(
  svgContent: string,
  colorInfo: ColorInfo,
  framework: 'react' | 'vue'
): string;
```

#### Example

```typescript
import { extractColors, replaceColorsWithProps } from 'svgfusion';

const svgContent = `<svg><path fill="#FF0000" stroke="#00FF00" /></svg>`;
const colorInfo = extractColors(svgContent);

console.log(colorInfo.fillColors); // ['#FF0000']
console.log(colorInfo.strokeColors); // ['#00FF00']

// Replace with React props
const reactSvg = replaceColorsWithProps(svgContent, colorInfo, 'react');
// Result: <path fill={fillColor1} className={fillColor1Class} stroke={strokeColor1} className={strokeColor1Class} />

// Replace with Vue props
const vueSvg = replaceColorsWithProps(svgContent, colorInfo, 'vue');
// Result: <path :fill="fillColor1" :class="fillColor1Class" :stroke="strokeColor1" :class="strokeColor1Class" />
```

#### Duplicate Name Validation

Validate for duplicate component names in batch processing.

```typescript
import { validateDuplicateNames, formatDuplicateErrors } from 'svgfusion';

const files = ['./icons/icon.svg', './assets/icon.svg'];
const result = validateDuplicateNames(files, { prefix: 'Icon' });

if (result.hasDuplicates) {
  const errorMessage = formatDuplicateErrors(result);
  console.error(errorMessage);
}
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
  colors?: string[]; // Extracted colors (when splitColors is enabled)
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
  // 🚀 Advanced Features
  splitColors?: boolean;
  isFixedStrokeWidth?: boolean;
  // Accessibility
  ariaLabelledBy?: boolean;
  ariaHidden?: boolean;
  role?: string;
  // Additional options
  icon?: boolean;
  dimensions?: boolean;
  nativeProps?: boolean;
  replaceAttrValues?: Record<string, string>;
  svgProps?: Record<string, string>;
  expandProps?: boolean | 'start' | 'end';
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
  // 🚀 Advanced Features
  splitColors?: boolean;
  isFixedStrokeWidth?: boolean;
  // Additional options
  props?: boolean;
  dimensions?: boolean;
  replaceAttrValues?: Record<string, string>;
}
```

### BatchConversionOptions

```typescript
interface BatchConversionOptions {
  inputDir: string;
  outputDir: string;
  framework?: 'react' | 'vue';
  recursive?: boolean;
  extensions?: string[];
  generateIndex?: boolean;
  indexFormat?: 'ts' | 'js';
  exportType?: 'named' | 'default';
  prefix?: string;
  suffix?: string;
  typescript?: boolean;
  // 🚀 Advanced Features
  splitColors?: boolean;
  isFixedStrokeWidth?: boolean;
  // All other conversion options
}
```

### ColorInfo

```typescript
interface ColorInfo {
  colors: string[];
  colorMap: Map<string, string>;
  fillColors: string[];
  strokeColors: string[];
  gradientColors: string[];
  fillColorMap: Map<string, string>;
  strokeColorMap: Map<string, string>;
  gradientColorMap: Map<string, string>;
}
```

### DuplicateValidationResult

```typescript
interface DuplicateValidationResult {
  hasDuplicates: boolean;
  duplicates: DuplicateNameInfo[];
  totalFiles: number;
  uniqueNames: number;
}

interface DuplicateNameInfo {
  componentName: string;
  files: string[];
  count: number;
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
