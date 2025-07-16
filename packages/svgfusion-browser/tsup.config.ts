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
  bundle: true,
  terserOptions: {
    compress: {
      drop_console: true,
      passes: 2,
    },
    output: {
      comments: false,
    },
  },
  noExternal: [
    'svgfusion-core/browser',
    'svgfusion-react',
    'svgfusion-vue',
    'svgfusion-utils/browser',
  ],
  external: [
    'fs',
    'path',
    'fs/promises',
    'prettier',
    'module',
    'url',
    'process',
    'assert',
    'v8',
    'util',
  ],
});
