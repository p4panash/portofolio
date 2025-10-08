import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	// Detect system preference
	const prefersDark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches;
	const { subscribe, set, update } = writable(prefersDark);

	// Apply initial theme
	if (browser) {
		if (prefersDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	return {
		subscribe,
		toggle: () => {
			update((darkMode) => {
				const newMode = !darkMode;
				if (browser) {
					if (newMode) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
				}
				return newMode;
			});
		},
		set
	};
}

export const darkMode = createThemeStore();
