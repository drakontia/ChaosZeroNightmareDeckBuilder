import { test, expect, Page, APIRequestContext } from '@playwright/test';

const getWithRetry = async (request: APIRequestContext, url: string, retries: number = 2) => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await request.get(url);
    } catch (error) {
      lastError = error;
      if (attempt >= retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError;
};

// ヘルパー関数：キャラクターと武器を選択
const selectCharacterAndWeapon = async (page: Page) => {
  await page.getByRole('button', { name: 'キャラクターを選択' }).click();
  await page.getByRole('button', { name: 'チズル' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'チズル' }).click();
  await page.getByRole('button', { name: '武器' }).click();
  await page.getByRole('button', { name: 'ガストロノミコン' }).click();
};

// ヘルパー関数：ヒラメキカードを追加
const addHiramekiCard = async (page: Page, cardName: string) => {
  const hiramekiSection = page.getByRole('heading', { name: 'ヒラメキカード' }).locator('..');
  const card = hiramekiSection.getByText(cardName, { exact: true }).first();
  await expect(card).toBeVisible({ timeout: 10000 });
  await card.click({ timeout: 10000 });
};

// ヘルパー関数：デッキを共有してshareIdを取得
const shareDeckAndGetShareId = async (page: Page) => {
  // コンソールエラーをキャプチャ
  const consoleErrors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const shareBtn = page.getByRole('button', { name: '共有' });
  await expect(shareBtn).toBeEnabled({ timeout: 5000 });

  const alertPromise = new Promise<string>((resolve) => {
    page.once('dialog', async (dialog) => {
      resolve(dialog.message());
      await dialog.accept();
    });
  });

  await shareBtn.click();
  const alertMessage = await alertPromise;
  
  // エラーが発生した場合はコンソールログを出力
  if (!alertMessage.includes('共有URLをコピーしました')) {
    console.log('Console errors:', consoleErrors);
  }
  
  expect(alertMessage).toContain('共有URLをコピーしました');

  const shareUrl = await page.evaluate(() => (window as any).__copiedURL);
  expect(shareUrl).toMatch(/^http:\/\/localhost:3000\/deck\//);

  const shareIdMatch = shareUrl.match(/\/deck\/([^/?]+)/);
  expect(shareIdMatch).not.toBeNull();
  return shareIdMatch![1];
};

test.describe('OpenGraph Image Generation', () => {
  test('should generate OpenGraph image for shared deck', async ({ page, request, context }) => {
    // クリップボードの権限を付与
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');
    
    // ページロード直後にクリップボードAPIをモック
    await page.evaluate(() => {
      (window as any).__copiedURL = '';
      const originalClipboard = navigator.clipboard;
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            (window as any).__copiedURL = text;
            return Promise.resolve();
          },
          readText: async () => (window as any).__copiedURL,
        },
        writable: true,
        configurable: true,
      });
    });
    
    await selectCharacterAndWeapon(page);
    await addHiramekiCard(page, '黄昏の結束');
    
    // カードが追加されたことを確認
    await expect(page.getByTestId('total-cards')).toContainText('5', { timeout: 10000 });
    
    const shareId = await shareDeckAndGetShareId(page);
    const ogImageUrl = `http://localhost:3000/deck/${shareId}/opengraph-image`;
    
    const response = await getWithRetry(request, ogImageUrl);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    
    const imageBuffer = await response.body();
    expect(imageBuffer.length).toBeGreaterThan(10 * 1024);
    
    // PNGのマジックナンバーを確認
    expect(imageBuffer[0]).toBe(0x89);
    expect(imageBuffer[1]).toBe(0x50);
    expect(imageBuffer[2]).toBe(0x4e);
    expect(imageBuffer[3]).toBe(0x47);
  });

  test('should return 404 for invalid shareId', async ({ request }) => {
    const invalidShareId = 'invalid-share-id-123';
    const ogImageUrl = `http://localhost:3000/deck/${invalidShareId}/opengraph-image`;
    
    const response = await getWithRetry(request, ogImageUrl);
    expect(response.status()).toBe(404);
  });

  test('should generate image with multiple cards', async ({ page, request, context }) => {
    // クリップボードの権限を付与
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    await page.goto('/');
    
    // ページロード直後にクリップボードAPIをモック
    await page.evaluate(() => {
      (window as any).__copiedURL = '';
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            (window as any).__copiedURL = text;
            return Promise.resolve();
          },
          readText: async () => (window as any).__copiedURL,
        },
        writable: true,
        configurable: true,
      });
    });
    
    await selectCharacterAndWeapon(page);
    await addHiramekiCard(page, '黄昏の結束');
    
    await expect(page.getByTestId('total-cards')).toContainText('5', { timeout: 10000 });
    
    const shareId = await shareDeckAndGetShareId(page);
    const ogImageUrl = `http://localhost:3000/deck/${shareId}/opengraph-image`;
    
    const response = await getWithRetry(request, ogImageUrl);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    
    const imageBuffer = await response.body();
    expect(imageBuffer.length).toBeGreaterThan(10 * 1024);
  });
});
