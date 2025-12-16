import { test, expect } from '@playwright/test';

test.describe('Deck Editor', () => {
  test('should load the deck editor page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('カオスゼロナイトメア デッキエディター')).toBeVisible();
  });

  test('should select a character', async ({ page }) => {
    await page.goto('/');
    
    // Click on a character
    await page.getByRole('button', { name: 'リリス SSR' }).click();
    
    // Verify character is shown in the deck
    await expect(page.getByText('リリス').first()).toBeVisible();
  });

  test('should select equipment', async ({ page }) => {
    await page.goto('/');
    
    // Select a weapon
    await page.getByRole('button', { name: /聖剣エクスカリバー/ }).click();
    
    // Verify weapon is shown in the deck
    await expect(page.getByText(/武器:.*聖剣エクスカリバー/)).toBeVisible();
  });

  test('should add cards to deck', async ({ page }) => {
    await page.goto('/');
    
    // Add a card
    await page.getByRole('button', { name: /ファイアボール/ }).first().click();
    
    // Verify card is added to deck
    await expect(page.getByText('デッキ枚数: 1')).toBeVisible();
  });

  test('should change card hirameki state', async ({ page }) => {
    await page.goto('/');
    
    // Add a card
    await page.getByRole('button', { name: /ファイアボール/ }).first().click();
    
    const deckSection = page.locator('text=現在のデッキ').locator('..');
    
    // Click on ヒラメキ button - use exact match and first to avoid ambiguity
    await deckSection.getByRole('button', { name: 'ヒラメキ', exact: true }).first().click();
    
    // Verify the cost changed (from 3 to 2) - look for the card cost specifically, not total cost
    await expect(page.locator('h3:has-text("ファイアボール")').locator('..').getByText('コスト: 2')).toBeVisible();
  });

  test('should change card to god hirameki state', async ({ page }) => {
    await page.goto('/');
    
    // Add a card
    await page.getByRole('button', { name: /ファイアボール/ }).first().click();
    
    const deckSection = page.locator('text=現在のデッキ').locator('..');
    
    // Click on 神ヒラメキ button
    await deckSection.getByRole('button', { name: '神ヒラメキ' }).first().click();
    
    // Verify the cost changed (from 3 to 1) - look for the card cost specifically, not total cost
    await expect(page.locator('h3:has-text("ファイアボール")').locator('..').getByText('コスト: 1')).toBeVisible();
  });

  test('should remove card from deck', async ({ page }) => {
    await page.goto('/');
    
    // Add a card
    await page.getByRole('button', { name: /ファイアボール/ }).first().click();
    
    // Verify card is added
    await expect(page.getByText('デッキ枚数: 1')).toBeVisible();
    
    // Remove the card
    const deckSection = page.locator('text=現在のデッキ').locator('..');
    await deckSection.getByRole('button', { name: '削除' }).first().click();
    
    // Verify card is removed
    await expect(page.getByText('カードを選択してデッキに追加してください')).toBeVisible();
  });

  test('should clear entire deck', async ({ page }) => {
    await page.goto('/');
    
    // Select character
    await page.getByRole('button', { name: 'リリス SSR' }).click();
    
    // Add a card
    await page.getByRole('button', { name: /ファイアボール/ }).first().click();
    
    // Clear deck
    await page.getByRole('button', { name: 'デッキをクリア' }).click();
    
    // Verify deck is cleared
    await expect(page.getByText('カードを選択してデッキに追加してください')).toBeVisible();
  });

  test('should add different card types', async ({ page }) => {
    await page.goto('/');
    
    // Add a normal card
    await page.getByRole('button', { name: /ファイアボール/ }).first().click();
    
    // Add a shared card
    await page.getByRole('button', { name: /全体攻撃/ }).click();
    
    // Add a monster card
    await page.getByRole('button', { name: /モンスター召喚/ }).click();
    
    // Add a forbidden card
    await page.getByRole('button', { name: /禁呪/ }).click();
    
    // Verify all cards are added
    await expect(page.getByText('デッキ枚数: 4')).toBeVisible();
  });
});
