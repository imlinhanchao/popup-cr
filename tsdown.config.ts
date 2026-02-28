import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'index.ts',
  format: 'iife',
  platform: 'browser',
  outDir: 'dist',
  clean: true,
  deps: {
    alwaysBundle: ['serajs'],
    onlyAllowBundle: false,
  },
});
