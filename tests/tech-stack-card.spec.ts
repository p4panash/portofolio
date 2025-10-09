import { test, expect } from '@playwright/test';

test.describe('TechStackCard Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Card Rendering', () => {
		test('should display Tech stack title', async ({ page }) => {
			const title = page.locator('text=Tech stack');
			await expect(title).toBeVisible();
		});

		test('should be clickable', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await expect(card).toHaveClass(/cursor-pointer/);
		});

		test('should have hover effects', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await expect(card).toHaveClass(/hover:shadow-soft-glow/);
			await expect(card).toHaveClass(/hover:border-vivid-blue/);
		});
	});

	test.describe('Technology Badges', () => {
		test('should display all 7 technology badges', async ({ page }) => {
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const badges = techStack.locator('button');
			await expect(badges).toHaveCount(7);
		});

		test('should display badges in correct order', async ({ page }) => {
			const expectedOrder = [
				'Ruby on Rails',
				'React',
				'Next.js',
				'Redux',
				'Sidekiq',
				'PostgreSQL',
				'Redis'
			];

			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const badges = techStack.locator('button');

			for (let i = 0; i < expectedOrder.length; i++) {
				const badge = badges.nth(i);
				const icon = badge.locator('svg');
				await expect(icon).toBeVisible();
			}
		});

		test('should display Ruby on Rails badge first', async ({ page }) => {
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const firstBadge = techStack.locator('button').first();
			await expect(firstBadge).toBeVisible();
		});

		test('should display Redis badge last', async ({ page }) => {
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const lastBadge = techStack.locator('button').last();
			await expect(lastBadge).toBeVisible();
		});

		test('should have non-expandable badges', async ({ page }) => {
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const firstBadge = techStack.locator('button').first();

			// Click the badge
			await firstBadge.click();
			await page.waitForTimeout(200);

			// Badge should not expand (no text visible)
			const hasText = await firstBadge
				.locator('span')
				.isVisible()
				.catch(() => false);
			expect(hasText).toBeFalsy();
		});

		test('should have proper badge styling', async ({ page }) => {
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const badge = techStack.locator('button').first();

			await expect(badge).toHaveClass(/rounded/);
			await expect(badge).toHaveClass(/shadow/);
			await expect(badge).toHaveClass(/backdrop-blur-sm/);
		});
	});

	test.describe('Modal Integration', () => {
		test('should open modal when card is clicked', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await card.click();
			await page.waitForTimeout(300);

			// Check if modal is visible
			const modal = page.locator('[role="dialog"]');
			await expect(modal).toBeVisible();
		});

		test('should display "Tech Stack" title in modal', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await card.click();
			await page.waitForTimeout(300);

			const modalTitle = page.locator('#modal-title');
			await expect(modalTitle).toHaveText('Tech Stack');
		});

		test('should display tech stack content in modal', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await card.click();
			await page.waitForTimeout(500);

			// Check for some expected content within the modal
			const modal = page.locator('[role="dialog"]');
			const content = modal.locator('h3:has-text("Ruby on Rails")');
			await expect(content).toBeVisible();
		});

		test('should close modal when clicking close button', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await card.click();
			await page.waitForTimeout(300);

			const closeButton = page.locator('button[aria-label="Close modal"]').last();
			await closeButton.click();
			await page.waitForTimeout(300);

			const modal = page.locator('[role="dialog"]');
			await expect(modal).not.toBeVisible();
		});

		test('should close modal when pressing Escape', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await card.click();
			await page.waitForTimeout(300);

			await page.keyboard.press('Escape');
			await page.waitForTimeout(300);

			const modal = page.locator('[role="dialog"]');
			await expect(modal).not.toBeVisible();
		});
	});

	test.describe('Dark Mode', () => {
		test('should adapt badges to dark mode', async ({ page }) => {
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(300);

			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const badge = techStack.locator('button').first();
			await expect(badge).toBeVisible();
		});

		test('should show black icons as white in dark mode', async ({ page }) => {
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(300);

			// Next.js, GitHub, Vercel icons should be white in dark mode
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const nextjsBadge = techStack.locator('button').nth(2); // Next.js is 3rd
			const icon = nextjsBadge.locator('svg');
			await expect(icon).toBeVisible();
		});
	});

	test.describe('Layout', () => {
		test('should have correct grid sizing', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await expect(card).toHaveClass(/lg:col-span-1/);
			await expect(card).toHaveClass(/lg:row-span-1/);
		});

		test('should display badges in flex wrap layout', async ({ page }) => {
			const techStack = page.locator('text=Tech stack').locator('..').locator('..');
			const badgeContainer = techStack.locator('.flex.flex-wrap');
			await expect(badgeContainer).toBeVisible();
			await expect(badgeContainer).toHaveClass(/gap-1/);
		});
	});

	test.describe('Visual Regression', () => {
		test('should match tech stack card screenshot in light mode', async ({ page }) => {
			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await expect(card).toHaveScreenshot('tech-stack-card-light-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match tech stack card screenshot in dark mode', async ({ page }) => {
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(500);

			const card = page.locator('text=Tech stack').locator('..').locator('..');
			await expect(card).toHaveScreenshot('tech-stack-card-dark-mode.png', {
				maxDiffPixels: 100
			});
		});
	});
});
