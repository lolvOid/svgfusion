# CLI Usage

![SVGFusion CLI](https://i.ibb.co/mfRb84x/cli.png)

The SVGFusion CLI provides a simple yet powerful interface for converting SVG files to React and Vue components with advanced features like split colors and duplicate validation.

## Installation

```bash
npm install -g svgfusion
```

## Basic Usage

```bash
svgfusion <input> [options]
```

### Quick Examples

```bash
# Convert all SVG files in directory to React components
svgfusion ./icons --output ./components

# Convert to Vue components with TypeScript
svgfusion ./icons --framework vue --typescript --output ./src/components

# Advanced: Split colors for Tailwind CSS
svgfusion ./icons --split-colors --prefix Icon --output ./components
```

## Options

### Core Options

### --prefix `<prefix>`

Add a prefix to the generated component name. Input is sanitized to remove symbols and spaces.

```bash
svgfusion ./icons --prefix Icon
# Output: IconStar, IconUserProfile, ...
```

### --suffix `<suffix>`

Add a suffix to the generated component name. Input is sanitized to remove symbols and spaces.

```bash
svgfusion ./icons --suffix Svg
# Output: StarSvg, UserProfileSvg, ...
```

### --prefix and --suffix together

You can combine both options:

```bash
svgfusion ./icons --prefix App --suffix Widget
# Output: AppStarWidget, AppUserWidget, ...
```

### -o, --output `<directory>`

Specify the output directory for generated components.

```bash
svgfusion ./icons -o ./components
```

**Default:** `./components`

### -f, --framework `<framework>`

Choose the target framework: `react` or `vue`.

```bash
svgfusion ./icons -f vue
```

**Default:** `react`

### -t, --typescript

Generate TypeScript files instead of JavaScript.

```bash
svgfusion ./icons -t
```

**Default:** `true`

### -r, --recursive

Recursively scan input directory for SVG files.

```bash
svgfusion ./icons -r
```

**Default:** `false`

### --index

Generate an index file for tree-shaking.

```bash
svgfusion ./icons --index
```

**Default:** `false`

### --index-format `<format>`

Format for the index file: `ts` or `js`.

```bash
svgfusion ./icons --index --index-format js
```

**Default:** `ts`

### --export-type `<type>`

Export type for the index file: `named` or `default`.

```bash
svgfusion ./icons --index --export-type default
```

**Default:** `named`

### --no-optimize

Skip SVG optimization with SVGO.

```bash
svgfusion ./icons --no-optimize
```

**Default:** SVG optimization is enabled

### 🚀 Advanced Options

### --split-colors

Extract individual color props for each SVG color, perfect for Tailwind CSS integration.

```bash
svgfusion ./icons --split-colors
```

This creates separate props for:

- `fillColor1`, `fillColor2`, etc. for fill colors
- `strokeColor1`, `strokeColor2`, etc. for stroke colors
- `gradientColor1`, `gradientColor2`, etc. for gradient colors
- `fillColor1Class`, `strokeColor1Class`, etc. for CSS classes

**Default:** `false`

### --fixed-stroke-width

Add support for non-scaling stroke width using `vector-effect="non-scaling-stroke"`.

```bash
svgfusion ./icons --fixed-stroke-width
```

This adds:

- `isFixedStrokeWidth` prop to components
- Conditional `vector-effect` attribute

**Default:** `false`

## Examples

### Single File Conversion

Convert a single SVG to React TypeScript component:

```bash
svgfusion star.svg -f react -t -o ./src/components
```

### Directory Conversion

Convert all SVG files in a directory:

```bash
svgfusion ./icons -f vue -o ./src/components
```

### Recursive Directory Conversion

Convert all SVG files in nested directories:

```bash
svgfusion ./assets -r -o ./src/components --index
```

### Advanced Features

#### Split Colors for Tailwind CSS

Perfect for design systems where you need granular control over colors:

```bash
svgfusion ./icons --split-colors --prefix Icon -o ./src/components
```

#### Fixed Stroke Width

For icons that need consistent stroke width at any scale:

```bash
svgfusion ./icons --fixed-stroke-width --split-colors -o ./src/components
```

#### Complete Advanced Example

```bash
svgfusion ./assets/icons \
  --framework react \
  --typescript \
  --recursive \
  --split-colors \
  --fixed-stroke-width \
  --prefix App \
  --suffix Icon \
  --index \
  --index-format ts \
  --export-type named \
  --output ./src/components/icons
```

### Using with npx

You can use SVGFusion without global installation:

```bash
npx svgfusion ./icons -f react -t --split-colors
```

### Error Handling

SVGFusion automatically detects and prevents duplicate component names:

```bash
svgfusion ./icons --prefix Icon -o ./components
# Error: Duplicate component names detected:
# Component name "Icon" conflicts:
#   - ./icons/icon.svg
#   - ./assets/icon.svg
```

## Output Files

### React Components

Generated React components include:

- TypeScript support (when `-t` flag is used)
- Proper prop types
- Forward refs
- Memo optimization
- className support
- Split colors support (when `--split-colors` is used)
- Fixed stroke width support (when `--fixed-stroke-width` is used)

#### Basic Example

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

#### Advanced Example with Split Colors

```typescript
import { SVGProps, memo, forwardRef } from 'react';

interface IconStarProps extends SVGProps<SVGSVGElement> {
  className?: string;
  fillColor1?: string;
  fillColor1Class?: string;
  strokeColor1?: string;
  strokeColor1Class?: string;
  isFixedStrokeWidth?: boolean;
}

const IconStar = memo(
  forwardRef<SVGSVGElement, IconStarProps>((props, ref) => {
    const {
      fillColor1 = '#FF0000',
      fillColor1Class = '',
      strokeColor1 = '#00FF00',
      strokeColor1Class = '',
      isFixedStrokeWidth = false,
      ...rest
    } = props;

    return (
      <svg
        ref={ref}
        {...rest}
        viewBox="0 0 24 24"
        vectorEffect={isFixedStrokeWidth ? 'non-scaling-stroke' : undefined}
      >
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill={fillColor1}
          className={fillColor1Class}
          stroke={strokeColor1}
          className={strokeColor1Class}
        />
      </svg>
    );
  })
);

IconStar.displayName = 'IconStar';
export default IconStar;
export { IconStar };
```

### Vue Components

Generated Vue components include:

- TypeScript support (when `-t` flag is used)
- Composition API with `<script setup>`
- Proper prop definitions
- Scoped styles
- Split colors support (when `--split-colors` is used)
- Fixed stroke width support (when `--fixed-stroke-width` is used)

#### Basic Example

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

#### Advanced Example with Split Colors

```vue
<script setup lang="ts">
interface Props {
  class?: string;
  style?: string | Record<string, any>;
  fillColor1?: string;
  fillColor1Class?: string;
  strokeColor1?: string;
  strokeColor1Class?: string;
  isFixedStrokeWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  style: undefined,
  fillColor1: '#FF0000',
  fillColor1Class: '',
  strokeColor1: '#00FF00',
  strokeColor1Class: '',
  isFixedStrokeWidth: false,
});
</script>

<template>
  <svg
    v-bind="$attrs"
    viewBox="0 0 24 24"
    :vector-effect="isFixedStrokeWidth ? 'non-scaling-stroke' : undefined"
  >
    <path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      :fill="fillColor1"
      :class="fillColor1Class"
      :stroke="strokeColor1"
      :class="strokeColor1Class"
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
5. **Split Colors**: Use `--split-colors` for maximum flexibility with design systems and Tailwind CSS
6. **Duplicate Detection**: SVGFusion automatically prevents naming conflicts - use different prefixes/suffixes to resolve conflicts
7. **Index Files**: Use `--index` for better tree-shaking in bundlers
8. **Fixed Stroke Width**: Use `--fixed-stroke-width` for icons that need consistent stroke width at any scale

## Troubleshooting

### Duplicate Component Names

If you encounter duplicate component name errors:

```bash
# Use prefixes to differentiate
svgfusion ./ui-icons --prefix UI -o ./components
svgfusion ./brand-icons --prefix Brand -o ./components

# Or use suffixes
svgfusion ./icons --suffix Icon -o ./components
svgfusion ./logos --suffix Logo -o ./components
```

### Large Color Palettes

When using `--split-colors` with SVGs that have many colors, consider:

```bash
# Generate components first to see the color distribution
svgfusion ./icons --split-colors --dry-run

# Use selective color extraction for complex SVGs
svgfusion ./simple-icons --split-colors -o ./components
```

### Performance Tips

For large icon sets:

```bash
# Use recursive processing for nested directories
svgfusion ./assets --recursive --index -o ./components

# Generate index files for better tree-shaking
svgfusion ./icons --index --export-type named -o ./components
```
