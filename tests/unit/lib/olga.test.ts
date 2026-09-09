import { describe, expect, it } from "vite-plus/test";
import { CHARACTER_CARDS } from "@/lib/character-cards";
import { CHARACTERS } from "@/lib/characters";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";

describe("Olga character", () => {
  it("olga exists in CHARACTERS", () => {
    const character = CHARACTERS.find((entry) => entry.id === "olga");

    expect(character).toBeDefined();
    expect(character?.job).toBe(JobType.PSIONIC);
    expect(character?.element).toBe(ElementType.INSTINCT);
    expect(character?.rarity).toBe("★5");
  });

  it("olga has four starting cards and four hirameki cards", () => {
    const character = CHARACTERS.find((entry) => entry.id === "olga");

    expect(character?.startingCards).toEqual([
      "olga_starting_1",
      "olga_starting_2",
      "olga_starting_3",
      "olga_starting_4",
    ]);
    expect(character?.hiramekiCards).toEqual([
      "olga_hirameki_1",
      "olga_hirameki_2",
      "olga_hirameki_3",
      "olga_hirameki_4",
    ]);
  });

  it("has all eight character cards", () => {
    const cardIds = [
      "olga_starting_1",
      "olga_starting_2",
      "olga_starting_3",
      "olga_starting_4",
      "olga_hirameki_1",
      "olga_hirameki_2",
      "olga_hirameki_3",
      "olga_hirameki_4",
    ];

    for (const id of cardIds) {
      const card = CHARACTER_CARDS.find((entry) => entry.id === id);

      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    }
  });

  it("has two basic attack cards and one basic skill card", () => {
    const basicCards = CHARACTER_CARDS.filter(
      (card) => card.id.startsWith("olga_starting_") && card.isBasicCard,
    );

    expect(basicCards).toHaveLength(3);
    expect(basicCards.filter((card) => card.category === CardCategory.ATTACK)).toHaveLength(2);
    expect(basicCards.filter((card) => card.category === CardCategory.SKILL)).toHaveLength(1);
  });

  it("gives hirameki-enabled cards six variations", () => {
    const nonBasicCards = CHARACTER_CARDS.filter(
      (card) => card.id.startsWith("olga_") && !card.isBasicCard,
    );

    expect(nonBasicCards).toHaveLength(5);
    for (const card of nonBasicCards.filter((card) => card.id !== "olga_hirameki_4")) {
      expect(card.hiramekiVariations.map((variation) => variation.level)).toEqual([0, 1, 2, 3, 4, 5]);
    }
    expect(
      nonBasicCards.find((card) => card.id === "olga_hirameki_4")?.hiramekiVariations,
    ).toHaveLength(1);
  });

  it("marks unique effects on the appropriate cards", () => {
    const endlessThirst = CHARACTER_CARDS.find((card) => card.id === "olga_hirameki_3");
    const execution = CHARACTER_CARDS.find((card) => card.id === "olga_hirameki_4");

    expect(endlessThirst?.statuses).toContain(CardStatus.UNIQUE);
    expect(execution?.statuses).toContain(CardStatus.UNIQUE);
    expect(execution?.statuses).toContain(CardStatus.RAPACITY);
    expect(execution?.hiramekiVariations[0].statuses).toBeUndefined();
  });

  it("has the correct statuses and effect descriptions for 分裂と修復 (olga_hirameki_2)", () => {
    const card = CHARACTER_CARDS.find((entry) => entry.id === "olga_hirameki_2");

    expect(card?.category).toBe(CardCategory.SKILL);

    const variations = card?.hiramekiVariations ?? [];
    expect(variations).toEqual([
      { level: 0, cost: 1, description: "苦痛の烙印1\nHPが最も高い敵に苦痛4" },
      { level: 1, cost: 0, description: "苦痛の烙印1\nHPが最も高い敵に苦痛4" },
      { level: 2, cost: 0, description: "亀裂の烙印1\nHPが最も高い敵に亀裂2" },
      {
        level: 3,
        cost: 0,
        description: "亀裂の烙印2\n苦痛の烙印2\nHPが最も高い敵に亀裂3、苦痛6",
        statuses: [CardStatus.EXHAUST],
      },
      {
        level: 4,
        cost: 0,
        description: "断絶の裂け目を1枚手札に移動、\n回収付与",
        statuses: [CardStatus.UNIQUE],
      },
      {
        level: 5,
        cost: 2,
        description: "亀裂の烙印2\n苦痛の烙印2\nターン開始時、\n亀裂の烙印1\nまたは\n苦痛の烙印1",
        statuses: [CardStatus.UNIQUE, CardStatus.INITIATION, CardStatus.LEAD],
        category: CardCategory.UPGRADE,
      },
    ]);
  });
});
