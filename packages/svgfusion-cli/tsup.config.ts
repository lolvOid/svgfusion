import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true,
  target: 'node18',
  platform: 'node',
  treeshake: true,
  shims: true,
});
