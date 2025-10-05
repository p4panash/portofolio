/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				// Light theme colors
				'light-bg': '#F8F9FA',
				'light-text': '#111827',
				'light-secondary': '#9CA3AF',

				// Dark theme colors
				'dark-bg': '#1F1D36',
				'dark-text': '#D1D5DB',
				'dark-secondary': '#A6A6A6',

				// Common accent colors
				'vivid-blue': '#6C63FF',
				'hover-blue': '#5C52DB'
			},
			boxShadow: {
				'soft-glow': '0 0 5px #6C63FF'
			}
		}
	},
	plugins: [],
	darkMode: 'selector'
};
