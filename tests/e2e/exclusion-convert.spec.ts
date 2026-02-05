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

/**
 * Exclusion conversion flow:
 * - Convert a character hirameki card via Exclusion Card tile
 * - Deck should remove original and not add target
 * - Faint Memory becomes 0 points (character card has no base points)
 */
 test('should convert character hirameki card via Exclusion Card and not add target; points = 0', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
  await selectCharacterAndWeapon(page);

  // Add a character hirameki card
  const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
  const hiramekiName = '月読';
  await hiramekiSection.getByText(hiramekiName, { exact: true }).first().click({ timeout: 10_000 });

  // Confirm in deck and capture counts
  const deckCard = getDeckCardContainerByName(page, hiramekiName);
  await expect(deckCard).toBeVisible();
  const totalBefore = parseInt(await page.locator('[data-testid="total-cards"]').innerText());

  // Convert via Exclusion Card tile
  await deckCard.getByRole('button', { name: 'メニュー' }).click();
  await page.getByRole('button', { name: '変換' }).click();
  const dialog = page.getByRole('dialog');
  const exclusionTile = dialog.getByText('排除カード', { exact: true }).first();
  await expect(exclusionTile).toBeVisible();
  await exclusionTile.click();

  // Deck should not contain target (none added) and original removed -> total decreases by 1
  await expect
    .poll(async () => parseInt(await page.locator('[data-testid="total-cards"]').innerText()), {
      message: 'card count should drop after exclusion convert',
    })
    .toBe(totalBefore - 1);

  // Converted list shows original for restoration
  const convertedSection = page.getByRole('heading', { name: '変換したカード' }).locator('..');
  await expect(convertedSection.getByText(hiramekiName, { exact: true }).first()).toBeVisible();

  // Confirm that the card is NOT shown in Hirameki section anymore
  await expect(hiramekiSection.getByText(hiramekiName, { exact: true }).first()).not.toBeVisible();

  // Faint Memory points should be 0 (character card has no acquisition points)
  const fmText = await page.getByTestId('faint-memory-points').innerText();
  expect(fmText.replace(/[^0-9]/g, '')).toBe('0');
});
