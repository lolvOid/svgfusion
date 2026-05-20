# SVGFusion React Native

React Native component generator for SVGFusion. Generates React Native components using [react-native-svg](https://github.com/software-mansion/react-native-svg).

## Installation

```bash
npm install svgfusion-react-native
```

## Usage

```typescript
import { ReactNativeGenerator } from 'svgfusion-react-native';

const generator = new ReactNativeGenerator({
  componentName: 'MyIcon',
  typescript: true,
});
```

## Features

- React Native component generation via `react-native-svg`
- TypeScript support
- `memo` and `forwardRef` wrappers
- Expo and bare workflow compatible

## Documentation

Visit [svgfusion.netlify.app](https://svgfusion.netlify.app) for complete documentation.

## License

MIT
