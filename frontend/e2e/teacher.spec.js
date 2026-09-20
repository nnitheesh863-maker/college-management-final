import { test, expect } from '@playwright/test';

test.describe('Teacher Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'sarah@demo.edu');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/teacher-dashboard');
  });

  test('should display teacher overview metrics and header', async ({ page }) => {
    await expect(page.getByText(/Teacher Portal|Dr. Sarah/i).first()).toBeVisible();
    await expect(page.getByText(/Students|Attendance/i).first()).toBeVisible();
  });

  test('should navigate across teacher sections (Attendance, Marks, Timetable)', async ({ page }) => {
    // Attendance section
    await page.getByRole('button', { name: /Attendance/i }).click();
    await expect(page.getByText(/Attendance/i).first()).toBeVisible();

    // Marks section
    await page.getByRole('button', { name: /Marks Entry/i }).click();
    await expect(page.getByText(/Marks/i).first()).toBeVisible();

    // Timetable section
    await page.getByRole('button', { name: /Timetable/i }).click();
    await expect(page.getByText(/Timetable|Schedule/i).first()).toBeVisible();
  });
});
