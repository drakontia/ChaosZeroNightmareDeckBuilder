# i18n キー構造リファレンス

`messages/` 配下の4言語ファイルに追加するキー構造の詳細です。

## 対象ファイル一覧

```
messages/
  ja/
    common.json   ← キャラクター名
    cards.json    ← カード名・説明文
  en/
    common.json
    cards.json
  zh/
    common.json
    cards.json
  ko/
    common.json
    cards.json
```

> **警告**: 4言語すべてに追加しないとビルドエラーになります（PR #28 の教訓）。

---

## common.json — キャラクター名

```json
{
  "character": {
    "existingCharacter": "...",
    "{character_id}": "{キャラクター名}"
  }
}
```

### 言語別サンプル

| 言語 | 例（adelheid） |
|------|--------------|
| ja | `"Adelheid"` |
| en | `"Adelheid"` |
| zh | `"Adelheid"` |
| ko | `"Adelheid"` |

---

## cards.json — カード名・説明文

### キー構造

```json
{
  "{character_id}_starting_1": {
    "name": "カード名",
    "descriptions": {
      "0": "Lv0（基本）の説明文"
    }
  },
  "{character_id}_starting_2": {
    "name": "カード名",
    "descriptions": {
      "0": "Lv0の説明文",
      "1": "Lv1の説明文",
      "2": "Lv2の説明文",
      "3": "Lv3の説明文",
      "4": "Lv4の説明文",
      "5": "Lv5の説明文"
    }
  }
}
```

### 説明文の記載ルール

- 数値（ダメージ量・回復量等）が不明な場合は `{N}` プレースホルダーを使用し、
  実装ファイルの description キーに `// TODO: 要確認` をコメントとして添付する
- 日本語以外の言語が未翻訳の場合は、英語フォールバックを使用し `// TODO: 翻訳確認` をコメントで残す

### 説明文のサンプル（adelheid の starting_3）

```json
"adelheid_starting_3": {
  "name": "ガーデンオブエデン",
  "descriptions": {
    "0": "味方全体にバリアを付与する。",
    "1": "味方全体にバリアを付与する。追加で味方全体のHPを{N}回復する。",
    "2": "味方全体にバリアを付与する。追加で味方全体のHPを{N}回復する。",
    "3": "味方全体にバリアと再生を付与する。追加で味方全体のHPを{N}回復する。",
    "4": "味方全体にバリアと再生を付与する。追加で味方全体のHPを{N}回復する。",
    "5": "味方全体にバリアと再生を付与する。追加で味方全体のHPを{N}回復する。このターン中、バリアの効果が2倍になる。"
  }
}
```

---

## 仮実装時の記載方針

1. **カード名**: 画像から読み取れた場合はそのまま記入、不明な場合は `"（仮）{character_id}_starting_N"` とし `// TODO: 要確認`
2. **説明文**: 数値は `{N}` で代替し、後で修正する旨を `// TODO:` で示す（PR #30 の教訓）
3. **未翻訳言語**: `en/zh/ko` が不明な場合は日本語テキストをそのまま入れてもよいが、必ずキーは追加する

---

## コード中での i18n キーの使用方法

```typescript
// lib/character-cards.ts の name フィールド
name: "cards.{character_id}_starting_1.name",

// lib/character-cards.ts の description フィールド（hiramekiVariations 内）
description: "cards.{character_id}_starting_1.descriptions.0",
```

コンポーネント側では `useTranslations('cards')` から `t('{character_id}_starting_1.name')` のように呼び出されます。
