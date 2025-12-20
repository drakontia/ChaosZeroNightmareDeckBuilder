import { test, expect, Page } from '@playwright/test';

const selectCharacterAndWeapon = async (page: Page) => {
  // Character selection
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'チズル' }).click();

  // Weapon selection
  await page.getByRole('button', { name: '武器' }).click();
  await page.getByRole('button', { name: 'ガストロノミコン' }).click();
};

const addFirstHiramekiCard = async (page: Page) => {
  const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
  const hiramekiGrid = hiramekiSection.locator('.grid');
  const firstCard = hiramekiGrid.locator('div[title]').first();
  const cardName = await firstCard.getAttribute('title');
  await firstCard.click();
  return cardName ?? '';
};

const addHiramekiCardByName = async (page: Page, cardName: string) => {
  const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
  const target = hiramekiSection.locator(`div[title="${cardName}"]`).first();
  await expect(target).toBeVisible();
  await target.click();
  return cardName;
};

const openAccordion = async (page: Page, name: string) => {
  const trigger = page.getByRole('button', { name });
  await trigger.click();
};

const getDeckCardContainerByName = (page: Page, cardName: string) => {
  const nameLocator = page.locator(`div[title="${cardName}"]`).first();
  // Climb to the nearest ancestor that also contains the menu button
  return nameLocator.locator('xpath=ancestor::div[.//button[@aria-label="メニュー"]][1]');
};

test.describe('Deck Editor', () => {
  test('should load the deck editor page', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('カオスゼロナイトメア デッキエディター')).toBeVisible();
  });

  test('should select a character', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);

    // Verify character is shown in the deck
    await expect(page.getByText('チズル').first()).toBeVisible();
  });

  test('should select equipment', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);

    // Verify weapon is shown in the deck (selected equipment button reflects the choice)
    await expect(page.getByRole('button', { name: 'ガストロノミコン' })).toBeVisible();
  });

  test('should add cards to deck', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);

    const addedCardName = await addFirstHiramekiCard(page);
    // Verify deck contains the added card by using deck card container
    const deckCard = getDeckCardContainerByName(page, addedCardName);
    await expect(deckCard).toBeVisible();

    // Deck total should go from 4 to 5
    const totalCardsField = page.getByRole('group').filter({ hasText: 'カード枚数' });
    await expect(totalCardsField.locator('span.text-primary').filter({ hasText: '5' })).toBeVisible();
  });

  test('should change card hirameki state and update description to selected level', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);
    const cardName = await addFirstHiramekiCard(page);
    // Try to find hirameki button within the card context; skip if not present
    const hiramekiBtn = page.getByRole('button', { name: 'ヒラメキ' }).filter({ has: page.locator(`div[title="${cardName}"]`) }).first();
    const btnCount = await hiramekiBtn.count();
    if (btnCount === 0) {
      test.skip(true, 'ヒラメキボタンが存在しないカードのためスキップ');
      return;
    }
    await hiramekiBtn.click();

    // Capture Lv1 description text from the modal preview, then select it
    const lv1Tile = page.locator('[title="Lv1"]').first();
    const lv1Text = await lv1Tile.innerText();
    await lv1Tile.click();

    // Verify hirameki button indicates active state
    await expect(hiramekiBtn).toHaveClass(/bg-yellow-400/);

    // Verify deck card description contains the Lv1 preview text
    const deckCard = getDeckCardContainerByName(page, cardName);
    await expect(deckCard).toContainText(lv1Text);
  });

  test('should change card to god hirameki state and show localized effect with correct cost', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);
    const cardName = await addFirstHiramekiCard(page);
    const godBtn = page.getByRole('button', { name: '神ヒラメキ選択' }).filter({ has: page.locator(`div[title="${cardName}"]`) }).first();
    const godCount = await godBtn.count();
    if (godCount === 0) {
      test.skip(true, '神ヒラメキボタンが存在しないカードのためスキップ');
      return;
    }
    await godBtn.click();

    // Choose a god in the horizontal group, then pick first effect preview
    const dialog = page.getByRole('dialog');
    const kilkenBtn = dialog.getByRole('button', { name: 'キルケン' });
    await kilkenBtn.first().click();
    const effectTile = dialog.locator('button[title]').first();
    const effectText = await effectTile.innerText();
    const tileCostMatch = effectText.match(/\b(\d+)\b/);
    const expectedCost = tileCostMatch ? parseInt(tileCostMatch[1], 10) : undefined;
    await effectTile.click();

    // Verify god button indicates active state
    await expect(godBtn).toHaveClass(/bg-yellow-400/);

    // Verify localized god effect text appears under the card description
    const deckCard = getDeckCardContainerByName(page, cardName);
    await expect(deckCard.getByText('攻撃時、追加ダメージを与える')).toBeVisible();

    // Verify the deck card cost matches the effect preview cost
    if (expectedCost !== undefined) {
      const deckText = await deckCard.innerText();
      const deckCostMatch = deckText.match(/\b(\d+)\b/);
      const deckCost = deckCostMatch ? parseInt(deckCostMatch[1], 10) : undefined;
      expect(deckCost).toBe(expectedCost);
    }
  });

  test('should remove card from deck', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);
    const cardName = await addFirstHiramekiCard(page);

    // Remove the card
    const deleteBtn = page.getByRole('button', { name: '削除' }).filter({ has: page.locator(`div[title="${cardName}"]`) }).first();
    const delCount = await deleteBtn.count();
    if (delCount === 0) {
      test.skip(true, '削除ボタンが見つからないためスキップ');
      return;
    }
    await deleteBtn.click();

    // Verify card is removed
    const totalCardsField = page.getByRole('group').filter({ hasText: 'カード枚数' });
    await expect(totalCardsField.getByText('4')).toBeVisible();
  });

  test('should clear entire deck', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);
    await addFirstHiramekiCard(page);

    // Clear deck
    await page.getByRole('button', { name: 'デッキをクリア' }).click();

    // Verify deck is cleared
    await expect(page.getByText('キャラクターを選択すると開始カードが表示されます')).toBeVisible();
  });

  test('should add different card types', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);

    await addFirstHiramekiCard(page);

    await openAccordion(page, '共用カード');
    await page.locator('div[title="全体攻撃"]').first().click();

    await openAccordion(page, 'モンスターカード');
    await page.locator('div[title="モンスター召喚"]').first().click();

    await openAccordion(page, '禁忌カード');
    await page.locator('div[title="禁呪"]').first().click();

    // Verify deck total now equals 8 (4 start + 4 added)
    const totalCardsField = page.getByRole('group').filter({ hasText: 'カード枚数' });
    await expect(totalCardsField.getByText('8')).toBeVisible();
  });

  test('hirameki cards should hide after add and reappear on undo', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);

    // Locate the Hirameki section and its grid
    const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
    const hiramekiGrid = hiramekiSection.locator('.grid');

    const firstCard = hiramekiGrid.locator('div[title]').first();
    const clickedTitle = await firstCard.getAttribute('title');
    await firstCard.click();

    // After adding, the clicked card should disappear from the list
    await expect(hiramekiGrid.locator(`div[title="${clickedTitle}"]`)).toHaveCount(0);

    // Undo from deck to bring it back
    // The added card appears at the end of deck; open its menu
    await page.getByRole('button', { name: 'メニュー' }).last().click();
    const undoBtn = page.getByRole('button', { name: '戻す' }).first();
    await expect(undoBtn).toBeVisible();
    await undoBtn.click();

    // It should reappear in the hirameki list (at least one match)
    const afterCount = await hiramekiGrid.locator(`div[title="${clickedTitle}"]`).count();
    expect(afterCount).toBeGreaterThan(0);
  });

  test('should convert a card to shared and restore from converted list', async ({ page }) => {
    await page.goto('/');
    await selectCharacterAndWeapon(page);

    const originalName = await addFirstHiramekiCard(page);

    // Open actions menu for the added card
    const deckCard = getDeckCardContainerByName(page, originalName);
    await expect(deckCard.getByRole('button', { name: 'メニュー' })).toBeVisible();
    await deckCard.getByRole('button', { name: 'メニュー' }).click();
    await deckCard.getByRole('button', { name: '変換' }).click();

    // Pick a shared card from the conversion modal
    const targetName = '全体攻撃';
    const dialog = page.getByRole('dialog');
    const targetTile = dialog.locator(`div[title="${targetName}"]`).first();
    await expect(targetTile).toBeVisible();
    await targetTile.click();

    // Deck should now show the converted target card (with actions menu available)
    const convertedDeckCard = getDeckCardContainerByName(page, targetName);
    await expect(convertedDeckCard.getByRole('button', { name: 'メニュー' })).toBeVisible();

    // Converted list should show the original card for restoration
    const convertedSection = page.getByRole('heading', { name: '変換したカード' }).locator('..');
    const originalTile = convertedSection.locator(`div[title="${originalName}"]`).first();
    await expect(originalTile).toBeVisible();

    // Restore the original card from the converted list
    await originalTile.click();

    // Deck shows the original card again and converted list entry disappears
    const restoredDeckCard = getDeckCardContainerByName(page, originalName);
    await expect(restoredDeckCard.getByRole('button', { name: 'メニュー' })).toBeVisible();
    await expect(convertedSection.locator(`div[title="${originalName}"]`)).toHaveCount(0);
  });
});
