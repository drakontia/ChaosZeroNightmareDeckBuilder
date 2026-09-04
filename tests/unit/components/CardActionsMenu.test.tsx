import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vite-plus/test";

import { CardActionsMenu } from "@/components/CardActionsMenu";
import { CardCategory, CardStatus, CardType, DeckCard } from "@/types";

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

const messages = {
  actions: {
    menu: "メニュー",
    undo: "戻す",
  },
  common: {
    delete: "削除",
    copy: "コピー",
    convert: "変換",
  },
};

function createDeckCard(overrides?: Partial<DeckCard>): DeckCard {
  return {
    id: "shared_test",
    deckId: "shared_test_deck_1",
    name: "Shared Test",
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    hiramekiVariations: [
      {
        level: 0,
        cost: 1,
        description: "base",
        statuses: [],
      },
      {
        level: 1,
        cost: 1,
        description: "lv1",
        statuses: [],
      },
    ],
    selectedHiramekiLevel: 0,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedHiddenHiramekiId: null,
    isBasicCard: false,
    ...overrides,
  };
}

function renderMenu(card: DeckCard) {
  render(
    <NextIntlClientProvider locale="ja" messages={messages}>
      <CardActionsMenu
        card={card}
        onRemoveCard={vi.fn()}
        onCopyCard={vi.fn()}
        onConvertCard={vi.fn()}
        onUndoCard={vi.fn()}
      />
    </NextIntlClientProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "メニュー" }));
}

describe("CardActionsMenu", () => {
  it("ヒラメキでUNIQUEが外れている場合はコピーできる", () => {
    const card = createDeckCard({
      statuses: [CardStatus.UNIQUE],
      selectedHiramekiLevel: 1,
      hiramekiVariations: [
        {
          level: 0,
          cost: 1,
          description: "base",
          statuses: [CardStatus.UNIQUE],
        },
        {
          level: 1,
          cost: 1,
          description: "lv1",
          statuses: [],
        },
      ],
    });

    renderMenu(card);

    expect(screen.getByRole("button", { name: "コピー" })).toBeDefined();
  });

  it("ヒラメキ後もUNIQUEがある場合はコピーできない", () => {
    const card = createDeckCard({
      statuses: [],
      selectedHiramekiLevel: 1,
      hiramekiVariations: [
        {
          level: 0,
          cost: 1,
          description: "base",
          statuses: [],
        },
        {
          level: 1,
          cost: 1,
          description: "lv1",
          statuses: [CardStatus.UNIQUE],
        },
      ],
    });

    renderMenu(card);

    expect(screen.queryByRole("button", { name: "コピー" })).toBeNull();
  });

  it("ペルソナカードでは削除と変換を表示しない", () => {
    const card = createDeckCard({
      id: "persona_01",
      deckId: "persona_01_deck_1",
    });

    renderMenu(card);

    expect(screen.queryByRole("button", { name: "削除" })).toBeNull();
    expect(screen.queryByRole("button", { name: "変換" })).toBeNull();
  });

  it("シーズン4カードではコピーを表示しない", () => {
    const card = createDeckCard({
      id: "traitors_execution",
      deckId: "traitors_execution_deck_1",
      statuses: [],
      hiramekiVariations: [
        {
          level: 0,
          cost: 2,
          description: "lv1",
          statuses: [],
        },
      ],
    });

    renderMenu(card);

    expect(screen.queryByRole("button", { name: "コピー" })).toBeNull();
  });
});
