# データ構造リファレンス

神ヒラメキ機能に関連する型定義とデータ構造の参照ドキュメントです。

---

## 型定義（`types/index.ts`）

### `GodType` enum

```typescript
export enum GodType {
  KILKEN = "kilken", // キルケン（5神の1柱）
  SECLAID = "seclaid", // セクレド（5神の1柱）
  DIALOS = "dialos", // ディアロス（5神の1柱）
  NIHILUM = "nihilum", // ニヒルム（5神の1柱）
  VITOL = "vitol", // ヴィトル（5神の1柱）
  ORDER = "order", // 秩序（追加神）
}
```

- 値は小文字のスネークケース
- i18nキー `god.{value}` と対応する（例: `god.kilken`）

### `GodHiramekiDefinition` interface

```typescript
export interface GodHiramekiDefinition {
  id: string; // "godhirameki_N" 形式（N は連番）
  additionalEffect: string; // フォールバック説明文
  costModifier?: number; // コスト修正値（省略時は 0 扱い）
  gods: GodType[] | "all"; // "all" = 全神共通、配列 = 特定の神のみ
}
```

### `DeckCard` interface（神ヒラメキ関連フィールド）

```typescript
export interface DeckCard extends CznCard {
  // ...
  godHiramekiType: GodType | null; // 選択した神（null = 未選択）
  godHiramekiEffectId: string | null; // 選択したエフェクトID（null = 未選択）
  // ...
}
```

---

## エフェクトデータ（`lib/god-hirameki.ts`）

### 現在のエフェクト一覧（2026年5月時点）

| ID               | 説明                                      | 対象神  |
| ---------------- | ----------------------------------------- | ------- |
| `godhirameki_1`  | ドロー1                                   | 全神    |
| `godhirameki_2`  | アクションポイント1獲得                   | 全神    |
| `godhirameki_3`  | このカードのコスト1減少（-1）             | 全神    |
| `godhirameki_4`  | このカードのシールド量30%増加             | 全神    |
| `godhirameki_5`  | このカードのダメージ量30%増加             | 全神    |
| `godhirameki_6`  | このカードの強靱度ダメージ100%増加        | 全神    |
| `godhirameki_7`  | 対象に脆弱2                               | 全神    |
| `godhirameki_8`  | 対象に苦痛4                               | 全神    |
| `godhirameki_9`  | 士気1、決意1                              | 全神    |
| `godhirameki_10` | 常に弱点攻撃                              | DIALOS  |
| `godhirameki_11` | ランダムな味方が対象に挟み撃ち            | VITOL   |
| `godhirameki_12` | 自分のカードをドロー1                     | VITOL   |
| `godhirameki_13` | このカードに開戦付与                      | VITOL   |
| `godhirameki_14` | 弱点攻撃：このターン、不屈2減少           | VITOL   |
| `godhirameki_15` | このカードに粉砕付与、敵全体に損傷3       | DIALOS  |
| `godhirameki_16` | このカードに保存付与                      | DIALOS  |
| `godhirameki_17` | シールドがない場合、シールド量100%増加    | DIALOS  |
| `godhirameki_18` | このターン、最初のカードで使用時、ドロー2 | SECLAID |
| `godhirameki_19` | HP50%未満なら、治癒量100%増加             | SECLAID |
| `godhirameki_20` | ターン開始時、ランダムな敵に標識2         | SECLAID |
| `godhirameki_21` | ストレス3減少                             | KILKEN  |
| `godhirameki_22` | 調律：次のターン、アクションポイント2     | KILKEN  |
| `godhirameki_23` | このターン、エゴスキルのコスト1減少       | KILKEN  |
| `godhirameki_24` | ターン開始時、コスト0～3に変更            | NIHILUM |
| `godhirameki_25` | 捨て札の消滅カード2枚を手札に移動         | NIHILUM |
| `godhirameki_26` | 治癒量100%増加、このカードに終極付与      | NIHILUM |
| `godhirameki_27` | 撃破：ドロー3                             | ORDER   |
| `godhirameki_28` | このカードに連携付与                      | ORDER   |
| `godhirameki_29` | 共用カードとして扱う、共用カードをドロー1 | ORDER   |

**次に追加するIDは `godhirameki_30` から。**

---

## i18nキー構造（`messages/*/common.json`）

```json
{
  "god": {
    "kilken": "キルケン",
    "seclaid": "セクレド",
    "dialos": "ディアロス",
    "nihilum": "ニヒルム",
    "vitol": "ヴィトル",
    "order": "@?#$"
  },
  "godEffects": {
    "godhirameki_1": "ドロー1",
    "godhirameki_2": "アクションポイント1獲得"
    // ... 以下省略 ...
  }
}
```

- `god.{GodType値}` — 神名の表示ラベル
- `godEffects.{id}` — エフェクトの説明文

コンポーネントでの使用例:

```typescript
t(`god.${selectedGod}`); // 神名
t(`godEffects.${effect.id}`, { defaultValue: effect.additionalEffect }); // エフェクト説明
```

---

## UIコンポーネント（`GodHiramekiDialog.tsx`）

### `GOD_TYPES` 配列

ドロップダウンに表示する神の順序を決定する。

```typescript
const GOD_TYPES = [
  GodType.KILKEN,
  GodType.SECLAID,
  GodType.DIALOS,
  GodType.NIHILUM,
  GodType.VITOL,
  GodType.ORDER,
] as const;
```

- 配列の順序がUIのドロップダウンの並び順になる
- `GodType` enumに追加しただけではここには反映されない（**手動追加が必要**）

### エフェクトフィルタリング

```typescript
GOD_HIRAMEKI_EFFECTS.filter((effect) => effect.gods === "all" || effect.gods.includes(selectedGod));
```

選択した神に対応するエフェクトのみが表示される。
