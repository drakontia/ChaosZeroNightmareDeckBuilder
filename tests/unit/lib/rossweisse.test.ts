import { describe, expect, it } from "vite-plus/test";
import { CardCategory, CardStatus, CardType, ElementType, JobType } from "@/types";
import { CHARACTER_CARDS } from "@/lib/character-cards";
import { CHARACTERS } from "@/lib/characters";
import enCards from "@/messages/en/cards.json";
import jaCards from "@/messages/ja/cards.json";
import koCards from "@/messages/ko/cards.json";
import zhCards from "@/messages/zh/cards.json";
import enCommon from "@/messages/en/common.json";
import jaCommon from "@/messages/ja/common.json";
import koCommon from "@/messages/ko/common.json";
import zhCommon from "@/messages/zh/common.json";

describe("Rossweisse character", () => {
  const cardIds = [
    "rossweisse_starting_1",
    "rossweisse_starting_2",
    "rossweisse_starting_3",
    "rossweisse_starting_4",
    "rossweisse_hirameki_1",
    "rossweisse_hirameki_2",
    "rossweisse_hirameki_3",
    "rossweisse_hirameki_4",
  ] as const;

  it("exists as a 4-star Striker of Justice", () => {
    const character = CHARACTERS.find((entry) => entry.id === "rossweisse");

    expect(character).toBeDefined();
    expect(character?.rarity).toBe("★5");
    expect(character?.job).toBe(JobType.STRIKER);
    expect(character?.element).toBe(ElementType.JUSTICE);
    expect(character?.imgUrl).toBe("/images/characters/character_rossweisse.png");
    expect(character?.startingCards).toHaveLength(4);
    expect(character?.hiramekiCards).toHaveLength(4);
  });

  it("defines and uses 明暗 (Equilux) as a card status", () => {
    const card = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_starting_4");

    expect(CardStatus.EQUILUX).toBe("equilux");
    expect(card?.statuses).toContain(CardStatus.EQUILUX);
    expect(card?.hiramekiVariations.every((variation) => variation.statuses?.includes(CardStatus.EQUILUX))).toBe(
      true,
    );
  });

  it("has names and all card translation keys in every locale", () => {
    expect(jaCommon.status.equilux).toBe("明暗");
    expect(enCommon.status.equilux).toBe("Equilux");
    expect(zhCommon.status.equilux).toBeTruthy();
    expect(koCommon.status.equilux).toBeTruthy();

    for (const common of [jaCommon, enCommon, zhCommon, koCommon]) {
      expect(common.character.rossweisse).toBeTruthy();
    }

    for (const messages of [jaCards, enCards, zhCards, koCards]) {
      const localeCardIds = Object.keys(messages.cards).filter((id) =>
        id.startsWith("rossweisse_"),
      );

      expect(localeCardIds).toHaveLength(cardIds.length);
      for (const id of cardIds) {
        const card = CHARACTER_CARDS.find((entry) => entry.id === id);
        const translation = messages.cards[id];

        expect(card).toBeDefined();
        if (!card) continue;

        expect(translation.name).toBeTruthy();
        expect(translation.descriptions).toMatchObject(
          Object.fromEntries(
            card.hiramekiVariations.map(({ level, description }) => [level, description]),
          ),
        );
      }
    }
  });

  it("keeps status labels out of descriptions because statuses are displayed separately", () => {
    for (const id of cardIds) {
      const card = CHARACTER_CARDS.find((entry) => entry.id === id);

      expect(card).toBeDefined();
      for (const variation of card?.hiramekiVariations ?? []) {
        expect(variation.description).not.toMatch(/^\[(?:明暗|唯一|終極|粉砕|開戦)/);
      }
    }
  });

  describe("starting cards", () => {
    it.each([
      ["rossweisse_starting_1", "rossweisse_starting_1"],
      ["rossweisse_starting_2", "rossweisse_starting_1"],
      ["rossweisse_starting_3", "rossweisse_starting_3"],
      ["rossweisse_starting_4", "rossweisse_starting_4"],
    ])("%s is registered as a starting character card", (id, imageId) => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === id);

      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
      expect(card?.imgUrl).toBe(`/images/cards/character/${imageId}.png`);
    });

    it("registers the two basic attacks and basic shield card", () => {
      const first = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_starting_1");
      const second = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_starting_2");
      const third = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_starting_3");

      expect(first?.category).toBe(CardCategory.ATTACK);
      expect(first?.isBasicCard).toBe(true);
      expect(first?.hiramekiVariations[0]).toMatchObject({ level: 0, cost: 1 });
      expect(second?.category).toBe(CardCategory.ATTACK);
      expect(second?.isBasicCard).toBe(true);
      expect(third?.category).toBe(CardCategory.SKILL);
      expect(third?.isBasicCard).toBe(true);
      expect(third?.hiramekiVariations[0]?.description).toBe("シールド100%");
    });

    it("has the base card and five specified hirameki variations for 明滅の剣", () => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_starting_4");

      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.isBasicCard).toBe(false);
      expect(card?.statuses).toContain(CardStatus.UNIQUE);
      expect(card?.hiramekiVariations).toHaveLength(6);
      expect(card?.hiramekiVariations.map(({ cost }) => cost)).toEqual([0, 0, 0, 0, 0, "X"]);
      expect(card?.hiramekiVariations[5]?.statuses).toContain(CardStatus.FINALE);
      expect(card?.hiramekiVariations[5]?.description).toContain("基本ダメージ量+120%");
    });
  });

  describe("hirameki cards", () => {
    it.each([
      "rossweisse_hirameki_1",
      "rossweisse_hirameki_2",
      "rossweisse_hirameki_3",
      "rossweisse_hirameki_4",
    ])("%s is registered as a character card", (id) => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === id);

      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(false);
      expect(card?.imgUrl).toBe(`/images/cards/character/${id}.png`);
    });

    it("registers the five specified 剣の共鳴 variations", () => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_hirameki_1");

      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.hiramekiVariations).toHaveLength(6);
      expect(card?.hiramekiVariations[3]?.statuses).toContain(CardStatus.UNIQUE);
      expect(card?.hiramekiVariations[4]?.description).toContain("粉砕");
    });

    it("registers the attack variations and statuses for 光の剣筋", () => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_hirameki_2");

      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.hiramekiVariations[2]?.cost).toBe(0);
      expect(card?.hiramekiVariations[4]?.statuses).toContain(CardStatus.UNIQUE);
      expect(card?.hiramekiVariations[5]?.statuses).toContain(CardStatus.UNIQUE);
    });

    it("registers 粉砕 on the final 循環の刃 variation", () => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_hirameki_3");

      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.hiramekiVariations).toHaveLength(6);
      expect(card?.hiramekiVariations[5]?.cost).toBe(2);
      expect(card?.hiramekiVariations[5]?.statuses).toContain(CardStatus.PULVERIZE);
    });

    it("registers キルケンの使徒 as a unique opening skill without hirameki", () => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === "rossweisse_hirameki_4");

      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.statuses).toEqual([CardStatus.UNIQUE, CardStatus.INITIATION]);
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0]).toMatchObject({ level: 0, cost: 0 });
    });
  });
});
