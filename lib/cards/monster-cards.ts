import { CznCard, CardType, CardCategory, CardGrade, CardStatus } from "@/types";

/**
 * Monster Cards
 * 
 * Note: Card names and descriptions are displayed using translations from messages/*.json files.
 * - Card name: t(`cards.${card.id}.name`)
 * - Card description: t(`cards.${card.id}.descriptions.${level}`)
 * 
 * The name and description fields below serve as fallback values when translations are not available.
 */
export const MONSTER_CARDS: CznCard[] = [
  {
    id: "monster_01",
    name: "恥ずかしがり屋の庭師",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_01.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ50%×4\n標識3" }
    ]
  },
  {
    id: "monster_02",
    name: "鬱陶しい代父",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_02.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ50%×4\n苦痛6" }
    ]
  },
  {
    id: "monster_03",
    name: "オートマタカヴァリエ",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.RARE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_03.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ150%\n脆弱4" }
    ]
  },
  {
    id: "monster_04",
    name: "羽の人面獣",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_04.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ランダムな敵にダメージ50%×5" }
    ]
  },
  {
    id: "monster_05",
    name: "ウルブズ・ヴェイン",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_05.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "敵全体にダメージ120%\n弱体化2\n損傷2" }
    ]
  },
  {
    id: "monster_06",
    name: "闇の掌中",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_06.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ120%×2\n撃破：ランダムな敵にダメージ120%×2" }
    ]
  },
  {
    id: "monster_07",
    name: "セブンアームズ",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.LEGEND,
    statuses: [CardStatus.HASTE],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_07.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ120%\n対象の行動カウントが5以上の場合、アクションポイント2獲得" }
    ]
  },
  {
    id: "monster_08",
    name: "ロットンリッパー",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [CardStatus.HASTE],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_08.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ160%\n行動カウント1増加" }
    ]
  },
  {
    id: "monster_09",
    name: "苦痛の熾天使",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_09.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ダメージ250%\n手札にこのカードだけがある場合、コスト2減少" }
    ]
  },
  {
    id: "monster_10",
    name: "ソルジャープライム",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.RARE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_10.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ダメージ300%\n大破時、アクションポイント2獲得" }
    ]
  },
  {
    id: "monster_11",
    name: "ビームシューター",
    type: CardType.MONSTER,
    category: CardCategory.ATTACK,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_11.png",
    hiramekiVariations: [
      { level: 0, cost: 3, description: "ダメージ350%\n対象がシールド保持中の場合、ダメージ量＋50%" }
    ]
  },
  {
    id: "monster_12",
    name: "空虚な飢え",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.RARE,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_12.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "士気2\n敵の士気-2" }
    ]
  },
  {
    id: "monster_13",
    name: "奈落の虫",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.COMMON,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_13.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "士気1減少\n決意3減少" }
    ]
  },
  {
    id: "monster_14",
    name: "冷ややかな代父",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_14.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "山札のカードをしたから1枚発動\n手札のカードを1枚選択、そのカードを山札の一番下に移動" }
    ]
  },
  {
    id: "monster_15",
    name: "悪霊サラマンダー",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.RARE,
    statuses: [CardStatus.EXHAUST2],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_15.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ドロー4" }
    ]
  },
  {
    id: "monster_16",
    name: "精霊フェニックス",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.RARE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_16.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "決意2\n減少したHPに応じて、シールド獲得" }
    ]
  },
  {
    id: "monster_17",
    name: "精霊キャフォックス",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.RARE,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_17.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "山札から1枚を選択しドロー\nそのカードに回収付与" }
    ]
  },
  {
    id: "monster_18",
    name: "トラッパー",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_18.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "シールド120%、脆弱1\n対象が行動しなかった場合シールド獲得量+120%、脆弱1追加" }
    ]
  },
  {
    id: "monster_19",
    name: "カルティストアービター",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.COMMON,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_19.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "シールド140%\n次のターン開始時、敵全体の行動カウント2増加" }
    ]
  },
  {
    id: "monster_20",
    name: "消失の飢え",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.COMMON,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_20.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ドロー1\n手札のカードがない場合、4追加" }
    ]
  },
  {
    id: "monster_21",
    name: "スローター",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    grade: CardGrade.COMMON,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_21.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "シールド200%\n獲得したシールドに応じて、敵全体にダメージ" }
    ]
  },
  {
    id: "monster_22",
    name: "アルビトゥム",
    type: CardType.MONSTER,
    category: CardCategory.UPGRADE,
    grade: CardGrade.RARE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_22.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "受けるダメージ量-15%(各ターン1回)" }
    ]
  },
  {
    id: "monster_23",
    name: "陰気な代母",
    type: CardType.MONSTER,
    category: CardCategory.UPGRADE,
    grade: CardGrade.RARE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_23.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ターン終了時、ランダムな敵にダメージ200%" }
    ]
  },
  {
    id: "monster_24",
    name: "悪霊デュラハン",
    type: CardType.MONSTER,
    category: CardCategory.UPGRADE,
    grade: CardGrade.LEGEND,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_24.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ターゲティング攻撃カード使用時、対象に苦痛1" }
    ]
  },
  {
    id: "monster_25",
    name: "甲殻虫",
    type: CardType.MONSTER,
    category: CardCategory.UPGRADE,
    grade: CardGrade.RARE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_25.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "クリスタライズ5" }
    ]
  },
  {
    id: "monster_26",
    name: "ドミニオン",
    type: CardType.MONSTER,
    category: CardCategory.UPGRADE,
    grade: CardGrade.LEGEND,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/monster_26.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ターン開始時士気1" }
    ]
  },
];
