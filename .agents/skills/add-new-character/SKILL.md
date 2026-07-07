---
name: add-new-character
description: >
  新規キャラクターをデッキビルダーに仮実装するためのスキルです。
  画像からカードデータを読み取り、ユーザー確認を経て TDD で実装します。
  Use this when you want to add a new character to the ChaosZeroNightmare Deck Builder.
---

# スキル: 新規キャラクター仮実装

「カオスゼロナイトメア デッキビルダー」に新しいキャラクターを仮実装します。
`仮実装` とは、ゲーム内の正確なデータが揃っていない段階での初期実装を指します。
不明な値には明示的な `// TODO:` コメントを残します。

## Step 1: 画像からカードデータを読み取る

ユーザーから提供された画像（キャラクター画像・カード画像・スクリーンショット等）から
以下の情報を読み取り、構造化してユーザーに提示してください。

### 読み取る項目

**キャラクター情報**
| 項目 | 説明 |
|------|------|
| `id` | 英小文字の識別子（例: `adelheid`） |
| `name (ja)` | 日本語名 |
| `name (en)` | 英語名 |
| `rarity` | ★4 または ★5 |
| `job` | STRIKER / VANGUARD / RANGER / HUNTER / CONTROLLER / PSIONIC |
| `element` | PASSION / JUSTICE / ORDER / INSTINCT / VOID |

**各カード（starting × 4、hirameki × 4 合計8枚）**
| 項目 | 説明 |
|------|------|
| `name (ja)` | カード名（日本語） |
| `category` | ATTACK / UPGRADE / SKILL |
| `statuses` | CardStatus の配列（詳細は references/card-structure.md） |
| `isBasicCard` | 基本カードか否か（基本カードはヒラメキなし） |
| ヒラメキ各レベル | level / cost / description / category変化 / statuses変化 |

### ユーザーへの確認

読み取った内容を以下の形式でユーザーに提示し、**必ず確認を取ってから次のステップへ進む**。

```
## 読み取ったキャラクター情報

**キャラクター**: {name_ja}（{id}）
- レアリティ: {rarity}
- ジョブ: {job}
- 属性: {element}

**スターティングカード（4枚）**
1. {card_name} - {category} / コスト{cost} / {statuses}
   - Lv0: {description}
   ...
2. ...

**ヒラメキカード（4枚）**
1. {card_name} - {category} / コスト{cost} / {statuses}
   - Lv0: {description}
   - Lv1: {description}
   ...

不明な箇所: {一覧}

この内容で実装を進めてよいですか？
```

---

## Step 2: 新規 CardStatus の確認

新しいカードに既存の `CardStatus` にない状態異常が含まれる場合は、
`types/index.ts` の `CardStatus` enum に追加する。

```typescript
// types/index.ts の CardStatus enum に追加
export enum CardStatus {
  // ... 既存の定義 ...
  NEW_STATUS = "new_status",  // 新しいステータス名（日本語コメント）
}
```

> **注意（PR #45 の教訓）**: 新 CardStatus を追加した場合、既存のテストが壊れていないか確認する。

---

## Step 3: テストファイルの作成（Red フェーズ）

`tests/unit/lib/{character_id}.test.ts` を作成する。
adelheid のテストファイル（`tests/unit/lib/adelheid.test.ts`）をテンプレートとして使う。

```typescript
// tests/unit/lib/{character_id}.test.ts
import { describe, it, expect } from 'vitest';
import { CardStatus, CardCategory, CardType, JobType, ElementType } from '@/types';
import { CHARACTERS } from '@/lib/characters';
import { CHARACTER_CARDS } from '@/lib/character-cards';

describe('{character_name} character', () => {
  it('{character_id} exists in CHARACTERS', () => {
    const char = CHARACTERS.find(c => c.id === '{character_id}');
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.{JOB});
    expect(char?.element).toBe(ElementType.{ELEMENT});
    expect(char?.rarity).toBe('{RARITY}');
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

    it('{character_id}_starting_1 is basic {CATEGORY} card', () => {
      const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_1');
      expect(card?.category).toBe(CardCategory.{CATEGORY});
      expect(card?.isBasicCard).toBe(true);
    });

    // 非基本カードのヒラメキ変化テスト（実際の仕様に合わせて追記）
    it('{card_name} Lv{N} has {STATUS} status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_starting_4');
      const lvN = card?.hiramekiVariations.find(v => v.level === {N});
      expect(lvN).toBeDefined();
      expect(lvN?.statuses).toContain(CardStatus.{STATUS});
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

    it('{card_name} ({hirameki_id}) is {CATEGORY} with {STATUS} status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === '{character_id}_hirameki_1');
      expect(card?.category).toBe(CardCategory.{CATEGORY});
      expect(card?.statuses).toContain(CardStatus.{STATUS});
    });
  });
});
```

テスト作成後、**まず失敗することを確認**する（Red フェーズ）:

```bash
pnpm vitest run tests/unit/lib/{character_id}.test.ts
```

---

## Step 4: キャラクターデータの実装（Green フェーズ）

### 4-1. `lib/characters.ts`

`CHARACTERS` 配列の**先頭**に追加する（最新キャラクターが先頭）。

```typescript
{
  id: "{character_id}",
  name: "character.{character_id}",
  rarity: "★5",
  job: JobType.{JOB},
  element: ElementType.{ELEMENT},
  imgUrl: "/images/characters/character_{character_id}.png",
  startingCards: [
    "{character_id}_starting_1",
    "{character_id}_starting_2",
    "{character_id}_starting_3",
    "{character_id}_starting_4"
  ],
  hiramekiCards: [
    "{character_id}_hirameki_1",
    "{character_id}_hirameki_2",
    "{character_id}_hirameki_3",
    "{character_id}_hirameki_4"
  ]
},
```

### 4-2. `lib/character-cards.ts`

`CHARACTER_CARDS` 配列の**先頭**に追加する。
カード構造の詳細は `references/card-structure.md` を参照。

> **注意（PR #30 の教訓）**: 仮の数値（ダメージ量・コスト等）には `// TODO: 要確認` コメントを付ける。

---

## Step 5: i18n の追加

> **警告（PR #28 の教訓）**: 4言語すべてに追加しないとビルドエラーになる。

対象ファイル（4言語すべて）:
- `messages/ja/common.json` — キャラクター名
- `messages/en/common.json` — キャラクター名
- `messages/zh/common.json` — キャラクター名
- `messages/ko/common.json` — キャラクター名
- `messages/ja/cards.json` — カード名・説明
- `messages/en/cards.json` — カード名・説明
- `messages/zh/cards.json` — カード名・説明
- `messages/ko/cards.json` — カード名・説明

i18n キー構造の詳細は `references/i18n-structure.md` を参照。

---

## Step 6: 画像のプレースホルダー確認

画像が未提供の場合は、`imgUrl` を既存の類似キャラクター画像にしておく（暫定）。
画像が提供された場合の配置先:

```
public/images/characters/character_{character_id}.png
public/images/cards/{character_id}_starting_1.png  〜  _starting_4.png
public/images/cards/{character_id}_hirameki_1.png  〜  _hirameki_4.png
```

---

## Step 7: テストの実行確認

```bash
# 対象キャラクターのテストを実行
pnpm vitest run tests/unit/lib/{character_id}.test.ts

# 全テストがグリーンであることを確認
pnpm test
```

---

## チェックリスト

- [ ] 画像からカードデータを読み取り、ユーザーに確認を取った
- [ ] 新規 CardStatus が必要な場合は `types/index.ts` に追加した
- [ ] テストファイルを作成し、Red（失敗）を確認した
- [ ] `lib/characters.ts` にキャラクターを追加した
- [ ] `lib/character-cards.ts` に全8枚のカードを追加した
- [ ] `messages/{ja,en,zh,ko}/common.json` にキャラクター名を追加した
- [ ] `messages/{ja,en,zh,ko}/cards.json` に全カードデータを追加した
- [ ] 仮置き値に `// TODO: 要確認` コメントを付けた
- [ ] `pnpm test` で全テストがグリーンであることを確認した

---

## 参考ファイル

- テンプレートテスト: `tests/unit/lib/adelheid.test.ts`
- キャラクターデータ: `lib/characters.ts`
- カードデータ: `lib/character-cards.ts`
