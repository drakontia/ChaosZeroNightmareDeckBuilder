import { describe, expect, it } from "vite-plus/test";
import { CHARACTER_CARDS } from "@/lib/character-cards";
import { CHARACTERS } from "@/lib/characters";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";

describe("Anika character", () => {
  it("exists in CHARACTERS as a ★4 STRIKER of ORDER", () => {
    const character = CHARACTERS.find((item) => item.id === "anika");

    expect(character).toBeDefined();
    expect(character?.rarity).toBe("★4");
    expect(character?.job).toBe(JobType.STRIKER);
    expect(character?.element).toBe(ElementType.ORDER);
  });

  it("has four starting cards and four hirameki cards", () => {
    const character = CHARACTERS.find((item) => item.id === "anika");

    expect(character?.startingCards).toEqual([
      "anika_starting_1",
      "anika_starting_2",
      "anika_starting_3",
      "anika_starting_4",
    ]);
    expect(character?.hiramekiCards).toEqual([
      "anika_hirameki_1",
      "anika_hirameki_2",
      "anika_hirameki_3",
      "anika_hirameki_4",
    ]);
  });

  it.each([
    "anika_starting_1",
    "anika_starting_2",
    "anika_starting_3",
    "anika_starting_4",
    "anika_hirameki_1",
    "anika_hirameki_2",
    "anika_hirameki_3",
    "anika_hirameki_4",
  ])("%s is a character card", (id) => {
    const card = CHARACTER_CARDS.find((item) => item.id === id);

    expect(card).toBeDefined();
    expect(card?.type).toBe(CardType.CHARACTER);
  });

  it("marks the first three starting cards as basic cards", () => {
    expect(CHARACTER_CARDS.find((item) => item.id === "anika_starting_1")?.isBasicCard).toBe(true);
    expect(CHARACTER_CARDS.find((item) => item.id === "anika_starting_2")?.isBasicCard).toBe(true);
    expect(CHARACTER_CARDS.find((item) => item.id === "anika_starting_3")?.isBasicCard).toBe(true);
    expect(CHARACTER_CARDS.find((item) => item.id === "anika_starting_4")?.isBasicCard).toBe(false);
    expect(CHARACTER_CARDS.find((item) => item.id === "anika_hirameki_4")?.isBasicCard).toBe(true);
    expect(CHARACTER_CARDS.find((item) => item.id === "anika_hirameki_4")?.hiramekiVariations).toHaveLength(1);
  });

  it("uses the issue-defined categories and base statuses", () => {
    const card = (id: string) => CHARACTER_CARDS.find((item) => item.id === id);

    expect(card("anika_starting_1")?.category).toBe(CardCategory.ATTACK);
    expect(card("anika_starting_3")?.category).toBe(CardCategory.SKILL);
    expect(card("anika_starting_4")?.category).toBe(CardCategory.ATTACK);
    expect(card("anika_starting_4")?.statuses).toContain(CardStatus.LEAD);
    expect(card("anika_hirameki_1")?.statuses).toEqual([CardStatus.BULLET, CardStatus.LEAD]);
    expect(card("anika_hirameki_2")?.statuses).toContain(CardStatus.FINALE);
    expect(card("anika_hirameki_3")?.statuses).toEqual([CardStatus.LEAD, CardStatus.RETAIN]);
    expect(card("anika_hirameki_4")?.statuses).toContain(CardStatus.WEAKNESS_ATTACK);
  });

  it("has six hirameki levels for each non-basic card", () => {
    const cards = CHARACTER_CARDS.filter((item) => item.id.startsWith("anika_") && !item.isBasicCard);

    expect(cards).toHaveLength(4);
    for (const card of cards) {
      expect(card.hiramekiVariations.map((variation) => variation.level)).toEqual([0, 1, 2, 3, 4, 5]);
    }
  });
});
