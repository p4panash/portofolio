import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';
import { getThemeHelper } from './theme-helpers';

/**
 * Helper class for interacting with the MapCard component in tests
 */
export class MapCardHelper {
	readonly page: Page;
	readonly zoomInButton: Locator;
	readonly zoomOutButton: Locator;
	readonly mapContainer: Locator;

	constructor(page: Page) {
		this.page = page;
		this.zoomInButton = page.getByRole('button', { name: 'Zoom in' });
		this.zoomOutButton = page.getByRole('button', { name: 'Zoom out' });
		this.mapContainer = page.locator('.mapboxgl-canvas');
	}

	/**
	 * Wait for the Mapbox map to fully load
	 */
	async waitForMapLoad() {
		// Wait for the Mapbox canvas to be visible
		await this.mapContainer.waitFor({ state: 'visible', timeout: 10000 });

		// Wait a bit for the map to stabilize
		await this.page.waitForTimeout(1000);
	}

	/**
	 * Wait for the custom marker (laptop emoji) to be visible
	 */
	async waitForMarker() {
		const marker = this.page.locator('.custom-marker');
		await marker.waitFor({ state: 'visible', timeout: 5000 });
		return marker;
	}

	/**
	 * Check if zoom in button is disabled
	 */
	async isZoomInDisabled(): Promise<boolean> {
		return await this.zoomInButton.isDisabled();
	}

	/**
	 * Check if zoom out button is disabled
	 */
	async isZoomOutDisabled(): Promise<boolean> {
		return await this.zoomOutButton.isDisabled();
	}

	/**
	 * Click the zoom in button
	 */
	async clickZoomIn() {
		await this.zoomInButton.click();
		// Wait for zoom animation
		await this.page.waitForTimeout(500);
	}

	/**
	 * Click the zoom out button
	 */
	async clickZoomOut() {
		await this.zoomOutButton.click();
		// Wait for zoom animation
		await this.page.waitForTimeout(500);
	}

	/**
	 * Toggle dark mode (uses shared ThemeHelper)
	 */
	async toggleDarkMode() {
		const theme = getThemeHelper(this.page);
		await theme.toggleDarkMode();
	}

	/**
	 * Check if dark mode is active (uses shared ThemeHelper)
	 */
	async isDarkMode(): Promise<boolean> {
		const theme = getThemeHelper(this.page);
		return await theme.isDarkMode();
	}

	/**
	 * Get the opacity of a button (to check disabled styling)
	 */
	async getButtonOpacity(button: Locator): Promise<string | null> {
		return await button.evaluate((el) => window.getComputedStyle(el).opacity);
	}

	/**
	 * Check if the map canvas exists and is visible
	 */
	async isMapVisible(): Promise<boolean> {
		return await this.mapContainer.isVisible();
	}

	/**
	 * Zoom in multiple times
	 */
	async zoomInMultiple(times: number) {
		for (let i = 0; i < times; i++) {
			if (!(await this.isZoomInDisabled())) {
				await this.clickZoomIn();
			}
		}
	}

	/**
	 * Zoom out multiple times
	 */
	async zoomOutMultiple(times: number) {
		for (let i = 0; i < times; i++) {
			if (!(await this.isZoomOutDisabled())) {
				await this.clickZoomOut();
			}
		}
	}

	/**
	 * Assert that zoom controls are visible
	 */
	async assertZoomControlsVisible() {
		await expect(this.zoomInButton).toBeVisible();
		await expect(this.zoomOutButton).toBeVisible();
	}

	/**
	 * Get the computed style of an element
	 */
	async getComputedStyle(locator: Locator, property: string): Promise<string> {
		return await locator.evaluate(
			(el, prop) => window.getComputedStyle(el).getPropertyValue(prop),
			property
		);
	}

	/**
	 * Get the marker circle element
	 */
	async getMarkerCircle(): Promise<Locator> {
		return this.page.locator('.marker-circle');
	}

	/**
	 * Check if marker has small radius (country-level zoom)
	 */
	async isMarkerSmall(): Promise<boolean> {
		const markerCircle = await this.getMarkerCircle();
		const classes = await markerCircle.getAttribute('class');
		return (classes?.includes('w-12') && classes?.includes('h-12')) || false;
	}

	/**
	 * Check if marker has large radius (city-level zoom)
	 */
	async isMarkerLarge(): Promise<boolean> {
		const markerCircle = await this.getMarkerCircle();
		const classes = await markerCircle.getAttribute('class');
		return (classes?.includes('w-20') && classes?.includes('h-20')) || false;
	}

	/**
	 * Get the marker element
	 */
	async getMarker(): Promise<Locator> {
		return this.page.locator('.custom-marker');
	}
}

/**
 * Helper function to create a MapCardHelper instance
 */
export function getMapCardHelper(page: Page): MapCardHelper {
	return new MapCardHelper(page);
}
