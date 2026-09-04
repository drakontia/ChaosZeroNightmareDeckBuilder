# 修正対象ファイル詳細チェックリスト

神または神ヒラメキエフェクトを追加する際に変更が必要なファイルと、各ファイルでの具体的な変更箇所をまとめます。

---

## 1. `types/index.ts` — 型定義

**変更箇所**: `GodType` enum（約132行目）

```typescript
export enum GodType {
  KILKEN = "kilken", // キルケン
  SECLAID = "seclaid", // セクレド
  DIALOS = "dialos", // ディアロス
  NIHILUM = "nihilum", // ニヒルム
  VITOL = "vitol", // ヴィトル
  ORDER = "order", // ORDER
  // ↓ 新しい神を追加する
  NEW_GOD = "new_god",
}
```

- 文字列値はスネークケースの小文字（例: `"new_god"`）
- i18nキー `god.new_god` と対応する

---

## 2. `lib/god-hirameki.ts` — エフェクト定義

**変更箇所**: `GOD_HIRAMEKI_EFFECTS` 配列

```typescript
export const GOD_HIRAMEKI_EFFECTS: GodHiramekiDefinition[] = [
  // ... 既存エフェクト ...

  // 全神共通エフェクト（gods: "all"）
  { id: "godhirameki_30", additionalEffect: "効果の説明", gods: "all" },

  // 新しい神専用エフェクト（gods: [GodType.XXX]）
  { id: "godhirameki_31", additionalEffect: "効果の説明", gods: [GodType.NEW_GOD] },

  // コスト修正付きエフェクト
  {
    id: "godhirameki_32",
    additionalEffect: "効果の説明",
    costModifier: -1,
    gods: [GodType.NEW_GOD],
  },
];
```

**IDの採番**:

- 現在の最大ID: `godhirameki_29`（2026年5月時点）
- 次の番号から連番で採番する（`godhirameki_30`, `godhirameki_31`, ...）
- 既存IDとの重複は許容されない

**`GodHiramekiDefinition` の型**:

```typescript
interface GodHiramekiDefinition {
  id: string; // "godhirameki_N" 形式
  additionalEffect: string; // フォールバック文字列（i18nが優先）
  costModifier?: number; // コスト修正（省略可）
  gods: GodType[] | "all"; // 適用可能な神
}
```

---

## 3. `components/hirameki-controls/GodHiramekiDialog.tsx` — UIダイアログ

**変更箇所**: `GOD_TYPES` 配列（約15行目）

```typescript
// ⚠️ PR #41/#43 の教訓: ここを忘れると神がUIに表示されない
const GOD_TYPES = [
  GodType.KILKEN,
  GodType.SECLAID,
  GodType.DIALOS,
  GodType.NIHILUM,
  GodType.VITOL,
  GodType.ORDER,
  GodType.NEW_GOD, // ← 追加
] as const;
```

- この配列がドロップダウンメニューの神一覧を制御する
- `GodType` enumに追加しただけではUIに反映されない

---

## 4. `messages/ja/common.json` — 日本語翻訳

**変更箇所**: `god` オブジェクトと `godEffects` オブジェクト

```json
{
  "god": {
    "kilken": "キルケン",
    "seclaid": "セクレド",
    "dialos": "ディアロス",
    "nihilum": "ニヒルム",
    "vitol": "ヴィトル",
    "order": "@?#$",
    "new_god": "新しい神の名前（日本語）"
  },
  "godEffects": {
    "godhirameki_29": "...",
    "godhirameki_30": "エフェクト説明（日本語）",
    "godhirameki_31": "エフェクト説明（日本語）"
  }
}
```

---

## 5. `messages/en/common.json` — 英語翻訳

```json
{
  "god": {
    "new_god": "New God Name (English)"
  },
  "godEffects": {
    "godhirameki_30": "Effect description (English)",
    "godhirameki_31": "Effect description (English)"
  }
}
```

---

## 6. `messages/ko/common.json` — 韓国語翻訳

```json
{
  "god": {
    "new_god": "새로운 신 이름"
  },
  "godEffects": {
    "godhirameki_30": "효과 설명",
    "godhirameki_31": "효과 설명"
  }
}
```

---

## 7. `messages/zh/common.json` — 中国語翻訳

```json
{
  "god": {
    "new_god": "新神名称（中文）"
  },
  "godEffects": {
    "godhirameki_30": "效果说明",
    "godhirameki_31": "效果说明"
  }
}
```

---

## 8. `tests/e2e/hirameki-controls.spec.ts` — E2Eテスト

**変更箇所**: 既存の `all N gods including X are available` テストを更新または新規追加

- 既存テストの `expect(itemCount).toBeGreaterThanOrEqual(N)` の N を更新
- 新しい神名のメニューアイテム確認を追加

---

## 変更ファイル数サマリー

| シナリオ                     | 変更ファイル数                                          |
| ---------------------------- | ------------------------------------------------------- |
| 神ヒラメキエフェクトのみ追加 | 5ファイル（god-hirameki.ts + 4言語）                    |
| 新しい神 + エフェクト追加    | 8ファイル（上記 + types/index.ts + Dialog + E2Eテスト） |
