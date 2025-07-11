<div align="center">
  <img src="https://i.ibb.co/TZFfpFL/logo.png" alt="SVGFusion Logo" width="120" height="120">

# SVGFusion

**Transform SVG files into production-ready React and Vue 3 components**

A powerful Node.js CLI tool and library that converts SVG files into optimized React and Vue components with complex SVG support, TypeScript integration, and smart optimization for modern development workflows.

[![npm version](https://img.shields.io/npm/v/svgfusion)](https://www.npmjs.com/package/svgfusion)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)

[📚 Documentation](https://svgfusion.netlify.app) • [⚡ CLI Reference](https://svgfusion.netlify.app/docs/cli-usage) • [📦 NPM](https://www.npmjs.com/package/svgfusion)

</div>

## Features

- **Dual Framework Support**: Generate both React and Vue 3 components from the same SVG
- **Complex SVG Support**: Handles gradients, masks, filters, patterns, and Figma exports
- **ID Collision Prevention**: Automatic unique ID generation for complex SVGs
- **Optimized Output**: Built-in SVGO optimization with customizable settings
- **Icon Builder Ready**: Perfect for design systems and icon libraries
- **TypeScript Ready**: Full TypeScript support with proper type definitions
- **Flexible API**: Both CLI and programmatic usage
- **Batch Processing**: Convert entire directories of SVG files
- **Production Ready**: Robust output with proper error handling
- **Zero Configuration**: Works out of the box with sensible defaults
- **Simple CLI**: Direct, intuitive command structure without subcommands

## Quick Start

### Simple as One Command

```bash
# Convert all SVG files in a directory to React components
npx svgfusion ./icons --output ./components

# Add prefixes, suffixes, and generate index file
npx svgfusion ./icons --prefix Icon --suffix Component --index
```

### Installation

```bash
# Install globally (recommended for CLI usage)
npm install -g svgfusion

# Or use npx (no installation needed)
npx svgfusion ./icons --output ./components

# Or install locally for programmatic usage
npm install svgfusion
# or
yarn add svgfusion
# or
pnpm add svgfusion
```

## CLI Options

<img src="https://i.ibb.co/TD0QP5FC/cli.png" alt="SVGFusion CLI" width="512" >

svgfusion ./icons --output ./components --prefix Icon --suffix Svg

You can add a prefix and/or suffix to the generated component names using the `--prefix` and `--suffix` options:

```sh
npx svgfusion ./svgs --prefix Icon --suffix Svg
```

This will generate components like `IconStarSvg`, `IconUserSvg`, etc.

Both options sanitize input to remove symbols and spaces. If omitted, no prefix/suffix is added.

#### Example

```sh
npx svgfusion ./svgs --prefix App --suffix Widget
# Output: AppStarWidget, AppUserWidget, ...
```

For more details, run:

```sh
npx svgfusion --help
```

### CLI Usage

```bash
# Convert to React components (default)
svgfusion ./icons --output ./components

# Convert to Vue 3 components
svgfusion ./icons --output ./components --framework vue

# Single file conversion with TypeScript
svgfusion ./star.svg --output ./components --typescript

# Batch processing with recursive directory scanning
svgfusion ./icons --output ./components --recursive

# Generate index file for tree-shaking
svgfusion ./icons --output ./components --index

# Skip optimization
svgfusion ./icons --output ./components --no-optimize

# Using npx (no global install needed)
npx svgfusion ./icons --output ./components --framework react
```

### CLI Options

```bash
svgfusion <input> [options]

Options:
  -o, --output <output>        Output directory (default: "./components")
  -f, --framework <framework>  Target framework (react|vue) (default: "react")
  -t, --typescript             Generate TypeScript files
  -r, --recursive              Recursively scan input directory for SVG files
  --index                      Generate index file for tree-shaking
  --index-format <format>      Index file format (ts|js) (default: "ts")
  --export-type <type>         Export type (named|default) (default: "named")
  --no-optimize                Skip SVG optimization
  --prefix <prefix>            Add prefix to component name (sanitized)
  --suffix <suffix>            Add suffix to component name (sanitized)
  -h, --help                   Show help
```

### Using with npx (No Installation Required)

Perfect for trying out SVGFusion or one-time conversions:

```bash
# Convert React components
npx svgfusion ./assets/icons --output ./src/components/icons

# Convert Vue components with TypeScript
npx svgfusion ./assets/icons --output ./src/components --framework vue --typescript

# Convert single file
npx svgfusion ./logo.svg --output ./src/components --framework react

# Batch convert with index generation
npx svgfusion ./assets/icons --output ./src/components --recursive --index

# Convert with custom naming
npx svgfusion ./assets/icons --output ./src/components --prefix Icon --suffix Component --index
```

### Programmatic Usage

#### Single File Conversion

```typescript
import { convertToReact, convertToVue, readSvgFile } from 'svgfusion';

// Read SVG file
const svgContent = await readSvgFile('./icons/star.svg');

// React conversion
const reactResult = await convertToReact(svgContent, {
  name: 'StarIcon',
  typescript: true,
  memo: true,
  ref: true,
});

// Vue conversion
const vueResult = convertToVue(svgContent, {
  name: 'StarIcon',
  typescript: true,
  scriptSetup: true,
});

console.log(reactResult.code); // Generated React component
console.log(vueResult.code); // Generated Vue component
```

#### Batch Processing

```typescript
import { BatchConverter } from 'svgfusion';

const batchConverter = new BatchConverter();

// Convert entire directory
const result = await batchConverter.convertBatch({
  inputDir: './icons',
  outputDir: './components',
  framework: 'react',
  recursive: true,
  generateIndex: true,
  typescript: true,
  prefix: 'Icon',
  suffix: 'Component',
  indexFormat: 'ts',
  exportType: 'named',
});

// Check results
console.log(`Processed ${result.summary.total} files`);
console.log(`Successful: ${result.summary.successful}`);
console.log(`Failed: ${result.summary.failed}`);

// Get component names
const componentNames = batchConverter.getComponentNames(result);
console.log('Generated components:', componentNames);

// Generate summary report
const report = batchConverter.generateSummaryReport(result);
console.log(report);
```

## API Reference

### `convertToReact(svgContent, options)`

Convert SVG to React component.

**Options:**

- `name?: string` - Component name (auto-generated from filename if not provided)
- `prefix?: string` - Add prefix to component name
- `suffix?: string` - Add suffix to component name
- `typescript?: boolean` - Generate TypeScript component (default: `true`)
- `memo?: boolean` - Wrap with React.memo (default: `true`)
- `ref?: boolean` - Add forwardRef support (default: `true`)
- `optimize?: boolean` - Apply SVGO optimization (default: `true`)

### `convertToVue(svgContent, options)`

Convert SVG to Vue 3 component. **Note: This is a synchronous function.**

**Options:**

- `name?: string` - Component name (auto-generated from filename if not provided)
- `prefix?: string` - Add prefix to component name
- `suffix?: string` - Add suffix to component name
- `typescript?: boolean` - Generate TypeScript component (default: `true`)
- `scriptSetup?: boolean` - Use script setup syntax (default: `true`)
- `compositionApi?: boolean` - Use Composition API (default: `true`)
- `optimize?: boolean` - Apply SVGO optimization (default: `true`)

### `BatchConverter`

Process multiple SVG files in batch operations.

#### `convertBatch(options: BatchConversionOptions)`

Convert multiple SVG files to framework components.

**Options:**

- `inputDir: string` - Input directory path
- `outputDir: string` - Output directory path
- `framework?: 'react' | 'vue'` - Target framework (default: 'react')
- `recursive?: boolean` - Recursively scan directories (default: false)
- `extensions?: string[]` - File extensions to process (default: ['.svg'])
- `generateIndex?: boolean` - Generate index file (default: false)
- `indexFormat?: 'ts' | 'js'` - Index file format (default: 'ts')
- `exportType?: 'named' | 'default'` - Export type (default: 'named')
- `prefix?: string` - Add prefix to component names
- `suffix?: string` - Add suffix to component names
- `typescript?: boolean` - Generate TypeScript components (default: true)
- All other conversion options from `convertToReact`/`convertToVue`

**Returns:** `Promise<BatchConversionResult>`

#### `getComponentNames(results: BatchConversionResult)`

Get array of generated component names from batch results.

#### `generateSummaryReport(results: BatchConversionResult)`

Generate a detailed summary report of the conversion process.

### `optimizeSvg(svgContent, config?)`

Optimize SVG content using SVGO. **Note: This is a synchronous function.**

### File Utilities

- `readSvgFile(filePath)` - Read SVG file (async)
- `writeSvgFile(filePath, content)` - Write SVG file (async)
- `readSvgDirectory(dirPath, recursive?)` - Read SVG files from directory (async)
- `writeComponentFile(filePath, content)` - Write component file (async)

## Examples

### Input SVG

```svg
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor" class="star-fill"/>
</svg>
```

### Generated React Component

```tsx
import { SVGProps } from 'react';
import { memo } from 'react';
import { forwardRef } from 'react';

const StarIcon = memo(
  forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & { className?: string }>(
    props => {
      return (
        <svg viewBox="0 0 24 24" {...props}>
          <path
            d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
            fill="currentColor"
            className="star-fill"
          />
        </svg>
      );
    }
  )
);

StarIcon.displayName = 'StarIcon';

export default StarIcon;
export { StarIcon };
```

### Generated Vue Component

```vue
<script setup lang="ts">
interface Props {
  class?: string;
  style?: string | Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  style: undefined,
});

// Component name for debugging
const __name = 'StarIcon';
</script>

<template>
  <svg v-bind="$attrs" viewBox="0 0 24 24">
    <path
      d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"
      fill="currentColor"
      class="star-fill"
    />
  </svg>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
```

## Advanced Configuration

### Custom SVGO Configuration

```typescript
import { createSvgoConfig, optimizeSvg } from 'svgfusion';

const customConfig = createSvgoConfig({
  removeViewBox: false,
  preserveColors: true,
  preserveClasses: true,
});

const optimizedSvg = optimizeSvg(svgContent, customConfig);
```

### Manual Batch Processing

```typescript
import {
  readSvgDirectory,
  convertToReact,
  writeComponentFile,
} from 'svgfusion';

const svgFiles = await readSvgDirectory('./icons', true); // recursive

for (const svgFile of svgFiles) {
  const svgContent = await readSvgFile(svgFile);
  const result = await convertToReact(svgContent, {
    name: path.basename(svgFile, '.svg'),
    prefix: 'Icon',
  });

  await writeComponentFile(`./components/${result.filename}`, result.code);
}
```

### Index File Generation

When using the `--index` flag or `generateIndex: true` option, SVGFusion creates an optimized index file for tree-shaking:

#### Named Exports (Default)

```typescript
// Auto-generated index file for tree-shaking
// This file exports all components for optimal bundling

export { default as IconStar } from './IconStar';
export { default as IconUser } from './IconUser';
export { default as IconHome } from './IconHome';

// Barrel export for convenience
export { IconStar, IconUser, IconHome };

// TypeScript component types
export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;
export type IconComponents = {
  IconStar: IconComponent;
  IconUser: IconComponent;
  IconHome: IconComponent;
};
```

#### Default Exports

```typescript
// Auto-generated index file
// Warning: Default exports are less tree-shakeable

import IconStar from './IconStar';
import IconUser from './IconUser';
import IconHome from './IconHome';

export default {
  IconStar,
  IconUser,
  IconHome,
};

// Individual exports for flexibility
export { default as IconStar } from './IconStar';
export { default as IconUser } from './IconUser';
export { default as IconHome } from './IconHome';
```

#### Usage

```typescript
// Tree-shakeable named imports (recommended)
import { IconStar, IconUser } from './components';

// Default import
import * as Icons from './components';
const { IconStar, IconUser } = Icons;
```

## Complex Filename Support

SVGFusion handles complex filenames from design systems:

```bash
# Design system metadata
"Size=xl, Color=Brand, Type=Glass.svg" → GlassBrandXl
"User Profile Avatar, Type=Solid.svg" → UserProfileAvatarTypeSolid

# Standard patterns
"icon-star.svg" → IconStar
"user-profile-avatar.svg" → UserProfileAvatar
```

## Styling Support

### CSS Classes

```svg
<path class="primary-color" />
<circle class="bg-blue-500" /> <!-- Tailwind -->
```

### CSS Variables

```svg
<path fill="var(--primary-color)" />
<circle fill="currentColor" />
```

### Gradients & Patterns

```svg
<defs>
  <linearGradient id="gradient">
    <stop offset="0%" style="stop-color:#ff6b6b" />
    <stop offset="100%" style="stop-color:#4ecdc4" />
  </linearGradient>
</defs>
<path fill="url(#gradient)" />
```

## Testing

```bash
npm test          # Run tests
npm run test:coverage # Run with coverage
```

## Development

```bash
npm run dev       # Watch mode
npm run build     # Build for production
npm run lint      # Lint code
npm run format    # Format code
```

## License

MIT © SVGFusion Contributors

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details.
