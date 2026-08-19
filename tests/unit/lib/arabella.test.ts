import { describe, expect, it } from "vitest";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_CARDS } from "@/lib/character-cards";

describe("Arabella character", () => {
  it("arabella exists in CHARACTERS", () => {
    const char = CHARACTERS.find((c) => c.id === "arabella");
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.STRIKER);
    expect(char?.element).toBe(ElementType.INSTINCT);
    expect(char?.rarity).toBe("★5");
  });

  it("arabella has 4 starting cards and 4 hirameki cards", () => {
    const char = CHARACTERS.find((c) => c.id === "arabella");
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  it("all arabella cards exist in CHARACTER_CARDS", () => {
    const ids = [
      "arabella_starting_1",
      "arabella_starting_2",
      "arabella_starting_3",
      "arabella_starting_4",
      "arabella_hirameki_1",
      "arabella_hirameki_2",
      "arabella_hirameki_3",
      "arabella_hirameki_4",
    ];

    for (const id of ids) {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card, `${id} should exist`).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    }
  });

  it("scream card has LEAD status and 6 variations", () => {
    const card = CHARACTER_CARDS.find((c) => c.id === "arabella_starting_4");
    expect(card?.category).toBe(CardCategory.ATTACK);
    expect(card?.statuses).toContain(CardStatus.LEAD);
    expect(card?.hiramekiVariations).toHaveLength(6);
  });

  it("observation game is UNIQUE upgrade card", () => {
    const card = CHARACTER_CARDS.find((c) => c.id === "arabella_hirameki_1");
    expect(card?.category).toBe(CardCategory.UPGRADE);
    expect(card?.statuses).toContain(CardStatus.UNIQUE);
  });

  it("aesthetics of dismantling is UNIQUE and Lv0 only", () => {
    const card = CHARACTER_CARDS.find((c) => c.id === "arabella_hirameki_4");
    expect(card?.statuses).toContain(CardStatus.UNIQUE);
    expect(card?.hiramekiVariations).toHaveLength(1);
    expect(card?.hiramekiVariations[0].level).toBe(0);
  });
});
