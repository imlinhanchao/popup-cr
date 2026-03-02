import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: 'index.ts',
    format: 'iife',
    platform: 'browser',
    outDir: 'dist',
    clean: true,
    minify: true,
    deps: {
      alwaysBundle: ['alpinejs'],
      onlyAllowBundle: false,
    },
  }, {
    entry: 'module.ts',
    outDir: './dist/',
    format: ['esm'],
    platform: 'browser',
    dts: false,
    target: 'esnext',
    sourcemap: false,
    clean: false,
    treeshake: true,
    deps: {
      alwaysBundle: ['alpinejs'],
      onlyAllowBundle: false,
    },
  }
]);
