import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
	build: {
		sourcemap: true
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
