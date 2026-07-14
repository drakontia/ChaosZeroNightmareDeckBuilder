import type { PersonaEngravingAlignment } from "@/types";

export interface EquipmentEngravingEffect {
  id: string;
  alignment: PersonaEngravingAlignment;
  description: string;
}

export const EQUIPMENT_ENGRAVING_EFFECTS: EquipmentEngravingEffect[] = [
  {
    id: "equipment_engraving_lux_01",
    alignment: "light",
    description: "味方が能力でカードを5枚以上生成した場合、自分の追加攻撃ダメージ量+30％（各ターン1回）",
  },
  {
    id: "equipment_engraving_lux_02",
    alignment: "light",
    description: "味方が大破時、対象の行動カウント2増加（各ターン1回）",
  },
  {
    id: "equipment_engraving_lux_03",
    alignment: "light",
    description: "ターン開始時、行動カウントが最も低い対象に弱体化２",
  },
  {
    id: "equipment_engraving_lux_04",
    alignment: "light",
    description: "今回のターンで行動カウントが３以上減少した場合、行動カウントが最も低い対象に弱体化１",
  },
  {
    id: "equipment_engraving_lux_05",
    alignment: "light",
    description: "ターン終了時、保存したカードがある場合、固定シールド50％",
  },
  {
    id: "equipment_engraving_umbra_01",
    alignment: "dark",
    description: "闇の刻印+1",
  },
  {
    id: "equipment_engraving_umbra_02",
    alignment: "dark",
    description: "自身の消滅カードのダメージ量25％増加",
  },
  {
    id: "equipment_engraving_umbra_03",
    alignment: "dark",
    description: "自身の安息カードのダメージ量25％増加",
  },
  {
    id: "equipment_engraving_umbra_04",
    alignment: "dark",
    description: "ターン開始時、手札に安息カードがある場合、ランダムの敵に固定ダメージ60％",
  },
  {
    id: "equipment_engraving_umbra_05",
    alignment: "dark",
    description: "攻撃を受けると、手札のランダムな安息カードを1枚破棄（各ターン1回）",
  },
  {
    id: "equipment_engraving_umbra_06",
    alignment: "dark",
    description: "追加攻撃時、１ターンの間、士気１（各ターン1回）",
  },
  {
    id: "equipment_engraving_umbra_07",
    alignment: "dark",
    description: "味方が能力で安息カードを破棄した場合、ドロー1（各ターン1回）",
  },
  {
    id: "equipment_engraving_umbra_08",
    alignment: "dark",
    description: "自分のカードが破棄された場合、次に使用する攻撃カードのダメージ量+100％（各ターン1回）",
  },
  // 追加：光装備刻印
  {
    id: "equipment_engraving_lux_06",
    alignment: "light",
    description: "ターン開始時、行動カウントが最も低い対象に固定ダメージ100%",
  },
  {
    id: "equipment_engraving_lux_07",
    alignment: "light",
    description: "攻撃を受けると、攻撃者に脆弱、弱体化のうち、ランダムで1個付与(各ターン1回)",
  },
  {
    id: "equipment_engraving_lux_08",
    alignment: "light",
    description: "自分のカード発動時、30%の確率で敵全体の行動カウント1増加(各ターン1回)",
  },
  {
    id: "equipment_engraving_lux_09",
    alignment: "light",
    description: "自分の迅速カードのダメージ量25%増加",
  },
  // 追加：闇装備刻印
  {
    id: "equipment_engraving_umbra_09",
    alignment: "dark",
    description: "光の刻印+1",
  },
  {
    id: "equipment_engraving_umbra_10",
    alignment: "dark",
    description: "自分の主導カードが破棄された場合、発動（各ターン1回）",
  },
  {
    id: "equipment_engraving_umbra_11",
    alignment: "dark",
    description: "味方が能力でカードを2枚破棄時、安息カードを1枚ドロー（各戦闘1回）",
  },
  {
    id: "equipment_engraving_umbra_12",
    alignment: "dark",
    description: "墓地のカード数が7枚以上の場合、自分の攻撃カードのダメージ量30%増加",
  },
  {
    id: "equipment_engraving_umbra_13",
    alignment: "dark",
    description: "墓地のカードが15枚以上の場合、自身の攻撃カードの会心ダメージ+15%",
  },
  {
    id: "equipment_engraving_umbra_14",
    alignment: "dark",
    description: "墓地のカードが40枚以上の場合、士気2（各戦闘1回）",
  },
];

export function normalizeEquipmentEngravingId(engravingId: string | null | undefined): string | null {
  if (!engravingId) {
    return null;
  }

  return EQUIPMENT_ENGRAVING_EFFECTS.some((effect) => effect.id === engravingId) ? engravingId : null;
}
