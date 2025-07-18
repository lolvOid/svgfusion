# SVGFusion Packages

SVGFusion is available as three main packages designed for different use cases.

## Package Overview

### **For General Usage**

#### `svgfusion` - Complete Toolkit

The main package that includes everything you need for SVG to component conversion.

```bash
npm install svgfusion
```

**Includes:**

- CLI functionality
- Node.js API
- Browser API
- React and Vue 3 support
- TypeScript definitions
- All transformation features

**Use when:** You want the complete SVGFusion experience with all features.

---

### **For Specialized Usage**

#### `svgfusion-cmd` - Command Line Interface

Standalone CLI tool for converting SVG files with batch processing capabilities.

```bash
npm install -g svgfusion-cmd
# or
npx svgfusion-cmd
```

**Features:**

- Batch processing
- Watch mode
- Framework support (React & Vue)
- TypeScript generation
- Configuration files
- Production-ready workflow

**Use when:** You only need command-line SVG conversion or CI/CD integration.

#### `svgfusion-dom` - Browser Package

Browser-optimized package for client-side conversion with zero Node.js dependencies.

```bash
npm install svgfusion-dom
```

**Features:**

- Zero Node.js dependencies
- Real-time conversion
- Framework support (React & Vue)
- Perfect for online editors
- CDN support

**Use when:** Building web applications, online editors, or playgrounds.

---

## Migration Guide

### From Previous Versions

If you're upgrading from an earlier version of SVGFusion, no changes are needed. The main `svgfusion` package maintains full backward compatibility.

```bash
# This still works exactly the same
npm install svgfusion
npx svgfusion ./icons --output ./components
```

### Choosing the Right Package

| Use Case             | Recommended Package | Installation                   |
| -------------------- | ------------------- | ------------------------------ |
| **General usage**    | `svgfusion`         | `npm install svgfusion`        |
| **CLI only**         | `svgfusion-cmd`     | `npm install -g svgfusion-cmd` |
| **Browser/Web apps** | `svgfusion-dom`     | `npm install svgfusion-dom`    |

---

## Package Comparison

| Feature          | svgfusion        | svgfusion-cmd     | svgfusion-dom |
| ---------------- | ---------------- | ----------------- | ------------- |
| **CLI Support**  | ✅               | ✅                | ❌            |
| **Node.js API**  | ✅               | ❌                | ❌            |
| **Browser API**  | ✅               | ❌                | ✅            |
| **Dependencies** | Full             | CLI optimized     | Zero runtime  |
| **Use Case**     | Complete toolkit | Command-line only | Browser-only  |

---

## Getting Started

### With Complete Toolkit

```bash
npm install svgfusion
```

Use for full feature access including CLI, Node.js API, and browser support.

### With CLI Only

```bash
npm install -g svgfusion-cmd
npx svgfusion-cmd ./icons --output ./components
```

Perfect for build processes and CI/CD workflows.

### With Browser Only

```bash
npm install svgfusion-dom
```

Ideal for web applications and online editors with minimal bundle impact.
