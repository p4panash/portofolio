import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

/**
 * Helper class for interacting with the Carousel component in tests
 */
export class CarouselHelper {
	readonly prevButton: Locator;
	readonly nextButton: Locator;
	readonly expandedModal: Locator;
	readonly closeButton: Locator;

	constructor(private page: Page) {
		this.prevButton = page.getByRole('button', { name: 'Previous slide' }).first();
		this.nextButton = page.getByRole('button', { name: 'Next slide' }).first();
		this.expandedModal = page.locator('[role="dialog"][aria-modal="true"]');
		this.closeButton = page.getByRole('button', { name: 'Close expanded view' });
	}

	/**
	 * Wait for carousel images to load
	 */
	async waitForCarouselLoad() {
		// Wait for at least one image to be visible
		await this.page.locator('img[alt*="Carousel slide"]').first().waitFor({ state: 'visible' });
		await this.page.waitForTimeout(500); // Wait for transitions

		// Navigate to slide 0 to ensure consistent starting state
		await this.goToSlide(0);
	}

	/**
	 * Get all carousel dot indicators
	 */
	getDots(): Locator {
		return this.page.locator('button[aria-label*="Go to slide"]');
	}

	/**
	 * Get the active dot indicator
	 */
	getActiveDot(): Locator {
		return this.page.locator('button[aria-label*="Go to slide"].w-6');
	}

	/**
	 * Click on a specific dot to navigate to that slide
	 */
	async goToSlide(index: number) {
		const dot = this.page.getByRole('button', { name: `Go to slide ${index + 1}` });
		await dot.click();
		await this.page.waitForTimeout(600); // Wait for transition
	}

	/**
	 * Click the next button to advance to the next slide
	 */
	async clickNext() {
		await this.nextButton.click();
		await this.page.waitForTimeout(600); // Wait for transition
	}

	/**
	 * Click the previous button to go to the previous slide
	 */
	async clickPrevious() {
		await this.prevButton.click();
		await this.page.waitForTimeout(600); // Wait for transition
	}

	/**
	 * Get the current slide image
	 */
	getCurrentSlideImage(): Locator {
		return this.page.locator('.opacity-100 img[alt*="Carousel slide"]').first();
	}

	/**
	 * Click on the current image to expand it
	 */
	async expandCurrentImage() {
		// Wait for carousel to stabilize
		await this.page.waitForTimeout(600);

		// Get the active slide index and click on that specific expand button
		const activeIndex = await this.getActiveSlideIndex();
		const expandButtons = this.page.getByRole('button', { name: 'Expand image' });
		await expandButtons.nth(activeIndex).click({ force: true });
		await this.page.waitForTimeout(300); // Wait for modal animation
	}

	/**
	 * Check if the expanded modal is visible
	 */
	async isExpanded(): Promise<boolean> {
		return await this.expandedModal.isVisible();
	}

	/**
	 * Close the expanded view
	 */
	async closeExpandedView() {
		await this.closeButton.click();
		await this.page.waitForTimeout(300); // Wait for modal close animation
	}

	/**
	 * Close expanded view by clicking backdrop
	 */
	async closeByBackdrop() {
		await this.expandedModal.click({ position: { x: 10, y: 10 } });
		await this.page.waitForTimeout(300);
	}

	/**
	 * Close expanded view by pressing Escape key
	 */
	async closeByEscapeKey() {
		await this.page.keyboard.press('Escape');
		await this.page.waitForTimeout(300);
	}

	/**
	 * Get the expanded image
	 */
	getExpandedImage(): Locator {
		return this.expandedModal.locator('img[alt*="Expanded view"]');
	}

	/**
	 * Get navigation buttons in expanded view
	 */
	getExpandedPrevButton(): Locator {
		return this.expandedModal.getByRole('button', { name: 'Previous slide' });
	}

	getExpandedNextButton(): Locator {
		return this.expandedModal.getByRole('button', { name: 'Next slide' });
	}

	/**
	 * Navigate in expanded view
	 */
	async clickNextInExpanded() {
		await this.getExpandedNextButton().click();
		await this.page.waitForTimeout(600);
	}

	async clickPreviousInExpanded() {
		await this.getExpandedPrevButton().click();
		await this.page.waitForTimeout(600);
	}

	/**
	 * Assert carousel controls are visible
	 */
	async assertControlsVisible() {
		await expect(this.prevButton).toBeVisible();
		await expect(this.nextButton).toBeVisible();
		await expect(this.getDots().first()).toBeVisible();
	}

	/**
	 * Count total number of slides
	 */
	async getSlideCount(): Promise<number> {
		return await this.getDots().count();
	}

	/**
	 * Get the index of the active slide (0-based)
	 */
	async getActiveSlideIndex(): Promise<number> {
		const activeDot = this.getActiveDot();
		const ariaLabel = await activeDot.getAttribute('aria-label');
		const match = ariaLabel?.match(/Go to slide (\d+)/);
		return match ? parseInt(match[1]) - 1 : 0;
	}
}

/**
 * Get a CarouselHelper instance for a page
 */
export function getCarouselHelper(page: Page): CarouselHelper {
	return new CarouselHelper(page);
}
