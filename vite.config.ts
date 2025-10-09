import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
	build: {
		sourcemap: true,
		// Disable minification in CI to preserve coverage instrumentation
		minify: process.env.CI ? false : 'esbuild'
	},
	plugins: [
		sveltekit(),
		istanbul({
			include: 'src/*',
			exclude: ['node_modules', 'tests/'],
			extension: ['.js', '.ts', '.svelte'],
			requireEnv: false,
			forceBuildInstrument: true
		})
	]
});
