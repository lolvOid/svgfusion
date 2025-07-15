import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build
  {
    entry: {
      node: 'src/index.ts',
    },
    format: ['esm', 'cjs'],
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
  // Browser build
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    splitting: false,
    sourcemap: false,
    dts: true,
    clean: false,
    target: 'es2020',
    outDir: 'dist',
    shims: true,
    minify: true,
    treeshake: true,
    platform: 'browser',
  },
]);
