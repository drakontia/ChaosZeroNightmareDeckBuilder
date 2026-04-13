import { test, expect, Page } from '@playwright/test';

const selectCharacter = async (page: Page) => {
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'チズル', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'チズル', exact: true }).click();
};

test.describe('Equipment Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await selectCharacter(page);
  });

  test('weapon button opens weapon selection modal', async ({ page }) => {
    await page.getByRole('button', { name: '武器' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole('heading', { name: '武器' })).toBeVisible();
  });

  test('armor button opens armor selection modal', async ({ page }) => {
    await page.getByRole('button', { name: '防具' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole('heading', { name: '防具' })).toBeVisible();
  });

  test('pendant button opens pendant selection modal', async ({ page }) => {
    await page.getByRole('button', { name: 'ペンダント' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });
    await expect(dialog.getByRole('heading', { name: 'ペンダント' })).toBeVisible();
  });

  test('selecting a weapon closes the modal and shows the weapon name', async ({ page }) => {
    await page.getByRole('button', { name: '武器' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: 'ガストロノミコン' }).click();

    // Dialog should close after selecting
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Weapon name should be displayed on the equipment button
    await expect(page.getByRole('button', { name: 'ガストロノミコン' })).toBeVisible();
  });

  test('selecting armor closes the modal', async ({ page }) => {
    await page.getByRole('button', { name: '防具' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Select the first armor item available (「除去」ボタンを除外)
    const firstArmorBtn = dialog.getByRole('button')
      .filter({ hasText: /.+/ })
      .filter({ hasNotText: '除去' })
      .first();
    await expect(firstArmorBtn).toBeVisible({ timeout: 5000 });
    const armorName = await firstArmorBtn.textContent();
    await firstArmorBtn.click();

    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Armor name should now appear somewhere on the page
    if (armorName?.trim()) {
      await expect(page.getByRole('button', { name: armorName.trim() })).toBeVisible({ timeout: 3000 });
    }
  });

  test('closing weapon modal without selection keeps 武器 placeholder', async ({ page }) => {
    await page.getByRole('button', { name: '武器' }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Close without selecting
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // 武器 button should still be visible (no equipment selected)
    await expect(page.getByRole('button', { name: '武器' })).toBeVisible();
  });
});
