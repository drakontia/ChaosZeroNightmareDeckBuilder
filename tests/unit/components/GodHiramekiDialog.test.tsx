import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { GodHiramekiDialog } from "@/components/hirameki-controls/GodHiramekiDialog";
import { CardCategory, CardType, DeckCard, GodType } from "@/types";

vi.mock("@/components/CardFrame", () => ({
  CardFrame: ({ cost }: { cost: number | string }) => <div data-testid="preview-cost">{String(cost)}</div>,
}));

const messages = {
  card: {
    godSelect: "神ヒラメキ選択",
  },
  god: {
    kilken: "キルケン",
    seclaid: "セクレド",
    dialos: "ディアロス",
    nihilum: "ニヒルム",
    vitol: "ヴィトル",
    order: "オーダー",
  },
  category: {
    attack: "攻撃",
  },
  common: {
    close: "閉じる",
  },
  godEffects: {},
  hiddenEffects: {},
};

function createXCostCard(): DeckCard {
  return {
    id: "test_x_cost_card",
    deckId: "test_x_cost_card_deck_1",
    name: "Xコストカード",
    type: CardType.CHARACTER,
    category: CardCategory.ATTACK,
    statuses: [],
    hiramekiVariations: [
      {
        level: 0,
        cost: "X",
        description: "test",
      },
    ],
    selectedHiramekiLevel: 0,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedHiddenHiramekiId: null,
    isBasicCard: false,
  };
}

describe("GodHiramekiDialog", () => {
  it("Xコストカードの神ヒラメキプレビューでNaNを表示しない", () => {
    render(
      <NextIntlClientProvider
        locale="ja"
        messages={messages}
        onError={() => {}}
        getMessageFallback={({ key }) => key}
      >
        <GodHiramekiDialog
          card={createXCostCard()}
          egoLevel={0}
          hasPotential={false}
          open={true}
          onOpenChange={vi.fn()}
          onSetGodHirameki={vi.fn()}
          onSetGodHiramekiEffect={vi.fn()}
        />
      </NextIntlClientProvider>
    );

    expect(screen.queryAllByText("NaN")).toHaveLength(0);
    expect(screen.getAllByTestId("preview-cost").some((node) => node.textContent === "X")).toBe(true);
  });

  it("神ヒラメキ効果を選択するとコールバックを実行する", () => {
    const onOpenChange = vi.fn();
    const onSetGodHirameki = vi.fn();
    const onSetGodHiramekiEffect = vi.fn();
    const card = createXCostCard();

    render(
      <NextIntlClientProvider
        locale="ja"
        messages={messages}
        onError={() => {}}
        getMessageFallback={({ key }) => key}
      >
        <GodHiramekiDialog
          card={card}
          egoLevel={0}
          hasPotential={false}
          open={true}
          onOpenChange={onOpenChange}
          onSetGodHirameki={onSetGodHirameki}
          onSetGodHiramekiEffect={onSetGodHiramekiEffect}
        />
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getAllByTestId("preview-cost")[0]);

    expect(onSetGodHirameki).toHaveBeenCalledWith(card.deckId, GodType.KILKEN);
    expect(onSetGodHiramekiEffect).toHaveBeenCalledWith(card.deckId, expect.any(String));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
