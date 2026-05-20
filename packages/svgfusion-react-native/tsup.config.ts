import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  target: 'es2020',
  platform: 'neutral',
  treeshake: true,
  shims: true,
  external: [
    'svgfusion-core',
    'svgfusion-utils',
    'prettier',
    'react',
    'react-native',
    'react-native-svg',
  ],
});
