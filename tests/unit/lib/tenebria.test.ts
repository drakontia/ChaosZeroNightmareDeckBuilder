import { describe, it, expect } from "vitest";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_CARDS } from "@/lib/character-cards";

describe("Tenebria character", () => {
  it("CardStatus has PREMIERE defined", () => {
    expect(CardStatus.PREMIERE).toBe("premiere");
  });

  it("tenebria exists in CHARACTERS", () => {
    const char = CHARACTERS.find((c) => c.id === "tenebria");
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.PSIONIC);
    expect(char?.element).toBe(ElementType.PASSION);
    expect(char?.rarity).toBe("★5");
  });

  it("tenebria has 4 starting cards and 4 hirameki cards", () => {
    const char = CHARACTERS.find((c) => c.id === "tenebria");
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  describe("starting cards", () => {
    const startingIds = [
      "tenebria_starting_1",
      "tenebria_starting_2",
      "tenebria_starting_3",
      "tenebria_starting_4",
    ];

    it.each(startingIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    });

    it.each([
      { id: "tenebria_starting_1", name: "サウンドチェック", category: CardCategory.ATTACK, description: "ダメージ100%" },
      { id: "tenebria_starting_2", name: "サウンドチェック", category: CardCategory.ATTACK, description: "ダメージ100%" },
      { id: "tenebria_starting_3", name: "ファンサービス", category: CardCategory.SKILL, description: "治癒100%" },
    ])("$id has expected basic card info", ({ id, name, category, description }) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card?.name).toBe(name);
      expect(card?.category).toBe(category);
      expect(card?.isBasicCard).toBe(true);
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0]).toMatchObject({
        level: 0,
        cost: 1,
        description,
      });
    });

    it("ミュージックスタート is non-basic and has Lv5 variation", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebria_starting_4");
      expect(card?.isBasicCard).toBe(false);
      const lv5 = card?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv5).toBeDefined();
    });
  });

  describe("hirameki cards", () => {
    const hiramekiIds = [
      "tenebria_hirameki_1",
      "tenebria_hirameki_2",
      "tenebria_hirameki_3",
      "tenebria_hirameki_4",
    ];

    it.each(hiramekiIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    });

    it("コール&レスポンス has HASTE status", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebria_hirameki_2");
      expect(card?.statuses).toContain(CardStatus.HASTE);
    });

    it("フォトタイム is a no-hirameki card (Lv0 only)", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "tenebria_hirameki_4");
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0].level).toBe(0);
    });
  });
});
