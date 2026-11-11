import {
  CardCategory,
  CardStatus,
  CardType,
  type CznCard,
  type MemoryLevelVariation,
} from "@/types";

type Locale = "ja" | "en" | "zh" | "ko";
type LocalizedText = Record<Locale, string>;

interface SharedCardDefinition {
  id: string;
  name: LocalizedText;
  category: CardCategory;
  cost: number;
  statuses: CardStatus[];
  description: LocalizedText;
}

const sharedCardDefinitions: SharedCardDefinition[] = [
  {
    id: "season5_divine_punishment",
    name: { ja: "神罰", en: "Divine Punishment", zh: "神罚", ko: "신벌" },
    category: CardCategory.ATTACK,
    cost: 3,
    statuses: [],
    description: {
      ja: "ダメージ350%\n手札の粉砕カード数に応じて、コスト減少",
      en: "Deal 350% damage. Cost decreases for each Pulverize card in hand.",
      zh: "造成350%伤害。手牌中的粉碎卡每有1张，费用降低。",
      ko: "피해 350%. 손패의 분쇄 카드 수에 따라 비용 감소",
    },
  },
  {
    id: "season5_damaged_divine_relic",
    name: { ja: "毀損された神物", en: "Damaged Divine Relic", zh: "受损的神物", ko: "훼손된 신물" },
    category: CardCategory.SKILL,
    cost: 2,
    statuses: [CardStatus.BANISH],
    description: {
      ja: "すべての戦闘員のストレス10減少\nクレジット200獲得",
      en: "Reduce all allies' Stress by 10. Gain 200 Credits.",
      zh: "所有战斗员压力减少10。获得200信用点。",
      ko: "모든 전투원 스트레스 10 감소. 크레딧 200 획득",
    },
  },
  {
    id: "season5_proxy_armor",
    name: { ja: "代理人の鎧", en: "Proxy's Armor", zh: "代理人的铠甲", ko: "대리인의 갑옷" },
    category: CardCategory.SKILL,
    cost: 2,
    statuses: [CardStatus.EXHAUST],
    description: {
      ja: "シールド200%\n味方の強化カード使用時、手札にあるなら起動",
      en: "Gain 200% Shield. If this is in hand when an ally uses an Upgrade card, activate it.",
      zh: "获得200%护盾。友方使用强化卡时，若此卡在手牌中则发动。",
      ko: "실드 200%. 아군이 강화 카드를 사용할 때 손패에 있으면 발동",
    },
  },
  {
    id: "season5_enveloping_light",
    name: { ja: "包み込む光", en: "Enveloping Light", zh: "包覆之光", ko: "감싸는 빛" },
    category: CardCategory.UPGRADE,
    cost: 1,
    statuses: [],
    description: {
      ja: "味方のスキルまたは強化カード使用時、天罰を1枚手札に生成（各ターン3回）",
      en: "When an ally uses a Skill or Upgrade card, create 1 Retribution in hand (up to 3 times per turn).",
      zh: "友方使用技能或强化卡时，在手牌中生成1张天罚（每回合最多3次）。",
      ko: "아군이 스킬 또는 강화 카드를 사용할 때 손패에 천벌 1장 생성 (턴당 3회)",
    },
  },
  {
    id: "season5_frost_fighter",
    name: { ja: "極寒の闘士", en: "Frost Fighter", zh: "极寒斗士", ko: "혹한의 투사" },
    category: CardCategory.ATTACK,
    cost: 1,
    statuses: [CardStatus.RETAIN, CardStatus.PULVERIZE],
    description: {
      ja: "ダメージ120%\n自分のカード生成時、このカードが手札にあるなら、発動時までダメージ量+30%（最大180%）",
      en: "[Retain / Pulverize] Deal 120% damage. When you generate a card while this is in hand, this card's damage increases by 30% until activated (max 180%).",
      zh: "[保存 / 粉碎] 造成120%伤害。此卡在手牌中时生成卡牌，则此卡伤害量+30%直至发动（最多180%）。",
      ko: "[보존 / 분쇄] 피해 120%. 이 카드가 손패에 있을 때 자신이 카드를 생성하면 발동 시까지 피해량 +30% (최대 180%)",
    },
  },
  {
    id: "season5_ambush_support",
    name: { ja: "待ち伏せ援護", en: "Ambush Support", zh: "伏击支援", ko: "매복 지원" },
    category: CardCategory.ATTACK,
    cost: 1,
    statuses: [CardStatus.COMBO],
    description: {
      ja: "敵全体にダメージ150%\nインスピレーション：粉砕付与",
      en: "[Combo] Deal 150% damage to all enemies. Inspiration: apply Pulverize.",
      zh: "[连携] 对所有敌人造成150%伤害。灵感：赋予粉碎。",
      ko: "[연계] 모든 적에게 피해 150%. 영감: 분쇄 부여",
    },
  },
  {
    id: "season5_slow_cooling",
    name: { ja: "低速冷却", en: "Slow Cooling", zh: "缓慢冷却", ko: "저속 냉각" },
    category: CardCategory.SKILL,
    cost: 1,
    statuses: [CardStatus.RETAIN],
    description: {
      ja: "脆弱2\n行動カウント1増加\n純粋：効果2倍適用",
      en: "[Retain] Apply Vulnerable 2 and increase Action Count by 1. Pure: apply effects twice.",
      zh: "[保存] 赋予脆弱2，行动计数+1。纯粹：效果翻倍。",
      ko: "[보존] 취약 2, 행동 카운트 1 증가. 순수: 효과 2배 적용",
    },
  },
  {
    id: "season5_rite_of_execution",
    name: { ja: "執行の儀式", en: "Rite of Execution", zh: "执行仪式", ko: "집행 의식" },
    category: CardCategory.SKILL,
    cost: 1,
    statuses: [CardStatus.FINALE, CardStatus.EXHAUST],
    description: {
      ja: "次のターン開始時、1ターンの間、士気2獲得、アクションポイント2獲得",
      en: "[Finale / Exhaust] At the start of next turn, gain Morale 2 and 2 Action Points for 1 turn.",
      zh: "[终极 / 消灭] 下回合开始时，获得士气2和行动点2，持续1回合。",
      ko: "[종결 / 소멸] 다음 턴 시작 시 1턴 동안 사기 2, 행동 포인트 2 획득",
    },
  },
  {
    id: "season5_retribution",
    name: { ja: "天罰", en: "Retribution", zh: "天罚", ko: "천벌" },
    category: CardCategory.ATTACK,
    cost: 1,
    statuses: [CardStatus.EXHAUST, CardStatus.BIND],
    description: {
      ja: "ダメージ70%\n結束の重複数に応じてダメージ量+60%",
      en: "[Exhaust / Bind (1/3)] Deal 70% damage. Damage increases by 60% per Bind stack.",
      zh: "[消灭 / 结系(1/3)] 造成70%伤害。每层结系使伤害量+60%。",
      ko: "[소멸 / 결속(1/3)] 피해 70%. 결속 중첩마다 피해량 +60%",
    },
  },
  {
    id: "season5_frozen_revelation",
    name: { ja: "凍てつく啓示", en: "Frozen Revelation", zh: "冰封启示", ko: "얼어붙은 계시" },
    category: CardCategory.SKILL,
    cost: 0,
    statuses: [],
    description: {
      ja: "強化カードを1枚ドロー\n連続：1枚ドロー",
      en: "Draw 1 Upgrade card. Consecutive: draw 1.",
      zh: "抽1张强化卡。连续：抽1张。",
      ko: "강화 카드 1장 드로우. 연속: 1장 드로우",
    },
  },
];

interface MemoryTheme {
  id: string;
  name: LocalizedText;
  trigger: LocalizedText;
  additionalEffect?: LocalizedText;
}

const memoryThemes: MemoryTheme[] = [
  {
    id: "suppression",
    name: { ja: "記憶：抑圧", en: "Memory: Suppression", zh: "记忆：压抑", ko: "기억: 억압" },
    trigger: {
      ja: "1ターンの間、ヒット数が3以上の味方の攻撃カード2回発動時、",
      en: "For 1 turn, when allied Attack cards with 3 or more hits activate twice, ",
      zh: "1回合内，命中次数达到3次以上的友方攻击卡发动2次时，",
      ko: "1턴 동안, 적중 횟수가 3회 이상인 아군 공격 카드가 2회 발동 시,",
    },
  },
  {
    id: "craving",
    name: { ja: "記憶：渇望", en: "Memory: Craving", zh: "记忆：渴望", ko: "기억: 갈망" },
    trigger: {
      ja: "強靱度ダメージが増加した味方の攻撃カード発動時、",
      en: "When an allied Attack card with increased Toughness damage activates, ",
      zh: "强化韧性伤害的友方攻击卡发动时，",
      ko: "강인도 피해가 증가한 아군 공격 카드 발동 시,",
    },
  },
  {
    id: "kingdom",
    name: { ja: "記憶：王国", en: "Memory: Kingdom", zh: "记忆：王国", ko: "기억: 왕국" },
    trigger: {
      ja: "1ターンの間、基本コストが3以上の味方の攻撃カード2回発動時、",
      en: "For 1 turn, when allied Attack cards with a base cost of 3 or more activate twice, ",
      zh: "1回合内，基础费用为3以上的友方攻击卡发动2次时，",
      ko: "1턴 동안, 기본 비용이 3 이상인 아군 공격 카드가 2회 발동 시,",
    },
  },
  {
    id: "golden",
    name: { ja: "記憶：金色", en: "Memory: Golden", zh: "记忆：金色", ko: "기억: 금빛" },
    trigger: {
      ja: "1ターンの間、発動した味方の攻撃カードの合計コストが8以上の場合、",
      en: "For 1 turn, when the total cost of activated allied Attack cards is 8 or more, ",
      zh: "1回合内，发动的友方攻击卡总费用达到8以上时，",
      ko: "1턴 동안, 발동한 아군 공격 카드의 총 비용이 8 이상일 경우,",
    },
  },
  {
    id: "resentment",
    name: { ja: "記憶：恨み", en: "Memory: Resentment", zh: "记忆：怨恨", ko: "기억: 원한" },
    trigger: {
      ja: "1ターンの間、味方の攻撃カード3枚破棄時、",
      en: "For 1 turn, when 3 allied Attack cards are discarded, ",
      zh: "1回合内，弃置3张友方攻击卡时，",
      ko: "1턴 동안, 아군 공격 카드 3장이 버려질 시,",
    },
  },
  {
    id: "woman",
    name: { ja: "記憶：女性", en: "Memory: Woman", zh: "记忆：女性", ko: "기억: 여성" },
    trigger: {
      ja: "1ターンの間、味方の迅速攻撃カード3回発動時、",
      en: "For 1 turn, when allied Haste Attack cards activate 3 times, ",
      zh: "1回合内，友方迅捷攻击卡发动3次时，",
      ko: "1턴 동안, 아군 신속 공격 카드가 3회 발동 시,",
    },
  },
  {
    id: "greed",
    name: { ja: "記憶：貪欲", en: "Memory: Greed", zh: "记忆：贪婪", ko: "기억: 탐욕" },
    trigger: {
      ja: "1ターンの間、味方の攻撃カードで3回全体攻撃時、",
      en: "For 1 turn, when allied Attack cards perform AoE attacks 3 times, ",
      zh: "1回合内，友方攻击卡进行3次全体攻击时，",
      ko: "1턴 동안, 아군 공격 카드로 전체 공격을 3회 할 시,",
    },
  },
  {
    id: "kaleidoscope",
    name: { ja: "記憶：万華鏡", en: "Memory: Kaleidoscope", zh: "记忆：万花筒", ko: "기억: 만화경" },
    trigger: {
      ja: "1ターンの間、味方の持続ダメージ効果3回発動時、",
      en: "For 1 turn, when allied damage-over-time effects activate 3 times, ",
      zh: "1回合内，友方持续伤害效果发动3次时，",
      ko: "1턴 동안, 아군 지속 피해 효과가 3회 발동 시,",
    },
  },
  {
    id: "loss",
    name: { ja: "記憶：喪失", en: "Memory: Loss", zh: "记忆：丧失", ko: "기억: 상실" },
    trigger: {
      ja: "味方のスキルカード重複時、",
      en: "When an allied Skill card is duplicated, ",
      zh: "友方技能卡重复时，",
      ko: "아군 스킬 카드가 중복될 시,",
    },
    additionalEffect: {
      ja: "自分の正義属性攻撃カードダメージ量25%増加",
      en: "Your Justice Attack card damage increases by 25%.",
      zh: "自身正义属性攻击卡伤害量增加25%。",
      ko: "자신의 정의 속성 공격 카드 피해량 25% 증가",
    },
  },
  {
    id: "coercion",
    name: { ja: "記憶：強要", en: "Memory: Coercion", zh: "记忆：强迫", ko: "기억: 강요" },
    trigger: {
      ja: "味方の基本カード重複時、",
      en: "When an allied Basic card is duplicated, ",
      zh: "友方基础卡重复时，",
      ko: "아군 기본 카드가 중복될 시,",
    },
    additionalEffect: {
      ja: "味方のダメージ量15%増加",
      en: "Allies' damage increases by 15%.",
      zh: "友方伤害量增加15%。",
      ko: "아군 피해량 15% 증가",
    },
  },
];

const effectFamilies = [
  {
    id: "self_attack",
    amounts: [7, 8, 9, 10],
    format: {
      ja: (amount: number) => `自分の攻撃力+${amount}%`,
      en: (amount: number) => `your Attack increases by ${amount}%`,
      zh: (amount: number) => `自身攻击力+${amount}%`,
      ko: (amount: number) => `자신의 공격력+${amount}%`,
    },
  },
  {
    id: "self_damage",
    amounts: [9, 11, 13, 15],
    format: {
      ja: (amount: number) => `自分のダメージ量${amount}%増加`,
      en: (amount: number) => `your damage increases by ${amount}%`,
      zh: (amount: number) => `自身伤害量增加${amount}%`,
      ko: (amount: number) => `자신의 피해량 ${amount}% 증가`,
    },
  },
  {
    id: "allied_attack",
    amounts: [3, 4, 5, 6],
    format: {
      ja: (amount: number) => `味方の攻撃力+${amount}%`,
      en: (amount: number) => `allies' Attack increases by ${amount}%`,
      zh: (amount: number) => `友方攻击力+${amount}%`,
      ko: (amount: number) => `아군의 공격력+${amount}%`,
    },
  },
  {
    id: "allied_damage",
    amounts: [5, 6, 7, 8],
    format: {
      ja: (amount: number) => `味方のダメージ量${amount}%増加`,
      en: (amount: number) => `allies' damage increases by ${amount}%`,
      zh: (amount: number) => `友方伤害量增加${amount}%`,
      ko: (amount: number) => `아군 피해량 ${amount}% 증가`,
    },
  },
] as const;

const memorySuffix: LocalizedText = {
  ja: "(各ターン1回、各戦闘2回)",
  en: "(once per turn, twice per battle)",
  zh: "（每回合1次，每场战斗2次）",
  ko: "(턴당 1회, 전투당 2회)",
};

const memoryDescription = (
  theme: MemoryTheme,
  effect: (typeof effectFamilies)[number],
  level: number,
  locale: Locale,
): string => {
  const amount = effect.amounts[level - 1];
  const mainEffect = `${effect.format[locale](amount)}${memorySuffix[locale]}`;
  const additionalEffect = theme.additionalEffect?.[locale];
  return `${theme.trigger[locale]}${mainEffect}${additionalEffect ? ` ${additionalEffect}` : ""}`;
};

export const SEASON5_SHARED_CARDS: CznCard[] = sharedCardDefinitions.map((definition) => ({
  id: definition.id,
  name: definition.name.ja,
  type: CardType.SHARED,
  category: definition.category,
  statuses: definition.statuses,
  allowedJobs: "all",
  imgUrl: "/images/cards/card_placeholder.png",
  hiramekiVariations: [{ level: 0, cost: definition.cost, description: definition.description.ja }],
}));

export const SEASON5_MEMORY_CARDS: CznCard[] = memoryThemes.flatMap((theme) =>
  effectFamilies.map((effect) => {
    const descriptions = [1, 2, 3, 4].map((level) =>
      memoryDescription(theme, effect, level, "ja"),
    );
    const memoryLevelVariations: MemoryLevelVariation[] = descriptions.map((description, index) => ({
      level: (index + 1) as MemoryLevelVariation["level"],
      cost: 0,
      description,
    }));

    return {
      id: `season5_memory_${theme.id}_${effect.id}`,
      name: theme.name.ja,
      type: CardType.SHARED,
      category: CardCategory.UPGRADE,
      statuses: [CardStatus.MEMORY, CardStatus.PREMIERE],
      allowedJobs: "all",
      imgUrl: "/images/cards/card_placeholder.png",
      isMemoryCard: true,
      memoryLevelVariations,
      hiramekiVariations: [
        { level: 0, cost: 0, description: memoryLevelVariations[0].description },
      ],
    };
  }),
);

export const SEASON5_CARD_TRANSLATIONS: Record<
  Locale,
  Record<string, { name: string; descriptions: Record<string, string> }>
> = {
  ja: {},
  en: {},
  zh: {},
  ko: {},
};

for (const definition of sharedCardDefinitions) {
  for (const locale of Object.keys(SEASON5_CARD_TRANSLATIONS) as Locale[]) {
    SEASON5_CARD_TRANSLATIONS[locale][definition.id] = {
      name: definition.name[locale],
      descriptions: { "0": definition.description[locale] },
    };
  }
}

for (const theme of memoryThemes) {
  for (const effect of effectFamilies) {
    const id = `season5_memory_${theme.id}_${effect.id}`;
    for (const locale of Object.keys(SEASON5_CARD_TRANSLATIONS) as Locale[]) {
      SEASON5_CARD_TRANSLATIONS[locale][id] = {
        name: theme.name[locale],
        descriptions: Object.fromEntries(
          [1, 2, 3, 4].map((level) => [level, memoryDescription(theme, effect, level, locale)]),
        ),
      };
    }
  }
}
