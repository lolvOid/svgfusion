import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/extension.ts'],
  format: ['cjs'], // VSCode extensions must be CommonJS
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false, // Keep readable for debugging
  target: 'node18',
  platform: 'node',
  external: ['vscode'],
  bundle: true,
  noExternal: ['svgfusion-dom', 'svgfusion-core', 'svgfusion-utils'],
  outDir: 'dist',
  shims: true,
});
