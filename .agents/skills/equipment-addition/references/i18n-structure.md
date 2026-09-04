# i18n 構造ガイド

## ファイル配置

```
messages/
  ja/
    equipment.json   # 日本語
  en/
    equipment.json   # 英語（IDの根拠となる）
  zh/
    equipment.json   # 中国語
  ko/
    equipment.json   # 韓国語
```

---

## equipment.json のキー構造

```json
{
  "equipment": {
    "title": "...",
    "rarity": {
      "rare": "...",
      "legendary": "...",
      "mythical": "..."
    },
    "weapon": {
      "title": "...",
      "{id}": {
        "name": "装備名",
        "description": "装備の説明文"
      }
    },
    "armor": {
      "title": "...",
      "{id}": {
        "name": "装備名",
        "description": "装備の説明文"
      }
    },
    "pendant": {
      "title": "...",
      "{id}": {
        "name": "装備名",
        "description": "装備の説明文"
      }
    }
  }
}
```

---

## 追加パターン

### 武器を追加する場合

`messages/{lang}/equipment.json` の `"weapon"` オブジェクト内に追加する。

```json
"weapon": {
  "title": "...",
  "obsidian_sword": { ... },
  "new_weapon_id": {
    "name": "新しい武器",
    "description": "武器の効果説明"
  }
}
```

### 防具を追加する場合

`messages/{lang}/equipment.json` の `"armor"` オブジェクト内に追加する。

```json
"armor": {
  "title": "...",
  "new_armor_id": {
    "name": "新しい防具",
    "description": "防具の効果説明"
  }
}
```

### ペンダントを追加する場合

`messages/{lang}/equipment.json` の `"pendant"` オブジェクト内に追加する。

```json
"pendant": {
  "title": "...",
  "new_pendant_id": {
    "name": "新しいペンダント",
    "description": "ペンダントの効果説明"
  }
}
```

---

## キーパスの規則（重要）

TypeScript の `name` / `description` フィールドは以下のパスを参照する:

| フィールド    | パス                                |
| ------------- | ----------------------------------- |
| `name`        | `equipment.{type}.{id}.name`        |
| `description` | `equipment.{type}.{id}.description` |

- `{type}` は **単数形**: `weapon` / `armor` / `pendant`
- `{id}` は TypeScript の `id` フィールドと**完全一致**

---

## 4言語の更新が必須

| 言語   | ファイル                     | 注意点                                         |
| ------ | ---------------------------- | ---------------------------------------------- |
| 日本語 | `messages/ja/equipment.json` | ゲーム内の正式な日本語名を使用                 |
| 英語   | `messages/en/equipment.json` | **システムIDの根拠**。正式な英語名必須         |
| 中国語 | `messages/zh/equipment.json` | 未翻訳の場合は英語をフォールバックとして使用可 |
| 韓国語 | `messages/ko/equipment.json` | 未翻訳の場合は英語をフォールバックとして使用可 |

> ⚠️ **English名が最重要**。英語名（`en`）のスペルミスや意味のズレが id のミスマッチにつながる。

---

## 実際の記述例（英語 equipment.json より）

```json
{
  "equipment": {
    "rarity": {
      "legendary": "Legendary",
      "mythical": "Mythical",
      "rare": "Rare"
    },
    "weapon": {
      "title": "Weapon",
      "obsidian_sword": {
        "name": "Obsidian Sword",
        "description": "Damage +12%"
      },
      "m85_military_grenade": {
        "name": "M85 Military Grenade",
        "description": "When using an upgrade card, deal 150% fixed damage to all enemies"
      }
    },
    "armor": {
      "title": "Armor",
      "scouts_combat_boots": {
        "name": "Scout's Combat Boots",
        "description": "..."
      }
    },
    "pendant": {
      "title": "Pendant",
      "amorphous_cube": {
        "name": "Amorphous Cube",
        "description": "..."
      }
    }
  }
}
```
