import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { SeasonLevelControls } from "@/components/SeasonLevelControls";
import { CardCategory, CardType, type DeckCard } from "@/types";

function TestHarness({ onUpdate }: { onUpdate: (deckId: string, level: 1 | 2 | 3) => void }) {
  const [card, setCard] = useState<DeckCard>({
    id: "traitors_execution",
    deckId: "deck-season4-1",
    name: "反逆者の粛清",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    hiramekiVariations: [{ level: 0, cost: 2, description: "base" }],
    selectedHiramekiLevel: 0,
    selectedHiddenHiramekiId: null,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedSeasonLevel: 1,
  });

  return (
    <SeasonLevelControls
      card={card}
      onUpdateSeasonLevel={(deckId, level) => {
        setCard((current) => ({ ...current, selectedSeasonLevel: level }));
        onUpdate(deckId, level);
      }}
    />
  );
}

describe("SeasonLevelControls", () => {
  it("opens popup from Lv button and updates selected level", () => {
    const onUpdate = vi.fn();
    const messages = {
      common: {
        close: "閉じる",
        remove: "削除",
      },
      card: {
        level: "Lv",
      },
    };

    render(
      <NextIntlClientProvider locale="ja" messages={messages}>
        <TestHarness onUpdate={onUpdate} />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("button", { name: "Lv.1" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Lv.1" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.3" }));

    expect(onUpdate).toHaveBeenCalledWith("deck-season4-1", 3);
    expect(screen.getByRole("button", { name: "Lv.3" })).toBeDefined();
  });
});
