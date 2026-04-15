import { CardStatus, JobType, PersonaEngraving, PersonaEngravingAlignment } from "@/types";

export const VALID_PERSONA_ENGRAVING_ALIGNMENTS: ReadonlySet<PersonaEngravingAlignment> = new Set(["light", "dark"]);

export interface PersonaEngravingDefinition {
  id: string;
  alignment: PersonaEngravingAlignment;
  description: string;
  descriptionKey: string;
  allowedJobs: JobType[] | "all";
  costModifier?: number;
  statuses?: CardStatus[];
}

export interface PersonaCardPresentationInput {
  baseName: string;
  baseImageUrl: string;
  baseCost: number | "X";
  baseDescription: string;
  baseStatuses: CardStatus[];
  engravings?: PersonaEngraving[];
  localization?: PersonaPresentationLocalization;
}

export interface PersonaCardPresentation {
  name: string;
  imgUrl: string;
  cost: number | "X";
  description: string;
  statuses: CardStatus[];
}

export type PersonaNameVariant = "base" | "light" | "dark" | "radiant" | "abyssal" | "boundary";

export interface PersonaPresentationLocalization {
  getName?: (variant: PersonaNameVariant) => string;
  getEngravingDescription?: (definition: PersonaEngravingDefinition) => string;
}

export const PERSONA_CARD_ENGRAVINGS: PersonaEngravingDefinition[] = [
  {
    id: "lux_haste_discount",
    alignment: "light",
    description: "迅速付与、コスト1増加。行動カウントが1の対象がいる場合、このカードのコスト2減少",
    descriptionKey: "lux_haste_discount",
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD, JobType.RANGER, JobType.HUNTER, JobType.PSIONIC],
    costModifier: 1,
    statuses: [CardStatus.HASTE],
  },
  {
    id: "lux_attunement_discount",
    alignment: "light",
    description: "感応：使用時までコスト1減少",
    descriptionKey: "lux_attunement_discount",
    allowedJobs: "all",
  },
  {
    id: "lux_exhaust_draw",
    alignment: "light",
    description: "消滅付与、コスト1増加。光の刻印5：自分に脆弱3、ドロー3",
    descriptionKey: "lux_exhaust_draw",
    allowedJobs: [JobType.RANGER, JobType.HUNTER, JobType.CONTROLLER],
    costModifier: 1,
    statuses: [CardStatus.EXHAUST],
  },
  {
    id: "lux_counter_by_count",
    alignment: "light",
    description: "光の刻印数に応じて反撃1",
    descriptionKey: "lux_counter_by_count",
    allowedJobs: "all",
  },
  {
    id: "lux_pain_by_count",
    alignment: "light",
    description: "光の刻印数に応じて敵全体に苦痛1",
    descriptionKey: "lux_pain_by_count",
    allowedJobs: "all",
  },
  {
    id: "lux_exhaust2_blessing",
    alignment: "light",
    description: "消滅2付与、コスト1増加。光の加護1",
    descriptionKey: "lux_exhaust2_blessing",
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    costModifier: 1,
    statuses: [CardStatus.EXHAUST2],
  },
  {
    id: "lux_retribution_wave",
    alignment: "light",
    description: "反撃の波動2、光の刻印数に応じて追加獲得",
    descriptionKey: "lux_retribution_wave",
    allowedJobs: [JobType.VANGUARD],
  },
  {
    id: "lux_shield_scale",
    alignment: "light",
    description: "光の刻印数に応じてシールド獲得量20%追加",
    descriptionKey: "lux_shield_scale",
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
  },
  {
    id: "umbra_zero_cost_burst",
    alignment: "dark",
    description: "このカードのコストが0になると、ダメージ量200％増加",
    descriptionKey: "umbra_zero_cost_burst",
    allowedJobs: "all",
  },
  {
    id: "umbra_attack_boost",
    alignment: "dark",
    description: "1ターンの間、自分の攻撃カードのダメージ量30％増加",
    descriptionKey: "umbra_attack_boost",
    allowedJobs: "all",
  },
  {
    id: "umbra_quietus_boost",
    alignment: "dark",
    description: "闇の刻印4：1ターンの間、自分の安息カードのダメージ量+40％",
    descriptionKey: "umbra_quietus_boost",
    allowedJobs: "all",
  },
  {
    id: "umbra_exhaust2_recall_personas",
    alignment: "dark",
    description: "消滅2付与。闇の刻印5：全てのペルソナカードを手札に加える",
    descriptionKey: "umbra_exhaust2_recall_personas",
    allowedJobs: [JobType.RANGER, JobType.HUNTER, JobType.CONTROLLER],
    statuses: [CardStatus.EXHAUST2],
  },
  {
    id: "umbra_discard_trigger",
    alignment: "dark",
    description: "コスト1増加。破棄された場合、このカード発動",
    descriptionKey: "umbra_discard_trigger",
    allowedJobs: "all",
    costModifier: 1,
  },
  {
    id: "umbra_retain_recover_attack",
    alignment: "dark",
    description: "保存付与。捨て札から自分の攻撃カードを1枚選択、そのカードを手札に移動",
    descriptionKey: "umbra_retain_recover_attack",
    allowedJobs: "all",
    statuses: [CardStatus.RETAIN],
  },
  {
    id: "umbra_retain_cost2_hit2",
    alignment: "dark",
    description: "保存付与、コスト2増加。闇の刻印5：全ての攻撃カード破棄、ヒット数2回追加",
    descriptionKey: "umbra_retain_cost2_hit2",
    allowedJobs: "all",
    costModifier: 2,
    statuses: [CardStatus.RETAIN],
  },
  {
    id: "umbra_exhaust_choose_hand",
    alignment: "dark",
    description: "消滅付与。闇の刻印3：手札のカードを1枚選択して発動",
    descriptionKey: "umbra_exhaust_choose_hand",
    allowedJobs: [JobType.HUNTER],
    statuses: [CardStatus.EXHAUST],
  },
  // 追加：光カード刻印
  {
    id: "lux_damage_by_count",
    alignment: "light",
    description: "光の刻印数に応じてダメージ量+30%",
    descriptionKey: "lux_damage_by_count",
    allowedJobs: "all",
  },
  {
    id: "lux_break_cost_down",
    alignment: "light",
    description: "このカードで大破時、コスト1減少",
    descriptionKey: "lux_break_cost_down",
    allowedJobs: "all",
  },
  {
    id: "lux_haste_attunement_cost_vary",
    alignment: "light",
    description: "迅速付与。感応：コストが0～2に変更される",
    descriptionKey: "lux_haste_attunement_cost_vary",
    allowedJobs: "all",
    statuses: [CardStatus.HASTE],
  },
  {
    id: "lux_exhaust_morale_down",
    alignment: "light",
    description: "消滅付与、行動カウント数に応じて1ターンの間、士気1減少(最大5)",
    descriptionKey: "lux_exhaust_morale_down",
    allowedJobs: [JobType.RANGER, JobType.HUNTER, JobType.CONTROLLER],
    statuses: [CardStatus.EXHAUST],
  },
  {
    id: "lux_retain_blessing_by_count",
    alignment: "light",
    description: "保存付与。光の刻印数に応じて光の祝福1",
    descriptionKey: "lux_retain_blessing_by_count",
    allowedJobs: [JobType.RANGER, JobType.CONTROLLER],
    statuses: [CardStatus.RETAIN],
  },
  {
    id: "lux_3_action_count_up",
    alignment: "light",
    description: "光の刻印3：敵全体の行動カウント3増加",
    descriptionKey: "lux_3_action_count_up",
    allowedJobs: [JobType.CONTROLLER],
  },
  {
    id: "lux_cost1_haste_draw2",
    alignment: "light",
    description: "コスト1増加。迅速カードを2枚ドロー",
    descriptionKey: "lux_cost1_haste_draw2",
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    costModifier: 1,
  },
  {
    id: "lux_mark_by_count",
    alignment: "light",
    description: "光の刻印数に応じてランダムな敵に標識1",
    descriptionKey: "lux_mark_by_count",
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
  },
  // 追加：闇カード刻印
  {
    id: "umbra_damage_by_count",
    alignment: "dark",
    description: "闇の刻印に応じてダメージ量+30%",
    descriptionKey: "umbra_damage_by_count",
    allowedJobs: "all",
  },
  {
    id: "umbra_resonance_hit2",
    alignment: "dark",
    description: "対象が共鳴状態の場合、ヒット数2回追加",
    descriptionKey: "umbra_resonance_hit2",
    allowedJobs: "all",
  },
  {
    id: "umbra_haste_discard_cost_down",
    alignment: "dark",
    description: "迅速付与。破棄された場合、このカード使用時までコスト1減少",
    descriptionKey: "umbra_haste_discard_cost_down",
    allowedJobs: "all",
    statuses: [CardStatus.HASTE],
  },
  {
    id: "umbra_discard_boost_by_count",
    alignment: "dark",
    description: "今回のターンでカードが破棄された場合、闇の刻印数に応じてダメージ量+50%",
    descriptionKey: "umbra_discard_boost_by_count",
    allowedJobs: "all",
  },
  {
    id: "umbra_quietus_discard_by_count",
    alignment: "dark",
    description: "闇の刻印数に応じてランダムな安息カード破棄",
    descriptionKey: "umbra_quietus_discard_by_count",
    allowedJobs: [JobType.RANGER, JobType.HUNTER, JobType.CONTROLLER],
  },
  {
    id: "umbra_attack_draw_resonance",
    alignment: "dark",
    description: "攻撃カードドロー時、闇の刻印数に応じて敵全体に共鳴1",
    descriptionKey: "umbra_attack_draw_resonance",
    allowedJobs: [JobType.RANGER],
  },
  {
    id: "umbra_pain_by_count",
    alignment: "dark",
    description: "闇の刻印に応じて敵全体に苦痛1",
    descriptionKey: "umbra_pain_by_count",
    allowedJobs: [JobType.CONTROLLER],
  },
];

const PERSONA_IMAGE_BY_SIGNATURE: Record<string, string> = {
  none: "/images/cards/persona.png",
  light: "/images/cards/lux_persona.png",
  dark: "/images/cards/umbra_persona.png",
  "light-light": "/images/cards/persona_of_luster.png",
  "dark-dark": "/images/cards/persona_of_obsidian.png",
  "dark-light": "/images/cards/persona_of_boundary.png",
  "light-dark": "/images/cards/persona_of_boundary.png",
};

const PERSONA_NAME_BY_VARIANT: Record<PersonaNameVariant, string> = {
  base: "ペルソナ",
  light: "光のペルソナ",
  dark: "闇のペルソナ",
  radiant: "光輝のペルソナ",
  abyssal: "漆黒のペルソナ",
  boundary: "境界のペルソナ",
};

export const getPersonaNameVariant = (engravings: PersonaEngraving[]): PersonaNameVariant => {
  const alignments = engravings.map((engraving) => engraving.alignment);
  if (alignments.length === 0) return "base";
  if (alignments.length === 1) {
    return alignments[0] === "light" ? "light" : "dark";
  }
  if (alignments[0] === "light" && alignments[1] === "light") return "radiant";
  if (alignments[0] === "dark" && alignments[1] === "dark") return "abyssal";
  return "boundary";
};

const getPersonaName = (engravings: PersonaEngraving[], localization?: PersonaPresentationLocalization): string => {
  const variant = getPersonaNameVariant(engravings);
  return localization?.getName?.(variant) ?? PERSONA_NAME_BY_VARIANT[variant];
};

const getPersonaImageUrl = (engravings: PersonaEngraving[], fallback: string): string => {
  const signature = engravings.length === 0 ? "none" : engravings.map((engraving) => engraving.alignment).join("-");
  return PERSONA_IMAGE_BY_SIGNATURE[signature] ?? fallback;
};

const getPersonaEngravingDefinition = (engraving: PersonaEngraving): PersonaEngravingDefinition | undefined =>
  PERSONA_CARD_ENGRAVINGS.find((definition) => definition.id === engraving.id && definition.alignment === engraving.alignment);

export function normalizePersonaCardEngravings(
  engravings: readonly PersonaEngraving[] | undefined,
  job?: JobType
): PersonaEngraving[] {
  if (!engravings) {
    return [];
  }

  const normalized: PersonaEngraving[] = [];
  for (const engraving of engravings) {
    const definition = getPersonaEngravingDefinition(engraving);
    if (!definition) {
      continue;
    }
    if (job && definition.allowedJobs !== "all" && !definition.allowedJobs.includes(job)) {
      continue;
    }
    if (!normalized.some((candidate) => candidate.id === engraving.id && candidate.alignment === engraving.alignment)) {
      normalized.push({
        id: engraving.id,
        alignment: engraving.alignment,
      });
    }
    if (normalized.length >= 2) {
      break;
    }
  }

  return normalized;
}

export function getPersonaCardPresentation({
  baseName,
  baseImageUrl,
  baseCost,
  baseDescription,
  baseStatuses,
  engravings = [],
  localization,
}: PersonaCardPresentationInput): PersonaCardPresentation {
  if (engravings.length === 0) {
    return {
      name: baseName,
      imgUrl: baseImageUrl,
      cost: baseCost,
      description: baseDescription,
      statuses: baseStatuses,
    };
  }

  let cost = baseCost;
  const descriptions = [baseDescription];
  const statuses = [...baseStatuses];

  for (const engraving of engravings) {
    const definition = getPersonaEngravingDefinition(engraving);
    if (!definition) {
      continue;
    }

    descriptions.push(localization?.getEngravingDescription?.(definition) ?? definition.description);
    if (typeof cost === "number" && definition.costModifier) {
      cost += definition.costModifier;
    }
    for (const status of definition.statuses ?? []) {
      if (!statuses.includes(status)) {
        statuses.push(status);
      }
    }
  }

  return {
    name: getPersonaName(engravings, localization),
    imgUrl: getPersonaImageUrl(engravings, baseImageUrl),
    cost,
    description: descriptions.join("\n"),
    statuses,
  };
}
