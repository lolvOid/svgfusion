<div align="center">
  <img src="https://i.ibb.co/TZFfpFL/logo.png" alt="SVGFusion Logo" width="120" height="120">

# SVGFusion

**SVGs to React & Vue 3 Components**

Convert SVG files into blazing-fast React and Vue 3 components with automatic color extraction, full TypeScript support, and seamless integration into any modern workflow.

[![npm version](https://img.shields.io/npm/v/svgfusion)](https://www.npmjs.com/package/svgfusion)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)

[Documentation](https://svgfusion.netlify.app) • [Packages Guide](https://svgfusion.netlify.app/docs/packages) • [NPM](https://www.npmjs.com/package/svgfusion) • **[Try Interactive Playground](https://svgfusion.netlify.app/playground)**

</div>

## Quick Start

```bash
# Install globally
npm install -g svgfusion

# Convert SVG files to React components
svgfusion ./icons --output ./components --framework react

# Or use without installation
npx svgfusion ./icons --output ./components --framework vue
```

## Available Packages

SVGFusion is available as a monorepo with specialized packages for different use cases:

| Package                                                                  | Description            | Installation                    | Use Case            |
| ------------------------------------------------------------------------ | ---------------------- | ------------------------------- | ------------------- |
| **[svgfusion](https://www.npmjs.com/package/svgfusion)**                 | Complete toolkit       | `npm install svgfusion`         | General usage       |
| **[svgfusion-cli](https://www.npmjs.com/package/svgfusion-cli)**         | Command-line interface | `npm install -g svgfusion-cli`  | CLI-only usage      |
| **[svgfusion-browser](https://www.npmjs.com/package/svgfusion-browser)** | Browser-optimized      | `npm install svgfusion-browser` | Web applications    |
| **[svgfusion-core](https://www.npmjs.com/package/svgfusion-core)**       | Core engine            | `npm install svgfusion-core`    | Custom tooling      |
| **[svgfusion-react](https://www.npmjs.com/package/svgfusion-react)**     | React utilities        | `npm install svgfusion-react`   | React-only projects |
| **[svgfusion-vue](https://www.npmjs.com/package/svgfusion-vue)**         | Vue utilities          | `npm install svgfusion-vue`     | Vue-only projects   |

> **Tip:** For most users, the main `svgfusion` package includes everything you need. Use specialized packages only if you need specific functionality.

## Key Features

- **Advanced Transformations**: Color splitting, stroke width extraction, and SVG optimization
- **Framework Support**: Generate React and Vue 3 components with TypeScript support
- **Browser & Node.js**: Works in both browser environments and Node.js
- **Batch Processing**: Convert entire directories with watch mode support
- **Production Ready**: Optimized output with proper error handling and accessibility
- **Zero Configuration**: Works out of the box with sensible defaults

## Try It Live

**Experience SVGFusion instantly in your browser!** - [**Launch Interactive Playground →**](https://svgfusion.netlify.app/playground)

Upload your SVG files, experiment with different options, and see the generated React/Vue components in real-time. No installation required!

## Examples

### CLI Usage

```bash
# Convert all SVG files in a directory to React components
npx svgfusion ./icons --output ./components

# Add prefixes, suffixes, and generate index file
npx svgfusion ./icons --prefix Icon --suffix Component --index

# Advanced: Split colors for Custom CSS Class with fixed stroke width
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

# Advanced: Split colors for maximum customization
svgfusion ./icons --output ./components --split-colors

# Advanced: Fixed stroke width with split colors
svgfusion ./icons --output ./components --split-colors --fixed-stroke-width

# Using npx (no global install needed)
npx svgfusion ./icons --output ./components --framework react
```

### Available CLI Options

```bash
svgfusion <input> [options]

Arguments:
  <input>                      SVG file or directory to convert

Options:
  -o, --output <dir>           Output directory for generated components (default: "./components")
  -f, --framework <framework>  Target framework: react or vue (default: "react")
  --typescript                 Generate TypeScript components (default: true)
  --javascript                 Generate JavaScript components
  --split-colors               Enable color splitting feature
  --fixed-stroke-width         Enable fixed stroke width feature
  --memo                       Wrap component with React.memo (default: true)
  --no-memo                    Disable React.memo wrapping
  --forward-ref                Enable forwardRef support (default: true)
  --no-forward-ref             Disable forwardRef support
  -n, --name <name>            Custom component name
  --optimize                   Enable SVG optimization (default: true)
  --no-optimize                Disable SVG optimization
  --recursive                  Process directories recursively
  --prefix <prefix>            Add prefix to component names
  --suffix <suffix>            Add suffix to component names
  --index                      Generate index.ts file for directory processing
  -h, --help                   Show help
```

--prefix `<prefix>` Add prefix to component name (sanitized)
--suffix `<suffix>` Add suffix to component name (sanitized)
--split-colors Extract individual color props for each SVG color
--fixed-stroke-width Add support for non-scaling stroke width
-h, --help Show help

````

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

# Advanced: Split colors for Custom CSS Class compatibility
npx svgfusion ./assets/icons --output ./src/components --split-colors --prefix Icon

# Advanced: Fixed stroke width with split colors
npx svgfusion ./assets/icons --output ./src/components --split-colors --fixed-stroke-width
````

### Programmatic Usage

#### Single File Conversion

```typescript
import { SVGFusion } from 'svgfusion';

const engine = new SVGFusion();
const svgContent = `<svg viewBox="0 0 24 24"><path fill="#FF0000" stroke="#00FF00" d="..."/></svg>`;

const result = await engine.convert(svgContent, {
  framework: 'react', // or 'vue'
  transformation: { splitColors: true },
  generator: { componentName: 'MyIcon', typescript: true },
});

console.log(result.code); // The generated component code
```

## API Reference

For the complete API documentation, visit [svgfusion.netlify.app](https://svgfusion.netlify.app/docs/api-reference).

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

### Split Colors with Intelligent Attribute Handling

The `splitColors` option extracts individual color properties from SVG elements and intelligently manages fill/stroke attributes:

```typescript
// Input SVG with mixed attributes
const svgContent = `
  <svg viewBox="0 0 24 24">
    <path fill="#FF0000" d="..." />          <!-- Has fill only -->
    <path stroke="#00FF00" d="..." />        <!-- Has stroke only -->
    <path fill="#0000FF" stroke="#FFFF00" /> <!-- Has both -->
    <path d="..." />                         <!-- Has neither -->
  </svg>
`;

// Convert with split colors
const result = await convertToReact(svgContent, {
  name: 'MultiColorIcon',
  splitColors: true,
  typescript: true,
});

// Generated component behavior:
// - Path with fill only: gets stroke="none" (prevents unwanted stroke)
// - Path with stroke only: gets fill="none" (prevents black fill default)
// - Path with both: keeps both as dynamic props
// - Path with neither: remains unchanged (no unnecessary attributes)

// Generated component props:
// - color, color2, color3 (for extracted colors in order)
// - colorClass, color2Class, color3Class (for CSS classes)
// - Colors are automatically converted to hex format
```

**Color Extraction Rules:**
- Colors are extracted from `fill`, `stroke`, and `stop-color` attributes
- All colors are converted to lowercase hex format (e.g., `#ff0000`)
- Empty or invalid color values are ignored
- Duplicate colors are automatically deduplicated
- Colors are assigned as `color`, `color2`, `color3`, etc. in order

**Intelligent Attribute Handling:**
- Elements with `fill` only → adds `stroke="none"`
- Elements with `stroke` only → adds `fill="none"`
- Elements with both `fill` and `stroke` → keeps both as props
- Elements with neither → no attributes added
- Empty attribute values (`fill=""`) are treated as non-existent
````

### Transformation Options

SVGFusion provides comprehensive transformation capabilities through the transformation options API:

```typescript
const result = await engine.convert(svgContent, {
  framework: 'react',
  transformation: {
    splitColors: true, // Extract color props
    splitStrokeWidths: true, // Extract stroke width props
    fixedStrokeWidth: true, // Non-scaling stroke support
    normalizeFillStroke: true, // Normalize fill/stroke attributes
    accessibility: true, // Add accessibility features
    optimize: true, // Apply SVG optimizations
    removeComments: true, // Remove XML comments
    removeDuplicates: true, // Remove duplicate elements
    minifyPaths: false, // Minify path data
  },
  generator: { componentName: 'MyIcon', typescript: true },
});
```

#### Fixed Stroke Width Support

The `fixedStrokeWidth` transformation adds support for non-scaling stroke width:

```typescript
const result = await convertToReact(svgContent, {
  name: 'StrokeIcon',
  isFixedStrokeWidth: true,
});

// Generated component includes:
// - isFixedStrokeWidth prop
// - vector-effect="non-scaling-stroke" when prop is true
```

#### Fill/Stroke Normalization

The `normalizeFillStroke` transformation intelligently handles fill and stroke attributes:

- Normalizes attribute values across all SVG elements
- Ensures consistent color and stroke width application
- Optimizes attribute inheritance and cascading

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

### Batch Processing with SVGFusion Engine

```typescript
import { SVGFusion, readSvgDirectory } from 'svgfusion';
import { writeFileSync } from 'fs';
import path from 'path';

const engine = new SVGFusion();
const svgFiles = await readSvgDirectory('./icons', true); // recursive

for (const svgFile of svgFiles) {
  const svgContent = readFileSync(svgFile, 'utf-8');
  const result = await engine.convert(svgContent, {
    framework: 'react',
    generator: {
      componentName: path.basename(svgFile, '.svg'),
      typescript: true,
    },
    transformation: {
      splitColors: true,
    },
  });

  writeFileSync(`./components/${result.filename}`, result.code);
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

## Browser Usage (New!)

SVGFusion now supports browser environments! Convert SVG strings to component code without writing files.

**Try the Interactive Playground**: [svgfusion.netlify.app/playground](https://svgfusion.netlify.app/playground)

```javascript
import { convertToReact, convertToVue } from 'svgfusion/browser';

const svgContent = `<svg viewBox="0 0 24 24"><path fill="#3B82F6" d="..."/></svg>`;

// Convert to React component string
const reactResult = await convertToReact(svgContent, {
  componentName: 'MyIcon',
  typescript: true,
  splitColors: true,
});

console.log(reactResult.code); // Generated React component code

// Convert to Vue component string
const vueResult = await convertToVue(svgContent, {
  componentName: 'MyIcon',
  typescript: true,
  sfc: true,
});

console.log(vueResult.code); // Generated Vue component code
```

**Browser Features:**

- All conversion features (color splitting, stroke fixing, etc.)
- React and Vue component generation
- TypeScript support
- Batch conversion
- Color extraction and validation
- Index file generation
- Works in all modern browsers
- **Interactive Playground** with Monaco Editor

#### [Browser API Documentation](./docs/docs/browser-api.md)

#### [Node API Documentation](./docs/docs/node-api.md)

## License

MIT © SVGFusion Contributors

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
