import { test, expect } from '@playwright/test';

test.describe('Authentication & Access Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  });

  test('should render the login page with all essential elements', async ({ page }) => {
    await expect(page).toHaveTitle(/Vite|College|React/i);
    await expect(page.locator('text=Welcome Back')).toBeVisible();
    await expect(page.locator('text=Sign in to your College ERP portal')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('text=Don\'t have an account? Register')).toBeVisible();
  });

  test('should navigate to registration page and display required fields', async ({ page }) => {
    await page.click('text=Don\'t have an account? Register');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('select[name="role"]')).toBeVisible();
  });

  test('should switch role specific fields in registration', async ({ page }) => {
    await page.goto('/register');
    const roleSelect = page.locator('select[name="role"]');
    await roleSelect.selectOption('student');
    await expect(page.locator('input[name="rollNo"]')).toBeVisible();

    await roleSelect.selectOption('teacher');
    await expect(page.locator('input[name="rollNo"]')).not.toBeVisible();
  });

  test('should allow direct access via demo shortcut', async ({ page }) => {
    await page.click('text=Skip to Demo Dashboard');
    await expect(page).toHaveURL(/.*teacher-dashboard/);
  });
});
