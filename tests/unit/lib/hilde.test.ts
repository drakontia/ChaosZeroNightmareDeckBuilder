import { describe, it, expect } from "vite-plus/test";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_CARDS } from "@/lib/character-cards";

describe("Hilde character", () => {
  it("hilde exists in CHARACTERS", () => {
    const char = CHARACTERS.find((c) => c.id === "hilde");
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.RANGER);
    expect(char?.element).toBe(ElementType.INSTINCT);
    expect(char?.rarity).toBe("★5");
  });

  it("hilde has 4 starting cards and 4 hirameki cards", () => {
    const char = CHARACTERS.find((c) => c.id === "hilde");
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  describe("starting cards", () => {
    const startingIds = [
      "hilde_starting_1",
      "hilde_starting_2",
      "hilde_starting_3",
      "hilde_starting_4",
    ];

    it.each(startingIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    });

    it("hilde_starting_1 is basic ATTACK card", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "hilde_starting_1");
      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.isBasicCard).toBe(true);
    });

    it("quiver lord Lv2/Lv3 text is registered", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "hilde_starting_4");
      const lv2 = card?.hiramekiVariations.find((v) => v.level === 2);
      const lv3 = card?.hiramekiVariations.find((v) => v.level === 3);
      expect(lv2?.description).toBe("山札にホーミングアロー(亀裂)を3枚生成");
      expect(lv3?.description).toBe("山札にホーミングアロー(特大)を1枚生成");
    });
  });

  describe("hirameki cards", () => {
    const hiramekiIds = [
      "hilde_hirameki_1",
      "hilde_hirameki_2",
      "hilde_hirameki_3",
      "hilde_hirameki_4",
    ];

    it.each(hiramekiIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    });

    it("vortex arrow is ATTACK with UNIQUE status and has only Lv0", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "hilde_hirameki_4");
      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.statuses).toContain(CardStatus.UNIQUE);
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0].description).toContain("ダメージ120%");
    });
  });
});
