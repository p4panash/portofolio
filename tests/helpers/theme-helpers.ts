import type { Page } from '@playwright/test';

/**
 * Theme helper functions for testing dark mode functionality
 */
export class ThemeHelper {
	constructor(private page: Page) {}

	/**
	 * Toggle dark mode on/off
	 */
	async toggleDarkMode() {
		// Find and click the theme toggle button
		const themeToggle = this.page.getByRole('button', { name: /theme/i });
		await themeToggle.click();
		// Wait for theme transition
		await this.page.waitForTimeout(300);
	}

	/**
	 * Check if dark mode is currently active
	 */
	async isDarkMode(): Promise<boolean> {
		const htmlElement = this.page.locator('html');
		const classAttr = await htmlElement.getAttribute('class');
		return classAttr?.includes('dark') || false;
	}

	/**
	 * Ensure the page is in light mode
	 */
	async ensureLightMode() {
		if (await this.isDarkMode()) {
			await this.toggleDarkMode();
		}
	}

	/**
	 * Ensure the page is in dark mode
	 */
	async ensureDarkMode() {
		if (!(await this.isDarkMode())) {
			await this.toggleDarkMode();
		}
	}
}

/**
 * Get a ThemeHelper instance for a page
 */
export function getThemeHelper(page: Page): ThemeHelper {
	return new ThemeHelper(page);
}
