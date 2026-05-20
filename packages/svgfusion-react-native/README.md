# SVGFusion React Native

React Native component generator for SVGFusion. Generates React Native components backed by [react-native-svg](https://github.com/software-mansion/react-native-svg).

## Installation

```bash
npm install svgfusion-react-native
```

This package only contains the React Native generator. You usually want to install it alongside `svgfusion-core` (and the consuming app must have `react-native-svg`):

```bash
npm install svgfusion-core svgfusion-react-native react-native-svg
```

Most users should install the `svgfusion` bundle instead — it already re-exports `ReactNativeGenerator` and the `convertToReactNative()` helper.

## Usage

### Through the bundle (recommended)

```typescript
import { convertToReactNative } from 'svgfusion';

const svgContent = '<svg viewBox="0 0 24 24">...</svg>';

const result = await convertToReactNative(svgContent, {
  generator: {
    componentName: 'StarIcon',
    typescript: true,
  },
});

console.log(result.code);
```

### Direct generator usage

```typescript
import { SVGFusion } from 'svgfusion-core';
import { ReactNativeGenerator } from 'svgfusion-react-native';

const engine = new SVGFusion();
const result = await engine.convert(
  svgContent,
  {
    framework: 'react-native',
    generator: { componentName: 'StarIcon', typescript: true },
  },
  ReactNativeGenerator
);
```

## Features

- React Native component generation via `react-native-svg`
- TypeScript support
- `memo` and `forwardRef` wrappers (configurable)
- Color and stroke-width prop splitting through the shared transformation pipeline
- Works with both Expo and bare React Native workflows

## Peer Dependencies

| Package            | Required Version |
| ------------------ | ---------------- |
| `react`            | `>=16.8.0`       |
| `react-native`     | `>=0.60.0`       |
| `react-native-svg` | `>=12.0.0`       |

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation.

## License

MIT
