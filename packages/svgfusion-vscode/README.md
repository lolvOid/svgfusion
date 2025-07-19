# SVGFusion VSCode Extension

Convert SVG files to React and Vue components with ease, directly from your VSCode editor.

## Features

### **SVG to Component Conversion**

- Convert individual SVG files to React or Vue components
- Supports both TypeScript and JavaScript output
- Automatic framework detection from your project

### **Batch Processing**

- Convert multiple SVG files at once
- Progress tracking with detailed error reporting
- Smart file selection with preview

### 🎮 **Interactive Playground**

- Built-in playground for testing conversions
- Real-time preview of generated components
- Experiment with different options

### **SVG Preview**

- Preview SVG files with different sizes and backgrounds
- View source code and file information
- Quick access to conversion actions

### **Smart Configuration**

- Auto-detects React/Vue projects
- Customizable output directories
- Framework-specific options (memo, forwardRef, SFC, script setup)

## Quick Start

1. **Install the extension**
2. **Open a project** containing SVG files
3. **Right-click any SVG file** and select "Convert to Component"
4. **Choose your options** and let SVGFusion do the rest!

## Usage

### Convert Single SVG

- Right-click on an SVG file in the Explorer
- Select "Convert to Component"
- Choose framework, language, and component name
- The component will be created in your configured output directory

### Batch Convert SVGs

- Open Command Palette (`Cmd+Shift+P`)
- Run "SVGFusion: Batch Convert SVGs"
- Select files to convert
- Choose conversion options

### Interactive Playground

- Open Command Palette (`Cmd+Shift+P`)
- Run "SVGFusion: Open Playground"
- Paste your SVG code and experiment with options

### Preview SVG

- Right-click on an SVG file
- Select "Preview Component"
- View with different sizes and backgrounds

## Keyboard Shortcuts

- `Cmd+Shift+S` (Mac) / `Ctrl+Shift+S` (Windows/Linux) - Convert SVG (when SVG file is active)
- `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux) - Open Playground

## Configuration

Configure SVGFusion through VSCode settings:

```json
{
  "svgfusion.framework": "auto", // "react" | "vue" | "auto"
  "svgfusion.typescript": true,
  "svgfusion.outputDirectory": "./src/components/icons",
  "svgfusion.react.memo": false,
  "svgfusion.react.forwardRef": false,
  "svgfusion.vue.sfc": true,
  "svgfusion.vue.scriptSetup": true,
  "svgfusion.transformation.splitColors": true,
  "svgfusion.transformation.splitStrokeWidths": false,
  "svgfusion.transformation.optimize": true
}
```

## Features in Detail

### Automatic Framework Detection

SVGFusion automatically detects whether you're working on a React or Vue project by analyzing:

- `package.json` dependencies
- Configuration files (`next.config.js`, `vue.config.js`, etc.)
- File extensions (`.jsx`, `.tsx`, `.vue`)

### Smart Component Naming

- Converts kebab-case and snake_case to PascalCase
- Validates component names follow conventions
- Suggests appropriate names based on file names

### Transformation Options

- **Split Colors**: Extract colors as props for easy theming
- **Split Stroke Widths**: Extract stroke widths as props
- **Optimization**: Automatically optimize SVG before conversion
- **TypeScript**: Generate type-safe components

### Framework-Specific Features

#### React

- **React.memo**: Wrap components for performance optimization
- **forwardRef**: Add ref forwarding support
- **TypeScript**: Full type support with proper prop interfaces

#### Vue

- **Single File Components**: Generate `.vue` files
- **Script Setup**: Use modern `<script setup>` syntax
- **TypeScript**: Full type support with proper prop definitions

## Examples

### Generated React Component

```tsx
import React from 'react';

interface MyIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const MyIcon: React.FC<MyIconProps> = ({
  color = 'currentColor',
  size = 24,
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path d="..." fill={color} />
  </svg>
);

export default MyIcon;
```

### Generated Vue Component

```vue
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :class="className"
  >
    <path d="..." :fill="color" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  color?: string;
  size?: number;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  color: 'currentColor',
  size: 24,
});
</script>
```

## Troubleshooting

### Extension Not Working

1. Check that you have SVG files in your workspace
2. Ensure you're using supported file extensions (`.svg`)
3. Check the Output panel for error messages

### Framework Detection Issues

1. Ensure your `package.json` includes framework dependencies
2. Check that configuration files are present
3. Manually set the framework in settings if auto-detection fails

### Conversion Errors

1. Validate that your SVG syntax is correct
2. Check the Output panel for detailed error messages
3. Try using the playground to isolate the issue

## Contributing

Found a bug or have a feature request? Visit our [GitHub repository](https://github.com/lolvOid/svgfusion) to:

- Report issues
- Request features
- Contribute code
- Review documentation

## Links

- 📚 [Documentation](https://svgfusion.netlify.app)
- 🐙 [GitHub Repository](https://github.com/lolvOid/svgfusion)
- 🌐 [Website](https://svgfusion.netlify.app)

---

**Enjoy using SVGFusion!** 🎉
