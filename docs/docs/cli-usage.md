# CLI Usage

The SVGFusion CLI provides a simple yet powerful interface for converting SVG files to React and Vue components.

## Installation

```bash
npm install -g svgfusion
```

## Basic Usage

```bash
svgfusion convert <input> [options]
```

## Commands

### convert

Convert SVG files to React or Vue components.

```bash
svgfusion convert input.svg
```

## Options

### --prefix `<prefix>`

Add a prefix to the generated component name. Input is sanitized to remove symbols and spaces.

```bash
svgfusion convert icon.svg --prefix Icon
# Output: IconIconStar, IconUserProfile, ...
```

### --suffix `<suffix>`

Add a suffix to the generated component name. Input is sanitized to remove symbols and spaces.

```bash
svgfusion convert icon.svg --suffix Svg
# Output: IconStarSvg, UserProfileSvg, ...
```

### --prefix and --suffix together

You can combine both options:

```bash
svgfusion convert ./icons --prefix App --suffix Widget
# Output: AppStarWidget, AppUserWidget, ...
```

### -o, --output `<directory>`

Specify the output directory for generated components.

```bash
svgfusion convert icon.svg -o ./components
```

**Default:** `./components`

### -f, --framework `<framework>`

Choose the target framework: `react` or `vue`.

```bash
svgfusion convert icon.svg -f vue
```

**Default:** `react`

### -t, --typescript

Generate TypeScript files instead of JavaScript.

```bash
svgfusion convert icon.svg -t
```

**Default:** `false`

### --no-optimize

Skip SVG optimization with SVGO.

```bash
svgfusion convert icon.svg --no-optimize
```

**Default:** SVG optimization is enabled

## Examples

### Single File Conversion

Convert a single SVG to React TypeScript component:

```bash
svgfusion convert star.svg -f react -t -o ./src/components
```

### Directory Conversion

Convert all SVG files in a directory:

```bash
svgfusion convert ./icons -f vue -o ./src/components
```

### Using with npx

You can use SVGFusion without global installation:

```bash
npx svgfusion convert icon.svg -f react -t
```

## Output Files

### React Components

Generated React components include:

- TypeScript support (when `-t` flag is used)
- Proper prop types
- Forward refs
- Memo optimization
- className support

Example output:

```typescript
import { SVGProps, memo, forwardRef } from 'react';

const IconStar = memo(forwardRef<SVGSVGElement, SVGProps<SVGSVGElement> & { className?: string; }>(props) => {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
});

IconStar.displayName = "IconStar";
export default IconStar;
export { IconStar };
```

### Vue Components

Generated Vue components include:

- TypeScript support (when `-t` flag is used)
- Composition API with `<script setup>`
- Proper prop definitions
- Scoped styles

Example output:

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
</script>

<template>
  <svg v-bind="$attrs" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
```

## Tips

1. **Batch Processing**: Use directory input to convert multiple SVG files at once
2. **Naming**: Component names are automatically generated from filenames using PascalCase. You can customize names with `--prefix` and `--suffix` options for your design system or naming conventions.
3. **Optimization**: SVG optimization is enabled by default for smaller bundle sizes
4. **TypeScript**: Always use `-t` flag for TypeScript projects for better type safety
