import { test, expect, Page } from '@playwright/test';

// ─── helpers ────────────────────────────────────────────────────────────────

const selectDiana = async (page: Page) => {
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'ディアナ', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'ディアナ', exact: true }).click();
};

const selectWeapon = async (page: Page) => {
  await page.getByRole('button', { name: '武器' }).click();
  await page.getByRole('button', { name: 'ガストロノミコン' }).click();
};

const selectArabella = async (page: Page) => {
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'アラベラ', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'アラベラ', exact: true }).click();
};

const getDeckCardContainerByName = (page: Page, cardName: string) => {
  const nameLocator = page.getByText(cardName, { exact: true }).first();
  return nameLocator.locator('xpath=ancestor::div[.//button[@aria-label="メニュー"]][1]');
};

// ─── tests ──────────────────────────────────────────────────────────────────

test.describe('Diana Character', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('Diana appears in the character selection list', async ({ page }) => {
    await page.getByRole('button', { name: 'キャラクターを選択' }).click();
    await expect(page.getByRole('button', { name: 'ディアナ', exact: true })).toBeVisible();
  });

  test('selecting Diana shows her starting cards in the deck', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    // Diana's starting cards should appear in deck
    await expect(page.getByText('撹乱射撃', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('私を守って', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('心を込めて！', { exact: true }).first()).toBeVisible();
  });

  test('Diana\'s hirameki cards are listed after character selection', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
    await expect(hiramekiSection.getByText('おいでミルクポン', { exact: true }).first()).toBeVisible();
    await expect(hiramekiSection.getByText('浄化のピストル', { exact: true }).first()).toBeVisible();
    await expect(hiramekiSection.getByText('芽生える愛', { exact: true }).first()).toBeVisible();
    await expect(hiramekiSection.getByText('解放された心', { exact: true }).first()).toBeVisible();
  });

  test('adding a Diana hirameki card shows it in the deck', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
    await hiramekiSection.getByText('浄化のピストル', { exact: true }).first().click({ timeout: 10_000 });

    const deckCard = getDeckCardContainerByName(page, '浄化のピストル');
    await expect(deckCard).toBeVisible();
  });

  test('Diana hirameki card has Hirameki and God buttons', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
    await hiramekiSection.getByText('浄化のピストル', { exact: true }).first().click({ timeout: 10_000 });

    const deckCard = getDeckCardContainerByName(page, '浄化のピストル');
    await expect(deckCard.getByRole('button', { name: 'ヒラメキ', exact: true })).toBeVisible();
    await expect(deckCard.getByRole('button', { name: '神ヒラメキ選択', exact: true })).toBeVisible();
  });

  test('Diana card shows QUIETUS status badge', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    // 「心を込めて！」は QUIETUS ステータスを持つ → CardFrame が [安息] と表示する
    const deckCard = getDeckCardContainerByName(page, '心を込めて！');
    await expect(deckCard).toBeVisible();
    await expect(deckCard).toContainText('安息');
  });

  test('selecting hirameki level for Diana card updates description', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
    await hiramekiSection.getByText('浄化のピストル', { exact: true }).first().click({ timeout: 10_000 });

    const deckCard = getDeckCardContainerByName(page, '浄化のピストル');
    const hiramekiBtn = deckCard.getByRole('button', { name: 'ヒラメキ', exact: true });
    await hiramekiBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Select Lv1 tile
    const lv1Tile = dialog.locator('[title="Lv1"]').first();
    await expect(lv1Tile).toBeVisible({ timeout: 5000 });
    const lv1Text = (await lv1Tile.innerText())
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    await lv1Tile.click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Hirameki button should be active
    await expect(hiramekiBtn).toHaveClass(/bg-yellow-400/);

    // Deck card should reflect Lv1 description
    for (const line of lv1Text) {
      await expect(deckCard).toContainText(line);
    }
  });

  test('Diana card accumulates Faint Memory points correctly', async ({ page }) => {
    await selectDiana(page);
    await selectWeapon(page);

    const getFaintMemory = async () => {
      const text = await page.locator('[data-testid="faint-memory-points"]').innerText();
      return parseInt(text);
    };

    const faintMemoryBefore = await getFaintMemory();

    // Add 浄化のピストル (CHARACTER type → 0 pt base)
    const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
    await hiramekiSection.getByText('浄化のピストル', { exact: true }).first().click({ timeout: 10_000 });

    const faintMemoryAfter = await getFaintMemory();
    expect(faintMemoryAfter).toBe(faintMemoryBefore);
  });

  test('Arabella appears in the character selection list', async ({ page }) => {
    await page.getByRole('button', { name: 'キャラクターを選択' }).click();
    await expect(page.getByRole('button', { name: 'アラベラ', exact: true })).toBeVisible();
  });

  test('selecting Arabella shows her starting and hirameki cards in the deck', async ({ page }) => {
    await selectArabella(page);
    await selectWeapon(page);

    await expect(page.getByText('斜め斬り', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('観察遊戯', { exact: true }).first()).toBeVisible();
  });
});
