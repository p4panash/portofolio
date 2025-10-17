import { test, expect } from './coverage';

test.describe('ContactCard Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
		await page.waitForLoadState('networkidle');
	});

	test.describe('Card Rendering', () => {
		test('should render the ContactCard with title', async ({ page }) => {
			const contactCard = page.locator("text=Let's Connect").locator('..');
			await expect(contactCard).toBeVisible();
		});

		test('should display title in uppercase with proper styling', async ({ page }) => {
			const title = page.locator("text=Let's Connect").first();
			await expect(title).toBeVisible();
			await expect(title).toHaveClass(/uppercase/);
			await expect(title).toHaveClass(/text-sm/);
		});

		test('should render all three contact links', async ({ page }) => {
			const contactCard = page.locator("text=Let's Connect").locator('..');
			const links = contactCard.locator('a');
			const count = await links.count();

			expect(count).toBe(3);
		});
	});

	test.describe('Contact Links', () => {
		test('should have LinkedIn link with correct href', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			await expect(linkedInLink).toBeVisible();
			await expect(linkedInLink).toHaveAttribute(
				'href',
				'https://www.linkedin.com/in/catalin-muntean/'
			);
		});

		test('should have GitHub link with correct href', async ({ page }) => {
			const githubLink = page.getByRole('link', { name: 'GitHub' });
			await expect(githubLink).toBeVisible();
			await expect(githubLink).toHaveAttribute('href', 'https://github.com/p4panash');
		});

		test('should have Email link with mailto', async ({ page }) => {
			const emailLink = page.getByRole('link', { name: 'Email' });
			await expect(emailLink).toBeVisible();
			await expect(emailLink).toHaveAttribute('href', /^mailto:/);
		});

		test('should open LinkedIn in new tab', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			await expect(linkedInLink).toHaveAttribute('target', '_blank');
			await expect(linkedInLink).toHaveAttribute('rel', 'noopener noreferrer');
		});

		test('should open GitHub in new tab', async ({ page }) => {
			const githubLink = page.getByRole('link', { name: 'GitHub' });
			await expect(githubLink).toHaveAttribute('target', '_blank');
			await expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
		});

		test('should not open Email in new tab', async ({ page }) => {
			const emailLink = page.getByRole('link', { name: 'Email' });
			const target = await emailLink.getAttribute('target');
			expect(target).toBeNull();
		});
	});

	test.describe('Icons and Layout', () => {
		test('should display all contact icons', async ({ page }) => {
			const contactCard = page.locator("text=Let's Connect").locator('..');
			const icons = contactCard.locator('svg');
			const count = await icons.count();

			expect(count).toBeGreaterThanOrEqual(3);
		});

		test('should display contact names below icons', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			const githubLink = page.getByRole('link', { name: 'GitHub' });
			const emailLink = page.getByRole('link', { name: 'Email' });

			await expect(linkedInLink.locator('span', { hasText: 'LinkedIn' })).toBeVisible();
			await expect(githubLink.locator('span', { hasText: 'GitHub' })).toBeVisible();
			await expect(emailLink.locator('span', { hasText: 'Email' })).toBeVisible();
		});

		test('should have proper flex layout', async ({ page }) => {
			const contactCard = page.locator("text=Let's Connect").locator('..').locator('..');
			const container = contactCard.locator('div.flex.items-center.justify-between');

			await expect(container).toBeVisible();
			await expect(container).toHaveClass(/gap-6/);
		});

		test('should display icons and text in column layout', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			await expect(linkedInLink).toHaveClass(/flex-col/);
			await expect(linkedInLink).toHaveClass(/items-center/);
		});
	});

	test.describe('Hover Interactions', () => {
		test('should scale on hover', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			await expect(linkedInLink).toHaveClass(/hover:scale-110/);
		});

		test('should change text color on hover', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			const nameSpan = linkedInLink.locator('span');

			await expect(nameSpan).toHaveClass(/group-hover:text-vivid-blue/);
		});

		test('should have transition effects', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			await expect(linkedInLink).toHaveClass(/transition-transform/);
			await expect(linkedInLink).toHaveClass(/duration-200/);
		});
	});

	test.describe('Accessibility', () => {
		test('should have proper aria-labels', async ({ page }) => {
			await expect(page.getByRole('link', { name: 'LinkedIn' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'GitHub' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Email' })).toBeVisible();
		});

		test('should be keyboard accessible', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			await linkedInLink.focus();
			await expect(linkedInLink).toBeFocused();
		});

		test('should allow tab navigation between links', async ({ page }) => {
			const linkedInLink = page.getByRole('link', { name: 'LinkedIn' });
			const githubLink = page.getByRole('link', { name: 'GitHub' });
			const emailLink = page.getByRole('link', { name: 'Email' });

			// Focus the first link
			await linkedInLink.focus();
			await expect(linkedInLink).toBeFocused();

			// Tab to the next link
			await page.keyboard.press('Tab');
			await expect(githubLink).toBeFocused();

			// Tab to the last link
			await page.keyboard.press('Tab');
			await expect(emailLink).toBeFocused();
		});
	});

	test.describe('Visual Regression', () => {
		test('should match ContactCard screenshot in light mode', async ({ page }) => {
			const contactCard = page.locator("text=Let's Connect").locator('..').locator('..');
			await expect(contactCard).toHaveScreenshot('contact-card-light-mode.png');
		});

		test('should match ContactCard screenshot in dark mode', async ({ page }) => {
			// Toggle to dark mode
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(500);

			const contactCard = page.locator("text=Let's Connect").locator('..').locator('..');
			await expect(contactCard).toHaveScreenshot('contact-card-dark-mode.png');
		});

		test('should match icon colors in dark mode', async ({ page }) => {
			// Toggle to dark mode
			const themeToggle = page.locator('button[aria-label="Toggle theme"]');
			await themeToggle.click();
			await page.waitForTimeout(500);

			const contactCard = page.locator("text=Let's Connect").locator('..').locator('..');
			const githubIcon = contactCard.getByRole('link', { name: 'GitHub' }).locator('svg').first();

			// GitHub icon should be visible in dark mode
			await expect(githubIcon).toBeVisible();
		});
	});
});
