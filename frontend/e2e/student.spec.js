import { test, expect } from '@playwright/test';

test.describe('Student Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'alice@demo.edu');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/student-dashboard');
  });

  test('should display student overview metrics and personal details', async ({ page }) => {
    await expect(page.getByText(/Student Dashboard/i).first()).toBeVisible();
    await expect(page.getByText(/Alice Johnson/i).first()).toBeVisible();
    await expect(page.getByText(/Attendance/i).first()).toBeVisible();
    await expect(page.getByText(/Average Marks/i).first()).toBeVisible();
  });

  test('should navigate across student tabs (Attendance, Fees, Results, Timetable, Leave)', async ({ page }) => {
    // Attendance tab
    await page.getByRole('button', { name: /Attendance/i }).first().click();
    await expect(page.getByText(/Attendance/i).first()).toBeVisible();

    // Fee Status tab
    await page.getByRole('button', { name: /Fee Status/i }).first().click();
    await expect(page.getByText(/Fee/i).first()).toBeVisible();

    // Exam Results tab
    await page.getByRole('button', { name: /Exam Results/i }).first().click();
    await expect(page.getByText(/Math|Results|Marks/i).first()).toBeVisible();

    // Timetable tab
    await page.getByRole('button', { name: /Timetable/i }).first().click();
    await expect(page.getByText(/Monday|Timetable/i).first()).toBeVisible();

    // Leave tab
    await page.getByRole('button', { name: /Leave/i }).first().click();
    await expect(page.getByText(/Leave/i).first()).toBeVisible();
  });
});
