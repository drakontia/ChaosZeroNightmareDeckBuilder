import { test, expect, Page } from '@playwright/test';

const selectCharacter = async (page: Page) => {
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'チズル', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'チズル', exact: true }).click();
};

const getDeckCardContainerByName = (page: Page, cardName: string) => {
  const nameLocator = page.getByText(cardName, { exact: true }).first();
  return nameLocator.locator('xpath=ancestor::div[.//button[@aria-label="メニュー"]][1]');
};

const addPersonaCard = async (page: Page) => {
  await page.getByRole('button', { name: 'シーズンカード 3' }).click();
  const forbiddenSection = page.getByRole('heading', { name: 'シーズンカード 3' }).locator('..');
  await forbiddenSection.getByTitle('ペルソナ').first().click({ timeout: 10_000 });

  // アコーディオンを閉じて「ペルソナ」テキストの重複を防ぐ
  await page.getByRole('button', { name: 'シーズンカード 3' }).click();
  await page.waitForTimeout(300);
};

test.describe('Persona Card Engraving', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectCharacter(page);
  });

  test('persona card shows 刻印 button in deck', async ({ page }) => {
    await addPersonaCard(page);

    const deckCard = getDeckCardContainerByName(page, 'ペルソナ');
    await expect(deckCard).toBeVisible({ timeout: 5000 });

    const engravingBtn = deckCard.getByRole('button', { name: '刻印', exact: true });
    await expect(engravingBtn).toBeVisible({ timeout: 5000 });
  });

  test('clicking 刻印 button opens persona engraving dialog', async ({ page }) => {
    await addPersonaCard(page);

    const deckCard = getDeckCardContainerByName(page, 'ペルソナ');
    const engravingBtn = deckCard.getByRole('button', { name: '刻印', exact: true });
    await engravingBtn.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole('heading', { name: '刻印', exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '光の刻印' })).toBeVisible();
    await expect(dialog.getByRole('button', { name: '闇の刻印' })).toBeVisible();
  });

  test('selecting a light engraving updates card name to 光のペルソナ', async ({ page }) => {
    await addPersonaCard(page);

    const deckCard = getDeckCardContainerByName(page, 'ペルソナ');
    await deckCard.getByRole('button', { name: '刻印', exact: true }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Open 光の刻印 accordion
    await dialog.getByRole('button', { name: '光の刻印' }).click();
    await page.waitForTimeout(300);

    // Click the first visible engraving button (チズル=PSIONIC なので感応を使用)
    const firstEngraving = dialog.getByRole('button').filter({ hasText: '感応' });
    await expect(firstEngraving.first()).toBeVisible({ timeout: 3000 });
    await firstEngraving.first().click();

    // Confirm the selection
    await dialog.getByRole('button', { name: '選択' }).click();

    // Dialog should close and card name should update to 光のペルソナ
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('光のペルソナ', { exact: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('can select two engravings and name becomes 光輝のペルソナ', async ({ page }) => {
    await addPersonaCard(page);

    const deckCard = getDeckCardContainerByName(page, 'ペルソナ');
    await deckCard.getByRole('button', { name: '刻印', exact: true }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Open 光の刻印 accordion and pick two light engravings
    await dialog.getByRole('button', { name: '光の刻印' }).click();
    await page.waitForTimeout(300);

    // チズル=PSIONICなので感応（全ジョブ対応）を使用
    const lightButtons = dialog.getByRole('button').filter({ hasText: '感応' });
    await expect(lightButtons.first()).toBeVisible({ timeout: 3000 });
    await lightButtons.first().click();

    // 2つ目は光の刻印数に応じて反撃1（全ジョブ対応）
    const secondLightBtn = dialog.getByRole('button').filter({ hasText: '反撃1' });
    await expect(secondLightBtn).toBeVisible({ timeout: 3000 });
    await secondLightBtn.click();

    await dialog.getByRole('button', { name: '選択' }).click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('光輝のペルソナ', { exact: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('clicking the same engraving cycles to two slots and updates to 光輝のペルソナ', async ({ page }) => {
    await addPersonaCard(page);

    const deckCard = getDeckCardContainerByName(page, 'ペルソナ');
    await deckCard.getByRole('button', { name: '刻印', exact: true }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await dialog.getByRole('button', { name: '光の刻印' }).click();
    await page.waitForTimeout(300);

    const sameEngraving = dialog.getByRole('button').filter({ hasText: '感応' }).first();
    await expect(sameEngraving).toBeVisible({ timeout: 3000 });
    await sameEngraving.click();
    await sameEngraving.click();

    await dialog.getByRole('button', { name: '選択' }).click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText('光輝のペルソナ', { exact: true }).first()).toBeVisible({ timeout: 5000 });
  });

  test('non-persona season cards do not show 刻印 button', async ({ page }) => {
    await page.getByRole('button', { name: 'シーズンカード 1' }).click();
    const forbiddenSection = page.getByRole('heading', { name: 'シーズンカード 1' }).locator('..');
    await forbiddenSection.getByText('禁じられたアルゴリズム', { exact: true }).first().click({ timeout: 10_000 });

    const deckCard = getDeckCardContainerByName(page, '禁じられたアルゴリズム');
    await expect(deckCard).toBeVisible({ timeout: 5000 });

    const engravingBtn = deckCard.getByRole('button', { name: '刻印', exact: true });
    await expect(engravingBtn).not.toBeVisible();
  });
});
