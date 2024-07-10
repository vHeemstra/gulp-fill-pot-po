import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  // sourcemap: true,
  clean: true,
  minify: true,
  shims: true,
  target: 'es2018',
  tsconfig: './tsconfig.json',
  silent: true,
});
