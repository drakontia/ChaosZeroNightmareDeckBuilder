import { describe, it, expect } from "vitest";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";
import { CHARACTERS } from "@/lib/characters";
import { CHARACTER_CARDS } from "@/lib/character-cards";

describe("Fei character", () => {
  it("fei exists in CHARACTERS", () => {
    const char = CHARACTERS.find((c) => c.id === "fei");
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.RANGER);
    expect(char?.element).toBe(ElementType.VOID);
    expect(char?.rarity).toBe("★5");
  });

  it("fei has 4 starting cards and 4 hirameki cards", () => {
    const char = CHARACTERS.find((c) => c.id === "fei");
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  describe("starting cards", () => {
    const startingIds = [
      "fei_starting_1",
      "fei_starting_2",
      "fei_starting_3",
      "fei_starting_4",
    ];

    it.each(startingIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    });

    it("fei_starting_1 and fei_starting_2 are basic ATTACK cards (蒼炎)", () => {
      const card1 = CHARACTER_CARDS.find((c) => c.id === "fei_starting_1");
      const card2 = CHARACTER_CARDS.find((c) => c.id === "fei_starting_2");
      expect(card1?.name).toBe("蒼炎");
      expect(card2?.name).toBe("蒼炎");
      expect(card1?.category).toBe(CardCategory.ATTACK);
      expect(card2?.category).toBe(CardCategory.ATTACK);
      expect(card1?.isBasicCard).toBe(true);
      expect(card2?.isBasicCard).toBe(true);
    });

    it("fei_starting_3 is basic SKILL card (憂愁)", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "fei_starting_3");
      expect(card?.name).toBe("憂愁");
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.isBasicCard).toBe(true);
    });

    it("fei_starting_4 is 退魔の形勢 with 開戦/唯一 and has Lv5 variation", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "fei_starting_4");
      expect(card?.name).toBe("退魔の形勢");
      expect(card?.category).toBe(CardCategory.UPGRADE);
      expect(card?.isBasicCard).toBe(false);
      expect(card?.statuses).toContain(CardStatus.INITIATION);
      expect(card?.statuses).toContain(CardStatus.UNIQUE);
      const lv5 = card?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv5).toBeDefined();
    });
  });

  describe("hirameki cards", () => {
    const hiramekiIds = [
      "fei_hirameki_1",
      "fei_hirameki_2",
      "fei_hirameki_3",
      "fei_hirameki_4",
    ];

    it.each(hiramekiIds)("%s exists in CHARACTER_CARDS", (id) => {
      const card = CHARACTER_CARDS.find((c) => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    });

    it("fei_hirameki_1 is 独舞 and has Lv5 variation", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "fei_hirameki_1");
      expect(card?.name).toBe("独舞");
      expect(card?.category).toBe(CardCategory.SKILL);
      const lv5 = card?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv5).toBeDefined();
    });

    it("fei_hirameki_2 is 常夜の雨 and has Lv5 variation", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "fei_hirameki_2");
      expect(card?.name).toBe("常夜の雨");
      expect(card?.category).toBe(CardCategory.SKILL);
      const lv5 = card?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv5).toBeDefined();
    });

    it("fei_hirameki_3 is 魂焔舞 and Lv5 becomes UPGRADE", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "fei_hirameki_3");
      expect(card?.name).toBe("魂焔舞");
      expect(card?.category).toBe(CardCategory.ATTACK);
      const lv5 = card?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv5).toBeDefined();
      expect(lv5?.category).toBe(CardCategory.UPGRADE);
      expect(lv5?.statuses).toContain(CardStatus.UNIQUE);
    });

    it("fei_hirameki_4 is 炎舞舞曲 SKILL with 消滅/唯一", () => {
      const card = CHARACTER_CARDS.find((c) => c.id === "fei_hirameki_4");
      expect(card?.name).toBe("炎舞舞曲");
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.statuses).toContain(CardStatus.EXHAUST);
      expect(card?.statuses).toContain(CardStatus.UNIQUE);
    });
  });
});
