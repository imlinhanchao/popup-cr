import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: 'index.ts',
    outDir: './dist/',
    format: 'esm',
    platform: 'browser',
    dts: false,
    target: 'esnext',
    sourcemap: false,
    clean: true,
    minify: true,
    treeshake: true,
    deps: {
      neverBundle: ['https://unpkg.com/vue@3/dist/vue.esm-browser.js'],
      onlyAllowBundle: false,
    },
  }, {
    entry: 'module.ts',
    outDir: './dist/',
    format: 'esm',
    platform: 'browser',
    dts: false,
    target: 'esnext',
    sourcemap: true,
    clean: false,
    treeshake: true,
    deps: {
      neverBundle: ['https://unpkg.com/vue@3/dist/vue.esm-browser.js'],
      onlyAllowBundle: false,
    },
  }
]);
