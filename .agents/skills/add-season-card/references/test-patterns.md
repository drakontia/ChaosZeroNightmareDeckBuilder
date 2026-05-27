# リファレンス: テストパターン

`tests/unit/lib/adelheid.test.ts` をベースにした Vitest テストの記述パターンです。

## インポート構成

```typescript
import { describe, it, expect } from 'vitest';
import { CardStatus, CardCategory, CardType, JobType, ElementType } from '@/types';
import { CHARACTERS } from '@/lib/characters';
import { CHARACTER_CARDS } from '@/lib/character-cards';
```

---

## キャラクター存在確認

```typescript
describe('{キャラクター名} character', () => {
  it('{character_id} exists in CHARACTERS', () => {
    const char = CHARACTERS.find(c => c.id === '{character_id}');
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.VANGUARD);     // 実際のジョブ
    expect(char?.element).toBe(ElementType.VOID); // 実際の属性（なければ省略）
    expect(char?.rarity).toBe('★5');
  });

  it('{character_id} has 4 starting cards and 4 hirameki cards', () => {
    const char = CHARACTERS.find(c => c.id === '{character_id}');
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });
});
```

---

## 開始カード（一括テスト）

```typescript
describe('starting cards', () => {
  const startingIds = [
    '{character_id}_starting_1',
    '{character_id}_starting_2',
    '{character_id}_starting_3',
    '{character_id}_starting_4',
  ];

  // 全4枚の存在確認（it.each でパラメータ化）
  it.each(startingIds)('%s exists in CHARACTER_CARDS', (id) => {
    const card = CHARACTER_CARDS.find(c => c.id === id);
    expect(card).toBeDefined();
    expect(card?.type).toBe(CardType.CHARACTER);
    expect(card?.isStartingCard).toBe(true);
  });
});
```

---

## 基本カードのテスト

```typescript
it('{character_id}_starting_1 is basic ATTACK card', () => {
  const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_1');
  expect(card?.category).toBe(CardCategory.ATTACK);
  expect(card?.isBasicCard).toBe(true);
});

it('{character_id}_starting_2 is basic SKILL card', () => {
  const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_2');
  expect(card?.category).toBe(CardCategory.SKILL);
  expect(card?.isBasicCard).toBe(true);
});
```

---

## 非基本開始カードのテスト

```typescript
it('{character_id}_starting_4 is non-basic SKILL with EXHAUST2 status', () => {
  const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_4');
  expect(card?.category).toBe(CardCategory.SKILL);
  expect(card?.isBasicCard).toBe(false);
  expect(card?.statuses).toContain(CardStatus.EXHAUST2);
});

// ヒラメキレベルごとのテスト
it('{character_id}_starting_4 Lv5 has UPGRADE category and UNIQUE status', () => {
  const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_4');
  const lv5 = card?.hiramekiVariations.find(v => v.level === 5);
  expect(lv5).toBeDefined();
  expect(lv5?.category).toBe(CardCategory.UPGRADE);
  expect(lv5?.statuses).toContain(CardStatus.UNIQUE);
});

it('{character_id}_starting_4 Lv4 has cost X and RETAIN status', () => {
  const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_4');
  const lv4 = card?.hiramekiVariations.find(v => v.level === 4);
  expect(lv4?.cost).toBe('X');
  expect(lv4?.statuses).toContain(CardStatus.RETAIN);
});
```

---

## ヒラメキカードのテスト

```typescript
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

  // 特定ステータスの確認
  it('{character_id}_hirameki_1 has UNIQUE status', () => {
    const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_hirameki_1');
    expect(card?.statuses).toContain(CardStatus.UNIQUE);
  });

  // Lv5 で特定ステータスが存在しないことを確認
  it('{character_id}_hirameki_1 Lv5 does NOT have BLESSING status', () => {
    const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_hirameki_1');
    const lv5 = card?.hiramekiVariations.find(v => v.level === 5);
    expect(lv5).toBeDefined();
    expect(lv5?.statuses).toBeDefined();
    expect(lv5?.statuses).not.toContain(CardStatus.BLESSING);
  });

  // ヒラメキなしカード（Lv0のみ）の確認
  it('{character_id}_hirameki_4 has only Lv0 (no hirameki available)', () => {
    const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_hirameki_4');
    expect(card?.hiramekiVariations).toHaveLength(1);
    expect(card?.hiramekiVariations[0].level).toBe(0);
  });
});
```

---

## 新 CardStatus の確認テスト（必要な場合のみ）

```typescript
it('CardStatus has {NEW_STATUS} defined', () => {
  expect(CardStatus.NEW_STATUS).toBe('new_status');
});
```

---

## テスト実行コマンド

```bash
# 単一ファイル実行（Red確認 → Green確認）
pnpm vitest run tests/unit/lib/{character_id}.test.ts

# 詳細出力付き
pnpm vitest run tests/unit/lib/{character_id}.test.ts --reporter=verbose

# 全テスト（既存テストへの影響確認）
pnpm test
```

---

## よくあるテスト失敗パターンと対処

| エラー | 原因 | 対処 |
|-------|------|------|
| `expect(char).toBeDefined()` 失敗 | `CHARACTERS` に id が存在しない | `lib/characters.ts` にエントリを追加 |
| `expect(card).toBeDefined()` 失敗 | `CHARACTER_CARDS` にカードが存在しない | `lib/character-cards.ts` にカードを追加 |
| `expect(lv5).toBeDefined()` 失敗 | `hiramekiVariations` に `level: 5` がない | 配列に Lv5 を追加 |
| `toContain(CardStatus.X)` 失敗 | `statuses` にステータスがない | カード定義の `statuses` を確認 |
| TypeScript エラー | 型不一致 | `types/index.ts` の型を確認 |
