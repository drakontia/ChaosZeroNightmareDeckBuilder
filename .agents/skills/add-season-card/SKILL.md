# スキル: シーズンカード（キャラクター）追加

## 概要

このスキルは、ChaosZeroNightmareデッキビルダーに新しいシーズンキャラクターカードを追加するための手順を提供します。
TDD（テスト駆動開発）アプローチで実装します。

**スコープ**: `CHARACTER` タイプの新キャラクターと、そのデッキカード8枚（開始カード4枚 + ヒラメキカード4枚）の追加。

---

## 前提知識

詳細な型定義・コード例は以下のリファレンスを参照してください。

- [`references/card-data-structure.md`](./references/card-data-structure.md) — `CznCard` / `HiramekiVariation` の型と記述例
- [`references/i18n-guide.md`](./references/i18n-guide.md) — 4言語 i18n の構造と追加手順
- [`references/test-patterns.md`](./references/test-patterns.md) — Vitest テストの記述パターン
- [`references/common-pitfalls.md`](./references/common-pitfalls.md) — 過去 PR で発覚した落とし穴一覧

---

## TDD フロー

```
RED   → テストファイルを作成し、失敗するテストを書く
GREEN → 最小限の実装でテストをパスさせる
REFACTOR → コードを整理する
```

**重要**: 実装前に必ずテストを先に書き、`pnpm test` で失敗を確認してから実装を開始してください。

---

## STEP 1: テストファイルを作成する（RED）

`tests/unit/lib/{character_id}.test.ts` を作成します。

```typescript
import { describe, it, expect } from 'vitest';
import { CardStatus, CardCategory, CardType, JobType, ElementType } from '@/types';
import { CHARACTERS } from '@/lib/characters';
import { CHARACTER_CARDS } from '@/lib/character-cards';

describe('{キャラクター名} character', () => {
  // 新しい CardStatus を追加した場合のみ
  it('CardStatus has {NEW_STATUS} defined', () => {
    expect(CardStatus.NEW_STATUS).toBe('new_status');
  });

  it('{character_id} exists in CHARACTERS', () => {
    const char = CHARACTERS.find(c => c.id === '{character_id}');
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.VANGUARD); // 実際のジョブに変更
    expect(char?.element).toBe(ElementType.VOID); // 実際の属性に変更
    expect(char?.rarity).toBe('★5');
  });

  it('{character_id} has 4 starting cards and 4 hirameki cards', () => {
    const char = CHARACTERS.find(c => c.id === '{character_id}');
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  describe('starting cards', () => {
    const startingIds = [
      '{character_id}_starting_1',
      '{character_id}_starting_2',
      '{character_id}_starting_3',
      '{character_id}_starting_4',
    ];

    it.each(startingIds)('%s exists in CHARACTER_CARDS', (id) => {
      const card = CHARACTER_CARDS.find(c => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    });

    // 開始カード1〜3: 基本カード（isBasicCard: true）
    it('{character_id}_starting_1 is basic ATTACK card', () => {
      const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_1');
      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.isBasicCard).toBe(true);
    });

    // 開始カード4: 非基本カード（ヒラメキあり）
    it('{character_id}_starting_4 is non-basic with statuses', () => {
      const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_4');
      expect(card?.isBasicCard).toBe(false);
      expect(card?.hiramekiVariations).toHaveLength(6); // Lv0〜Lv5
    });
  });

  describe('hirameki cards', () => {
    const hiramekiIds = [
      '{character_id}_hirameki_1',
      '{character_id}_hirameki_2',
      '{character_id}_hirameki_3',
      '{character_id}_hirameki_4',
    ];

    it.each(hiramekiIds)('%s exists in CHARACTER_CARDS', (id) => {
      const card = CHARACTER_CARDS.find(c => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    });

    // 各カードの特定のステータスやカテゴリをテストする
    // 例: hirameki_4 がヒラメキなし（Lv0のみ）の場合
    it('{character_id}_hirameki_4 has only Lv0 (no hirameki)', () => {
      const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_hirameki_4');
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0].level).toBe(0);
    });
  });
});
```

テストが赤になることを確認します:

```bash
pnpm vitest run tests/unit/lib/{character_id}.test.ts
```

---

## STEP 2: `types/index.ts` に新 CardStatus を追加する（必要な場合のみ）

新しいカードステータスが必要な場合のみ実施します。

```typescript
// types/index.ts の CardStatus enum に追加
export enum CardStatus {
  // ... 既存のステータス ...
  NEW_STATUS = "new_status",  // 説明コメント（日本語）
}
```

**注意**: 追加後は既存テスト（`adelheid.test.ts` 等）が壊れないことを確認してください。

---

## STEP 3: `lib/characters.ts` にキャラクターを追加する

```typescript
// lib/characters.ts の CHARACTERS 配列に追加
{
  id: "character_id",              // ケバブケース
  name: "character.character_id",  // i18n キー
  rarity: "★5",
  job: JobType.VANGUARD,           // 正確なジョブタイプ
  element: ElementType.VOID,       // 正確な属性（なければ省略）
  imgUrl: "/images/characters/character_{character_id}.png",
  startingCards: [
    "{character_id}_starting_1",
    "{character_id}_starting_2",
    "{character_id}_starting_3",
    "{character_id}_starting_4",
  ],
  hiramekiCards: [
    "{character_id}_hirameki_1",
    "{character_id}_hirameki_2",
    "{character_id}_hirameki_3",
    "{character_id}_hirameki_4",
  ],
},
```

---

## STEP 4: `lib/character-cards.ts` にカード定義を追加する

コードパターンは [`references/card-data-structure.md`](./references/card-data-structure.md) を参照してください。

追加するカードの種別:

| 種別 | 枚数 | `isBasicCard` | `isStartingCard` | ヒラメキ段階 |
|------|-----|--------------|----------------|------------|
| 開始カード 1〜3 | 3枚 | `true` | `true` | Lv0 のみ |
| 開始カード 4 | 1枚 | `false` | `true` | Lv0〜5 |
| ヒラメキカード 1〜3 | 3枚 | — | — | Lv0〜5 |
| ヒラメキカード 4 | 1枚 | — | — | Lv0 のみ（ヒラメキなしの場合） |

---

## STEP 5 & 6: i18n に翻訳を追加する

4言語すべてに同時に追加してください。詳細は [`references/i18n-guide.md`](./references/i18n-guide.md) を参照。

**追加対象ファイル（8ファイル）**:

| ファイル | 追加内容 |
|---------|---------|
| `messages/ja/cards.json` | カード名・説明（日本語） |
| `messages/en/cards.json` | カード名・説明（英語） |
| `messages/zh/cards.json` | カード名・説明（中国語）|
| `messages/ko/cards.json` | カード名・説明（韓国語） |
| `messages/ja/common.json` | キャラクター名（日本語） |
| `messages/en/common.json` | キャラクター名（英語） |
| `messages/zh/common.json` | キャラクター名（中国語） |
| `messages/ko/common.json` | キャラクター名（韓国語） |

---

## STEP 7: テストを実行してパスを確認する（GREEN）

```bash
# 特定のテストファイルのみ実行
pnpm vitest run tests/unit/lib/{character_id}.test.ts

# 全テストを実行して既存テストに影響がないことを確認
pnpm test
```

すべてのテストが緑になったら次に進みます。

---

## STEP 8: ビルドを確認する

```bash
pnpm build
```

---

## チェックリスト

- [ ] テストファイルを先に作成し、失敗を確認した
- [ ] `types/index.ts` に新 CardStatus を追加した（必要な場合のみ）
- [ ] `lib/characters.ts` にキャラクター定義を追加した
- [ ] `lib/character-cards.ts` に8枚のカードを追加した（開始4 + ヒラメキ4）
- [ ] `messages/{ja,en,zh,ko}/cards.json` に全8枚のカードの翻訳を追加した
- [ ] `messages/{ja,en,zh,ko}/common.json` にキャラクター名を追加した
- [ ] `pnpm test` ですべてのテストがパスした
- [ ] `pnpm build` でビルドが成功した
- [ ] 英語IDが正確なケバブケースか確認した（→ [`references/common-pitfalls.md`](./references/common-pitfalls.md)）
- [ ] 基本カード3枚に `isBasicCard: true` を設定した
- [ ] ヒラメキありカードは Lv0〜Lv5 の 6 段階を記述した

---

## 参照

- 型定義: `types/index.ts`
- キャラクター一覧: `lib/characters.ts`
- キャラクターカード定義: `lib/character-cards.ts`
- テスト例: `tests/unit/lib/adelheid.test.ts`
- 過去の落とし穴: [`references/common-pitfalls.md`](./references/common-pitfalls.md)
