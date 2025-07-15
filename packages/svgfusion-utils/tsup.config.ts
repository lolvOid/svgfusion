import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      node: 'src/node.ts',
    },
    format: ['cjs', 'esm'],
    splitting: false,
    sourcemap: false,
    dts: true,
    clean: true,
    target: 'node18',
    outDir: 'dist',
    shims: true,
    minify: true,
    treeshake: true,
    platform: 'node',
  },
  {
    entry: {
      browser: 'src/browser.ts',
    },
    format: ['cjs', 'esm'],
    splitting: false,
    sourcemap: false,
    dts: true,
    clean: true,
    target: 'esnext',
    outDir: 'dist',
    shims: true,
    minify: true,
    treeshake: true,
    platform: 'browser',
  },
]);
