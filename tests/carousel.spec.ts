import { test, expect } from '@playwright/test';
import { getCarouselHelper } from './helpers/carousel-helpers';
import { getThemeHelper } from './helpers/theme-helpers';

test.describe('Carousel Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test.describe('Carousel Rendering', () => {
		test('should render carousel with images', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Verify carousel image is visible
			const currentImage = carousel.getCurrentSlideImage();
			await expect(currentImage).toBeVisible();
		});

		test('should display navigation controls', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.assertControlsVisible();
		});

		test('should display correct number of dot indicators', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Should have 6 images
			const slideCount = await carousel.getSlideCount();
			expect(slideCount).toBe(6);
		});

		test('should highlight active dot indicator', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// First slide should be active
			const activeDot = carousel.getActiveDot();
			await expect(activeDot).toBeVisible();

			// Active dot should have w-6 class (wider)
			await expect(activeDot).toHaveClass(/w-6/);
		});

		test('should display images with object-cover styling', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			const currentImage = carousel.getCurrentSlideImage();

			// Images should use object-cover to fill the container
			await expect(currentImage).toHaveClass(/object-cover/);
		});
	});

	test.describe('Carousel Navigation', () => {
		test('should navigate to next slide', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Should start at slide 0
			expect(await carousel.getActiveSlideIndex()).toBe(0);

			// Click next
			await carousel.clickNext();

			// Should be at slide 1
			expect(await carousel.getActiveSlideIndex()).toBe(1);
		});

		test('should navigate to previous slide', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Go to slide 2
			await carousel.goToSlide(2);
			expect(await carousel.getActiveSlideIndex()).toBe(2);

			// Click previous
			await carousel.clickPrevious();

			// Should be at slide 1
			expect(await carousel.getActiveSlideIndex()).toBe(1);
		});

		test('should navigate using dot indicators', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Click on third dot (index 2)
			await carousel.goToSlide(2);

			// Should be at slide 2
			expect(await carousel.getActiveSlideIndex()).toBe(2);
		});

		test('should wrap around from last to first slide', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Go to last slide (index 5)
			await carousel.goToSlide(5);
			expect(await carousel.getActiveSlideIndex()).toBe(5);

			// Click next
			await carousel.clickNext();

			// Should wrap to first slide
			expect(await carousel.getActiveSlideIndex()).toBe(0);
		});

		test('should wrap around from first to last slide', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Should start at slide 0
			expect(await carousel.getActiveSlideIndex()).toBe(0);

			// Click previous
			await carousel.clickPrevious();

			// Should wrap to last slide (index 5)
			expect(await carousel.getActiveSlideIndex()).toBe(5);
		});
	});

	test.describe('Auto-play Functionality', () => {
		test('should auto-advance slides', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Should start at slide 0
			expect(await carousel.getActiveSlideIndex()).toBe(0);

			// Wait for auto-play (5 seconds + buffer)
			await page.waitForTimeout(5500);

			// Should have advanced to slide 1
			expect(await carousel.getActiveSlideIndex()).toBe(1);
		});

		test('should reset auto-play timer when navigating manually', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Click next manually
			await carousel.clickNext();
			expect(await carousel.getActiveSlideIndex()).toBe(1);

			// Wait less than auto-play interval
			await page.waitForTimeout(3000);

			// Should still be at slide 1 (timer was reset)
			expect(await carousel.getActiveSlideIndex()).toBe(1);

			// Wait for full auto-play interval
			await page.waitForTimeout(2500);

			// Now should have advanced to slide 2
			expect(await carousel.getActiveSlideIndex()).toBe(2);
		});
	});

	test.describe('Expanded View', () => {
		test('should expand image when clicked', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Click to expand
			await carousel.expandCurrentImage();

			// Modal should be visible
			expect(await carousel.isExpanded()).toBe(true);

			// Expanded image should be visible
			const expandedImage = carousel.getExpandedImage();
			await expect(expandedImage).toBeVisible();
		});

		test('should close expanded view with close button', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			expect(await carousel.isExpanded()).toBe(true);

			// Close using button
			await carousel.closeExpandedView();

			// Modal should be closed
			expect(await carousel.isExpanded()).toBe(false);
		});

		test('should close expanded view by clicking backdrop', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			expect(await carousel.isExpanded()).toBe(true);

			// Close by clicking backdrop
			await carousel.closeByBackdrop();

			// Modal should be closed
			expect(await carousel.isExpanded()).toBe(false);
		});

		test('should close expanded view with Escape key', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			expect(await carousel.isExpanded()).toBe(true);

			// Close with Escape
			await carousel.closeByEscapeKey();

			// Modal should be closed
			expect(await carousel.isExpanded()).toBe(false);
		});

		test('should navigate in expanded view', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Expand first image
			await carousel.expandCurrentImage();
			expect(await carousel.isExpanded()).toBe(true);

			// Navigate to next in expanded view
			await carousel.clickNextInExpanded();

			// Should still be expanded
			expect(await carousel.isExpanded()).toBe(true);

			// Verify we're on slide 1 (check the expanded image src)
			const expandedImage = carousel.getExpandedImage();
			const src = await expandedImage.getAttribute('src');
			expect(src).toContain('2.jpeg');
		});

		test('should preserve expanded state when navigating', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Go to slide 2 and expand
			await carousel.goToSlide(2);
			await carousel.expandCurrentImage();

			expect(await carousel.isExpanded()).toBe(true);

			// Navigate previous in expanded view
			await carousel.clickPreviousInExpanded();

			// Should still be expanded
			expect(await carousel.isExpanded()).toBe(true);

			// Should be on slide 1 now
			const expandedImage = carousel.getExpandedImage();
			const src = await expandedImage.getAttribute('src');
			expect(src).toContain('2.jpeg');
		});

		test('should display expanded image with correct styling', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			const expandedImage = carousel.getExpandedImage();

			// Should use object-contain for proper aspect ratio
			await expect(expandedImage).toHaveClass(/object-contain/);

			// Should have max dimensions
			await expect(expandedImage).toHaveClass(/max-w-\[90vw\]/);
			await expect(expandedImage).toHaveClass(/max-h-\[90vh\]/);
		});
	});

	test.describe('Dark Mode Integration', () => {
		test('should display carousel in dark mode', async ({ page }) => {
			const carousel = getCarouselHelper(page);
			const theme = getThemeHelper(page);

			await carousel.waitForCarouselLoad();

			// Switch to dark mode
			await theme.toggleDarkMode();

			// Carousel should still be visible
			const currentImage = carousel.getCurrentSlideImage();
			await expect(currentImage).toBeVisible();

			// Navigation controls should be visible
			await carousel.assertControlsVisible();
		});

		test('should apply dark mode styling to controls', async ({ page }) => {
			const carousel = getCarouselHelper(page);
			const theme = getThemeHelper(page);

			await carousel.waitForCarouselLoad();
			await theme.toggleDarkMode();

			// Navigation buttons should have dark mode classes
			await expect(carousel.nextButton).toHaveClass(/dark:bg-dark-bg/);
			await expect(carousel.prevButton).toHaveClass(/dark:bg-dark-bg/);
		});

		test('should apply dark mode to expanded view', async ({ page }) => {
			const carousel = getCarouselHelper(page);
			const theme = getThemeHelper(page);

			await carousel.waitForCarouselLoad();
			await theme.toggleDarkMode();

			await carousel.expandCurrentImage();

			// Close button should have dark mode styling
			await expect(carousel.closeButton).toHaveClass(/dark:bg-dark-bg/);

			// Expanded navigation buttons should have dark mode styling
			await expect(carousel.getExpandedNextButton()).toHaveClass(/dark:bg-dark-bg/);
		});
	});

	test.describe('Accessibility', () => {
		test('should have proper ARIA labels on navigation buttons', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			await expect(carousel.prevButton).toHaveAttribute('aria-label', 'Previous slide');
			await expect(carousel.nextButton).toHaveAttribute('aria-label', 'Next slide');
		});

		test('should have proper ARIA labels on dot indicators', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			const firstDot = page.getByRole('button', { name: 'Go to slide 1' });
			await expect(firstDot).toBeVisible();

			const thirdDot = page.getByRole('button', { name: 'Go to slide 3' });
			await expect(thirdDot).toBeVisible();
		});

		test('should have proper ARIA attributes on expanded modal', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			// Modal should have dialog role and aria-modal
			await expect(carousel.expandedModal).toHaveAttribute('role', 'dialog');
			await expect(carousel.expandedModal).toHaveAttribute('aria-modal', 'true');
		});

		test('should have descriptive alt text for images', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			const currentImage = carousel.getCurrentSlideImage();
			const altText = await currentImage.getAttribute('alt');

			expect(altText).toMatch(/Carousel slide \d+/);
		});

		test('should close expanded view with Escape key', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			expect(await carousel.isExpanded()).toBe(true);

			// Press Escape to close
			await page.keyboard.press('Escape');
			await page.waitForTimeout(300);

			expect(await carousel.isExpanded()).toBe(false);
		});

		test('should navigate with arrow keys in expanded view', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			// Get initial image src
			const expandedImage = carousel.getExpandedImage();
			const initialSrc = await expandedImage.getAttribute('src');
			expect(initialSrc).toContain('1.jpeg');

			// Press ArrowRight to go to next slide
			await page.keyboard.press('ArrowRight');
			await page.waitForTimeout(600);

			// Should be on slide 2
			const nextSrc = await expandedImage.getAttribute('src');
			expect(nextSrc).toContain('2.jpeg');

			// Press ArrowLeft to go back
			await page.keyboard.press('ArrowLeft');
			await page.waitForTimeout(600);

			// Should be back on slide 1
			const backSrc = await expandedImage.getAttribute('src');
			expect(backSrc).toContain('1.jpeg');
		});

		test('should support Tab navigation to focus buttons', async ({ page, browserName }) => {
			// Skip for webkit as it has different tab navigation behavior
			test.skip(browserName === 'webkit', 'Tab navigation works differently in webkit');

			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			// Tab should move focus to close button
			await page.keyboard.press('Tab');
			const closeButton = carousel.closeButton;
			await expect(closeButton).toBeFocused();
		});
	});

	test.describe('Visual Regression', () => {
		test('should match carousel screenshot in light mode', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();

			// Find the carousel by looking for the image with "Carousel slide" alt and get its parent container
			const carouselContainer = page
				.locator('img[alt*="Carousel slide"]')
				.first()
				.locator('..')
				.locator('..')
				.locator('..');
			await expect(carouselContainer).toHaveScreenshot('carousel-light-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match carousel screenshot in dark mode', async ({ page }) => {
			const carousel = getCarouselHelper(page);
			const theme = getThemeHelper(page);

			await carousel.waitForCarouselLoad();

			// Go to first slide to ensure consistent snapshot
			await carousel.goToSlide(0);

			await theme.toggleDarkMode();
			await page.waitForTimeout(800);

			const carouselContainer = page
				.locator('img[alt*="Carousel slide"]')
				.first()
				.locator('..')
				.locator('..')
				.locator('..');
			await expect(carouselContainer).toHaveScreenshot('carousel-dark-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match expanded view screenshot', async ({ page }) => {
			const carousel = getCarouselHelper(page);

			await carousel.waitForCarouselLoad();
			await carousel.expandCurrentImage();

			await expect(carousel.expandedModal).toHaveScreenshot('carousel-expanded-view.png', {
				maxDiffPixels: 100
			});
		});
	});
});
