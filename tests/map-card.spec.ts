import { test, expect } from '@playwright/test';
import { getMapCardHelper } from './helpers/map-helpers';

test.describe('MapCard Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the homepage where MapCard is rendered
		await page.goto('/');
	});

	test.describe('Map Rendering', () => {
		test('should render the MapCard component', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			// Wait for map to load
			await mapHelper.waitForMapLoad();

			// Verify map is visible
			expect(await mapHelper.isMapVisible()).toBe(true);
		});

		test('should display the custom marker with person on laptop emoji', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			// Wait for map and marker
			await mapHelper.waitForMapLoad();
			const marker = await mapHelper.waitForMarker();

			// Verify marker is visible
			await expect(marker).toBeVisible();

			// Verify marker contains the person on laptop emoji (👨🏼‍💻)
			await expect(marker.locator('text=👨🏼‍💻')).toBeVisible();
		});

		test('should have correct marker styling at initial zoom', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Find the marker circle
			const markerCircle = await mapHelper.getMarkerCircle();
			await expect(markerCircle).toBeVisible();

			// At initial zoom (10.5), marker should be large (w-20 h-20)
			expect(await mapHelper.isMarkerLarge()).toBe(true);

			// Verify it has the expected classes (semi-transparent blue background, white border)
			await expect(markerCircle).toHaveClass(/bg-blue-500/);
			await expect(markerCircle).toHaveClass(/border-white/);
		});

		test('should render Mapbox canvas element', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Verify Mapbox canvas exists
			const canvas = page.locator('.mapboxgl-canvas');
			await expect(canvas).toBeVisible();
		});
	});

	test.describe('Dynamic Marker Sizing', () => {
		test('should display large marker at initial zoom level', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// At initial zoom (10.5), marker should be large
			expect(await mapHelper.isMarkerLarge()).toBe(true);
			expect(await mapHelper.isMarkerSmall()).toBe(false);
		});

		test('should shrink marker after 3 zoom-out clicks', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Initially large
			expect(await mapHelper.isMarkerLarge()).toBe(true);

			// Zoom out 3 times (from 10.5 to ~7.5)
			await mapHelper.zoomOutMultiple(3);

			// Wait for transition
			await page.waitForTimeout(500);

			// Marker should now be small
			expect(await mapHelper.isMarkerSmall()).toBe(true);
			expect(await mapHelper.isMarkerLarge()).toBe(false);
		});

		test('should remain large after 2 zoom-out clicks', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Initially large
			expect(await mapHelper.isMarkerLarge()).toBe(true);

			// Zoom out only 2 times (from 10.5 to ~8.5)
			await mapHelper.zoomOutMultiple(2);

			// Wait for transition
			await page.waitForTimeout(500);

			// Marker should still be large (threshold is at 3 clicks)
			expect(await mapHelper.isMarkerLarge()).toBe(true);
			expect(await mapHelper.isMarkerSmall()).toBe(false);
		});

		test('should enlarge marker when zooming back in', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Zoom out 3 times to make it small
			await mapHelper.zoomOutMultiple(3);
			await page.waitForTimeout(500);

			// Verify marker is small
			expect(await mapHelper.isMarkerSmall()).toBe(true);

			// Zoom back in once
			await mapHelper.zoomInMultiple(1);
			await page.waitForTimeout(500);

			// Marker should be large again
			expect(await mapHelper.isMarkerLarge()).toBe(true);
			expect(await mapHelper.isMarkerSmall()).toBe(false);
		});

		test('should maintain small size at minimum zoom', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Zoom out to minimum
			await mapHelper.zoomOutMultiple(10);
			await page.waitForTimeout(500);

			// Marker should be small at minimum zoom (3)
			expect(await mapHelper.isMarkerSmall()).toBe(true);
		});

		test('should have smooth transition animation', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			const markerCircle = await mapHelper.getMarkerCircle();

			// Check for transition classes
			await expect(markerCircle).toHaveClass(/transition-all/);
			await expect(markerCircle).toHaveClass(/duration-300/);
		});
	});

	test.describe('Zoom Controls', () => {
		test('should display both zoom in and zoom out buttons', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.assertZoomControlsVisible();
		});

		test('should have correct aria-labels for accessibility', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Check aria-labels
			await expect(mapHelper.zoomInButton).toHaveAttribute('aria-label', 'Zoom in');
			await expect(mapHelper.zoomOutButton).toHaveAttribute('aria-label', 'Zoom out');
		});

		test('should position zoom controls in top-right corner', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Find the zoom controls container
			const zoomContainer = page.locator('.absolute.top-3.right-3');
			await expect(zoomContainer).toBeVisible();

			// Verify it contains both buttons
			const buttons = zoomContainer.locator('button');
			await expect(buttons).toHaveCount(2);
		});

		test('should display + and - symbols in buttons', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Check for + symbol
			await expect(mapHelper.zoomInButton.locator('text=+')).toBeVisible();

			// Check for - symbol
			await expect(mapHelper.zoomOutButton.locator('text=−')).toBeVisible();
		});
	});

	test.describe('Zoom Functionality', () => {
		test('should zoom out when clicking zoom out button', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Initially zoom out button should be enabled (we're at initial zoom 10.5)
			expect(await mapHelper.isZoomOutDisabled()).toBe(false);

			// Click zoom out
			await mapHelper.clickZoomOut();

			// Button should still be enabled (we haven't reached min zoom yet)
			expect(await mapHelper.isZoomOutDisabled()).toBe(false);
		});

		test('should not zoom in when at maximum zoom (initial zoom)', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// At initial load, we're at max zoom (10.5), so zoom in should be disabled
			expect(await mapHelper.isZoomInDisabled()).toBe(true);
		});

		test('should enable zoom in after zooming out', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Zoom in should be disabled initially
			expect(await mapHelper.isZoomInDisabled()).toBe(true);

			// Zoom out once
			await mapHelper.clickZoomOut();

			// Now zoom in should be enabled
			expect(await mapHelper.isZoomInDisabled()).toBe(false);
		});
	});

	test.describe('Zoom Limits', () => {
		test('should disable zoom in button at maximum zoom', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// At initial zoom (10.5 = MAX_ZOOM), button should be disabled
			expect(await mapHelper.isZoomInDisabled()).toBe(true);

			// Check disabled styling (40% opacity)
			const opacity = await mapHelper.getButtonOpacity(mapHelper.zoomInButton);
			expect(parseFloat(opacity || '1')).toBeLessThan(1);
		});

		test('should disable zoom out button at minimum zoom', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Zoom out multiple times to reach minimum (MIN_ZOOM = 3)
			// From 10.5, we need to zoom out about 7-8 times (each click = ~1 zoom level)
			await mapHelper.zoomOutMultiple(10);

			// Check if zoom out is now disabled
			expect(await mapHelper.isZoomOutDisabled()).toBe(true);

			// Check disabled styling
			const opacity = await mapHelper.getButtonOpacity(mapHelper.zoomOutButton);
			expect(parseFloat(opacity || '1')).toBeLessThan(1);
		});

		test('should not allow zooming beyond limits', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Try to zoom in when already at max
			const initialZoomInDisabled = await mapHelper.isZoomInDisabled();
			expect(initialZoomInDisabled).toBe(true);

			// Try clicking (should have no effect)
			await mapHelper.zoomInButton.click({ force: true });
			await page.waitForTimeout(500);

			// Should still be disabled
			expect(await mapHelper.isZoomInDisabled()).toBe(true);

			// Now zoom out to minimum
			await mapHelper.zoomOutMultiple(10);

			// Try to zoom out more
			const zoomOutDisabled = await mapHelper.isZoomOutDisabled();
			expect(zoomOutDisabled).toBe(true);

			// Try clicking (should have no effect)
			await mapHelper.zoomOutButton.click({ force: true });
			await page.waitForTimeout(500);

			// Should still be disabled
			expect(await mapHelper.isZoomOutDisabled()).toBe(true);
		});

		test('should update button states dynamically during zoom', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Start: zoom in disabled, zoom out enabled
			expect(await mapHelper.isZoomInDisabled()).toBe(true);
			expect(await mapHelper.isZoomOutDisabled()).toBe(false);

			// Zoom out once
			await mapHelper.clickZoomOut();

			// Middle state: both buttons enabled
			expect(await mapHelper.isZoomInDisabled()).toBe(false);
			expect(await mapHelper.isZoomOutDisabled()).toBe(false);

			// Zoom back in
			await mapHelper.clickZoomIn();

			// Back to start: zoom in disabled, zoom out enabled
			expect(await mapHelper.isZoomInDisabled()).toBe(true);
			expect(await mapHelper.isZoomOutDisabled()).toBe(false);
		});
	});

	test.describe('Dark Mode Integration', () => {
		test('should switch map style when toggling dark mode', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Start in light mode
			expect(await mapHelper.isDarkMode()).toBe(false);

			// Toggle to dark mode
			await mapHelper.toggleDarkMode();

			// Verify dark mode is active
			expect(await mapHelper.isDarkMode()).toBe(true);

			// Map should still be visible and functional
			expect(await mapHelper.isMapVisible()).toBe(true);
		});

		test('should maintain zoom controls visibility in dark mode', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Toggle to dark mode
			await mapHelper.toggleDarkMode();

			// Zoom controls should still be visible
			await mapHelper.assertZoomControlsVisible();

			// Buttons should still be functional
			expect(await mapHelper.isZoomInDisabled()).toBe(true);
			await mapHelper.clickZoomOut();
			expect(await mapHelper.isZoomInDisabled()).toBe(false);
		});

		test('should apply dark mode styling to zoom buttons', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Toggle to dark mode
			await mapHelper.toggleDarkMode();

			// Check that buttons have dark mode classes
			await expect(mapHelper.zoomInButton).toHaveClass(/dark:bg-dark-bg/);
			await expect(mapHelper.zoomOutButton).toHaveClass(/dark:bg-dark-bg/);
		});

		test('should keep marker visible in dark mode', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			const marker = await mapHelper.waitForMarker();

			// Toggle to dark mode
			await mapHelper.toggleDarkMode();

			// Marker should still be visible
			await expect(marker).toBeVisible();
			await expect(marker.locator('text=💻')).toBeVisible();
		});

		test('should toggle between light and dark mode multiple times', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Toggle dark mode on
			await mapHelper.toggleDarkMode();
			expect(await mapHelper.isDarkMode()).toBe(true);

			// Toggle back to light mode
			await mapHelper.toggleDarkMode();
			expect(await mapHelper.isDarkMode()).toBe(false);

			// Toggle dark mode on again
			await mapHelper.toggleDarkMode();
			expect(await mapHelper.isDarkMode()).toBe(true);

			// Map should remain functional
			expect(await mapHelper.isMapVisible()).toBe(true);
			await mapHelper.assertZoomControlsVisible();
		});
	});

	test.describe('Accessibility', () => {
		test('should have proper disabled state for screen readers', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Zoom in button should be disabled at max zoom
			await expect(mapHelper.zoomInButton).toBeDisabled();

			// Zoom out once
			await mapHelper.clickZoomOut();

			// Now zoom in should be enabled
			await expect(mapHelper.zoomInButton).toBeEnabled();
		});

		test('should have proper cursor styling on disabled buttons', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Check cursor style on disabled zoom in button
			const cursor = await mapHelper.getComputedStyle(mapHelper.zoomInButton, 'cursor');
			expect(cursor).toBe('not-allowed');
		});

		test('should maintain focus visibility on zoom controls', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Focus on zoom out button
			await mapHelper.zoomOutButton.focus();

			// Check if it's focused
			await expect(mapHelper.zoomOutButton).toBeFocused();
		});
	});

	// Visual Regression Tests
	// Note: Skip these tests if you don't have baseline screenshots yet
	// Run with --update-snapshots to generate baselines first
	test.describe('Visual Regression', () => {
		test('should match screenshot in light mode', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Take screenshot of the entire page
			await expect(page).toHaveScreenshot('map-card-light-mode.png', {
				maxDiffPixels: 100 // Allow some tolerance for map tiles loading
			});
		});

		test('should match screenshot in dark mode', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();
			await mapHelper.waitForMarker();

			// Toggle to dark mode
			await mapHelper.toggleDarkMode();
			await page.waitForTimeout(500);

			// Take screenshot
			await expect(page).toHaveScreenshot('map-card-dark-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match screenshot with zoom controls', async ({ page }) => {
			const mapHelper = getMapCardHelper(page);

			await mapHelper.waitForMapLoad();

			// Take screenshot focused on zoom controls
			const zoomContainer = page.locator('.absolute.top-3.right-3');
			await expect(zoomContainer).toHaveScreenshot('zoom-controls.png');
		});
	});
});
