import { test, expect } from '@playwright/test';

test.describe('Navigation, Security & Role Protection', () => {
  test('should redirect unauthenticated users to /login when accessing protected dashboards', async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    await page.goto('/student-dashboard');
    await expect(page).toHaveURL(/.*login/);

    await page.goto('/teacher-dashboard');
    await expect(page).toHaveURL(/.*login/);

    await page.goto('/principal-dashboard');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should support logout and clear active session', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sarah@demo.edu');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*teacher-dashboard/);

    const logoutBtn = page.getByTestId('logout-btn-header');
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.dispatchEvent('click');
    await expect(page).toHaveURL(/.*login/);
  });
});
