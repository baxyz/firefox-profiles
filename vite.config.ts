import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';

const metadata = JSON.parse(readFileSync('./metadata.json', 'utf-8'));

export default defineConfig({
  build: {
    lib: {
      entry: 'src/extension.ts',
      formats: ['es'],
      fileName: () => 'extension.js',
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    rollupOptions: {
      external: [
        /^gi:\/\/.*/,
        /^resource:\/\/.*/,
      ],
      output: {
        banner: `// NAME: ${metadata.name}\n// VERSION: ${metadata['shell-version'].join(', ')}\n`,
      },
    },
  },
  esbuild: {
    target: 'es2022',
  },
});
