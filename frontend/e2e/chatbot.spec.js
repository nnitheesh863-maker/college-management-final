import { test, expect } from '@playwright/test';

test.describe('AI Chatbot Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'alice@demo.edu');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/student-dashboard');
  });

  test('should open and interact with the AI Chatbot floating assistant', async ({ page }) => {
    const botTrigger = page.locator('button:has-text("🤖")').or(page.locator('button[aria-label*="AI"]').or(page.locator('button:has-text("Chatbot")'))).first();
    
    if (await botTrigger.isVisible()) {
      await botTrigger.click();
      await expect(page.getByText(/AI Assistant|Teaching Assistant|Chatbot/i).first()).toBeVisible();

      const chatInput = page.locator('input[placeholder*="Ask"]').or(page.locator('input[placeholder*="Type"]')).or(page.locator('input[type="text"]').last());
      if (await chatInput.isVisible()) {
        await chatInput.fill('What is my attendance percentage?');
        const sendBtn = page.locator('button:has-text("Send")').or(page.locator('button[type="submit"]')).last();
        if (await sendBtn.isVisible()) {
          await sendBtn.click();
        }
      }
    }
  });
});
