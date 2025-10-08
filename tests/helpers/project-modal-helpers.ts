import { expect } from '@playwright/test';
import type { Page, Locator } from '@playwright/test';

/**
 * Helper class for interacting with the ProjectModal component in tests
 */
export class ProjectModalHelper {
	readonly page: Page;
	readonly modal: Locator;
	readonly modalBackdrop: Locator;
	readonly modalTitle: Locator;
	readonly closeButton: Locator;
	readonly modalContent: Locator;
	readonly loadingSpinner: Locator;
	readonly errorMessage: Locator;

	constructor(page: Page) {
		this.page = page;
		this.modal = page.locator('[role="dialog"][aria-modal="true"]');
		this.modalBackdrop = page.locator('button.fixed.inset-0[aria-label="Close modal"]');
		this.modalTitle = page.locator('#modal-title');
		this.closeButton = page.locator('button[aria-label="Close modal"]').last();
		this.modalContent = page.locator('.prose');
		this.loadingSpinner = page.locator('.animate-spin');
		this.errorMessage = page.locator('.text-red-500');
	}

	/**
	 * Check if the modal is currently open
	 */
	async isModalOpen(): Promise<boolean> {
		return await this.modal.isVisible();
	}

	/**
	 * Wait for the modal to open
	 */
	async waitForModalOpen() {
		await this.modal.waitFor({ state: 'visible', timeout: 5000 });
	}

	/**
	 * Wait for the modal to close
	 */
	async waitForModalClose() {
		await this.modal.waitFor({ state: 'hidden', timeout: 5000 });
	}

	/**
	 * Get the modal title text
	 */
	async getModalTitle(): Promise<string> {
		return (await this.modalTitle.textContent()) || '';
	}

	/**
	 * Click a project card to open the modal
	 * Uses data-testid to identify the card
	 */
	async openProjectByTitle(projectTitle: string) {
		// Map project titles to test IDs
		const testIdMap: Record<string, string> = {
			'This Beauty': 'project-card-this-beauty',
			'Manga App': 'project-card-manga-app',
			'Imi Permit': 'project-card-imi-permit'
		};

		const testId = testIdMap[projectTitle];
		if (!testId) {
			throw new Error(`Unknown project: ${projectTitle}`);
		}

		// Find and click the card button
		const cardButton = this.page.getByTestId(testId);

		// Wait for button to be ready and ensure page is idle
		await cardButton.waitFor({ state: 'visible', timeout: 5000 });
		await this.page.waitForLoadState('networkidle');
		await this.page.waitForTimeout(500); // Give time for any animations

		// Click the button
		await cardButton.click();

		// Wait for the modal to actually appear
		await this.modal.waitFor({ state: 'visible', timeout: 5000 });
	}

	/**
	 * Close the modal using the close button
	 */
	async closeByButton() {
		await this.closeButton.click();
		await this.page.waitForTimeout(500);
	}

	/**
	 * Close the modal by clicking the backdrop
	 */
	async closeByBackdrop() {
		await this.modalBackdrop.click({ position: { x: 10, y: 10 } });
		await this.page.waitForTimeout(500);
	}

	/**
	 * Close the modal using the Escape key
	 */
	async closeByEscapeKey() {
		await this.page.keyboard.press('Escape');
		await this.page.waitForTimeout(500);
	}

	/**
	 * Wait for content to finish loading
	 */
	async waitForContentLoad() {
		// Wait for spinner to disappear
		await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
	}

	/**
	 * Check if loading spinner is visible
	 */
	async isLoading(): Promise<boolean> {
		return await this.loadingSpinner.isVisible();
	}

	/**
	 * Check if error message is displayed
	 */
	async hasError(): Promise<boolean> {
		return await this.errorMessage.isVisible();
	}

	/**
	 * Get the error message text
	 */
	async getErrorMessage(): Promise<string> {
		return (await this.errorMessage.textContent()) || '';
	}

	/**
	 * Check if modal content is displayed
	 */
	async hasContent(): Promise<boolean> {
		return await this.modalContent.isVisible();
	}

	/**
	 * Get the modal content HTML
	 */
	async getContentHtml(): Promise<string> {
		return (await this.modalContent.innerHTML()) || '';
	}

	/**
	 * Assert modal is visible
	 */
	async assertModalVisible() {
		await expect(this.modal).toBeVisible();
	}

	/**
	 * Assert modal is not visible
	 */
	async assertModalNotVisible() {
		await expect(this.modal).not.toBeVisible();
	}

	/**
	 * Assert modal has correct ARIA attributes
	 */
	async assertAriaAttributes() {
		await expect(this.modal).toHaveAttribute('role', 'dialog');
		await expect(this.modal).toHaveAttribute('aria-modal', 'true');
		await expect(this.modal).toHaveAttribute('aria-labelledby', 'modal-title');
	}

	/**
	 * Assert close button is visible and accessible
	 */
	async assertCloseButtonVisible() {
		await expect(this.closeButton).toBeVisible();
		await expect(this.closeButton).toHaveAttribute('aria-label', 'Close modal');
	}

	/**
	 * Check if a specific heading exists in the content
	 */
	async hasHeading(text: string): Promise<boolean> {
		const heading = this.modalContent.locator(`h1:has-text("${text}"), h2:has-text("${text}"), h3:has-text("${text}")`);
		return await heading.isVisible();
	}

	/**
	 * Get all headings from the content
	 */
	async getHeadings(): Promise<string[]> {
		const headings = await this.modalContent.locator('h1, h2, h3').allTextContents();
		return headings;
	}

	/**
	 * Check if content contains specific text
	 */
	async contentContains(text: string): Promise<boolean> {
		const content = await this.getContentHtml();
		return content.includes(text);
	}
}

/**
 * Get a ProjectModalHelper instance for a page
 */
export function getProjectModalHelper(page: Page): ProjectModalHelper {
	return new ProjectModalHelper(page);
}
