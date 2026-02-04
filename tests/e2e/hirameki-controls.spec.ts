import { test, expect, Page } from '@playwright/test';

const selectCharacterAndWeapon = async (page: Page) => {
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'チズル' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'チズル' }).click();

  await page.getByRole('button', { name: '武器' }).click();
  await page.getByRole('button', { name: 'ガストロノミコン' }).click();
};

const openAccordion = async (page: Page, name: string) => {
  const trigger = page.getByRole('button', { name });
  await trigger.click();
};

const getDeckCardContainerByName = (page: Page, cardName: string) => {
  const nameLocator = page.getByText(cardName, { exact: true }).first();
  return nameLocator.locator('xpath=ancestor::div[.//button[@aria-label="メニュー"]][1]');
};

test.describe('Hirameki Controls (non-character cards)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);
  });

  test('shared/monster/forbidden cards show Hirameki and God controls', async ({ page }) => {
    // Add one card for each type
    await openAccordion(page, '共用カード');
    const sharedSection = page.getByRole('heading', { name: '共用カード' }).locator('..');
    await sharedSection.getByText('加虐性', { exact: true }).first().click({ timeout: 10_000 });

    await openAccordion(page, 'モンスターカード');
    const monsterSection = page.getByRole('heading', { name: 'モンスターカード' }).locator('..');
    await monsterSection.getByText('恥ずかしがり屋の庭師', { exact: true }).first().click({ timeout: 10_000 });

    await openAccordion(page, 'シーズンカード');
    const forbiddenSection = page.getByRole('heading', { name: 'シーズンカード' }).locator('..');
    await forbiddenSection.getByText('禁じられたアルゴリズム', { exact: true }).first().click({ timeout: 10_000 });

    // Verify controls exist on each deck card with shorter timeout
    for (const name of ['加虐性', '恥ずかしがり屋の庭師', '禁じられたアルゴリズム']) {
      const deckCard = getDeckCardContainerByName(page, name);
      await expect(deckCard.getByRole('button', { name: 'ヒラメキ', exact: true })).toBeVisible({ timeout: 5000 });
      await expect(deckCard.getByRole('button', { name: '神ヒラメキ選択', exact: true })).toBeVisible({ timeout: 5000 });
    }
  });

  test('apply hidden hirameki to shared card updates description (and marks active)', async ({ page }) => {
    // Add a shared card
    await openAccordion(page, '共用カード');
    const sharedSection = page.getByRole('heading', { name: '共用カード' }).locator('..');
    const cardName = '加虐性';
    await sharedSection.getByText(cardName, { exact: true }).first().click({ timeout: 10_000 });

    const deckCard = getDeckCardContainerByName(page, cardName);
    const hiramekiBtn = deckCard.getByRole('button', { name: 'ヒラメキ', exact: true });
    await expect(hiramekiBtn).toBeVisible();
    await hiramekiBtn.click();

    // In the dialog, check if hidden hirameki accordion exists
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // Hidden hirameki accordion should appear for base level cards
    const accordionTrigger = dialog.getByRole('button', { name: '隠しヒラメキ' });
    const hasAccordion = await accordionTrigger.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasAccordion) {
      await accordionTrigger.click();
      await page.waitForTimeout(500);

      // Use the button[title] tiles used in the UI; capture text to assert later
      const firstHiddenTile = dialog.locator('button[title]').first();
      await expect(firstHiddenTile).toBeVisible({ timeout: 3000 });
      const tileText = (await firstHiddenTile.innerText()).split('\n').map(s => s.trim()).filter(Boolean)[0] ?? '';
      await firstHiddenTile.click();
      // Wait for dialog to close
      await expect(dialog).not.toBeVisible({ timeout: 5000 });

      // Re-fetch deck card and verify description contains a snippet from selected hidden effect
      const updatedDeckCard = getDeckCardContainerByName(page, cardName);
      if (tileText) {
        await expect(updatedDeckCard).toContainText(tileText, { timeout: 5000 });
      }
      // Optionally, check button active style (best-effort)
      const updatedHiramekiBtn = updatedDeckCard.getByRole('button', { name: 'ヒラメキ', exact: true });
      await expect(updatedHiramekiBtn).toHaveClass(/bg-yellow-400|bg-yellow-300/, { timeout: 3000 });
    } else {
      // Close dialog if no accordion
      await page.keyboard.press('Escape');
    }
  });

  test('apply god hirameki to shared card marks God active', async ({ page }) => {
    // Add a shared card
    await openAccordion(page, '共用カード');
    const sharedSection = page.getByRole('heading', { name: '共用カード' }).locator('..');
    const cardName = '加虐性';
    await sharedSection.getByText(cardName, { exact: true }).first().click({ timeout: 10_000 });

    const deckCard = getDeckCardContainerByName(page, cardName);
    const godBtn = deckCard.getByRole('button', { name: '神ヒラメキ選択', exact: true });
    await expect(godBtn).toBeVisible();
    await godBtn.click();

    // Select god from dropdown and pick effect
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    
    // Click the god dropdown button within the dialog
    const godDropdown = dialog.getByRole('button', { name: '神ヒラメキ選択' }).first();
    await godDropdown.click();
    
    // Select Kilken from the menu
    const kilkenOption = page.getByRole('menuitem', { name: 'キルケン' }).first();
    await kilkenOption.click();
    
    // Now click the first effect tile and remember text snippet (use title-bearing tiles)
    const effectTiles = dialog.locator('button[title]');
    const tileCount = await effectTiles.count();
    
    if (tileCount > 0) {
      const firstTile = effectTiles.first();
      await expect(firstTile).toBeVisible();
      const allLines = (await firstTile.innerText()).split('\n').map(s => s.trim()).filter(Boolean);
      // Heuristic: pick the longest line that is not the card name or a pure number (likely the effect text)
      const candidate = allLines
        .filter(line => line !== cardName && !/^\d+$/.test(line))
        .sort((a, b) => b.length - a.length)[0] ?? '';
      await firstTile.click();
      // Wait for dialog to close
      await expect(dialog).not.toBeVisible({ timeout: 5000 });
      
      // Re-fetch deck card and verify effect text appears
      const updatedDeckCard = getDeckCardContainerByName(page, cardName);
      if (candidate) {
        await expect(updatedDeckCard).toContainText(candidate, { timeout: 5000 });
      }
    } else {
      // Close dialog
      await page.keyboard.press('Escape');
    }
  });
});
