import { withOrganizedCardImage } from "@/lib/card-image-paths";
import {
  PERSONA_CARD_IMAGE,
} from "@/lib/persona-image-paths";
import { CznCard, CardType, CardCategory, CardStatus, JobType } from "@/types";

const ALL_PERSONA_JOBS = [
  JobType.STRIKER,
  JobType.VANGUARD,
  JobType.RANGER,
  JobType.HUNTER,
  JobType.PSIONIC,
  JobType.CONTROLLER,
];

/**
 * Forbidden Cards
 * 
 * Note: Card names and descriptions are displayed using translations from messages/*.json files.
 * - Card name: t(`cards.${card.id}.name`)
 * - Card description: t(`cards.${card.id}.descriptions.${level}`)
 * 
 * The name and description fields below serve as fallback values when translations are not available.
 */
export const FORBIDDEN_CARDS: CznCard[] = ([
  {
    id: "forbidden_card_8",
    name: "筋肉強化進化体",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/forbidden_card_8.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ダメージ80%×2\nインスピレーション:ヒット数2回増加" }
    ]
  },
  {
    id: "forbidden_card_9",
    name: "感染性ウイルス",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/forbidden_card_9.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ダメージ120%×1\n感化:ヒット数1回増加(最大5重複)" }
    ]
  },
  {
    id: "forbidden_card_10",
    name: "攻撃性の突然変異",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/forbidden_card_10.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "自分の攻撃カードドロー1、1ターンの間、そのカードのダメージ量+50%" }
    ]
  },
  {
    id: "forbidden_card_11",
    name: "殻形成細胞",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.RETAIN],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/forbidden_card_11.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "シールド70%\n手札のカードに応じてシールド+25%" }
    ]
  },
  {
    id: "forbidden_card_12",
    name: "強制略奪",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_12.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "ドロー1\n山札または捨て札から、ランダムな禁忌カード1枚を手元に移動" }
    ]
  },
  {
    id: "forbidden_card_13",
    name: "禁じられたアルゴリズム",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_13.png",
    hiramekiVariations: [
      { level: 0, cost: 3, description: "手札にランダムな禁忌カードを1枚生成" }
    ]
  },
  {
    id: "forbidden_card_14",
    name: "自己発電実験",
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [CardStatus.LEAD],
    allowedJobs: [JobType.CONTROLLER, JobType.PSIONIC],
    imgUrl: "/images/cards/forbidden_card_14.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "手札のカードが6枚以上の時、ランダムなカード1枚1ターンのコスト0（ターンごとに1回）" }
    ]
  },
  {
    id: "forbidden_card_15",
    name: "強制学習装置",
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [CardStatus.LEAD],
    allowedJobs: [JobType.CONTROLLER, JobType.PSIONIC],
    imgUrl: "/images/cards/forbidden_card_15.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "カード4枚使用時、ドロー1（ターンごとに1回）" }
    ]
  },
  {
    id: "forbidden_card_1",
    name: "禁忌:永生の飢え", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.RETAIN, CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_1.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 0, description: "感応:ドロー1、アクションポイント1獲得" },
    ]
  },
  {
    id: "forbidden_card_2",
    name: "禁忌:自由の手招き", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST, CardStatus.INITIATION],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_2.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 0, description: "手札のランダムなカード1枚のコスト1減少" },
    ]
  },
  {
    id: "forbidden_card_3",
    name: "禁忌:使い捨ての自我", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_3.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 1, description: "ドロー1、そのカードのコストに応じて、ドロー" },
    ]
  },
  {
    id: "forbidden_card_4",
    name: "禁忌:虚無の導き", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [CardStatus.INITIATION],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_4.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 1, description: "能力でドロー時、治癒40％、ランダムな戦闘員のストレス1減少" },
    ]
  },
  {
    id: "forbidden_card_5",
    name: "禁忌:暴力の歓喜", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.RETAIN],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_5.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 9, description: "ダメージ150%x4\n能力でドロー時、このカードのコスト1減少" },
    ]
  },
  {
    id: "forbidden_card_6",
    name: "禁忌:憤怒の肖像", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_6.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 1, description: "ダメージ70%x1\n手札のカード4枚ごとにヒット数1回追加\nヒット数に応じてドロー1" },
    ]
  },
  {
    id: "forbidden_card_7",
    name: "禁忌:刻まれた悪意", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.LEAD],
    allowedJobs: "all",
    imgUrl: "/images/cards/forbidden_card_7.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 2, description: "ドロー1\n手札のランダムカード発動2" },
    ]
  },
  // Seasonal 2
  {
    id: "spore_harvester",
    name: "胞子採集器", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.RETAIN, CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/spore_harvester.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 0, description: "焼却：汚染された胞子2枚生成\n保存：汚染された胞子1枚生成" },
    ]
  },
  {
    id: "nutrient_absorption",
    name: "養分吸収", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/nutrient_absorption.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 0, description: "手札のカード1枚を選択して消滅\nそのカードのコストに応じて、手札のランダムなカード1枚を1ターンの間、コスト1減少" },
    ]
  },
  {
    id: "residual_herb",
    name: "残像草", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.RETRIEVE2, CardStatus.EXHAUST3],
    allowedJobs: "all",
    imgUrl: "/images/cards/residual_herb.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 0, description: "シールド60%\n焼却：汚染された胞子1枚生成" },
    ]
  },
  {
    id: "forests_hunger",
    name: "森の飢え", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/forests_hunger.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 2, description: "防御依存ダメージ300%\n手札の消滅カードをすべて消滅、その数に応じて、ダメージ量+25%" },
    ]
  },
  {
    id: "forgotten_grave",
    name: "忘れ去られた墓地", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.IGNITION, CardStatus.RETAIN, CardStatus.EXHAUST],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/forgotten_grave.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 6, description: "このカードのコスト減少時、1ターンの間、自分の会心率+10%\n焼却：汚染された胞子1枚生成" },
    ]
  },
  {
    id: "mushroom_ammo",
    name: "きのこ弾丸", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.BULLET, CardStatus.EXHAUST],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/mushroom_ammo.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 3, description: "ダメージ450%\n胞子増殖効果2倍" },
    ]
  },
  {
    id: "one_with_all",
    name: "物我一体", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.FINALE, CardStatus.EXHAUST],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/one_with_all.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 0, description: "手札と山札と捨て札から1枚選択して発動\n1ターンの間、カードでダメージ、シールド、治癒をすべて発動時、使用不可を排除" },
    ]
  },
  {
    id: "natures_gift",
    name: "自然の賜り物", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/natures_gift.png",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 1, description: "手札のカード数に応じて、治癒20%\n調律：手札のカード数に応じて、汚染された胞子1枚生成" },
    ]
  },
  {
    id: "azure_lumen",
    name: "青いルーメン",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.RETAIN, CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/azure_lumen.png",
    hiramekiVariations: [
      { level: 0, cost: 0, description: "手札の消滅カード1枚消滅" }
    ]
  },
  {
    id: "crimson_lumen",
    name: "赤いルーメン",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.IGNITION, CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/crimson_lumen.png",
    hiramekiVariations: [
      { level: 0, cost: 3, description: "敵全体にダメージ300%" }
    ]
  },
  {
    id: "amber_lumen",
    name: "黄のルーメン",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/amber_lumen.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "治癒150%\n調律：シールド150%" }
    ]
  },
  {
    id: "ebony_lumen",
    name: "黒いルーメン",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.EXHAUST],
    allowedJobs: "all",
    imgUrl: "/images/cards/ebony_lumen.png",
    hiramekiVariations: [
      { level: 0, cost: 3, description: "焼却:ドロー3\n壊れた黒いルーメン1枚生成" }
    ]
  },
  {
    id: "flame_of_eternity",
    name: "永劫の火種",
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/flame_of_eternity.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "コストが1以上のカード\nダメージ量40%増加\n攻撃カードコスト1増加" }
    ]
  },
  // Season 3
  {
    id: "doctrine_of_binding",
    name: "束縛の教理",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/doctrine_of_binding.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ダメージ200%\n対象が共鳴状態なら、ダメージ量100%増加" }
    ]
  },
  {
    id: "echoes_of_abundance",
    name: "溢れる響き",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.QUIETUS],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/echoes_of_abundance.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ダメージ200%\n破棄された場合、対象に共鳴2" }
    ]
  },
  {
    id: "persona_of_loss",
    name: "喪失のペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/persona_of_loss.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "自分の攻撃カードドロー1\nそのカードが安息カードの場合、連結付与" }
    ]
  },
  {
    id: "whispers_of_madness",
    name: "狂気のささやき",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/whispers_of_madness.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "破棄1\n次に使用する攻撃カードのダメージ量+100%" }
    ]
  },
  {
    id: "explosion_of_emotions",
    name: "感情の爆発",
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [CardStatus.LEAD],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/explosion_of_emotions.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "カードが4枚破棄された場合、アクションポイント1（各ターン1回）" }
    ]
  },
  {
    id: "resonance_of_truth",
    name: "真実の共鳴",
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [CardStatus.INITIATION],
    allowedJobs: "all",
    imgUrl: "/images/cards/resonance_of_truth.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "能力でドロー時、敵全体に共鳴1（各ターン1回）" }
    ]
  },
  {
    id: "inner_awakening",
    name: "内面の覚醒",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.QUIETUS],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/inner_awakening.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "破棄1\nランダムな攻撃カードを1枚ドロー、そのカードに連結付与" }
    ]
  },
  {
    id: "dream_world",
    name: "夢の世界",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.QUIETUS],
    allowedJobs: "all",
    imgUrl: "/images/cards/dream_world.png",
    hiramekiVariations: [
      { level: 0, cost: 3, description: "ダメージ300%\n破棄された場合、山札からランダムなカードを2枚破棄" }
    ]
  },
  {
    id: "the_inverted_messiah",
    name: "逆さ吊りのメシア",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/the_inverted_messiah.png",
    hiramekiVariations: [
      { level: 0, cost: 2, description: "ダメージ250%\n手札に連結カードがある場合、破棄、ヒット数1回追加" }
    ]
  },
  {
    id: "the_other_side_of_nightmares",
    name: "悪夢の裏面",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.LINKED, CardStatus.QUIETUS],
    allowedJobs: "all",
    imgUrl: "/images/cards/the_other_side_of_nightmares.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "ドロー2\n山札に悲惨な記憶を1枚生成" }
    ]
  },
  {
    id: "a_girl_and_her_rotterd_apple",
    name: "腐りゆく林檎と少女",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/a_girl_and_her_rotterd_apple.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "シールド180%\n光の加護1" }
    ]
  },
  {
    id: "faceless_woman",
    name: "顔のない女性",
    type: CardType.FORBIDDEN,
    category: CardCategory.UPGRADE,
    statuses: [],
    allowedJobs: "all",
    imgUrl: "/images/cards/faceless_woman.png",
    hiramekiVariations: [
      { level: 0, cost: 1, description: "連結カード使用時、ドロー1（各ターン1回）" }
    ]
  },
  // Season 4 - Desire cards
  {
    id: "traitors_execution",
    name: "反逆者の粛清",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.CONTROL],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/traitors_execution.png",
    hiramekiVariations: [{ level: 0, cost: 2, description: "敵全体にダメージ200%。撃破：ランダムな敵に灼熱4" }],
    seasonLevelVariations: [
      { level: 1, cost: 2, description: "敵全体にダメージ200%。撃破：ランダムな敵に灼熱4" },
      { level: 2, cost: 2, description: "敵全体にダメージ270%。撃破：ランダムな敵に灼熱4" },
      { level: 3, cost: 2, description: "敵全体にダメージ300%。撃破：ランダムな敵に灼熱6" },
    ],
  },
  {
    id: "mark_of_servitude",
    name: "服従の烙印",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.CONTROL],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/mark_of_servitude.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ130%。対象が灼熱状態なら、追加攻撃100%" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "ダメージ130%。対象が灼熱状態なら、追加攻撃100%" },
      { level: 2, cost: 1, description: "ダメージ150%。対象が灼熱状態なら、追加攻撃140%" },
      { level: 3, cost: 1, description: "ダメージ170%。対象が灼熱状態なら、追加攻撃180%" },
    ],
  },
  {
    id: "kneel_before_me",
    name: "跪け",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.CONTROL],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/kneel_before_me.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "デバフを所持中の対象に脆弱1。敵全体に弱体化1、灼熱3" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "デバフを所持中の対象に脆弱1。敵全体に弱体化1、灼熱3" },
      { level: 2, cost: 1, description: "デバフを所持中の対象に脆弱2。敵全体に弱体化1、灼熱3" },
      { level: 3, cost: 1, description: "デバフを所持中の対象に脆弱3。敵全体に弱体化1、灼熱3" },
    ],
  },
  {
    id: "indiscriminate_slaughter",
    name: "見境なき殺戮",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.CONTROL],
    allowedJobs: "all",
    imgUrl: "/images/cards/indiscriminate_slaughter.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ240%。行動カウント2減少" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "ダメージ240%。行動カウント2減少" },
      { level: 2, cost: 1, description: "ダメージ290%。行動カウント3減少" },
      { level: 3, cost: 1, description: "ダメージ360%。行動カウント3減少" },
    ],
  },
  {
    id: "order_of_dominance",
    name: "序列の確立",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.CONTROL],
    allowedJobs: "all",
    imgUrl: "/images/cards/order_of_dominance.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ120%。対象が苦痛または灼熱状態なら、ダメージ量85%増加" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "ダメージ120%。対象が苦痛または灼熱状態なら、ダメージ量85%増加" },
      { level: 2, cost: 1, description: "ダメージ140%。対象が苦痛または灼熱状態なら、ダメージ量100%増加" },
      { level: 3, cost: 1, description: "ダメージ150%。対象が苦痛または灼熱状態なら、ダメージ量125%増加" },
    ],
  },
  {
    id: "postmortem_analysis",
    name: "事後分析",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.INQUIRY],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/postmortem_analysis.png",
    hiramekiVariations: [{ level: 0, cost: 2, description: "ダメージ200%。このターン中に、味方が撃破した敵数に応じて1ターンの間ダメージ量+50%(最大4回)" }],
    seasonLevelVariations: [
      { level: 1, cost: 2, description: "ダメージ200%。このターン中に、味方が撃破した敵数に応じて1ターンの間ダメージ量+50%(最大4回)" },
      { level: 2, cost: 2, description: "ダメージ260%。このターン中に、味方が撃破した敵数に応じて1ターンの間ダメージ量+60%(最大4回)" },
      { level: 3, cost: 2, description: "ダメージ320%。このターン中に、味方が撃破した敵数に応じて1ターンの間ダメージ量+70%(最大4回)" },
    ],
  },
  {
    id: "sensory_overload",
    name: "感覚過負荷",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.INQUIRY],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/sensory_overload.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "1ターンの間、自分の能力でドロー時、ランダムな敵に追加攻撃75%(最大3回)" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "1ターンの間、自分の能力でドロー時、ランダムな敵に追加攻撃75%(最大3回)" },
      { level: 2, cost: 1, description: "1ターンの間、自分の能力でドロー時、ランダムな敵に追加攻撃90%(最大3回)" },
      { level: 3, cost: 1, description: "1ターンの間、自分の能力でドロー時、ランダムな敵に追加攻撃110%(最大3回)" },
    ],
  },
  {
    id: "forbidden_hypothesis",
    name: "禁じられた仮説",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.INQUIRY],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/forbidden_hypothesis.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "ドロー1。ランダムな敵に弱体化、脆弱、苦痛のうち、ランダム効果2回付与" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "ドロー1。ランダムな敵に弱体化、脆弱、苦痛のうち、ランダム効果2回付与" },
      { level: 2, cost: 1, description: "ドロー1。ランダムな敵に弱体化、脆弱、苦痛のうち、ランダム効果3回付与" },
      { level: 3, cost: 1, description: "ドロー1。敵全体に弱体化、脆弱、苦痛のうち、ランダム効果3回付与" },
    ],
  },
  {
    id: "sample_collection",
    name: "標本収集",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.INQUIRY],
    allowedJobs: "all",
    imgUrl: "/images/cards/sample_collection.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ100%。ドロー1" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "ダメージ100%。ドロー1" },
      { level: 2, cost: 1, description: "ダメージ150%。ドロー1" },
      { level: 3, cost: 1, description: "ダメージ150%。ドロー2" },
    ],
  },
  {
    id: "knowledge_addiction",
    name: "知識中毒",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.INQUIRY],
    allowedJobs: "all",
    imgUrl: "/images/cards/knowledge_addiction.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "このターンドローしたカード数に応じて1ターンの間、次に使用する攻撃カードのダメージ量+20%(最大5)" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "このターンドローしたカード数に応じて1ターンの間、次に使用する攻撃カードのダメージ量+20%(最大5)" },
      { level: 2, cost: 1, description: "このターンドローしたカード数に応じて1ターンの間、次に使用する攻撃カードのダメージ量+30%(最大5)" },
      { level: 3, cost: 1, description: "このターンドローしたカード数に応じて1ターンの間、次に使用する攻撃カードのダメージ量+40%(最大5)" },
    ],
  },
  {
    id: "sever_ties",
    name: "関係の抹消",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.CLAIM],
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    imgUrl: "/images/cards/sever_ties.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "1ターンの間、対象が所持中のデバフ種類数に応じて与えるダメージ量+20%(最大60%)" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "1ターンの間、対象が所持中のデバフ種類数に応じて与えるダメージ量+20%(最大60%)" },
      { level: 2, cost: 1, description: "1ターンの間、対象が所持中のデバフ種類数に応じて与えるダメージ量+30%(最大90%)" },
      { level: 3, cost: 1, description: "1ターンの間、対象が所持中のデバフ種類数に応じて与えるダメージ量+40%(最大120%)" },
    ],
  },
  {
    id: "narcissism",
    name: "ナルシシズム",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.CLAIM],
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    imgUrl: "/images/cards/narcissism.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "1ターンの間、他の戦闘員の攻撃カード使用時、ランダムな敵に挟み撃ち60%(最大2回)。挟み撃ちの対象は1ターンの間、士気1減少" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "1ターンの間、他の戦闘員の攻撃カード使用時、ランダムな敵に挟み撃ち60%(最大2回)。挟み撃ちの対象は1ターンの間、士気1減少" },
      { level: 2, cost: 1, description: "1ターンの間、他の戦闘員の攻撃カード使用時、ランダムな敵に挟み撃ち80%(最大2回)。挟み撃ちの対象は1ターンの間、士気1減少" },
      { level: 3, cost: 1, description: "1ターンの間、他の戦闘員の攻撃カード使用時、ランダムな敵に挟み撃ち110%(最大2回)。挟み撃ちの対象は1ターンの間、士気1減少" },
    ],
  },
  {
    id: "its_all_mine",
    name: "すべて我が物に",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.CLAIM],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: "/images/cards/its_all_mine.png",
    hiramekiVariations: [{ level: 0, cost: 2, description: "ダメージ200%。撃破：対象が所持中のデバフ数に応じて1ターンの間、士気1" }],
    seasonLevelVariations: [
      { level: 1, cost: 2, description: "ダメージ200%。撃破：対象が所持中のデバフ数に応じて1ターンの間、士気1" },
      { level: 2, cost: 2, description: "ダメージ300%。撃破：対象が所持中のデバフ数に応じて1ターンの間、士気1" },
      { level: 3, cost: 2, description: "ダメージ390%。撃破：対象が所持中のデバフ数に応じて1ターンの間、士気1" },
    ],
  },
  {
    id: "obsession",
    name: "執着",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.CLAIM],
    allowedJobs: "all",
    imgUrl: "/images/cards/obsession.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ120%。対象が所持中のデバフ種類数に応じてダメージ量+25%(最大100%)" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "ダメージ120%。対象が所持中のデバフ種類数に応じてダメージ量+25%(最大100%)" },
      { level: 2, cost: 1, description: "ダメージ150%。対象が所持中のデバフ種類数に応じてダメージ量+30%(最大120%)" },
      { level: 3, cost: 1, description: "ダメージ170%。対象が所持中のデバフ種類数に応じてダメージ量+40%(最大160%)" },
    ],
  },
  {
    id: "gilded_nest",
    name: "黄金の巣",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.CLAIM],
    allowedJobs: "all",
    imgUrl: "/images/cards/gilded_nest.png",
    hiramekiVariations: [{ level: 0, cost: 1, description: "対象が所持中のデバフ1個につきシールド40%(最大200%)。苦痛2、灼熱2" }],
    seasonLevelVariations: [
      { level: 1, cost: 1, description: "対象が所持中のデバフ1個につきシールド40%(最大200%)。苦痛2、灼熱2" },
      { level: 2, cost: 1, description: "対象が所持中のデバフ1個につきシールド50%(最大250%)。苦痛4、灼熱4" },
      { level: 3, cost: 1, description: "対象が所持中のデバフ1個につきシールド60%(最大300%)。苦痛6、灼熱6" },
    ],
  },
  // Personas
  {
    id: "persona_01",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: ALL_PERSONA_JOBS,
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ250%\n衝撃波3" }],
  },
  {
    id: "persona_02",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: ALL_PERSONA_JOBS,
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ200%\n死の烙印1" }],
  },
  {
    id: "persona_03",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: ALL_PERSONA_JOBS,
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "2枚まで破棄\n破棄した数に応じて1ターンの間、自分の攻撃カードのダメージ量+60%" }],
  },
  {
    id: "persona_04",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: ALL_PERSONA_JOBS,
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ドロー1\n攻撃カードドロー時、1ターンの間、士気2" }],
  },
  {
    id: "persona_05",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: ALL_PERSONA_JOBS,
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ250%\n今回のターンでカードを生成した場合、ダメージ50％増加" }],
  },
  {
    id: "persona_06",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE, CardStatus.QUIETUS],
    allowedJobs: ALL_PERSONA_JOBS,
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "山札からランダムな安息カードを1枚破棄" }],
  },
  {
    id: "persona_07",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.RANGER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ドロー2\n攻撃カードをドローした数に応じて挟み撃ち100%" }],
  },
  {
    id: "persona_08",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.VANGUARD, JobType.CONTROLLER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "防御依存ダメージ250%\n脆弱1" }],
  },
  {
    id: "persona_09",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.VANGUARD],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "防御依存ダメージ250%\n行動カウントが1の対象がいる場合、反撃2" }],
  },
  {
    id: "persona_10",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.PSIONIC],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ150%\n対象が所持中の自分の苦痛数に応じてダメージ量+30％" }],
  },
  {
    id: "persona_11",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE, CardStatus.EXHAUST5],
    allowedJobs: [JobType.STRIKER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ100%\n手札の自分の攻撃カードのダメージ量+50％" }],
  },
  {
    id: "persona_12",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.CONTROLLER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "墓地のカード数に応じて次に使用する攻撃カードのダメージ量+15％（最大150％）" }],
  },
  {
    id: "persona_13",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.CONTROLLER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "防御依存ダメージ250%\n行動カウント2" }],
  },
  {
    id: "persona_14",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.VANGUARD],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "シールド250%\n反撃2" }],
  },
  {
    id: "persona_15",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE, CardStatus.BULLET],
    allowedJobs: [JobType.HUNTER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ250%\n手札の全ての弾丸カードが使用時までダメージ量+30％" }],
  },
  {
    id: "persona_16",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.RANGER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "ダメージ250%\n標識2" }],
  },
  {
    id: "persona_17",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE, CardStatus.EXHAUST2],
    allowedJobs: [JobType.HUNTER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "弾丸カードのダメージ量+30％" }],
  },
  {
    id: "persona_18",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.PSIONIC],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "治癒250%\n1ターンの間、カード破棄時、ランダムな敵に苦痛1" }],
  },
  {
    id: "persona_19",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE],
    allowedJobs: [JobType.PSIONIC, JobType.CONTROLLER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "治癒250%\n行動鈍化3" }],
  },
  {
    id: "persona_20",
    name: "ペルソナ",
    type: CardType.FORBIDDEN,
    category: CardCategory.SKILL,
    statuses: [CardStatus.UNIQUE, CardStatus.EXHAUST2],
    allowedJobs: [JobType.STRIKER],
    imgUrl: PERSONA_CARD_IMAGE,
    hiramekiVariations: [{ level: 0, cost: 1, description: "シールド250%\n墓地から自分のランダムな攻撃カード1枚を手札に移動" }],
  },
] satisfies CznCard[]).map(withOrganizedCardImage);
