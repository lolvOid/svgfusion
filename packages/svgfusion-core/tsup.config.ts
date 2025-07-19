import { defineConfig } from 'tsup';

export default defineConfig([
  // Node.js build
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
    platform: 'neutral',
    external: ['prettier', 'jsdom'],
  },
  // Browser build
  {
    entry: ['src/browser.ts'],
    format: ['esm', 'cjs'],
    splitting: false,
    sourcemap: false,
    dts: true,
    clean: false,
    target: 'es2020',
    outDir: 'dist',
    outExtension: (ctx) => ({
      js: ctx.format === 'cjs' ? '.js' : '.mjs',
    }),
    shims: true,
    minify: true,
    treeshake: true,
    platform: 'browser',
    external: ['prettier'],
    define: {
      'window': 'globalThis',
      'DOMParser': 'globalThis.DOMParser',
    },
  },
]);
