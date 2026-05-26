# Equipment データスキーマ

## TypeScript 型定義

`types/index.ts` に定義されています。

```typescript
export enum EquipmentType {
  WEAPON = "weapon",
  ARMOR = "armor",
  PENDANT = "pendant"
}

export interface Equipment {
  id: string;           // snake_case（英語正式名称から導出）
  name: string;         // i18n キー: "equipment.{type}.{id}.name"
  type: EquipmentType;  // WEAPON / ARMOR / PENDANT
  rarity: string;       // i18n キー（下記参照）
  description?: string; // i18n キー: "equipment.{type}.{id}.description"（省略可能）
  imgUrl?: string;      // 画像パス（省略可能）
}
```

## フィールド詳細

### `id`

- **形式**: snake_case の英語名
- **導出元**: ゲーム内の英語正式名称
- **例**: `obsidian_sword`, `m85_military_grenade`, `scouts_combat_boots`
- ⚠️ **ID を変更すると i18n キーと画像パスもすべて変更が必要になる**

### `name`

- **形式**: `"equipment.{type}.{id}.name"`
- **`{type}`**: `weapon` / `armor` / `pendant`（**単数形**）
- **例**:
  - `"equipment.weapon.obsidian_sword.name"`
  - `"equipment.armor.scouts_combat_boots.name"`
  - `"equipment.pendant.amorphous_cube.name"`

### `type`

- `EquipmentType.WEAPON` → `lib/equipment/weapons.ts` に配置
- `EquipmentType.ARMOR` → `lib/equipment/armors.ts` に配置
- `EquipmentType.PENDANT` → `lib/equipment/pendants.ts` に配置

### `rarity`

有効な値は以下の3つのみ:

| 値 | 日本語 | 英語 |
|---|---|---|
| `"equipment.rarity.rare"` | 希少 | Rare |
| `"equipment.rarity.legendary"` | 伝説 | Legendary |
| `"equipment.rarity.mythical"` | 神話 | Mythical |

> **神話級（mythical）は各スロット1個制限**: UIが警告を表示するが、データ層には制限なし。意図的に複数追加しないこと。

### `description`

- **形式**: `"equipment.{type}.{id}.description"` または省略
- **例**: `"equipment.weapon.obsidian_sword.description"`

### `imgUrl`

- **形式**: `"/images/equipment/{type}s/{id}.png"`
- **`{type}s`**: `weapons` / `armors` / `pendants`（**複数形**）
- **例**:
  - `"/images/equipment/weapons/obsidian_sword.png"`
  - `"/images/equipment/armors/scouts_combat_boots.png"`
  - `"/images/equipment/pendants/amorphous_cube.png"`

---

## 完全な実装例

### WEAPON（希少）

```typescript
// lib/equipment/weapons.ts
{
  id: "obsidian_sword",
  name: "equipment.weapon.obsidian_sword.name",
  type: EquipmentType.WEAPON,
  rarity: "equipment.rarity.rare",
  description: "equipment.weapon.obsidian_sword.description",
  imgUrl: "/images/equipment/weapons/obsidian_sword.png"
},
```

### ARMOR（神話級）

```typescript
// lib/equipment/armors.ts
{
  id: "some_mythical_armor",
  name: "equipment.armor.some_mythical_armor.name",
  type: EquipmentType.ARMOR,
  rarity: "equipment.rarity.mythical",
  description: "equipment.armor.some_mythical_armor.description",
  imgUrl: "/images/equipment/armors/some_mythical_armor.png"
},
```

### PENDANT（伝説）

```typescript
// lib/equipment/pendants.ts
{
  id: "heart_of_the_jewel",
  name: "equipment.pendant.heart_of_the_jewel.name",
  type: EquipmentType.PENDANT,
  rarity: "equipment.rarity.legendary",
  description: "equipment.pendant.heart_of_the_jewel.description",
  imgUrl: "/images/equipment/pendants/heart_of_the_jewel.png"
},
```

---

## 集約ファイル（変更不要）

`lib/equipment.ts` は3ファイルを自動集約するため、直接変更しない。

```typescript
// lib/equipment.ts（参考）
export { WEAPONS, ARMORS, PENDANTS };
export const EQUIPMENT: Equipment[] = [...WEAPONS, ...ARMORS, ...PENDANTS];
```

---

## データ整合性テスト

`tests/unit/lib/equipment-data.test.ts` が以下を自動検証する:

- 全装備のIDが一意
- `name` / `description` / `imgUrl` がパターンに準拠
- `rarity` が有効な i18n キー
- 追加後も重複なし
