# リファレンス: よくある落とし穴

過去の PR から学んだ、シーズンカード追加時の注意点まとめです。

---

## 落とし穴 #1: 英語名の誤りがシステムIDを壊す（PR #33）

**何が起きたか**  
英語キャラクター名が間違っていたため、カードIDや共有リンクが壊れた。
ゲーム内では英語名を使うため、スペルミス1つがすべての参照を破壊する。

**影響範囲**

- カードID（`{character_id}_starting_1` 等）
- 神ヒラメキ、コピー、変換の参照
- デッキ共有URL（シリアライズされたID）

**対処**

```
❌ NG: id: "heidemari"    // スペルミス → すべての参照が壊れる
✅ OK: id: "heidemarie"   // 正確なスペル
```

キャラクターIDはケバブケースで、公式の英語表記に準拠させてください。

---

## 落とし穴 #2: `CardStatus` の命名衝突（PR #23）

**何が起きたか**  
`CardStatus.SERENITY` が `CardStatus.QUIETUS` にリネームされた。
この変更が既存のすべてのカード定義と i18n キーに波及した。

**対処**  
新しいステータスを追加する前に `types/index.ts` の既存の値と重複しないことを確認する。

```typescript
// NG: 既存の値と意味が重複する
NEW_STATUS = "exhaust"; // すでに EXHAUST が存在する

// OK: 意味が明確で重複しない
NEW_STATUS = "new_status";
```

既存のステータスを改名する場合は、`lib/character-cards.ts`・`lib/cards/*` 内のすべての参照と、4言語の `common.json` の `cardStatus.*` キーをすべて更新してください。

---

## 落とし穴 #3: キャラクター定義の属性ミス（PR #28・#30）

**何が起きたか**

- PR #28 でハイデマリーを追加したが、ジョブや属性の設定が誤っていた
- PR #30 でキャラクター定義を修正するPRが必要になった

**対処**  
`lib/characters.ts` のエントリを追加する前に、公式ゲームデータで以下を確認してください。

```
- ジョブ（job）: JobType.STRIKER / VANGUARD / RANGER / HUNTER / CONTROLLER / PSIONIC
- 属性（element）: ElementType.PASSION / JUSTICE / ORDER / INSTINCT / VOID
- レアリティ（rarity）: "★4" または "★5"
- 開始カードとヒラメキカードのID（8枚）
```

---

## 落とし穴 #4: ペルソナカードで画像を使い回す（PR #37）

**何が起きたか**  
ATTACKとSKILLのペルソナカードで同じ画像ファイルを使っていたため、
カテゴリ別の画像が正しく表示されなかった。

**対処**  
`lib/character-cards.ts` でカードに `imgUrl` を設定する場合、カテゴリ別に別ファイルを用意してください。

```typescript
// NG: ATTACK と SKILL で同じ画像
{ id: "char_starting_1", imgUrl: "/images/cards/char_starting.png" }
{ id: "char_starting_2", imgUrl: "/images/cards/char_starting.png" } // 同じ!

// OK: カードごとに別ファイル
{ id: "char_starting_1", imgUrl: "/images/cards/char_starting_1.png" }
{ id: "char_starting_2", imgUrl: "/images/cards/char_starting_2.png" }
```

---

## 落とし穴 #5: `isBasicCard` と `isStartingCard` の混同

**説明**

| フィールド             | 意味                               | 設定する枚数      |
| ---------------------- | ---------------------------------- | ----------------- |
| `isStartingCard: true` | キャラクターの初期デッキに含まれる | 4枚すべて         |
| `isBasicCard: true`    | ヒラメキ不可の基本カード           | 通常3枚（1〜3番） |

```typescript
// 開始カード1〜3: どちらも true
{ isBasicCard: true, isStartingCard: true, hiramekiVariations: [{ level: 0 }] }

// 開始カード4: isStartingCard のみ true
{ isBasicCard: false, isStartingCard: true, hiramekiVariations: [{ level: 0 }, ..., { level: 5 }] }

// ヒラメキカード: どちらも省略（false 相当）
{ hiramekiVariations: [{ level: 0 }, ..., { level: 5 }] }
```

---

## 落とし穴 #6: `statuses` フィールドはレベル別に「上書き」される

**説明**  
`HiramekiVariation.statuses` はカードレベルの `CznCard.statuses` を**マージしない**。
レベルごとに明示的に書く必要があります。

```typescript
// NG: Lv2 に EXHAUST2 が表示されない（statuses フィールドがマージされない）
statuses: [CardStatus.EXHAUST2],
hiramekiVariations: [
  { level: 0, statuses: [CardStatus.EXHAUST2] },
  { level: 2, statuses: [CardStatus.INITIATION] }, // EXHAUST2 が消える!
]

// OK: Lv2 に両方明示する
{ level: 2, statuses: [CardStatus.INITIATION, CardStatus.EXHAUST2] }
```

---

## 落とし穴 #7: `"unusable"` コストの用途（PR #38）

**何が起きたか**  
使用不可カードのコストを `0` にしていたが、正しくは `"unusable"` を使う必要がある。
`"unusable"` を使うと UI に禁止アイコンが表示される。

```typescript
// NG: 使用不可カードに 0 を使う
{ cost: 0, description: "使用できない" }

// OK: unusable を使う
{ cost: "unusable", description: "使用できない" }
```

---

## 落とし穴 #8: ヒラメキなしカードの `hiramekiVariations` の長さ

**説明**  
ヒラメキに対応していないカード（例: UNIQUE ステータスの特殊カード）は、
`hiramekiVariations` に Lv0 のみ（長さ 1）を持ちます。

```typescript
// 正しい: ヒラメキなし（Lv0 のみ）
hiramekiVariations: [{ level: 0, cost: 3, description: "説明", statuses: [CardStatus.UNIQUE] }];

// NG: 誤って Lv1 以降を追加してしまう
hiramekiVariations: [
  { level: 0, cost: 3, description: "説明" },
  { level: 1, cost: 3, description: "..." }, // ← UNIQUE カードにヒラメキは存在しない
];
```

---

## 落とし穴 #9: 4言語の翻訳が揃っていない

**何が起きたか**  
日本語と英語のみ追加して、中国語・韓国語を省略したケース。
言語切り替え時にフォールバック表示（キーがそのまま表示）になる。

**対処**  
翻訳が用意できない言語は、暫定的に日本語か英語のテキストをコピーしてプレースホルダーにする。
最終 PR 前には正式な翻訳を確認すること。

---

## 落とし穴 #10: 新 CardStatus 追加時に i18n を忘れる（PR #45）

**説明**  
`types/index.ts` に新しい `CardStatus` を追加しただけでは、UI に表示されない。
4言語すべての `common.json` の `cardStatus` セクションにも追加が必要。

```json
// messages/ja/common.json
{
  "cardStatus": {
    "blessing": "祝福",
    "{new_status}": "新ステータスの日本語名"
  }
}
```
