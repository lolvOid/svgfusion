# VSCode Extension

The SVGFusion VSCode extension brings the power of SVG-to-component conversion directly into your development workflow. Convert SVG files to React and Vue components without leaving your editor.

## Installation

Install the extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=lolvoid.svgfusion-vscode):

1. **Via VS Code Marketplace**: Search for "SVGFusion" in the Extensions view (`Cmd+Shift+X`)
2. **Via Command Line**: `code --install-extension lolvoid.svgfusion-vscode`
3. **Manual Install**: Download the `.vsix` file and install via `Extensions: Install from VSIX...`

## Quick Start

1. **Open a project** containing SVG files
2. **Right-click any SVG file** in the Explorer
3. **Select "Convert to Component"**
4. **Choose your options** and generate your component!

## Features

### SVG to Component Conversion

Convert individual SVG files to React or Vue components with full customization options:

- **Framework Selection**: React or Vue (auto-detected from your project)
- **Language Support**: TypeScript and JavaScript
- **Component Naming**: Smart conversion from file names to component names
- **Output Directory**: Configurable output location

### Batch Processing

Convert multiple SVG files at once:

1. Open Command Palette (`Cmd+Shift+P`)
2. Run **"SVGFusion: Batch Convert SVGs"**
3. Select multiple files and conversion options
4. Track progress with detailed reporting

### Interactive Playground

Test conversions in real-time:

1. Open Command Palette (`Cmd+Shift+P`)
2. Run **"SVGFusion: Open Playground"**
3. Paste SVG code and experiment with options
4. Copy generated component code

### SVG Preview

Preview SVG files with different configurations:

1. Right-click an SVG file
2. Select **"Preview Component"**
3. View with different sizes and backgrounds

### Smart Features

#### Framework Detection

Automatically detects your project framework by analyzing:

- `package.json` dependencies
- Configuration files (`next.config.js`, `vue.config.js`)
- File extensions (`.jsx`, `.tsx`, `.vue`)

#### Hover Information

Hover over SVG files to see:

- File dimensions and size
- Quick conversion actions
- SVG structure overview

#### Tree View

Dedicated SVG explorer in the sidebar showing all SVG files in your workspace.

## Configuration

Configure SVGFusion through VS Code settings (`Cmd/Ctrl + ,`, search "SVGFusion"):

```json
{
  "svgfusion.framework": "auto",
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

### Configuration Options

| Setting                            | Type                         | Default                    | Description                             |
| ---------------------------------- | ---------------------------- | -------------------------- | --------------------------------------- |
| `framework`                        | `"react" \| "vue" \| "auto"` | `"auto"`                   | Target framework for conversion         |
| `typescript`                       | `boolean`                    | `true`                     | Generate TypeScript components          |
| `outputDirectory`                  | `string`                     | `"./src/components/icons"` | Output directory for components         |
| `react.memo`                       | `boolean`                    | `false`                    | Wrap React components with `React.memo` |
| `react.forwardRef`                 | `boolean`                    | `false`                    | Add `forwardRef` to React components    |
| `vue.sfc`                          | `boolean`                    | `true`                     | Generate Vue Single File Components     |
| `vue.scriptSetup`                  | `boolean`                    | `true`                     | Use `<script setup>` syntax             |
| `transformation.splitColors`       | `boolean`                    | `true`                     | Extract colors as props                 |
| `transformation.splitStrokeWidths` | `boolean`                    | `false`                    | Extract stroke widths as props          |
| `transformation.optimize`          | `boolean`                    | `true`                     | Optimize SVG before conversion          |

## Commands

All commands are available through the Command Palette (`Cmd+Shift+P`):

| Command                           | Description                        | Keyboard Shortcut                       |
| --------------------------------- | ---------------------------------- | --------------------------------------- |
| `SVGFusion: Convert to Component` | Convert selected SVG file          | `Cmd+Shift+S` (when SVG file is active) |
| `SVGFusion: Batch Convert SVGs`   | Convert multiple SVG files         | -                                       |
| `SVGFusion: Open Playground`      | Open interactive playground        | `Cmd+Shift+G`                           |
| `SVGFusion: Preview Component`    | Preview SVG with different options | -                                       |

## Context Menus

Right-click any SVG file to access:

- **Convert to Component** - Quick conversion with options
- **Preview Component** - Preview with different configurations

## Generated Components

### React Example

```tsx
import React from 'react';

interface StarIconProps {
  color?: string;
  size?: number;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({
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
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={color}
    />
  </svg>
);

export default StarIcon;
```

### Vue Example

```vue
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    :class="className"
  >
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      :fill="color"
    />
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

## Framework-Specific Features

### React

- **TypeScript Support**: Full type definitions with prop interfaces
- **React.memo**: Optional performance optimization
- **forwardRef**: Add ref forwarding support
- **JSX/TSX**: Proper file extensions

### Vue

- **Single File Components**: Generate `.vue` files
- **Script Setup**: Modern `<script setup>` syntax support
- **TypeScript**: Full type support with proper prop definitions
- **Composition API**: Modern Vue 3 patterns

## Tips & Best Practices

### Organizing SVG Files

```
src/
├── assets/
│   └── icons/          # Source SVG files
│       ├── arrow.svg
│       ├── user.svg
│       └── star.svg
└── components/
    └── icons/          # Generated components
        ├── ArrowIcon.tsx
        ├── UserIcon.tsx
        └── StarIcon.tsx
```

### Naming Conventions

SVGFusion automatically converts file names to proper component names:

- `arrow-left.svg` → `ArrowLeftIcon`
- `user_profile.svg` → `UserProfileIcon`
- `star.svg` → `StarIcon`

### Performance Optimization

- Enable **React.memo** for frequently re-rendered components
- Use **color splitting** to make icons themeable
- Keep SVGs optimized (the extension does this automatically)

## Troubleshooting

### Extension Not Working

1. Check that SVG files have `.svg` extension
2. Ensure workspace contains a `package.json` file
3. Check Output panel for error messages

### Framework Detection Issues

1. Ensure `package.json` includes framework dependencies
2. Add configuration files (`next.config.js`, `vue.config.js`)
3. Manually set framework in settings if auto-detection fails

### Conversion Errors

1. Validate SVG syntax
2. Check Output panel for detailed error messages
3. Try the playground to isolate issues
4. Ensure output directory exists and is writable

## Support

- **Issues**: [GitHub Issues](https://github.com/lolvOid/svgfusion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lolvOid/svgfusion/discussions)
- **Documentation**: [SVGFusion Docs](https://svgfusion.netlify.app)

## Related Tools

- [SVGFusion CLI](cli-usage.md) - Command-line interface
- [Browser API](browser-api.md) - Client-side conversion
- [Node.js API](node-api.md) - Server-side conversion
