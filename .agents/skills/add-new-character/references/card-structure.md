# カード型定義リファレンス

`lib/character-cards.ts` に追加するカードデータの型定義詳細です。

## CznCard 型の主要フィールド

```typescript
interface CznCard {
  id: string;              // "{character_id}_starting_1" 等
  type: CardType;          // CHARACTER_CARDS なら CardType.CHARACTER
  name: string;            // i18n キー "cards.{id}.name"
  category: CardCategory;  // ATTACK / UPGRADE / SKILL
  statuses: CardStatus[];  // 状態異常・効果のリスト
  cost: number;            // コスト（仮の場合は // TODO: 要確認 を添付）
  isStartingCard: boolean; // スターティングカードか
  isBasicCard: boolean;    // 基本カードか（基本カードはヒラメキなし）
  hiramekiVariations: HiramekiVariation[];
}
```

## HiramekiVariation 型

```typescript
interface HiramekiVariation {
  level: number;           // 0〜5（キャラカード）、0〜4（基本カードは0のみ）
  cost: number;
  description: string;     // i18n キー "cards.{id}.descriptions.{level}"
  category: CardCategory;  // カテゴリが変化する場合のみ記載（変化しない場合は親と同じ）
  statuses: CardStatus[];  // ステータスが変化する場合のみ記載
}
```

## CardStatus 一覧（主要なもの）

> 最新の全一覧は `types/index.ts` の `CardStatus` enum を参照。

| 値 | 意味 |
|----|------|
| `BRAVE` | 勇気 |
| `AURA` | オーラ |
| `REGEN` | 再生 |
| `BARRIER` | バリア |
| `QUICK` | 速攻 |
| `IMMUNE` | 耐性 |
| `BURN` | 炎上 |
| `FREEZE` | 凍結 |
| `STUN` | 気絶 |
| `SEAL` | 封印 |
| `WEAK` | 弱体 |
| `COUNTER` | カウンター |

## カード ID 命名規則

```
{character_id}_starting_1  〜  {character_id}_starting_4
{character_id}_hirameki_1  〜  {character_id}_hirameki_4
```

## 実装例（adelheit のカード）

```typescript
// lib/character-cards.ts
{
  id: "adelheit_starting_1",
  type: CardType.CHARACTER,
  name: "cards.adelheit_starting_1.name",
  category: CardCategory.ATTACK,
  statuses: [],
  cost: 1,
  isStartingCard: true,
  isBasicCard: true,
  hiramekiVariations: [
    {
      level: 0,
      cost: 1,
      description: "cards.adelheit_starting_1.descriptions.0",
      category: CardCategory.ATTACK,
      statuses: [],
    },
  ],
},
```

## 基本カード vs 通常カード

| 項目 | 基本カード (`isBasicCard: true`) | 通常カード |
|------|--------------------------------|-----------|
| ヒラメキ段階 | Lv0 のみ | Lv0〜Lv5 |
| `hiramekiVariations` の数 | 1（level: 0 のみ） | 6（level: 0〜5） |
| 神ヒラメキ対象 | 対象外 | 対象 |

## スターティングカードとヒラメキカードの違い

| 項目 | スターティングカード | ヒラメキカード |
|------|-------------------|-------------|
| `isStartingCard` | `true` | `false` |
| デッキ初期枚数 | 4枚 | 0枚（習得して追加） |
| 基本カードの有無 | 通常 starting_1, starting_2 が基本カード | 通常なし |
