import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  target: 'es2020',
  platform: 'neutral',
  treeshake: true,
  shims: true,
  external: ['svgfusion-core', 'prettier'],
});
