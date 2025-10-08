import { test, expect } from './coverage';

test.describe('Badge Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Badge Rendering', () => {
		test('should render badges in TechStack card', async ({ page }) => {
			// Find the TechStack card by its title
			const techStackCard = page.locator('text=Tech stack').locator('..');

			// Find badges within TechStack card
			const badges = techStackCard.locator('button.cursor-pointer');
			const count = await badges.count();

			// Should have 7 badges in TechStack
			expect(count).toBe(7);
		});

		test('should display badge icons', async ({ page }) => {
			// Find TechStack card
			const techStackCard = page.locator('text=Tech stack').locator('..');

			// All badges should have SVG icons
			const badges = techStackCard.locator('button svg');
			const count = await badges.count();

			expect(count).toBeGreaterThanOrEqual(7);
		});

		test('should render badges with correct technologies', async ({ page }) => {
			// Find TechStack card
			const techStackCard = page.locator('text=Tech stack').locator('..');

			// Should have badges for these technologies (they have SVG icons with aria-label)
			const reactBadge = techStackCard.getByRole('button', { name: /react/i });
			const nextBadge = techStackCard.getByRole('button', { name: /next/i });
			const postgresBadge = techStackCard.getByRole('button', { name: /postgres/i });

			await expect(reactBadge).toBeVisible();
			await expect(nextBadge).toBeVisible();
			await expect(postgresBadge).toBeVisible();
		});

		test('should have proper shadow and rounded styling', async ({ page }) => {
			// Find TechStack card
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			// Check for shadow and rounded classes
			await expect(badge).toHaveClass(/shadow/);
			await expect(badge).toHaveClass(/rounded/);
		});
	});

	test.describe('Badge Behavior - Non-Expandable', () => {
		test('should be non-expandable in TechStack', async ({ page }) => {
			// TechStack badges should not expand (isExpandable={false})
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			// Click the badge
			await badge.click();
			await page.waitForTimeout(300);

			// Badge should still only show icon (not expanded with text)
			const icon = badge.locator('svg');
			await expect(icon).toBeVisible();
		});

		test('should have cursor-pointer class', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			await expect(badge).toHaveClass(/cursor-pointer/);
		});

		test('should have proper padding and gap', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			// Check for padding class
			await expect(badge).toHaveClass(/p-1/);

			// Check for gap in inner flex container
			const innerDiv = badge.locator('div').first();
			await expect(innerDiv).toHaveClass(/gap-2/);
		});
	});

	test.describe('Badge Behavior - Expandable', () => {
		test('should show only icon initially for expandable badges', async ({ page }) => {
			// Project cards have expandable badges (default isExpandable=true)
			const projectCard = page.getByTestId('project-card-this-beauty');
			const badge = projectCard.locator('button').first();

			// Initially should show only icon
			const icon = badge.locator('svg');
			await expect(icon).toBeVisible();

			// Should not show text initially
			const badgeText = badge.locator('span');
			await expect(badgeText).not.toBeVisible();
		});

		test('should expand to show text when clicked', async ({ page }) => {
			const projectCard = page.getByTestId('project-card-this-beauty');
			const badge = projectCard.locator('button').first();

			// Click to expand
			await badge.click();
			await page.waitForTimeout(300);

			// Should now show the text label
			const badgeText = badge.locator('span');
			await expect(badgeText).toBeVisible();

			// Icon should still be visible
			const icon = badge.locator('svg');
			await expect(icon).toBeVisible();
		});

		test('should collapse when clicked again', async ({ page }) => {
			const projectCard = page.getByTestId('project-card-this-beauty');
			const badge = projectCard.locator('button').first();

			// Click to expand
			await badge.click();
			await page.waitForTimeout(300);

			// Verify expanded
			let badgeText = badge.locator('span');
			await expect(badgeText).toBeVisible();

			// Click again to collapse
			await badge.click();
			await page.waitForTimeout(300);

			// Should be collapsed again
			badgeText = badge.locator('span');
			await expect(badgeText).not.toBeVisible();
		});

		test('should display correct tech name when expanded', async ({ page }) => {
			const projectCard = page.getByTestId('project-card-this-beauty');

			// Find the Svelte badge
			const svelteBadge = projectCard.getByRole('button', { name: /svelte/i });

			// Click to expand
			await svelteBadge.click();
			await page.waitForTimeout(300);

			// Should show "Svelte" text
			await expect(svelteBadge.locator('span')).toHaveText('Svelte');
		});

		test('should expand multiple badges independently', async ({ page }) => {
			const projectCard = page.getByTestId('project-card-this-beauty');

			const firstBadge = projectCard.locator('button').nth(0);
			const secondBadge = projectCard.locator('button').nth(1);

			// Expand first badge
			await firstBadge.click();
			await page.waitForTimeout(300);

			// First should be expanded
			await expect(firstBadge.locator('span')).toBeVisible();

			// Second should still be collapsed
			await expect(secondBadge.locator('span')).not.toBeVisible();

			// Now expand second
			await secondBadge.click();
			await page.waitForTimeout(300);

			// Both should be expanded
			await expect(firstBadge.locator('span')).toBeVisible();
			await expect(secondBadge.locator('span')).toBeVisible();
		});

		test('should stop click propagation to parent card', async ({ page }) => {
			const projectCard = page.getByTestId('project-card-this-beauty');
			const badge = projectCard.locator('button').first();

			// Click badge - should not trigger card click (which opens modal)
			await badge.click();
			await page.waitForTimeout(300);

			// Modal should NOT be open
			const modal = page.locator('[role="dialog"]');
			await expect(modal).not.toBeVisible();

			// Badge should be expanded
			await expect(badge.locator('span')).toBeVisible();
		});
	});

	test.describe('Badge Icons and Colors', () => {
		test('should render different icons for different technologies', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');

			// Each badge should have an SVG icon
			const badges = techStackCard.locator('button svg');
			const count = await badges.count();

			// Should have 7 different icons
			expect(count).toBe(7);
		});
	});

	test.describe('Badge Accessibility', () => {
		test('should be keyboard accessible', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			// Focus on badge
			await badge.focus();

			// Check if focused
			await expect(badge).toBeFocused();
		});

		test('should be clickable as a button', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			// Should be a button element
			expect(await badge.evaluate((el) => el.tagName)).toBe('BUTTON');
		});

		test('should handle click events', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			// Should be able to click without errors
			await badge.click();
			await expect(badge).toBeVisible();
		});
	});

	test.describe('Badge Layout Integration', () => {
		test('should display badges in a flex wrap layout', async ({ page }) => {
			// Find the TechStack card container
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badgeContainer = techStackCard.locator('div.flex.flex-wrap').first();

			await expect(badgeContainer).toBeVisible();
			await expect(badgeContainer).toHaveClass(/flex-wrap/);
			await expect(badgeContainer).toHaveClass(/gap-1/);
		});

		test('should render correct number of badges in TechStack', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badges = techStackCard.locator('button');

			// TechStack should have 7 badges
			const count = await badges.count();
			expect(count).toBe(7);
		});

		test('should maintain consistent sizing across badges', async ({ page }) => {
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badges = techStackCard.locator('button');

			const firstBadge = badges.nth(0);
			const secondBadge = badges.nth(1);

			const firstBox = await firstBadge.boundingBox();
			const secondBox = await secondBadge.boundingBox();

			// Heights should be consistent
			expect(firstBox?.height).toBe(secondBox?.height);
		});
	});

	test.describe('Dark Mode Integration', () => {
		test('should adapt to dark mode', async ({ page }) => {
			// Toggle dark mode
			const themeToggle = page.getByRole('button', { name: /toggle theme/i });
			await themeToggle.click();
			await page.waitForTimeout(300);

			// Badges should still be visible in dark mode
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const badge = techStackCard.locator('button').first();

			await expect(badge).toBeVisible();
		});

		test('should maintain icon visibility in dark mode', async ({ page }) => {
			// Toggle dark mode
			const themeToggle = page.getByRole('button', { name: /toggle theme/i });
			await themeToggle.click();
			await page.waitForTimeout(300);

			// Icons should still be visible
			const techStackCard = page.locator('text=Tech stack').locator('..');
			const icon = techStackCard.locator('button svg').first();

			await expect(icon).toBeVisible();
		});
	});

	test.describe('Visual Regression', () => {
		test('should match badge screenshot in light mode', async ({ page }) => {
			// Find TechStack card with badges
			const techStackSection = page.locator('text=Tech stack').locator('..').locator('..');

			await expect(techStackSection).toHaveScreenshot('badges-light-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match badge screenshot in dark mode', async ({ page }) => {
			// Toggle dark mode
			const themeToggle = page.getByRole('button', { name: /toggle theme/i });
			await themeToggle.click();
			await page.waitForTimeout(500);

			// Find TechStack card with badges
			const techStackSection = page.locator('text=Tech stack').locator('..').locator('..');

			await expect(techStackSection).toHaveScreenshot('badges-dark-mode.png', {
				maxDiffPixels: 100
			});
		});
	});
});
