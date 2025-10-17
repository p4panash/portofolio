import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
	build: {
		sourcemap: true,
		// Disable minification in CI to preserve coverage instrumentation
		minify: process.env.CI ? false : 'esbuild',
		// Increase chunk size warning limit - we have large dependencies like mapbox-gl
		// The gzipped size is more important (and much smaller)
		chunkSizeWarningLimit: 2000,
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Separate mapbox-gl into its own chunk (large library ~450KB)
					if (id.includes('mapbox-gl')) {
						return 'mapbox';
					}
					// Separate marked (markdown parser) into its own chunk
					if (id.includes('marked')) {
						return 'markdown';
					}
					// Keep icons in a separate chunk
					if (id.includes('@icons-pack')) {
						return 'icons';
					}
					// Separate coverage instrumentation in non-production builds
					if (id.includes('istanbul') || id.includes('__coverage__')) {
						return 'coverage';
					}
					// Group all node_modules except the ones above into vendor chunk
					if (id.includes('node_modules')) {
						return 'vendor';
					}
				}
			}
		}
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
