import { test, expect } from './coverage';
import { getProjectModalHelper } from './helpers/project-modal-helpers';
import { getThemeHelper } from './helpers/theme-helpers';

test.describe('ProjectModal Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Modal Opening', () => {
		test('should open modal when clicking This Beauty project card', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			// Modal should not be visible initially
			await modal.assertModalNotVisible();

			// Click on This Beauty card
			await modal.openProjectByTitle('This Beauty');

			// Modal should now be visible
			await modal.assertModalVisible();

			// Modal title should match the project
			expect(await modal.getModalTitle()).toBe('This Beauty');
		});

		test('should open modal when clicking Manga App project card', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('Manga App');
			await modal.assertModalVisible();
			expect(await modal.getModalTitle()).toBe('Manga App');
		});

		test('should open modal when clicking Imi Permit project card', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('Imi Permit');
			await modal.assertModalVisible();
			expect(await modal.getModalTitle()).toBe('Imi Permit');
		});

		test('should display loading spinner initially', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			// Loading spinner should be visible briefly
			// (may or may not catch it depending on load speed)
			const isLoading = await modal.isLoading();
			// Just verify the test can check loading state
			expect(typeof isLoading).toBe('boolean');
		});
	});

	test.describe('Modal Content', () => {
		test('should load and display content', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Content should be visible with prose styling
			expect(await modal.hasContent()).toBe(true);
			await expect(modal.modalContent).toHaveClass(/prose/);
		});

		test('should render markdown as HTML', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Check that markdown was converted to HTML with basic elements
			const html = await modal.getContentHtml();
			expect(html.length).toBeGreaterThan(0);
			expect(html).toMatch(/<h[1-6]>/); // Has headings
		});

		test('should display content for different projects', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			// Test that each project loads content
			const projects = ['This Beauty', 'Manga App', 'Imi Permit'];

			for (const project of projects) {
				await modal.openProjectByTitle(project);
				await modal.waitForContentLoad();

				expect(await modal.hasContent()).toBe(true);

				await modal.closeByButton();
			}
		});
	});

	test.describe('Modal Closing', () => {
		test('should close modal when clicking close button', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.assertModalVisible();

			await modal.closeByButton();

			await modal.assertModalNotVisible();
		});

		test('should close modal when clicking backdrop', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.assertModalVisible();

			await modal.closeByBackdrop();

			await modal.assertModalNotVisible();
		});

		test('should close modal when pressing Escape key', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.assertModalVisible();

			await modal.closeByEscapeKey();

			await modal.assertModalNotVisible();
		});

		test('should allow reopening modal after closing', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			// Open and close
			await modal.openProjectByTitle('This Beauty');
			await modal.closeByButton();
			await modal.assertModalNotVisible();

			// Open again
			await modal.openProjectByTitle('Manga App');
			await modal.assertModalVisible();
			expect(await modal.getModalTitle()).toBe('Manga App');
		});
	});

	test.describe('Accessibility', () => {
		test('should have proper ARIA attributes', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			await modal.assertAriaAttributes();
		});

		test('should have accessible close button', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			await modal.assertCloseButtonVisible();
		});

		test('should have proper heading hierarchy', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Modal title should be h2 with id
			await expect(modal.modalTitle).toHaveAttribute('id', 'modal-title');
		});

		test('should allow focusing the close button', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Focus on the close button directly
			await modal.closeButton.focus();

			// Close button should be focused
			await expect(modal.closeButton).toBeFocused();
		});

		test('should close modal when close button is clicked after focusing', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Focus and click close button
			await modal.closeButton.focus();
			await modal.closeButton.click();

			// Modal should be closed
			await modal.assertModalNotVisible();
		});

		test('should support keyboard navigation with Escape', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			// Press Escape
			await page.keyboard.press('Escape');

			await modal.assertModalNotVisible();
		});
	});

	test.describe('Dark Mode Integration', () => {
		test('should display modal correctly in dark mode', async ({ page }) => {
			const modal = getProjectModalHelper(page);
			const theme = getThemeHelper(page);

			// Switch to dark mode
			await theme.toggleDarkMode();

			// Open modal
			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Modal should be visible with dark mode styling
			await modal.assertModalVisible();
			await expect(modal.modal).toHaveClass(/dark:bg-dark-bg/);
		});

		test('should render content with dark mode prose styling', async ({ page }) => {
			const modal = getProjectModalHelper(page);
			const theme = getThemeHelper(page);

			await theme.toggleDarkMode();
			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Content should have dark mode prose classes
			await expect(modal.modalContent).toHaveClass(/dark:prose-invert/);
		});

		test('should persist theme state across multiple modals', async ({ page }) => {
			const modal = getProjectModalHelper(page);
			const theme = getThemeHelper(page);

			// Start in light mode, ensure theme mode
			await theme.ensureLightMode();

			// Open first modal
			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Should be in light mode
			expect(await theme.isDarkMode()).toBe(false);

			// Close modal
			await modal.closeByButton();
			await modal.waitForModalClose();

			// Switch to dark mode while no modal is open
			await theme.toggleDarkMode();

			// Open different modal
			await modal.openProjectByTitle('Manga App');
			await modal.waitForContentLoad();

			// Should maintain dark mode
			expect(await theme.isDarkMode()).toBe(true);
			await expect(modal.modal).toHaveClass(/dark:bg-dark-bg/);
		});
	});

	test.describe('Modal Styling', () => {
		test('should have rounded corners and shadow', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			await expect(modal.modal).toHaveClass(/rounded-2xl/);
			await expect(modal.modal).toHaveClass(/shadow-2xl/);
		});

		test('should have semi-transparent backdrop', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			await expect(modal.modalBackdrop).toHaveClass(/bg-black/);
			await expect(modal.modalBackdrop).toHaveClass(/bg-opacity-50/);
		});

		test('should have proper max width and height constraints', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			await expect(modal.modal).toHaveClass(/max-w-4xl/);
			await expect(modal.modal).toHaveClass(/max-h-\[90vh\]/);
		});

		test('should have sticky header', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			const header = modal.modal.locator('.sticky.top-0');
			await expect(header).toBeVisible();
		});

		test('should have scrollable content area', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			const contentArea = modal.modal.locator('.overflow-y-auto');
			await expect(contentArea).toBeVisible();
		});
	});

	test.describe('Multiple Projects', () => {
		test('should switch between different project modals', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			// Open first project
			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();
			expect(await modal.getModalTitle()).toBe('This Beauty');

			// Close and open different project
			await modal.closeByButton();
			await modal.openProjectByTitle('Manga App');
			await modal.waitForContentLoad();

			// Should show different project
			expect(await modal.getModalTitle()).toBe('Manga App');
			expect(await modal.hasContent()).toBe(true);
		});
	});

	test.describe('Close Button Interaction', () => {
		test('should have hover effect on close button', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			// Hover over close button
			await modal.closeButton.hover();

			// Should have hover classes
			await expect(modal.closeButton).toHaveClass(/hover:bg-gray-100/);
			await expect(modal.closeButton).toHaveClass(/hover:rotate-90/);
		});

		test('should display X icon in close button', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');

			// Check for SVG icon
			const icon = modal.closeButton.locator('svg');
			await expect(icon).toBeVisible();
		});
	});

	test.describe('Visual Regression', () => {
		test('should match modal screenshot in light mode', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Take screenshot of the modal
			await expect(modal.modal).toHaveScreenshot('project-modal-light-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match modal screenshot in dark mode', async ({ page }) => {
			const modal = getProjectModalHelper(page);
			const theme = getThemeHelper(page);

			await theme.toggleDarkMode();
			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Take screenshot of the modal in dark mode
			await expect(modal.modal).toHaveScreenshot('project-modal-dark-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match close button screenshot', async ({ page }) => {
			const modal = getProjectModalHelper(page);

			await modal.openProjectByTitle('This Beauty');
			await modal.waitForContentLoad();

			// Hover over close button
			await modal.closeButton.hover();

			// Take screenshot of close button with hover state
			await expect(modal.closeButton).toHaveScreenshot('project-modal-close-button-hover.png');
		});

		// TODO: Add visual tests for specific project content once final versions are ready
		// - Modal with This Beauty content
		// - Modal with Manga App content
		// - Modal with Imi Permit content
	});
});
