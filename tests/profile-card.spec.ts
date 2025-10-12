import { test, expect } from './coverage';

test.describe('ProfileCard Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Profile Content', () => {
		test('should display profile name', async ({ page }) => {
			const nameElement = page.locator('text=Cătălin Muntean');
			await expect(nameElement).toBeVisible();
		});

		test('should display subtitle "Full-Stack Developer"', async ({ page }) => {
			const subtitleElement = page.locator('p:has-text("Full-Stack Developer")').first();
			await expect(subtitleElement).toBeVisible();
		});

		test('should display professional bio', async ({ page }) => {
			const bioText = page.locator(
				'text=Full-stack developer specializing in building scalable web applications'
			);
			await expect(bioText).toBeVisible();
		});

		test('should display avatar image', async ({ page }) => {
			const avatar = page.locator('img[alt="Cătălin Muntean"]');
			await expect(avatar).toBeVisible();
			await expect(avatar).toHaveAttribute('src', /github/);
		});

		test('should have avatar with proper styling', async ({ page }) => {
			const avatar = page.locator('img[alt="Cătălin Muntean"]');
			await expect(avatar).toHaveClass(/rounded-full/);
			await expect(avatar).toHaveClass(/border-2/);
			await expect(avatar).toHaveClass(/shadow-md/);
		});
	});

	test.describe('Resume Download Button', () => {
		test('should display resume download button', async ({ page }) => {
			const resumeButton = page.locator('a[href="/resume.pdf"]');
			await expect(resumeButton).toBeVisible();
		});

		test('should have download attribute', async ({ page }) => {
			const resumeButton = page.locator('a[href="/resume.pdf"]');
			await expect(resumeButton).toHaveAttribute('download', '');
		});

		test('should have proper styling', async ({ page }) => {
			const resumeButton = page.locator('a[href="/resume.pdf"]');
			await expect(resumeButton).toHaveClass(/rounded-full/);
			await expect(resumeButton).toHaveClass(/shadow-lg/);
			await expect(resumeButton).toHaveClass(/backdrop-blur-sm/);
		});

		test('should contain download icon', async ({ page }) => {
			const resumeButton = page.locator('a[href="/resume.pdf"]');
			const icon = resumeButton.locator('svg');
			await expect(icon).toBeVisible();
		});
	});

	test.describe('Info Badges', () => {
		test('should display three info badges', async ({ page }) => {
			// Look for info badges near the bio section
			const badges = page.locator('.flex.flex-wrap.gap-1 > span');
			await expect(badges).toHaveCount(3);
		});

		test('should display "5+ years experience" badge', async ({ page }) => {
			const badge = page.locator('text=5+ years experience');
			await expect(badge).toBeVisible();
		});

		test('should display "Remote ready" badge', async ({ page }) => {
			const badge = page.locator('text=Remote ready');
			await expect(badge).toBeVisible();
		});

		test('should display "Open to opportunities" badge', async ({ page }) => {
			const badge = page.locator('text=Open to opportunities');
			await expect(badge).toBeVisible();
		});

		test('should have proper badge styling', async ({ page }) => {
			const badge = page.locator('text=5+ years experience');
			await expect(badge).toHaveClass(/rounded/);
			await expect(badge).toHaveClass(/shadow/);
			await expect(badge).toHaveClass(/backdrop-blur-sm/);
		});
	});

	test.describe('Dark Mode', () => {
		test('should adapt to dark mode', async ({ page }) => {
			// Toggle dark mode
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(300); // Wait for animation

			// Check that dark mode classes are applied
			const main = page.locator('main');
			await expect(main).toHaveClass(/dark:bg-dark-bg/);
		});

		test('should maintain avatar visibility in dark mode', async ({ page }) => {
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(300);

			const avatar = page.locator('img[alt="Cătălin Muntean"]');
			await expect(avatar).toBeVisible();
		});
	});

	test.describe('Layout', () => {
		test('should have correct grid sizing', async ({ page }) => {
			// ProfileCard should span 2 columns and 2 rows on large screens
			// Find the div that contains the ProfileCard with the grid sizing
			const cardRoot = page
				.locator('img[alt="Cătălin Muntean"]')
				.locator('xpath=ancestor::*[contains(@class, "lg:col-span")]');

			// Check if the card has the correct sizing classes
			await expect(cardRoot).toHaveClass(/lg:col-span-2/);
			await expect(cardRoot).toHaveClass(/lg:row-span-2/);
		});

		test('should have proper spacing between elements', async ({ page }) => {
			// The gap-8 is on the outer flex container
			const container = page
				.locator('img[alt="Cătălin Muntean"]')
				.locator('xpath=ancestor::*[contains(@class, "gap-8")]');
			await expect(container).toHaveClass(/gap-8/);
		});
	});

	test.describe('Visual Regression', () => {
		test('should match profile card screenshot in light mode', async ({ page }) => {
			const profileCard = page.locator('img[alt="Cătălin Muntean"]').locator('../..');
			await expect(profileCard).toHaveScreenshot('profile-card-light-mode.png', {
				maxDiffPixels: 100
			});
		});

		test('should match profile card screenshot in dark mode', async ({ page }) => {
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(500);

			const profileCard = page.locator('img[alt="Cătălin Muntean"]').locator('../..');
			await expect(profileCard).toHaveScreenshot('profile-card-dark-mode.png', {
				maxDiffPixels: 100
			});
		});
	});
});
