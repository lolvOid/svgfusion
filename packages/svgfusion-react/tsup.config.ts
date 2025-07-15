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
  external: ['svgfusion-core', 'prettier'],
});
