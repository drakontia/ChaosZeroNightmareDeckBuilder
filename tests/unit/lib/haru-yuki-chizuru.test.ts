import { describe, it, expect } from "vite-plus/test";
import { CardStatus, CardCategory, CardType } from "@/types";
import { CHARACTER_CARDS } from "@/lib/character-cards";

// Issue #88: 5月17日アップデートによるハル・ユキ・チズルのカード調整

describe("ハル (Haru) カード調整", () => {
  describe("パワーチャージ (haru_hirameki_2)", () => {
    const getCard = () => CHARACTER_CARDS.find((c) => c.id === "haru_hirameki_2");

    it("exists in CHARACTER_CARDS as ATTACK type", () => {
      const card = getCard();
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.category).toBe(CardCategory.ATTACK);
    });

    it("Lv0: ダメージ240%, 単体対象の場合ダメージ量+100%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 0);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("240%");
      expect(lv?.description).toContain("100%");
    });

    it("Lv1: ダメージ320%, 単体対象の場合ダメージ量+150%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 1);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("320%");
      expect(lv?.description).toContain("150%");
    });

    it("Lv2: [弱点攻撃] ダメージ320%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 2);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("320%");
      expect(lv?.statuses).toContain(CardStatus.WEAKNESS_ATTACK);
    });

    it("Lv4: ダメージ270%, +50%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 4);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("270%");
      expect(lv?.description).toContain("50%");
    });

    it("Lv5: ダメージ320%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("320%");
    });
  });

  describe("エネルギーチャージ (haru_hirameki_3)", () => {
    const getCard = () => CHARACTER_CARDS.find((c) => c.id === "haru_hirameki_3");

    it("exists in CHARACTER_CARDS as SKILL type with RETAIN status", () => {
      const card = getCard();
      expect(card).toBeDefined();
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.statuses).toContain(CardStatus.RETAIN);
    });

    it("Lv0: コスト0, 50%増加", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 0);
      expect(lv).toBeDefined();
      expect(lv?.cost).toBe(0);
      expect(lv?.description).toContain("50%");
    });

    it("Lv1: コスト0, 50%増加, 会心率+20%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 1);
      expect(lv).toBeDefined();
      expect(lv?.cost).toBe(0);
      expect(lv?.description).toContain("50%");
      expect(lv?.description).toContain("会心率");
    });

    it("Lv2: コスト0, 100%増加, 強靭度ダメージ+2", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 2);
      expect(lv).toBeDefined();
      expect(lv?.cost).toBe(0);
      expect(lv?.description).toContain("100%");
      expect(lv?.description).toContain("2");
    });

    it("Lv4: コスト0, 50%増加", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 4);
      expect(lv).toBeDefined();
      expect(lv?.cost).toBe(0);
      expect(lv?.description).toContain("50%");
    });

    it("Lv5: [唯一] 40%増加", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv).toBeDefined();
      expect(lv?.statuses).toContain(CardStatus.UNIQUE);
      expect(lv?.description).toContain("40%");
    });
  });
});

describe("ユキ (Yuki) カード調整", () => {
  describe("盗み斬り (yuki_hirameki_1)", () => {
    const getCard = () => CHARACTER_CARDS.find((c) => c.id === "yuki_hirameki_1");

    it("exists in CHARACTER_CARDS as ATTACK type", () => {
      const card = getCard();
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.category).toBe(CardCategory.ATTACK);
    });

    it("Lv0: 敵全体220%, 単体対象の場合ダメージ量50%増加, インスピレーション：コスト1減少", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 0);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("220%");
      expect(lv?.description).toContain("50%");
      expect(lv?.description).toContain("コスト1減少");
    });

    it("Lv1: 敵全体330%, 単体対象の場合ダメージ量50%増加, インスピレーション：コスト1減少", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 1);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("330%");
      expect(lv?.description).toContain("50%");
      expect(lv?.description).toContain("コスト1減少");
    });

    it("Lv2: 敵全体220%, 単体対象の場合ダメージ量50%増加, インスピレーション：コスト2減少", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 2);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("220%");
      expect(lv?.description).toContain("50%");
      expect(lv?.description).toContain("コスト2減少");
    });

    it("Lv3: 敵全体220%, 単体対象の場合ダメージ量50%増加, インスピレーション：ヒット数1回追加", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 3);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("220%");
      expect(lv?.description).toContain("50%");
      expect(lv?.description).toContain("ヒット数1回追加");
    });

    it("Lv4: [保存] ダメージ400%, +150%(最大5)", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 4);
      expect(lv).toBeDefined();
      expect(lv?.statuses).toContain(CardStatus.RETAIN);
      expect(lv?.description).toContain("400%");
      expect(lv?.description).toContain("+150%");
    });

    it("Lv5: 敵全体360%, コスト1減少, 単体対象の場合ダメージ量50%増加", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("360%");
      expect(lv?.description).toContain("コスト1減少");
      expect(lv?.description).toContain("50%");
    });
  });

  describe("氷山斬り (yuki_hirameki_4)", () => {
    const getCard = () => CHARACTER_CARDS.find((c) => c.id === "yuki_hirameki_4");

    it("exists in CHARACTER_CARDS as ATTACK type", () => {
      const card = getCard();
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.category).toBe(CardCategory.ATTACK);
    });

    it("Lv0: インスピレーション：ヒット数1回追加のみ（ダメージ量20%減少なし）", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 0);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("ヒット数1回追加");
      expect(lv?.description).not.toContain("20%減少");
    });
  });
});

describe("チズル (Chizuru) カード調整", () => {
  describe("業火 (chizuru_starting_4)", () => {
    const getCard = () => CHARACTER_CARDS.find((c) => c.id === "chizuru_starting_4");

    it("exists in CHARACTER_CARDS with INITIATION status", () => {
      const card = getCard();
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.statuses).toContain(CardStatus.INITIATION);
    });

    it("Lv0: ダメージ100%×2, 呪縛術：ヒット数1回追加（×2, ヒット数2回ではない）", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 0);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("100%×2");
      expect(lv?.description).toContain("ヒット数1回追加");
      expect(lv?.description).not.toContain("ヒット数2回追加");
    });

    it("Lv1: ダメージ150%×2, 呪縛術：ヒット数1回追加（×2, ヒット数2回ではない）", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 1);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("150%×2");
      expect(lv?.description).toContain("ヒット数1回追加");
      expect(lv?.description).not.toContain("ヒット数2回追加");
    });

    it("Lv2: コスト0", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 2);
      expect(lv).toBeDefined();
      expect(lv?.cost).toBe(0);
    });

    it("Lv3: ダメージ250%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 3);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("250%");
    });

    it("Lv4: コスト0", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 4);
      expect(lv).toBeDefined();
      expect(lv?.cost).toBe(0);
    });
  });

  describe("鬼狩り (chizuru_hirameki_3)", () => {
    const getCard = () => CHARACTER_CARDS.find((c) => c.id === "chizuru_hirameki_3");

    it("exists in CHARACTER_CARDS with HASTE status", () => {
      const card = getCard();
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.statuses).toContain(CardStatus.HASTE);
    });

    it("Lv0: ダメージ70%×3", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 0);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("70%×3");
    });

    it("Lv1: ダメージ60%×4", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 1);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("60%×4");
    });

    it("Lv2: 結束カードのダメージ量+120%", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 2);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("+120%");
    });

    it("Lv3: ダメージ120%×3", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 3);
      expect(lv).toBeDefined();
      expect(lv?.description).toContain("120%×3");
    });

    it("Lv5: [唯一] ターン開始時、鬼火4", () => {
      const lv = getCard()?.hiramekiVariations.find((v) => v.level === 5);
      expect(lv).toBeDefined();
      expect(lv?.statuses).toContain(CardStatus.UNIQUE);
      expect(lv?.description).toContain("鬼火4");
    });
  });
});
