import { GodType, GodHiramekiDefinition } from "@/types";

// Unified God Hirameki effects list with applicable gods per effect
export const GOD_HIRAMEKI_EFFECTS: GodHiramekiDefinition[] = [
  { id: "godhirameki_1", additionalEffect: "ドロー1", gods: "all" },
  { id: "godhirameki_2", additionalEffect: "アクションポイント1獲得", gods: "all" },
  {
    id: "godhirameki_3",
    additionalEffect: "このカードのコスト1減少",
    costModifier: -1,
    gods: "all",
  },
  { id: "godhirameki_4", additionalEffect: "このカードのシールド量30%増加", gods: "all" },
  { id: "godhirameki_5", additionalEffect: "このカードのダメージ量30%増加", gods: "all" },
  { id: "godhirameki_6", additionalEffect: "このカードの強靱度ダメージ100%増加", gods: "all" },
  { id: "godhirameki_7", additionalEffect: "対象に脆弱2", gods: "all" },
  { id: "godhirameki_8", additionalEffect: "対象に苦痛4", gods: "all" },
  { id: "godhirameki_9", additionalEffect: "士気1、決意1", gods: "all" },
  { id: "godhirameki_10", additionalEffect: "常に弱点攻撃", gods: [GodType.DIALOS] },
  {
    id: "godhirameki_11",
    additionalEffect: "ランダムな味方が対象に挟み撃ち",
    gods: [GodType.VITOL],
  },
  // New effects for Vitol
  { id: "godhirameki_12", additionalEffect: "自分のカードをドロー1", gods: [GodType.VITOL] },
  { id: "godhirameki_13", additionalEffect: "このカードに開戦付与", gods: [GodType.VITOL] },
  {
    id: "godhirameki_14",
    additionalEffect: "弱点攻撃：このターン、不屈2減少",
    gods: [GodType.VITOL],
  },
  // New effects for Dialos
  {
    id: "godhirameki_15",
    additionalEffect: "このカードに粉砕付与、敵全体に損傷3",
    gods: [GodType.DIALOS],
  },
  { id: "godhirameki_16", additionalEffect: "このカードに保存付与", gods: [GodType.DIALOS] },
  {
    id: "godhirameki_17",
    additionalEffect: "シールドがない場合、シールド量100%増加",
    gods: [GodType.DIALOS],
  },
  // New effects for Seclaid
  {
    id: "godhirameki_18",
    additionalEffect: "このターン、最初のカードで使用時、ドロー2",
    gods: [GodType.SECLAID],
  },
  {
    id: "godhirameki_19",
    additionalEffect: "HP50%未満なら、治癒量100%増加",
    gods: [GodType.SECLAID],
  },
  {
    id: "godhirameki_20",
    additionalEffect: "ターン開始時、ランダムな敵に標識2",
    gods: [GodType.SECLAID],
  },
  // New effects for Kilken
  { id: "godhirameki_21", additionalEffect: "ストレス3減少", gods: [GodType.KILKEN] },
  {
    id: "godhirameki_22",
    additionalEffect: "調律：次のターン、アクションポイント2",
    gods: [GodType.KILKEN],
  },
  {
    id: "godhirameki_23",
    additionalEffect: "このターン、エゴスキルのコスト1減少",
    gods: [GodType.KILKEN],
  },
  // New effects for Nihilum
  {
    id: "godhirameki_24",
    additionalEffect: "ターン開始時、コスト0～3に変更",
    gods: [GodType.NIHILUM],
  },
  {
    id: "godhirameki_25",
    additionalEffect: "捨て札の消滅カード2枚を手札に移動",
    gods: [GodType.NIHILUM],
  },
  {
    id: "godhirameki_26",
    additionalEffect: "治癒量100%増加、このカードに終極付与",
    gods: [GodType.NIHILUM],
  },
  // New effects for Order
  { id: "godhirameki_27", additionalEffect: "撃破：ドロー3", gods: [GodType.ORDER] },
  { id: "godhirameki_28", additionalEffect: "このカードに連携付与", gods: [GodType.ORDER] },
  {
    id: "godhirameki_29",
    additionalEffect: "共用カードとして扱う、共用カードをドロー1",
    gods: [GodType.ORDER],
  },
];
