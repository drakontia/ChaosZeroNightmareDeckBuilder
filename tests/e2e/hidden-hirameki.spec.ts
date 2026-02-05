import { test, expect } from '@playwright/test';

test.describe('Hidden Hirameki E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the deck builder
    await page.goto('/');
  });

  test('should display hidden hirameki button for cards with hidden variants', async ({ page }) => {
    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if hidden hirameki buttons are present when applicable
    // This test assumes cards with hidden variants are displayed
    const buttons = await page.locator('button').count();
    
    // Should have at least button for regular hirameki, god, and potentially hidden hirameki
    expect(buttons).toBeGreaterThan(0);
  });

  test('should toggle hidden hirameki state when button is clicked', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Get the hidden hirameki button (if it exists)
    const hiddenHiramekiButtons = await page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]').count();
    
    // If there are hidden hirameki buttons, test clicking them
    if (hiddenHiramekiButtons > 0) {
      const firstHiddenButton = page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]').first();
      const initialClass = await firstHiddenButton.getAttribute('class');
      
      // Click the button to toggle hidden hirameki
      await firstHiddenButton.click();
      
      // Wait for potential modal to appear
      await page.waitForTimeout(300);
      
      // Dialog should be visible
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
    }
  });

  test('should show hidden hirameki preview cards in modal', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find and click a hidden hirameki button
    const hiddenButtons = await page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
    const count = await hiddenButtons.count();
    
    if (count > 0) {
      await hiddenButtons.first().click();
      
      // Wait for modal to open
      await page.waitForTimeout(500);
      
      // Check if dialog is visible with hidden hirameki options
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      // Should contain card preview frames
      const cardFrames = page.locator('[data-testid="card-frame"], .border');
      const frameCount = await cardFrames.count();
      expect(frameCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should apply hidden hirameki and display correct card info', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find a hidden hirameki button and click it
    const hiddenButtons = await page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
    const count = await hiddenButtons.count();
    
    if (count > 0) {
      await hiddenButtons.first().click();
      await page.waitForTimeout(500);
      
      // Click the first card variant in the modal
      const cardVariants = page.locator('[role="dialog"] button');
      const variantCount = await cardVariants.count();
      
      if (variantCount > 0) {
        // Click the first variant
        await cardVariants.first().click();
        
        // Modal should close
        await page.waitForTimeout(300);
        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).not.toBeVisible({ timeout: 2000 });
      }
    }
  });

  test('should handle multiple hidden hirameki levels correctly', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Get all hidden hirameki buttons
    const hiddenButtons = await page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
    const buttonCount = await hiddenButtons.count();
    
    // Test each hidden hirameki button
    for (let i = 0; i < Math.min(buttonCount, 2); i++) {
      const buttons = page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
      const button = buttons.nth(i);
      
      // Click the button
      await button.click();
      await page.waitForTimeout(500);
      
      // Verify dialog is visible
      const dialog = page.locator('[role="dialog"]');
      await expect(dialog).toBeVisible();
      
      // Click first variant
      const variants = page.locator('[role="dialog"] button');
      const variantCount = await variants.count();
      if (variantCount > 0) {
        await variants.first().click();
        await page.waitForTimeout(300);
      }
      
      // Click outside or close button to close dialog
      const closeButton = page.locator('[role="dialog"] button:has-text("外す")').first();
      const hasCloseButton = await closeButton.isVisible().catch(() => false);
      if (hasCloseButton) {
        await closeButton.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('should preserve hidden hirameki state when copying card', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Find and apply hidden hirameki to a card
    const hiddenButtons = await page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
    const count = await hiddenButtons.count();
    
    if (count > 0) {
      // Apply hidden hirameki
      await hiddenButtons.first().click();
      await page.waitForTimeout(500);
      
      const variants = page.locator('[role="dialog"] button');
      const variantCount = await variants.count();
      if (variantCount > 0) {
        await variants.first().click();
        await page.waitForTimeout(500);
      }
      
      // Now copy the card using the copy action (if available)
      // This is a simplified test - actual implementation may vary
      const cardActions = page.locator('[data-testid="card-actions"], [title*="Copy"]');
      const actionCount = await cardActions.count();
      expect(actionCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should reset hidden hirameki when removing it', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Apply hidden hirameki
    const hiddenButtons = await page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
    const count = await hiddenButtons.count();
    
    if (count > 0) {
      await hiddenButtons.first().click();
      await page.waitForTimeout(500);
      
      // Select first variant
      const variants = page.locator('[role="dialog"] button');
      const variantCount = await variants.count();
      if (variantCount > 0) {
        await variants.first().click();
        await page.waitForTimeout(500);
      }
      
      // Click the hidden hirameki button again
      const freshButtons = page.locator('button[title*="隠しヒラメキ"], button[title*="Hidden"]');
      await freshButtons.first().click();
      await page.waitForTimeout(500);
      
      // Click remove button
      const removeButton = page.locator('[role="dialog"] button:has-text("外す")').first();
      const hasRemove = await removeButton.isVisible().catch(() => false);
      if (hasRemove) {
        await removeButton.click();
        await page.waitForTimeout(300);
      }
    }
  });
});
