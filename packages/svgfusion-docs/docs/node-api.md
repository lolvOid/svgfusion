# Node API

SVGFusion provides a simple Node API for converting SVG files into React and Vue components.

## Installation

```bash
npm install svgfusion
```

## SVGFusion Engine

The main class for converting SVG content to components.

### Basic Usage

```typescript
import { SVGFusion } from 'svgfusion';

const fusion = new SVGFusion();
const svgContent = `<svg viewBox="0 0 24 24"><path fill="#FF0000" d="..."/></svg>`;

const result = await fusion.convert(svgContent, {
  framework: 'react', // or 'vue'
  transformation: {
    splitColors: true,
  },
  generator: {
    componentName: 'MyIcon',
    typescript: true,
  },
});

console.log(result.code);
```

### Options

#### Framework Options

- `framework`: Target framework ('react' | 'vue')

#### Transformation Options

- `transformation.splitColors`: Extract color props from SVG
- `transformation.splitStrokeWidths`: Extract stroke width props
- `transformation.fixedStrokeWidth`: Add non-scaling stroke support
- `transformation.normalizeFillStroke`: Normalize fill/stroke attributes
- `transformation.accessibility`: Add accessibility features (default: true)
- `transformation.optimize`: Apply SVG optimizations (default: true)
- `transformation.removeComments`: Remove XML comments (default: true)
- `transformation.removeDuplicates`: Remove duplicate elements (default: true)
- `transformation.minifyPaths`: Minify path data (default: false)

#### Generator Options

- `generator.componentName`: Component name
- `generator.typescript`: Generate TypeScript (default: true)

### Color Splitting

Extracts SVG colors as component props with smart attribute handling:

- Paths with fill only → adds stroke="none"
- Paths with stroke only → adds fill="none"
- Paths with both → keeps both as props

### CLI Usage

```bash
npx svgfusion ./icons --output ./components --split-colors
```

## Examples

### React Component

```typescript
import { SVGFusion } from 'svgfusion';

const svgContent = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

const engine = new SVGFusion();
const result = await engine.convert(svgContent, {
  framework: 'react',
  generator: { componentName: 'StarIcon', typescript: true },
});

console.log(result.code);
```

### Vue Component

```typescript
const result = await engine.convert(svgContent, {
  framework: 'vue',
  generator: { componentName: 'StarIcon' },
});
```

### Color Splitting

```typescript
const colorfulSvg = `<svg viewBox="0 0 24 24"><path fill="#FF0000" stroke="#00FF00" d="..."/></svg>`;

const result = await engine.convert(colorfulSvg, {
  framework: 'react',
  transformation: { splitColors: true },
  generator: { componentName: 'MultiColorIcon' },
});

console.log(result.metadata.originalColors); // ['#ff0000', '#00ff00']
```

## Convenience Functions

### convertToReact

```typescript
import { convertToReact } from 'svgfusion';

const result = await convertToReact(svgContent, {
  name: 'StarIcon',
  splitColors: true,
  typescript: true,
});
```

### convertToVue

```typescript
import { convertToVue } from 'svgfusion';

const result = await convertToVue(svgContent, {
  name: 'StarIcon',
  prefix: 'My',
  suffix: 'Icon',
  splitColors: true,
});
```

Both convenience functions now support automatic hyphen separators when using prefix/suffix combinations, generating component names like `UI-Star-Component` that are converted to proper PascalCase (e.g., `UIStarComponent`).

## Component Naming

SVGFusion provides enhanced component naming capabilities with prefix/suffix support and automatic hyphen separators.

### svgToComponentName

```typescript
import { svgToComponentName } from 'svgfusion';

// Basic usage
const componentName = svgToComponentName('star-icon.svg');
// Result: 'StarIcon'

// With prefix and suffix
const componentName = svgToComponentName('star.svg', 'UI', 'Component');
// Result: 'UIStarComponent' (automatic hyphen separators: UI-Star-Component → UIStarComponent)
```

### formatComponentName

```typescript
import { formatComponentName } from 'svgfusion';

const formattedName = formatComponentName('Star', 'UI', 'Icon');
// Result: 'UIStarIcon'
```

### Enhanced PascalCase Conversion

The library includes enhanced PascalCase conversion that properly handles:

- Number boundaries (e.g., 'Button2xl' → 'Button2Xl')
- Complex filenames with metadata
- Leading numbers and symbols (automatically removed)
- Proper camelCase to PascalCase conversion

## Utility Functions

### File Operations

```typescript
import { readSvgFile, readSvgDirectory, writeComponentFile } from 'svgfusion';

// Read single SVG file
const svgContent = await readSvgFile('./icon.svg');

// Read all SVG files from directory
const svgFiles = await readSvgDirectory('./icons', true); // recursive

// Write component to file
await writeComponentFile('./components/Icon.tsx', componentCode);
```

### Index File Generation

```typescript
import { generateIndexFile } from 'svgfusion';

// Generate index file for components
const indexContent = generateIndexFile(
  [
    { componentName: 'IconStar', filename: 'IconStar.tsx' },
    { componentName: 'IconUser', filename: 'IconUser.tsx' },
  ],
  {
    typescript: true,
    exportType: 'named',
  }
);
```

### SVG Optimization

```typescript
import { optimizeSvg, createSvgoConfig } from 'svgfusion';

// Optimize SVG with default settings
const optimized = optimizeSvg(svgContent);

// Optimize with custom config
const config = createSvgoConfig({ removeViewBox: false });
const optimized = optimizeSvg(svgContent, config);
```

### Color Extraction

```typescript
import { extractColors } from 'svgfusion';

const svgContent = `<svg><path fill="#FF0000" stroke="#00FF00" /></svg>`;
const colors = extractColors(svgContent);
console.log(colors); // ['#ff0000', '#00ff00']
```

## Types

### ConversionResult

```typescript
interface ConversionResult {
  code: string;
  filename: string;
  componentName: string;
  metadata: {
    originalColors?: string[];
    framework: 'react' | 'vue';
  };
}
```

### SVGFusionOptions

```typescript
interface SVGFusionOptions {
  framework: 'react' | 'vue';
  transformation?: {
    splitColors?: boolean;
    fixedStrokeWidth?: boolean;
  };
  generator?: {
    componentName?: string;
    typescript?: boolean;
    memo?: boolean; // React only
    forwardRef?: boolean; // React only
    scriptSetup?: boolean; // Vue only
  };
}
```

## Error Handling

Wrap calls in try-catch blocks:

```typescript
try {
  const result = await engine.convert(svgContent, options);
  console.log(result.code);
} catch (error) {
  console.error('Conversion failed:', error.message);
}
```
