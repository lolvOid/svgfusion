# SVGFusion Demo Runner

A comprehensive script to generate components and run demo applications for both React and Vue frameworks.

## Quick Start

```bash
# Full demo setup (generate + install + run)
npm run demo

# Or use the script directly
node scripts/run_demo.js
```

## Available Commands

### NPM Scripts

```bash
npm run demo              # Generate, install, and run all demos
npm run demo:generate     # Generate React and Vue components only
npm run demo:install      # Install demo dependencies only
npm run demo:run          # Run existing demos only
```

### Direct Script Usage

```bash
node scripts/run_demo.js [command]

# Commands:
node scripts/run_demo.js all         # Default: generate + install + run
node scripts/run_demo.js generate    # Generate components from SVGs
node scripts/run_demo.js install     # Install demo dependencies
node scripts/run_demo.js run         # Start dev servers
node scripts/run_demo.js help        # Show help
```

## What It Does

### 1. Generate Components

- Builds the latest SVGFusion library
- Converts SVG files from `demo/svgs/` into React and Vue components
- Generates TypeScript components with:
  - Color customization props
  - Size props
  - Accessibility features
  - ViewBox preservation
  - Index files for easy importing

### 2. Install Dependencies

- Installs React demo dependencies (if `demo/react-demo/` exists)
- Installs Vue demo dependencies (if `demo/vue-demo/` exists)

### 3. Run Development Servers

- Starts React demo at `http://localhost:5175/` (or next available port)
- Starts Vue demo at `http://localhost:5176/` (or next available port)
- Runs both servers concurrently
- Graceful shutdown with Ctrl+C

## Demo Structure

```
demo/
├── svgs/                           # Source SVG files
├── generate-react-icons.js        # React component generator
├── generate-vue-icons.js          # Vue component generator
├── react-demo/                    # React demo application
│   └── src/components/icons/       # Generated React components
└── vue-demo/                      # Vue demo application
    └── src/components/icons/       # Generated Vue components
```

## Generated Components Features

### React Components (.tsx)

- TypeScript support with full type safety
- SVG props inheritance (`React.SVGProps<SVGSVGElement>`)
- Dynamic color props with CSS classes
- Size props for responsive scaling
- Accessibility with title/desc support
- forwardRef support

### Vue Components (.vue)

- Single File Component (SFC) format
- TypeScript with Composition API
- Script setup syntax
- SVG attributes inheritance with `v-bind="$attrs"`
- Dynamic color props with Vue classes
- Size props for responsive scaling
- Accessibility with title/desc support

## Example Usage

After running the demo, you can use the generated components like this:

### React

```tsx
import { GradientIcon, BrowserifyIcon } from './components/icons';

function App() {
  return (
    <div>
      <GradientIcon size="32" color="#ff0000" />
      <BrowserifyIcon size="24" color="#00ff00" colorClass="my-custom-class" />
    </div>
  );
}
```

### Vue

```vue
<template>
  <div>
    <GradientIcon size="32" color="#ff0000" />
    <BrowserifyIcon
      size="24"
      color="#00ff00"
      :color-class="'my-custom-class'"
    />
  </div>
</template>

<script setup>
import { GradientIcon, BrowserifyIcon } from './components/icons';
</script>
```

## Troubleshooting

### Port Conflicts

The demo runner automatically finds available ports if the default ones are in use.

### Build Errors

The script automatically rebuilds SVGFusion before generating components to ensure you're using the latest code.

### Missing Dependencies

Run `npm run demo:install` to ensure all demo dependencies are installed.

### Component Generation Issues

Check that SVG files exist in `demo/svgs/` and are valid SVG format.
