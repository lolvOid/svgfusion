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

## What's Included

This package includes everything you need for SVG to component conversion:

- **CLI Tool** - Convert SVG files from command line
- **Node.js API** - Programmatic conversion in Node.js
- **Module API** - Browser-compatible module for web apps
- **React & Vue Support** - Generate components for both frameworks
- **TypeScript Ready** - Full TypeScript support with proper types

## Installation

```bash
npm install svgfusion
```

## Quick Start

### CLI Usage

```bash
# Clone the repository
git clone https://github.com/lolvOid/svgfusion
cd svgfusion
pnpm install

# Build first (required)
pnpm build

# Use the CLI
pnpm svgfusion icon.svg --framework react --output ./components
pnpm svgfusion ./icons --framework vue --typescript --output ./components
```

### Module Usage (Browser/Web Apps)

```javascript
import { convertToReact, convertToVue } from 'svgfusion/browser';

const svgCode = `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;

// React component
const reactResult = await convertToReact(svgCode, {
  componentName: 'StarIcon',
  typescript: true,
  splitColors: true,
});

// Vue component
const vueResult = await convertToVue(svgCode, {
  componentName: 'StarIcon',
  typescript: true,
  splitColors: true,
});
```

### Node.js API

```javascript
import { SVGFusion } from 'svgfusion';

const engine = new SVGFusion();
const result = await engine.convert(svgContent, {
  framework: 'react',
  transformation: { splitColors: true },
  generator: { typescript: true, componentName: 'MyIcon' },
});
```

## Documentation

For complete guides, API reference, and examples visit [svgfusion.netlify.app](https://svgfusion.netlify.app)

## License

MIT
