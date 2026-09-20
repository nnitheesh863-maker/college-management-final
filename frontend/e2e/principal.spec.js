import { test, expect } from '@playwright/test';

test.describe('Principal Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'james@demo.edu');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/principal-dashboard');
  });

  test('should display principal executive dashboard with institution metrics', async ({ page }) => {
    await expect(page.getByText(/Principal/i).first()).toBeVisible();
    await expect(page.getByText(/Total Students|Overview/i).first()).toBeVisible();
  });

  test('should navigate across administrative tabs', async ({ page }) => {
    // Navigate to Students section
    await page.getByRole('button', { name: /Students/i }).click();
    await expect(page.getByText('Student Management')).toBeVisible();

    // Navigate to Teachers section
    await page.getByRole('button', { name: /Teachers/i }).click();
    await expect(page.getByText('Teacher Management')).toBeVisible();

    // Navigate to Revenue section
    await page.getByRole('button', { name: /Revenue/i }).click();
    await expect(page.getByText('Revenue Analytics')).toBeVisible();
  });
});
