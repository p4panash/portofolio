import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x',
			// Enable edge runtime for better performance
			split: false
		}),
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore missing resume.pdf during build
				if (path === '/resume.pdf') {
					return;
				}
				// Ignore missing responsive images (some images are too small to have all sizes)
				if (path.match(/-\d+w\.webp$/)) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
