import { describe, it, expect } from "vitest";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_CARDS } from "@/lib/character-cards";

describe("Tenebrea character", () => {
  it("CardStatus has PREMIERE defined", () => {
    expect(CardStatus.PREMIERE).toBe("premiere");
  });

  it("tenebrea exists in CHARACTERS", () => {
    const char = CHARACTERS.find((c) => c.id === "tenebrea");
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.PSIONIC);
    expect(char?.element).toBe(ElementType.PASSION);
    expect(char?.rarity).toBe("★5");
  });

  it("tenebrea has 4 starting cards and 4 hirameki cards", () => {
    const char = CHARACTERS.find((c) => c.id === "tenebrea");
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  describe("starting cards", () => {
    const startingIds = [
      "tenebrea_starting_1",
      "tenebrea_starting_2",
      "tenebrea_starting_3",
      "tenebrea_starting_4",
    ];

    it.each(startingIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    });

    it("tenebrea_starting_1 is basic ATTACK card", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebrea_starting_1");
      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.isBasicCard).toBe(true);
    });

    it("tenebrea_starting_3 is basic SKILL card", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebrea_starting_3");
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.isBasicCard).toBe(true);
    });

    it("ミュージックスタート is non-basic and has Lv5 variation", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebrea_starting_4");
      expect(card?.isBasicCard).toBe(false);
      const lv5 = card?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv5).toBeDefined();
    });
  });

  describe("hirameki cards", () => {
    const hiramekiIds = [
      "tenebrea_hirameki_1",
      "tenebrea_hirameki_2",
      "tenebrea_hirameki_3",
      "tenebrea_hirameki_4",
    ];

    it.each(hiramekiIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    });

    it("コール&レスポンス has HASTE status", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebrea_hirameki_2");
      expect(card?.statuses).toContain(CardStatus.HASTE);
    });

    it("フォトタイム is a no-hirameki card (Lv0 only)", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebrea_hirameki_4");
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0].level).toBe(0);
    });
  });
});
