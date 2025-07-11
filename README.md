<div align="center">
  <img src="https://i.ibb.co/TZFfpFL/logo.png" alt="SVGFusion Logo" width="120" height="120">

# SVGFusion

**Transform SVG files into production-ready React and Vue 3 components**

A powerful Node.js CLI tool and library that converts SVG files into optimized React and Vue components with native SVG props inheritance, TypeScript integration, and smart optimization for modern development workflows.

[![npm version](https://img.shields.io/npm/v/svgfusion)](https://www.npmjs.com/package/svgfusion)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)

[📚 Documentation](https://svgfusion.netlify.app) • [⚡ CLI Reference](https://svgfusion.netlify.app/docs/cli-usage) • [📦 NPM](https://www.npmjs.com/package/svgfusion)

</div>

## What's New in v2.0

- **Custom SVGFusion Engine**: Complete rewrite with custom SVG parser replacing SVGR/SVGO
- **Native SVG Props**: Full React.SVGProps and Vue SVGAttributes support
- **Enhanced Type Safety**: Better TypeScript integration and type inference
- **Improved Performance**: Faster processing with streamlined architecture
- **Better Control**: Fine-grained control over SVG transformations and output

## Features

- **Native SVG Props**: Generated components extend React.SVGProps<SVGSVGElement> and Vue SVGAttributes
- **Dual Framework Support**: Generate both React and Vue 3 components from the same SVG
- **Custom Engine**: Built-in SVGFusion engine for reliable SVG parsing and transformation
- **Complex SVG Support**: Handles gradients, masks, filters, patterns, and Figma exports
- **ID Collision Prevention**: Automatic unique ID generation for complex SVGs
- **Optimized Output**: Smart optimization with customizable settings
- **Icon Builder Ready**: Perfect for design systems and icon libraries
- **TypeScript Ready**: Full TypeScript support with proper type definitions
- **Flexible API**: Both CLI and programmatic usage
- **Batch Processing**: Convert entire directories of SVG files
- **Production Ready**: Robust output with proper error handling
- **Zero Configuration**: Works out of the box with sensible defaults
- **Simple CLI**: Direct, intuitive command structure without subcommands

### Advanced Features

- **Split Colors Mode**: Extract individual color props for maximum Tailwind CSS compatibility
- **Fixed Stroke Width**: Add `vector-effect="non-scaling-stroke"` support for consistent strokes
- **Duplicate Detection**: Automatic validation prevents component name conflicts
- **Gradient Support**: Full support for linearGradient and radialGradient color extraction
- **Smart Naming**: Intelligent component naming with conflict resolution suggestions

## Quick Start

### Simple as One Command

```bash
# Convert all SVG files in a directory to React components
npx svgfusion ./icons --output ./components

# Add prefixes, suffixes, and generate index file
npx svgfusion ./icons --prefix Icon --suffix Component --index

# Advanced: Split colors for Tailwind CSS with fixed stroke width
npx svgfusion ./icons --split-colors --fixed-stroke-width --prefix Icon
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

<img src="https://i.ibb.co/mfRb84x/cli.png" alt="SVGFusion CLI" width="512" >

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
  --split-colors              Extract individual color props for each SVG color
  --fixed-stroke-width        Add support for non-scaling stroke width
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

# Advanced: Split colors for Tailwind CSS compatibility
npx svgfusion ./assets/icons --output ./src/components --split-colors --prefix Icon

# Advanced: Fixed stroke width with split colors
npx svgfusion ./assets/icons --output ./src/components --split-colors --fixed-stroke-width
```

### Programmatic Usage

#### Single File Conversion

```typescript
import { SVGFusion, readFileSync } from 'svgfusion';

// Create SVGFusion engine instance
const engine = new SVGFusion();

// Read SVG file
const svgContent = readFileSync('./icons/star.svg', 'utf8');

// React conversion with native SVG props
const reactResult = engine.convert(svgContent, {
  framework: 'react',
  componentName: 'StarIcon',
  typescript: true,
  features: {
    colorSplitting: true,
    strokeFixing: true,
    accessibility: true,
  },
});

// Vue conversion with native SVG attributes
const vueResult = engine.convert(svgContent, {
  framework: 'vue',
  componentName: 'StarIcon',
  typescript: true,
  features: {
    colorSplitting: true,
    strokeFixing: true,
    accessibility: true,
  },
});

console.log(reactResult.code); // Generated React component with React.SVGProps
console.log(vueResult.code); // Generated Vue component with SVGAttributes
```

#### Batch Processing with CLI

```typescript
import { processInput } from 'svgfusion/cli';

// Convert entire directory
processInput('./icons', {
  output: './components',
  framework: 'react',
  recursive: true,
  index: true,
  typescript: true,
  prefix: 'Icon',
  suffix: 'Component',
  splitColors: true,
  fixedStrokeWidth: true,
});
```

## API Reference

### `SVGFusion`

The main engine class for converting SVG content to framework components.

```typescript
import { SVGFusion } from 'svgfusion';

const engine = new SVGFusion();
```

#### `convert(svgContent: string, options: SVGFusionOptions): ConversionResult`

Convert SVG content to React or Vue component.

**Options:**

- `framework: 'react' | 'vue'` - Target framework
- `componentName?: string` - Component name (auto-generated from filename if not provided)
- `typescript?: boolean` - Generate TypeScript component (default: `true`)
- `features?: FeatureConfig` - Enable/disable transformation features
  - `colorSplitting?: boolean` - Extract individual color props (default: `false`)
  - `strokeFixing?: boolean` - Add fixed stroke width support (default: `false`)
  - `accessibility?: boolean` - Add accessibility enhancements (default: `true`)

**Returns:** `ConversionResult`

- `code: string` - Generated component code
- `framework: string` - Target framework
- `componentName: string` - Final component name
- `warnings: string[]` - Any conversion warnings

### React Components

Generated React components automatically extend `React.SVGProps<SVGSVGElement>`, providing:

- All native SVG element props (onClick, onMouseOver, className, style, etc.)
- Full TypeScript support with proper type inference
- Native event handling and accessibility features

```tsx
// Generated component signature
interface StarIconProps extends React.SVGProps<SVGSVGElement> {
  // Custom color props if colorSplitting is enabled
  color1?: string;
  color2?: string;
}

const StarIcon: React.FC<StarIconProps> = props => {
  // Component implementation with native SVG props support
};
```

### Vue Components

Generated Vue components extend `SVGAttributes` with `v-bind="$attrs"`, providing:

- All native SVG element attributes
- Event handlers (onClick, onMouseover, etc.)
- Full TypeScript support with proper attribute typing

```vue
<script setup lang="ts">
import type { SVGAttributes } from 'vue';

interface StarIconProps extends SVGAttributes {
  // Custom color props if colorSplitting is enabled
  color1?: string;
  color2?: string;
}

defineOptions({ inheritAttrs: false });
</script>

<template>
  <svg v-bind="$attrs" viewBox="0 0 24 24">
    <!-- SVG content -->
  </svg>
</template>
```

### CLI Integration

```typescript
import { processInput } from 'svgfusion/cli';

// Process single file or directory
processInput(inputPath: string, options: CliOptions): void
```

**CLI Options:**

- `output?: string` - Output directory (default: './components')
- `framework?: 'react' | 'vue'` - Target framework (default: 'react')
- `typescript?: boolean` - Generate TypeScript files (default: true)
- `recursive?: boolean` - Process directories recursively (default: false)
- `index?: boolean` - Generate index file (default: false)
- `prefix?: string` - Add prefix to component names
- `suffix?: string` - Add suffix to component names
- `splitColors?: boolean` - Enable color splitting feature
- `fixedStrokeWidth?: boolean` - Enable stroke fixing feature

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
import type { SVGProps } from 'react';

interface StarIconProps extends SVGProps<SVGSVGElement> {}

const StarIcon = (props: StarIconProps) => {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
        className="star-fill"
      />
    </svg>
  );
};

export { StarIcon };
```

### Generated React Component with Color Splitting

```tsx
import type { SVGProps } from 'react';

interface StarIconProps extends SVGProps<SVGSVGElement> {
  fillColor?: string;
}

const StarIcon = ({ fillColor = 'currentColor', ...props }: StarIconProps) => {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={fillColor}
        className="star-fill"
      />
    </svg>
  );
};

export { StarIcon };
```

### Generated Vue Component

```vue
<script setup lang="ts">
import type { SVGAttributes } from 'vue';

interface StarIconProps extends SVGAttributes {}

defineOptions({ inheritAttrs: false });
</script>

<template>
  <svg v-bind="$attrs" viewBox="0 0 24 24">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill="currentColor"
      class="star-fill"
    />
  </svg>
</template>
```

### Generated Vue Component with Color Splitting

```vue
<script setup lang="ts">
import type { SVGAttributes } from 'vue';

interface StarIconProps extends SVGAttributes {
  fillColor?: string;
}

const props = withDefaults(defineProps<StarIconProps>(), {
  fillColor: 'currentColor',
});

defineOptions({ inheritAttrs: false });
</script>

<template>
  <svg v-bind="$attrs" viewBox="0 0 24 24">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      :fill="fillColor"
      class="star-fill"
    />
  </svg>
</template>
```

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

````

## Advanced Configuration

### Split Colors for Tailwind CSS

The `splitColors` option extracts individual color properties from SVG elements, making them perfect for Tailwind CSS integration:

```typescript
// Input SVG with colors
const svgContent = `
  <svg viewBox="0 0 24 24">
    <path fill="#FF0000" stroke="#00FF00" />
    <circle fill="#0000FF" />
    <linearGradient>
      <stop stop-color="#FFFF00" />
      <stop stop-color="#FF00FF" />
    </linearGradient>
  </svg>
`;

// Convert with split colors
const result = await convertToReact(svgContent, {
  name: 'MultiColorIcon',
  splitColors: true,
  typescript: true,
});

// Generated component props:
// - fillColor1, fillColor2 (for fill colors)
// - strokeColor1 (for stroke colors)
// - gradientColor1, gradientColor2 (for gradient colors)
// - fillColor1Class, strokeColor1Class, etc. (for CSS classes)
````

### Fixed Stroke Width Support

The `isFixedStrokeWidth` option adds support for non-scaling stroke width:

```typescript
const result = await convertToReact(svgContent, {
  name: 'StrokeIcon',
  isFixedStrokeWidth: true,
});

// Generated component includes:
// - isFixedStrokeWidth prop
// - vector-effect="non-scaling-stroke" when prop is true
```

### Duplicate Name Detection

The batch converter automatically detects and prevents duplicate component names:

```typescript
// These files would generate the same component name "Icon"
const files = ['./icons/icon.svg', './assets/icon.svg', './ui/icon.svg'];

// Batch processing will throw an error with conflict details
try {
  await batchConverter.convertBatch({
    inputDir: './icons',
    outputDir: './components',
    // ... other options
  });
} catch (error) {
  console.error(error.message);
  // Error: Duplicate component names detected:
  // Component name "Icon" conflicts:
  //   - ./icons/icon.svg
  //   - ./assets/icon.svg
  //   - ./ui/icon.svg
}
```

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
