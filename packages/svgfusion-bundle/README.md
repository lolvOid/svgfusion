<div align="center">
  <img src="https://i.ibb.co/TZFfpFL/logo.png" alt="SVGFusion Logo" width="120" height="120">

# SVGFusion

**Convert SVG files into React and Vue 3 components**

[![npm version](https://img.shields.io/npm/v/svgfusion)](https://www.npmjs.com/package/svgfusion)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=flat&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)

[Documentation](https://svgfusion.netlify.app) • [CLI Reference](https://svgfusion.netlify.app/docs/cli-usage) • [Interactive Playground](https://svgfusion.netlify.app/playground)

</div>

## Features

- **React & Vue Support**: Generate components for both frameworks from the same SVG
- **TypeScript Ready**: Full TypeScript support with proper type definitions
- **Advanced Color Splitting**: Intelligent color extraction with fill/stroke optimization
- **Stroke Width Splitting**: Extract stroke widths as component props
- **Native SVG Props**: Components extend React.SVGProps and Vue SVGAttributes
- **Batch Processing**: Convert entire directories of SVG files
- **Browser Support**: Use directly in browsers with full feature support

## Installation

```bash
npm install svgfusion
```

## Quick Start

### React Component

```typescript
import { convertSvgToReact } from 'svgfusion';

const svgCode = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

const result = await convertSvgToReact(svgCode, {
  componentName: 'StarIcon',
  typescript: true,
  splitColors: true,
});

console.log(result.component);
```

### Vue Component

```typescript
import { convertSvgToVue } from 'svgfusion';

const result = await convertSvgToVue(svgCode, {
  componentName: 'StarIcon',
  typescript: true,
  splitColors: true,
});

console.log(result.component);
```

### CLI Usage

Coming soon! For now, clone the repository and use:

```bash
git clone https://github.com/lolvOid/svgfusion
cd svgfusion
pnpm install
pnpm build
pnpm --filter=svgfusion-bundle exec svgfusion icon.svg --react --typescript
```

### Browser Usage

```html
<script type="module">
  import {
    convertSvgToReact,
    convertSvgToVue,
  } from 'https://cdn.jsdelivr.net/npm/svgfusion@1.25.2/+esm';

  const svgCode = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

  const result = await convertSvgToReact(svgCode, {
    componentName: 'StarIcon',
    typescript: true,
  });

  console.log(result.component);
</script>
```

Or import the browser-optimized version:

```javascript
import { convertSvgToReact, convertSvgToVue } from 'svgfusion/browser';
// No Node.js dependencies required
```

## Documentation

- **[Full Documentation](https://svgfusion.netlify.app)** - Complete guides and API reference
- **[Interactive Playground](https://svgfusion.netlify.app/playground)** - Try SVGFusion in your browser
- **[CLI Reference](https://svgfusion.netlify.app/docs/cli-usage)** - Command-line documentation
- **[API Reference](https://svgfusion.netlify.app/docs/api)** - Programmatic usage
- **[Examples](https://svgfusion.netlify.app/docs/examples)** - Real-world use cases

## License

MIT License - see [LICENSE](LICENSE) for details.
