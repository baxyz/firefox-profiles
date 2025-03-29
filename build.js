import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./src/extension.ts'], // Main entry point
  bundle: true, // Enables bundling
  outfile: './dist/extension.js', // Single output file
  platform: 'neutral', // Compatible with GNOME Shell
  format: 'esm', // ES Modules format
  target: 'es2022', // Target ES2022
  sourcemap: false, // Disables sourcemaps
  external: ['gi://*', 'resource://*'], // Excludes GNOME modules
}).catch(() => process.exit(1));
