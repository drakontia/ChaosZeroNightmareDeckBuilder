import { describe, expect, it } from "vite-plus/test";
import { CHARACTER_CARDS } from "@/lib/character-cards";
import { CardStatus } from "@/types";
import enCards from "@/messages/en/cards.json";
import jaCards from "@/messages/ja/cards.json";
import koCards from "@/messages/ko/cards.json";
import zhCards from "@/messages/zh/cards.json";

const updatedDescriptions = [
  {
    cardId: "sereniel_starting_4",
    level: 0,
    japanese: "ダメージ120%\n残光2\n大破時、墓地から手札に移動",
    english: "120% Damage\n2 Afterglow\nOn Ravage, Move from Graveyard to hand",
  },
  {
    cardId: "sereniel_starting_4",
    level: 1,
    japanese: "ダメージ180%\n大破時、墓地から手札に移動\n破壊：ヒット数1回追加",
    english: "180% Damage\nOn Ravage, Move to hand\nDestruction: Add 1 Hit(s)",
  },
  {
    cardId: "sereniel_starting_4",
    level: 2,
    japanese: "ダメージ180%\n残光3\n大破時、手札に移動",
    english: "180% Damage\n3 Afterglow\nOn Ravage, Move to hand",
  },
  {
    cardId: "sereniel_starting_4",
    level: 3,
    japanese: "ダメージ225%\n残光2\n捨て札にホーミングレーザーL2枚作成",
    english: "225% Damage\n2 Afterglow\nCreate 2 Homing Laser L in Discard Pile",
  },
  {
    cardId: "sereniel_starting_4",
    level: 4,
    japanese: "ダメージ120%\n残光1\n大破時またはターン開始時、手札に移動",
    english: "120% Damage\n1 Afterglow\nOn Ravage or at the start of the turn, Move to hand",
  },
  {
    cardId: "sereniel_starting_4",
    level: 5,
    japanese: "ダメージ180%\n残光2\n墓地のすべてのホーミングレーザーLを手札に移動",
    english: "180% Damage\n2 Afterglow\nMove all Homing Laser L in graveyard to hand",
  },
  {
    cardId: "sereniel_hirameki_1",
    level: 2,
    japanese: "ダメージ180%\n対象の減少した強靱度の数に応じて、基本ダメージ量+60%\n(最大10)",
    english:
      "180% Damage\n+60% Base Damage Amount for each decreased Tenacity of the target\n(max 10)",
  },
  {
    cardId: "sereniel_hirameki_3",
    level: 0,
    japanese: "ランダムな敵にダメージ140%x4\nヒットごとに強靱度ダメージ1",
    english: "140% Damage x4 to random enemies\n1 Tenacity Damage for each Hit",
  },
  {
    cardId: "sereniel_hirameki_3",
    level: 1,
    japanese: "ランダムな敵にダメージ210%x4\nヒットごとに強靱度ダメージ1\n大破：コスト1減少",
    english:
      "210% Damage x4 to random enemies\n1 Tenacity Damage for each Hit\nRavage: Decrease Cost by 1",
  },
  {
    cardId: "sereniel_hirameki_3",
    level: 2,
    japanese:
      "ランダムな敵にダメージ140%x4\nヒットごとに強靱度ダメージ1\n保存：発動時まで、ヒット数1回追加\n(最大5回)",
    english:
      "140% Damage x4 to random enemies\n1 Tenacity Damage for each Hit\nPreservation: Add 1 Hit until use\n(Max 5 hits)",
  },
  {
    cardId: "sereniel_hirameki_3",
    level: 3,
    japanese:
      "ランダムな敵にダメージ140%x4\nヒットした対象の数に応じて、ホーミングレーザーL1枚生成",
    english: "140% Damage x4 to random enemies\nCreate 1 Homing Laser L for each target Hit",
  },
  {
    cardId: "sereniel_hirameki_3",
    level: 4,
    japanese: "ランダムな敵にダメージ140%\n手札のホーミングレーザー数に応じて、ヒット数1回追加",
    english: "140% Damage to random enemies\nAdd 1 Hit for each Homing Laser in hand",
  },
  {
    cardId: "sereniel_hirameki_3",
    level: 5,
    japanese: "ダメージ140%x4\n大破：もう1回発動",
    english: "140% Damage x4\nRavage: Activate 1 more time",
  },
] as const;

type SerenielCardId = "sereniel_starting_4" | "sereniel_hirameki_1" | "sereniel_hirameki_3";

type SerenielLocaleCards = Pick<typeof jaCards.cards, SerenielCardId>;

function localeDescription(
  cards: SerenielLocaleCards,
  cardId: SerenielCardId,
  level: number,
): string {
  const descriptions = cards[cardId].descriptions;
  return descriptions[String(level) as keyof typeof descriptions];
}

describe("Sereniel adjustments", () => {
  it.each(updatedDescriptions)(
    "$cardId Lv$level has the adjusted description",
    ({ cardId, level, japanese, english }) => {
      const card = CHARACTER_CARDS.find((entry) => entry.id === cardId);
      const variation = card?.hiramekiVariations.find((entry) => entry.level === level);

      expect(variation?.description).toBe(japanese);
      expect(localeDescription(jaCards.cards, cardId, level)).toBe(japanese);
      expect(localeDescription(enCards.cards, cardId, level)).toBe(english);
      expect(localeDescription(zhCards.cards, cardId, level)).toBe(japanese);
      expect(localeDescription(koCards.cards, cardId, level)).toBe(japanese);
    },
  );

  it("keeps Cobalt Light Lv5's weakness attack status", () => {
    const cobaltLight = CHARACTER_CARDS.find((entry) => entry.id === "sereniel_hirameki_3");
    const level5 = cobaltLight?.hiramekiVariations.find((entry) => entry.level === 5);

    expect(level5?.statuses).toContain(CardStatus.WEAKNESS_ATTACK);
  });
});
