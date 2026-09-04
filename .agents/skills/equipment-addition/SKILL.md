---
name: add-equipment
description: >
  新規装備をデッキビルダーに追加するためのスキルです。
  画像から装備データを読み取り、ユーザー確認を経て TDD で実装します。
  Use this when you want to add a new equipment to the ChaosZeroNightmare Deck Builder.
---

# スキル: 装備の追加 (Add Equipment)

## 目的

このスキルは、「カオスゼロナイトメア」デッキビルダーに新しい装備（武器・防具・ペンダント）を追加する手順を定めたものです。

---

## 前提知識

- 装備は3種別: `WEAPON` / `ARMOR` / `PENDANT`
- レアリティは3段階: `rare` / `legendary` / `mythical`
- **神話級（mythical）は各スロット1個制限**（UI側で制御済み、追加ロジック不要）
- すべての文言は i18n キーで管理（4言語必須: ja / en / zh / ko）
- 英語名はシステムID（snake_case）として使われる

詳細: → [`references/data-schema.md`](./references/data-schema.md)

---

## 変更が必要なファイル一覧

新しい装備を1件追加するたびに、以下のファイルすべてを更新します。

| ファイル                                   | 内容                     |
| ------------------------------------------ | ------------------------ |
| `lib/equipment/weapons.ts`                 | WEAPON の場合のみ        |
| `lib/equipment/armors.ts`                  | ARMOR の場合のみ         |
| `lib/equipment/pendants.ts`                | PENDANT の場合のみ       |
| `messages/ja/equipment.json`               | 日本語名・説明           |
| `messages/en/equipment.json`               | 英語名・説明（IDの根拠） |
| `messages/zh/equipment.json`               | 中国語名・説明           |
| `messages/ko/equipment.json`               | 韓国語名・説明           |
| `public/images/equipment/{type}s/{id}.png` | 装備画像                 |

> **注意**: `lib/equipment.ts` は変更不要（自動的に集約される）

---

## TDD: テストから始める

実装前に必ずテストを確認し、追加後も全件グリーンを保つこと。

```bash
# データ整合性テストを実行
pnpm exec vitest run tests/unit/lib/equipment-data.test.ts

# 全テストを実行
pnpm exec vitest run
```

`tests/unit/lib/equipment-data.test.ts` は以下を自動検証します:

- 全装備のIDが一意である
- i18n キーがパターンに準拠している（`equipment.{type}.{id}.{name|description}`）
- imgUrl パスがパターンに準拠している（`/images/equipment/{type}s/{id}.png`）
- レアリティ値が有効な i18n キーである

---

## ステップ別手順

### Step 1: ID を決める（最重要）

英語の正式名称をゲーム内ドキュメントで確認し、`snake_case` に変換する。

```
例: "Obsidian Sword" → obsidian_sword
例: "M85 Military Grenade" → m85_military_grenade
```

> ⚠️ **英語名を間違えると全体で整合性が崩れる。** → [`references/past-pr-lessons.md`](./references/past-pr-lessons.md)

### Step 2: TypeScript データを追加

対応するファイルの配列末尾（または適切な位置）にエントリを追記する。

→ フィールド定義・実装例: [`references/data-schema.md`](./references/data-schema.md)

### Step 3: i18n を4言語すべてに追加

各言語ファイルの対応するセクション（`weapon` / `armor` / `pendant`）にキーを追加する。

→ キー構造・記述例: [`references/i18n-structure.md`](./references/i18n-structure.md)

### Step 4: 画像ファイルを配置

```
public/images/equipment/weapons/{id}.png   # WEAPON
public/images/equipment/armors/{id}.png    # ARMOR
public/images/equipment/pendants/{id}.png  # PENDANT
```

- 形式: PNG
- ファイル名: `{id}.png`（TypeScript の `id` フィールドと完全一致）

### Step 5: テストを実行して確認

```bash
pnpm exec vitest run tests/unit/lib/equipment-data.test.ts
```

全20件グリーンであることを確認する。

---

## チェックリスト

装備を追加したら、以下を確認する:

- [ ] `id` は snake_case で、英語の正式名称に基づいている
- [ ] TypeScript エントリの `id`・`name`・`description`・`imgUrl` がパターンに従っている
- [ ] 4言語すべての i18n ファイルにキーを追加した
- [ ] 画像ファイルを配置した（ファイル名 = `{id}.png`）
- [ ] `pnpm exec vitest run tests/unit/lib/equipment-data.test.ts` が全件グリーン
- [ ] `pnpm exec vitest run` が全件グリーン

---

## よくあるミスとその対処

| ミス                                               | 対処                                                                        |
| -------------------------------------------------- | --------------------------------------------------------------------------- |
| 英語名を日本語名から類推した                       | 必ずゲーム内の英語表記を確認する                                            |
| i18n キーの `type` 部分を複数形にした（`weapons`） | 単数形: `weapon` / `armor` / `pendant`                                      |
| imgUrl の `type` 部分を単数形にした（`weapon`）    | 複数形: `weapons` / `armors` / `pendants`                                   |
| 一部の言語ファイルにしか追加しなかった             | 必ず `ja` `en` `zh` `ko` の4言語すべて                                      |
| 神話級を複数追加した                               | 神話級は各スロット1個のみ（UIが警告を出すが、データ追加自体はできてしまう） |

---

## 参考資料

- [`references/data-schema.md`](./references/data-schema.md) — Equipment 型定義・フィールド詳細
- [`references/i18n-structure.md`](./references/i18n-structure.md) — i18n ファイルの構造とキー体系
- [`references/past-pr-lessons.md`](./references/past-pr-lessons.md) — 過去の PR から得た教訓
