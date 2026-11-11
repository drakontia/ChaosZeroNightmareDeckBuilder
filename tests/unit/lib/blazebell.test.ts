import { describe, expect, it } from "vite-plus/test";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_CARDS } from "@/lib/character-cards";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";

describe("Blazebell character", () => {
  it("exists as a 5-star Justice Controller with four starting and hirameki cards", () => {
    const character = CHARACTERS.find((entry) => entry.id === "blazebell");

    expect(character).toMatchObject({
      job: JobType.CONTROLLER,
      element: ElementType.JUSTICE,
      rarity: "★5",
    });
    expect(character?.startingCards).toEqual([
      "blazebell_starting_1",
      "blazebell_starting_2",
      "blazebell_starting_3",
      "blazebell_starting_4",
    ]);
    expect(character?.hiramekiCards).toEqual([
      "blazebell_hirameki_1",
      "blazebell_hirameki_2",
      "blazebell_hirameki_3",
      "blazebell_hirameki_4",
    ]);
  });

  it("registers all eight character cards with the expected starting-card flags", () => {
    const character = CHARACTERS.find((entry) => entry.id === "blazebell");

    for (const id of character?.startingCards ?? []) {
      const card = CHARACTER_CARDS.find((entry) => entry.id === id);
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    }

    for (const id of character?.hiramekiCards ?? []) {
      const card = CHARACTER_CARDS.find((entry) => entry.id === id);
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(false);
    }
  });

  it("keeps bracketed statuses separate from card descriptions", () => {
    const cards = CHARACTER_CARDS.filter((card) => card.id.startsWith("blazebell_"));

    expect(cards).toHaveLength(8);
    expect(
      cards.every((card) =>
        card.hiramekiVariations.every((variation) => !/[［］[\]]/.test(variation.description)),
      ),
    ).toBe(true);

    const azureFlame = CHARACTER_CARDS.find((card) => card.id === "blazebell_starting_2");
    expect(azureFlame?.statuses).toContain(CardStatus.BIND);

    const scatteringFlame = CHARACTER_CARDS.find((card) => card.id === "blazebell_starting_4");
    expect(
      scatteringFlame?.hiramekiVariations.find((variation) => variation.level === 1)?.statuses,
    ).toEqual([CardStatus.UNIQUE, CardStatus.RETAIN]);

    const beckoningFlame = CHARACTER_CARDS.find((card) => card.id === "blazebell_hirameki_1");
    expect(
      beckoningFlame?.hiramekiVariations.find((variation) => variation.level === 5)?.statuses,
    ).toEqual([CardStatus.UNIQUE, CardStatus.INITIATION]);

    const resonance = CHARACTER_CARDS.find((card) => card.id === "blazebell_hirameki_3");
    expect(resonance?.statuses).toEqual([CardStatus.UNIQUE, CardStatus.INITIATION]);
  });

  it("uses the confirmed card categories and hirameki levels", () => {
    const card = (id: string) => CHARACTER_CARDS.find((entry) => entry.id === id);

    expect(card("blazebell_starting_1")?.category).toBe(CardCategory.ATTACK);
    expect(card("blazebell_starting_2")?.category).toBe(CardCategory.SKILL);
    expect(card("blazebell_starting_3")?.category).toBe(CardCategory.SKILL);
    expect(card("blazebell_starting_1")?.isBasicCard).toBe(true);
    expect(card("blazebell_starting_2")?.isBasicCard).toBe(true);
    expect(card("blazebell_starting_3")?.isBasicCard).toBe(true);
    expect(card("blazebell_starting_4")?.isBasicCard).toBe(false);
    expect(card("blazebell_starting_4")?.hiramekiVariations).toHaveLength(6);
    expect(card("blazebell_hirameki_1")?.category).toBe(CardCategory.ATTACK);
    expect(card("blazebell_hirameki_1")?.hiramekiVariations).toHaveLength(6);
    expect(
      card("blazebell_hirameki_1")?.hiramekiVariations.find((variation) => variation.level === 5)
        ?.category,
    ).toBe(CardCategory.UPGRADE);
    expect(card("blazebell_hirameki_2")?.category).toBe(CardCategory.SKILL);
    expect(card("blazebell_hirameki_2")?.hiramekiVariations).toHaveLength(6);
    const resonance = card("blazebell_hirameki_3");
    expect(resonance?.category).toBe(CardCategory.UPGRADE);
    expect(resonance?.hiramekiVariations).toHaveLength(6);
    expect(
      resonance?.hiramekiVariations.map((variation) => variation.category ?? resonance.category),
    ).toEqual(Array(6).fill(CardCategory.UPGRADE));
    expect(card("blazebell_hirameki_4")?.category).toBe(CardCategory.UPGRADE);
    expect(card("blazebell_hirameki_4")?.hiramekiVariations).toHaveLength(1);
    expect(
      card("blazebell_hirameki_1")?.hiramekiVariations.map((variation) => variation.cost),
    ).toEqual([1, 1, 1, 1, 0, 1]);
    expect(
      card("blazebell_hirameki_2")?.hiramekiVariations.map((variation) => variation.cost),
    ).toEqual([1, 1, 0, 1, 1, 1]);
    expect(
      card("blazebell_hirameki_3")?.hiramekiVariations.map((variation) => variation.cost),
    ).toEqual([2, 3, 1, 1, 1, 2]);
  });
});
