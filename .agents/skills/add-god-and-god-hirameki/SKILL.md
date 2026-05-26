---
name: add-god-and-god-hirameki
description: ChaosZeroNightmare Deck Builder に新しい「神」または「神ヒラメキエフェクト」を追加する手順。TDDで実施し、過去PR（#41/#43）の教訓（GOD_TYPES配列の更新忘れ防止）を含む。
origin: project
---

# スキル: 神および神ヒラメキの追加

## 概要

このスキルは、ChaosZeroNightmare Deck Builder に新しい「神」または「神ヒラメキエフェクト」を追加するAIエージェント向けの実施手順です。

**TDDで実施すること**: テストを先に書いてから実装する。

---

## 変更対象ファイル

新しい「神」を追加する場合は以下すべてを変更する。神ヒラメキエフェクトのみ追加する場合は★印のファイルのみ変更する。

| ファイル | 変更内容 | 必須 |
|----------|----------|------|
| `types/index.ts` | `GodType` enumに新しい神を追加 | 神を追加する場合 |
| `lib/god-hirameki.ts` | `GOD_HIRAMEKI_EFFECTS` に新エフェクト追加 ★ | 常に |
| `components/hirameki-controls/GodHiramekiDialog.tsx` | `GOD_TYPES` 配列に新しい神を追加 | 神を追加する場合 |
| `messages/ja/common.json` | `god.*` / `godEffects.*` にキー追加 ★ | 常に |
| `messages/en/common.json` | `god.*` / `godEffects.*` にキー追加 ★ | 常に |
| `messages/ko/common.json` | `god.*` / `godEffects.*` にキー追加 ★ | 常に |
| `messages/zh/common.json` | `god.*` / `godEffects.*` にキー追加 ★ | 常に |
| `tests/e2e/hirameki-controls.spec.ts` | 新しい神のドロップダウン表示テストを追加 | 神を追加する場合 |

詳細は [`references/file-checklist.md`](./references/file-checklist.md) を参照。

---

## ⚠️ 過去PRからの注意点（必読）

### PR #41 / PR #43 の教訓
**PR #41**（feat: add new god ORDER）で ORDER 神を追加した際、以下のファイルの修正が抜けた：

```
components/hirameki-controls/GodHiramekiDialog.tsx
```

`GOD_TYPES` 配列（行15付近）に新しい神を追加するのを忘れると、型定義・データ・i18nが揃っていても**UIのドロップダウンに神が表示されない**。PR #43で別途修正が必要になった。

> **チェックポイント**: `GodHiramekiDialog.tsx` の `GOD_TYPES` 配列は必ず更新すること。

---

## 実装手順（TDD）

### Step 1: テストを書く（Red）

#### ユニットテスト

`tests/unit/lib/god-hirameki.test.ts` を作成または更新する：

```typescript
import { describe, it, expect } from "vitest";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { GodType } from "@/types";

describe("GOD_HIRAMEKI_EFFECTS", () => {
  it("新しい神のエフェクトが含まれている", () => {
    const effects = GOD_HIRAMEKI_EFFECTS.filter(
      (e) => e.gods !== "all" && e.gods.includes(GodType.YOUR_NEW_GOD)
    );
    expect(effects.length).toBeGreaterThan(0);
  });

  it("エフェクトIDが重複していない", () => {
    const ids = GOD_HIRAMEKI_EFFECTS.map((e) => e.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });
});
```

#### E2Eテスト

`tests/e2e/hirameki-controls.spec.ts` に追加する（`all N gods including X are available` パターンで）：

```typescript
test("all N gods including [新しい神] are available in god hirameki dropdown", async ({ page }) => {
  await openAccordion(page, "共用カード");
  const sharedSection = page.getByRole("heading", { name: "共用カード" }).locator("..");
  await sharedSection.getByText("加虐性", { exact: true }).first().click({ timeout: 10_000 });

  const deckCard = getDeckCardContainerByName(page, "加虐性");
  await deckCard.getByRole("button", { name: "神ヒラメキ選択", exact: true }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: 5000 });

  const godDropdown = dialog.getByRole("button", { name: "神ヒラメキ選択" }).first();
  await godDropdown.click();

  // 既存の神を確認
  await expect(page.getByRole("menuitem", { name: "キルケン" })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("menuitem", { name: "セクレド" })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("menuitem", { name: "ディアロス" })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("menuitem", { name: "ニヒルム" })).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("menuitem", { name: "ヴィトル" })).toBeVisible({ timeout: 5000 });

  // 新しい神を確認（i18n後の日本語名を使う）
  await expect(page.getByRole("menuitem", { name: "[新しい神の日本語名]" })).toBeVisible({ timeout: 5000 });

  // 合計N神分のmenuitemがあることを確認
  const menuItems = page.getByRole("menuitem");
  expect(await menuItems.count()).toBeGreaterThanOrEqual(N);

  await page.keyboard.press("Escape");
});
```

### Step 2: 型定義を更新する（神を追加する場合のみ）

`types/index.ts` の `GodType` enumに新しい神を追加する：

```typescript
export enum GodType {
  KILKEN = "kilken",
  SECLAID = "seclaid",
  DIALOS = "dialos",
  NIHILUM = "nihilum",
  VITOL = "vitol",
  ORDER = "order",
  YOUR_NEW_GOD = "your_new_god", // ← 追加
}
```

### Step 3: 神ヒラメキエフェクトを追加する

`lib/god-hirameki.ts` の `GOD_HIRAMEKI_EFFECTS` 配列に追加する：

```typescript
// 全神共通エフェクトは gods: "all"
{ id: "godhirameki_30", additionalEffect: "効果の説明", gods: "all" },

// 特定の神専用エフェクトは gods: [GodType.XXX]
{ id: "godhirameki_31", additionalEffect: "効果の説明", gods: [GodType.YOUR_NEW_GOD] },
{ id: "godhirameki_32", additionalEffect: "効果の説明", costModifier: -1, gods: [GodType.YOUR_NEW_GOD] },
```

**IDの採番ルール**: 既存の最大IDの次の番号を使う（現在は `godhirameki_29` まで使用済み）。

データ構造の詳細は [`references/data-structures.md`](./references/data-structures.md) を参照。

### Step 4: GodHiramekiDialog を更新する（神を追加する場合のみ）

`components/hirameki-controls/GodHiramekiDialog.tsx` の `GOD_TYPES` 配列に追加する：

```typescript
// ⚠️ PR #41/#43 の教訓: ここを忘れるとUIに神が表示されない
const GOD_TYPES = [
  GodType.KILKEN,
  GodType.SECLAID,
  GodType.DIALOS,
  GodType.NIHILUM,
  GodType.VITOL,
  GodType.ORDER,
  GodType.YOUR_NEW_GOD, // ← 追加
] as const;
```

### Step 5: i18nキーを追加する

4言語すべてに追加する。未翻訳の場合は日本語または英語でフォールバック可。

**`messages/ja/common.json`**:
```json
{
  "god": {
    "your_new_god": "新しい神の日本語名"
  },
  "godEffects": {
    "godhirameki_30": "効果の説明（日本語）",
    "godhirameki_31": "効果の説明（日本語）"
  }
}
```

**`messages/en/common.json`**、**`messages/ko/common.json`**、**`messages/zh/common.json`** も同様に追加する。

キー構造の詳細は [`references/file-checklist.md`](./references/file-checklist.md) を参照。

### Step 6: テストを実行して Green にする

```bash
# ユニットテスト
pnpm vitest run tests/unit/lib/god-hirameki.test.ts

# または全件
pnpm test

# E2Eテスト（UIに影響する変更の場合）
pnpm test:playwright
```

---

## 最終確認チェックリスト

実装完了後、以下をすべて確認する：

- [ ] `GodType` enumに新しい神が追加されている（`types/index.ts`）
- [ ] `GOD_HIRAMEKI_EFFECTS` に新しいエフェクトが追加されている（`lib/god-hirameki.ts`）
- [ ] **`GOD_TYPES` 配列に新しい神が追加されている（`GodHiramekiDialog.tsx`）** ← 最重要
- [ ] 4言語すべてのi18nキーが追加されている（`messages/*/common.json`）
- [ ] ユニットテストが通っている（`pnpm test`）
- [ ] E2Eテストが通っている（`pnpm test:playwright`）
- [ ] ビルドが通っている（`pnpm build`）
