# リファレンス: カードデータ構造

## `CznCard` インターフェース

```typescript
// types/index.ts
export interface CznCard {
  id: string; // カードID（ケバブケース + アンダースコア）
  name: string; // フォールバック表示名（日本語）
  type: CardType; // CHARACTER / SHARED / MONSTER / FORBIDDEN
  category: CardCategory; // ATTACK / UPGRADE / SKILL
  statuses: CardStatus[]; // カードレベルのステータス（配列）
  grade?: CardGrade; // モンスターカード専用
  isBasicCard?: boolean; // true = 基本3枚（ヒラメキ不可）
  isStartingCard?: boolean; // true = キャラの開始4枚
  allowedJobs?: JobType[] | "all"; // 共用/モンスター/禁忌カード専用
  imgUrl?: string; // カード画像パス
  hiramekiVariations: HiramekiVariation[]; // ヒラメキレベル配列
}
```

## `HiramekiVariation` インターフェース

```typescript
// types/index.ts
export interface HiramekiVariation {
  level: number; // 0 = 基本, 1-5 = キャラカード
  cost: number | "X" | "unusable"; // X: 可変コスト, unusable: 使用不可
  name?: string; // レベル別の名前上書き（任意）
  description: string; // フォールバック説明テキスト
  category?: CardCategory; // このレベルでカテゴリを上書き
  statuses?: CardStatus[]; // このレベルのステータス（上書き・マージしない）
  egoVariations?: {
    [egoLevel: number]: {
      statuses?: CardStatus[];
      description: string;
      cost?: number | "X" | "unusable";
    };
  };
  potentialVariation?: {
    description: string;
    cost?: number | "X" | "unusable";
  };
}
```

---

## カードID 命名規則

```
{character_id}_starting_{1-4}    // キャラの開始カード
{character_id}_hirameki_{1-4}    // キャラのヒラメキカード
```

**重要**: `{character_id}` はケバブケース（例: `adelheid`, `heidemarie`）。
英語キャラクター名からの変換ではなく、意図したIDを使用してください（→ [common-pitfalls.md](./common-pitfalls.md) の落とし穴#1参照）。

---

## 基本カード（3枚）パターン

開始カード1〜3番は通常 `isBasicCard: true` で、ヒラメキ不可（`hiramekiVariations` はLv0のみ）。

```typescript
{
  id: "{character_id}_starting_1",
  name: "日本語カード名",       // フォールバック値
  type: CardType.CHARACTER,
  category: CardCategory.ATTACK,
  statuses: [],
  isBasicCard: true,
  isStartingCard: true,
  imgUrl: "/images/cards/{character_id}_starting_1.png",
  hiramekiVariations: [
    { level: 0, cost: 1, description: "フォールバック説明" }
  ]
},
```

---

## 非基本開始カード（4枚目）パターン

開始カード4番は `isBasicCard: false`（または省略）でヒラメキ対応（Lv0〜5）。

```typescript
{
  id: "{character_id}_starting_4",
  name: "日本語カード名",
  type: CardType.CHARACTER,
  category: CardCategory.SKILL,
  statuses: [CardStatus.EXHAUST2],  // カードレベルのステータス
  isBasicCard: false,
  isStartingCard: true,
  imgUrl: "/images/cards/{character_id}_starting_4.png",
  hiramekiVariations: [
    {
      level: 0,
      cost: 1,
      description: "基本説明",
      statuses: [CardStatus.EXHAUST2]  // レベルで明示的に定義（カードレベルから継承しない）
    },
    {
      level: 1,
      cost: 1,
      description: "Lv1説明",
      statuses: [CardStatus.EXHAUST2]
    },
    {
      level: 2,
      cost: 0,
      description: "Lv2説明",
      statuses: [CardStatus.INITIATION, CardStatus.EXHAUST2]  // 追加ステータス
    },
    {
      level: 3,
      cost: 0,
      description: "Lv3説明",
      statuses: [CardStatus.EXHAUST2]
    },
    {
      level: 4,
      cost: "X",           // X コスト
      description: "Lv4説明",
      statuses: [CardStatus.RETAIN, CardStatus.EXHAUST2]
    },
    {
      level: 5,
      cost: 1,
      category: CardCategory.UPGRADE,  // カテゴリ上書き
      description: "Lv5説明",
      statuses: [CardStatus.UNIQUE]    // 完全上書き（EXHAUST2 は消える）
    },
  ]
},
```

---

## ヒラメキカードパターン（Lv0〜5, 6段階）

```typescript
{
  id: "{character_id}_hirameki_1",
  name: "日本語カード名",
  type: CardType.CHARACTER,
  category: CardCategory.SKILL,
  statuses: [CardStatus.UNIQUE],
  imgUrl: "/images/cards/{character_id}_hirameki_1.png",
  hiramekiVariations: [
    { level: 0, cost: 2, description: "基本説明", statuses: [CardStatus.UNIQUE] },
    { level: 1, cost: 2, description: "Lv1説明", statuses: [CardStatus.UNIQUE] },
    { level: 2, cost: 2, description: "Lv2説明", statuses: [CardStatus.UNIQUE] },
    { level: 3, cost: 2, description: "Lv3説明", statuses: [CardStatus.UNIQUE] },
    { level: 4, cost: 2, description: "Lv4説明", statuses: [CardStatus.UNIQUE] },
    { level: 5, cost: 2, description: "Lv5説明", statuses: [CardStatus.UNIQUE] },
  ]
},
```

---

## ヒラメキなしカードパターン（Lv0のみ）

ヒラメキ対応なしのカードは `hiramekiVariations` にLv0のみを含めます。

```typescript
{
  id: "{character_id}_hirameki_4",
  name: "日本語カード名",
  type: CardType.CHARACTER,
  category: CardCategory.UPGRADE,
  statuses: [CardStatus.UNIQUE],
  imgUrl: "/images/cards/{character_id}_hirameki_4.png",
  hiramekiVariations: [
    { level: 0, cost: 3, description: "基本説明のみ", statuses: [CardStatus.UNIQUE] }
  ]
},
```

---

## statuses フィールドの注意点

`HiramekiVariation.statuses` はカードレベルの `CznCard.statuses` を**上書き**します（マージしない）。

```typescript
// カードレベルのステータス
statuses: [CardStatus.EXHAUST2],

// Lv2: EXHAUST2 + INITIATION を明示的に書く必要がある
{ level: 2, statuses: [CardStatus.INITIATION, CardStatus.EXHAUST2] }

// Lv5: ステータスを空にしたい場合
{ level: 5, statuses: [] }

// statuses フィールドを省略した場合 → カードレベルの statuses を表示に使用
// ただし、明示的に書くことを推奨
```

---

## コスト型の種類

| 値            | 意味       | 用途                                    |
| ------------- | ---------- | --------------------------------------- |
| `0`           | コスト0    | 無料カード                              |
| `1`, `2`, ... | 固定コスト | 通常カード                              |
| `"X"`         | 可変コスト | X コストカード（UI は「X」表示）        |
| `"unusable"`  | 使用不可   | 使用できないカード（UI は禁止アイコン） |

---

## `Character` インターフェース

```typescript
// types/index.ts
export interface Character {
  id: string; // ケバブケース
  name: string; // i18n キー（例: "character.adelheid"）
  rarity: string; // "★4" または "★5"
  job: JobType; // 必須
  element?: ElementType; // 任意
  egoLevel?: number; // エゴ発現レベル（任意）
  imgUrl?: string; // キャラクター画像パス
  startingCards: string[]; // 開始カードIDの配列（4枚）
  hiramekiCards: string[]; // ヒラメキカードIDの配列（4枚）
}
```

---

## `CardStatus` 一覧（`types/index.ts` より）

| 定数名            | 値                  | 日本語     |
| ----------------- | ------------------- | ---------- |
| `INITIATION`      | `"initiation"`      | 開戦       |
| `RETAIN`          | `"retain"`          | 保存       |
| `CELESTIAL`       | `"celestial"`       | 天上       |
| `COMBO`           | `"combo"`           | 連携       |
| `EXHAUST`         | `"exhaust"`         | 消滅       |
| `EXHAUST2`        | `"exhaust2"`        | 消滅2      |
| `EXHAUST3`        | `"exhaust3"`        | 消滅3      |
| `EXHAUST5`        | `"exhaust5"`        | 消滅5      |
| `LEAD`            | `"lead"`            | 主導       |
| `UNIQUE`          | `"unique"`          | 唯一       |
| `HASTE`           | `"haste"`           | 迅速       |
| `FINALE`          | `"finale"`          | 終極       |
| `RETRIEVE`        | `"retrieve"`        | 回収       |
| `RETRIEVE2`       | `"retrieve2"`       | 回収2      |
| `RETRIEVE3`       | `"retrieve3"`       | 回収3      |
| `EPHEMERAL`       | `"ephemeral"`       | 蒸発       |
| `BULLET`          | `"bullet"`          | 弾丸       |
| `QUIETUS`         | `"quietus"`         | 安息       |
| `WEAKNESS_ATTACK` | `"weakness_attack"` | 弱点攻撃   |
| `PULVERIZE`       | `"pulverize"`       | 粉砕       |
| `BIND`            | `"bind"`            | 結束       |
| `IGNITION`        | `"ignition"`        | 点火       |
| `COPIED`          | `"copied"`          | コピー済み |
| `FORM_UPGRADE`    | `"form_upgrade"`    | 形状強化   |
| `LINKED`          | `"linked"`          | 連結       |
| `BLESSING`        | `"blessing"`        | 祝福       |

新しいステータスを追加する場合は `types/index.ts` の `CardStatus` enum に追加してください。
