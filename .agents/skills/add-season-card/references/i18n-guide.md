# リファレンス: i18n ガイド

## ファイル構成

```
messages/
  ja/
    cards.json    # カード名・説明（日本語）
    common.json   # キャラクター名・UI文言（日本語）
  en/
    cards.json    # カード名・説明（英語）
    common.json   # キャラクター名・UI文言（英語）
  zh/
    cards.json    # カード名・説明（中国語）
    common.json   # キャラクター名・UI文言（中国語）
  ko/
    cards.json    # カード名・説明（韓国語）
    common.json   # キャラクター名・UI文言（韓国語）
```

**重要**: 4言語すべてに同時に追加してください。1言語でも欠けるとフォールバック表示になります。

---

## cards.json の構造

### カード名と説明の追加

```json
// messages/ja/cards.json
{
  "cards": {
    "{character_id}_starting_1": {
      "name": "カード日本語名",
      "descriptions": {
        "0": "説明テキスト（Lv0）"
      }
    },
    "{character_id}_starting_4": {
      "name": "カード日本語名",
      "descriptions": {
        "0": "基本説明",
        "1": "Lv1説明",
        "2": "Lv2説明",
        "3": "Lv3説明",
        "4": "Lv4説明",
        "5": "Lv5説明"
      }
    },
    "{character_id}_hirameki_1": {
      "name": "カード日本語名",
      "descriptions": {
        "0": "基本説明",
        "1": "Lv1説明",
        "2": "Lv2説明",
        "3": "Lv3説明",
        "4": "Lv4説明",
        "5": "Lv5説明"
      }
    }
  }
}
```

### ポイント

- キーは `cards.{card_id}.name` と `cards.{card_id}.descriptions.{level}` 形式
- `level` は文字列キー（`"0"`, `"1"`, ...）
- 基本カード（`isBasicCard: true`）は `descriptions` に `"0"` のみ
- ヒラメキありカードは `"0"` 〜 `"5"` の6段階

---

## common.json の構造

### キャラクター名の追加

```json
// messages/ja/common.json
{
  // 既存キーの後に追加...
  "character": {
    "adelheid": "アーデルハイト",
    "heidemarie": "ハイデマリー",
    "{character_id}": "キャラクター名（日本語）"
  }
}
```

i18n キー: `character.{character_id}`  
使用箇所: `lib/characters.ts` の `name` フィールド（`"character.{id}"` 形式）

---

## 言語別の翻訳パターン

### 日本語（ja）

正式な日本語名と説明を記述します。

### 英語（en）

公式の英語名がない場合はローマ字表記または意訳を使用します。

```json
// messages/en/cards.json 例
{
  "cards": {
    "{character_id}_starting_1": {
      "name": "English Card Name",
      "descriptions": {
        "0": "Deals damage equal to 100% of DEF."
      }
    }
  }
}
```

### 中国語（zh） / 韓国語（ko）

翻訳が用意できない場合は、一時的に日本語（または英語）をプレースホルダーとして使用できます。
ただし、最終PR前には正式な翻訳を追加してください。

```json
// messages/zh/cards.json（暫定プレースホルダー例）
{
  "cards": {
    "{character_id}_starting_1": {
      "name": "カード日本語名",
      "descriptions": {
        "0": "防御依存ダメージ100%"
      }
    }
  }
}
```

---

## 実装手順（一括追加）

新キャラクター追加時に変更する8ファイル:

```bash
# 追加対象ファイル（並行して編集する）
messages/ja/cards.json    # 8枚のカード名・説明（日本語）
messages/en/cards.json    # 8枚のカード名・説明（英語）
messages/zh/cards.json    # 8枚のカード名・説明（中国語）
messages/ko/cards.json    # 8枚のカード名・説明（韓国語）
messages/ja/common.json   # キャラクター名（日本語）
messages/en/common.json   # キャラクター名（英語）
messages/zh/common.json   # キャラクター名（中国語）
messages/ko/common.json   # キャラクター名（韓国語）
```

---

## 新しい CardStatus を追加した場合

`CardStatus` に新しい値を追加した場合、`common.json` の `cardStatus` セクションにも追加が必要です。

```json
// messages/ja/common.json
{
  "cardStatus": {
    "initiation": "開戦",
    "retain": "保存",
    "{new_status}": "新ステータスの日本語名"
  }
}
```

4言語すべての `common.json` に追加してください。

---

## i18n キー確認チェックリスト

- [ ] `messages/ja/cards.json` — 全8枚のカードエントリ追加済み
- [ ] `messages/en/cards.json` — 全8枚のカードエントリ追加済み
- [ ] `messages/zh/cards.json` — 全8枚のカードエントリ追加済み
- [ ] `messages/ko/cards.json` — 全8枚のカードエントリ追加済み
- [ ] `messages/ja/common.json` — `character.{id}` キー追加済み
- [ ] `messages/en/common.json` — `character.{id}` キー追加済み
- [ ] `messages/zh/common.json` — `character.{id}` キー追加済み
- [ ] `messages/ko/common.json` — `character.{id}` キー追加済み
- [ ] 新 CardStatus を追加した場合 → 全4言語の `common.json` に `cardStatus.{value}` を追加済み
