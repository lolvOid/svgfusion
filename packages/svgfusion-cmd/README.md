# SVGFusion CLI

🚀 Command-line interface for converting SVG files into production-ready React and Vue 3 components with TypeScript support and batch processing capabilities.

## Installation

```bash
npm install -g svgfusion-cmd
# or
npx svgfusion-cmd
```

## Quick Start

```bash
# Convert single SVG to React component
svgfusion-cmd input.svg --output ./components --framework react

# Batch convert all SVGs in a directory
svgfusion-cmd ./icons --output ./components --framework vue --typescript

# Watch mode for development
svgfusion-cmd ./icons --output ./components --watch
```

## Features

- **Batch Processing** - Convert entire directories of SVG files
- **Fast & Efficient** - Optimized for large-scale conversions
- **Framework Support** - React and Vue 3 components
- **TypeScript Ready** - Generate .tsx/.ts files with full type support
- **Watch Mode** - Automatically convert files on changes
- **Customizable** - Extensive configuration options
- **Zero Dependencies** - Standalone CLI tool

<img src="https://i.ibb.co/mfRb84x/cli.png" alt="SVGFusion CLI" width="512" >

## Usage

### Basic Commands

```bash
# Convert single file
svgfusion-cmd icon.svg --framework react --output ./components

# Convert directory
svgfusion-cmd ./icons --framework vue --output ./src/components

# With TypeScript
svgfusion-cmd ./icons --framework react --typescript --output ./components

# Watch mode
svgfusion-cmd ./icons --framework react --watch --output ./components
```

### Options

| Option         | Alias | Description                   | Default    |
| -------------- | ----- | ----------------------------- | ---------- |
| `--framework`  | `-f`  | Target framework (react, vue) | `react`    |
| `--output`     | `-o`  | Output directory              | `./output` |
| `--typescript` | `-t`  | Generate TypeScript files     | `false`    |
| `--watch`      | `-w`  | Watch for file changes        | `false`    |
| `--config`     | `-c`  | Configuration file path       | -          |
| `--help`       | `-h`  | Show help                     | -          |
| `--version`    | `-v`  | Show version                  | -          |

### Configuration File

Create a `svgfusion.config.js` file:

```javascript
export default {
  framework: 'react',
  typescript: true,
  output: './src/components/icons',
  template: 'functional',
  naming: 'PascalCase',
  // Add custom transformations
  transforms: {
    removeIds: true,
    addDisplayName: true,
  },
};
```

## Examples

### React Component Output

```tsx
// Generated IconHome.tsx
import React from 'react';

interface IconHomeProps extends React.SVGProps<SVGSVGElement> {}

export const IconHome: React.FC<IconHomeProps> = props => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12 3l8 8v10h-6v-6H10v6H4V11l8-8z" />
    </svg>
  );
};

export default IconHome;
```

### Vue Component Output

```vue
<!-- Generated IconHome.vue -->
<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    v-bind="$attrs"
  >
    <path d="M12 3l8 8v10h-6v-6H10v6H4V11l8-8z" />
  </svg>
</template>

<script setup lang="ts">
interface Props extends SVGAttributes {}

defineProps<Props>();
</script>
```

## Advanced Usage

### Batch Processing with Naming Patterns

```bash
# Convert with custom naming
svgfusion-cmd ./icons --framework react --typescript \
  --output ./components \
  --naming "Icon{name}" \
  --case PascalCase
```

### Integration with Build Tools

```json
{
  "scripts": {
    "icons:build": "svgfusion-cmd ./assets/icons --framework react --typescript --output ./src/components/icons",
    "icons:watch": "svgfusion-cmd ./assets/icons --framework react --typescript --output ./src/components/icons --watch"
  }
}
```

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation, examples, and advanced configuration options.

## License

MIT © [lolvoid](https://github.com/lolvOid)
