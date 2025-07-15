import { defineConfig } from 'tsup';

export default defineConfig([
  // Library build
  {
    entry: ['src/index.ts'],
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
    external: ['prettier'],
  },
]);
