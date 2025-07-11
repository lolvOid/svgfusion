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

## Quick Start

### Installation

```bash
# Install globally (recommended for CLI usage)
npm install -g svgfusion

# Or use npx (no installation needed)
npx svgfusion convert ./icons --output ./components

# Or install locally for programmatic usage
npm install svgfusion
# or
yarn add svgfusion
# or
pnpm add svgfusion
```

### CLI Usage

```bash
# Convert to React components (default)
svgfusion convert ./icons --output ./components

# Convert to Vue 3 components
svgfusion convert ./icons --output ./components --framework vue

# Single file conversion with TypeScript
svgfusion convert ./star.svg --output ./components --typescript

# Skip optimization
svgfusion convert ./icons --output ./components --no-optimize

# Using npx (no global install needed)
npx svgfusion convert ./icons --output ./components --framework react
```

### CLI Options

```bash
svgfusion convert <input> [options]

Options:
  -o, --output <output>        Output directory (default: "./components")
  -f, --framework <framework>  Target framework (react|vue) (default: "react")
  -t, --typescript             Generate TypeScript files
  --no-optimize                Skip SVG optimization
  -h, --help                   Show help
```

### Using with npx (No Installation Required)

Perfect for trying out SVGFusion or one-time conversions:

```bash
# Convert React components
npx svgfusion convert ./assets/icons --output ./src/components/icons

# Convert Vue components with TypeScript
npx svgfusion convert ./assets/icons --output ./src/components --framework vue --typescript

# Convert single file
npx svgfusion convert ./logo.svg --output ./src/components --framework react
```

### Programmatic Usage

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

### Batch Processing

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
