import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

import { SeasonLevelControls } from "@/components/SeasonLevelControls";
import { CardCategory, CardStatus, CardType, type DeckCard } from "@/types";

function TestHarness({
  onUpdate,
  onUpdateStatuses,
}: {
  onUpdate: (deckId: string, level: 1 | 2 | 3) => void;
  onUpdateStatuses: (deckId: string, statuses: CardStatus[]) => void;
}) {
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
    selectedSeasonStatuses: [CardStatus.CONTROL, CardStatus.INQUIRY, CardStatus.CLAIM],
  });

  return (
    <SeasonLevelControls
      card={card}
      onUpdateSeasonLevel={(deckId, level) => {
        setCard((current) => ({ ...current, selectedSeasonLevel: level }));
        onUpdate(deckId, level);
      }}
      onUpdateSeasonStatuses={(deckId, statuses) => {
        setCard((current) => ({ ...current, selectedSeasonStatuses: statuses }));
        onUpdateStatuses(deckId, statuses);
      }}
    />
  );
}

describe("SeasonLevelControls", () => {
  it("opens popup from Lv button and updates selected level", () => {
    const onUpdate = vi.fn();
    const onUpdateStatuses = vi.fn();
    const messages = {
      common: {
        close: "閉じる",
        remove: "削除",
      },
      card: {
        level: "Lv",
      },
      status: {
        control: "統制",
        inquiry: "探求",
        claim: "所有",
        survival: "生存",
      },
    };

    render(
      <NextIntlClientProvider locale="ja" messages={messages}>
        <TestHarness onUpdate={onUpdate} onUpdateStatuses={onUpdateStatuses} />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("button", { name: "Lv.1" })).toBeDefined();

    fireEvent.click(screen.getByRole("button", { name: "Lv.1" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.3" }));

    expect(onUpdate).toHaveBeenCalledWith("deck-season4-1", 3);
    expect(screen.getByRole("button", { name: "Lv.3" })).toBeDefined();
  });

  it("allows selecting duplicated statuses up to current Lv slots", () => {
    const onUpdate = vi.fn();
    const onUpdateStatuses = vi.fn();
    const messages = {
      common: {
        close: "閉じる",
        remove: "削除",
      },
      card: {
        level: "Lv",
        seasonStatus: "ステータス",
      },
      status: {
        control: "統制",
        inquiry: "探求",
        claim: "所有",
        survival: "生存",
      },
    };

    render(
      <NextIntlClientProvider locale="ja" messages={messages}>
        <TestHarness onUpdate={onUpdate} onUpdateStatuses={onUpdateStatuses} />
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByRole("button", { name: "Lv.1" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.3" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.3 スロット2 生存" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.3 スロット3 生存" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.1" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.3" }));

    expect(onUpdateStatuses).toHaveBeenCalledWith("deck-season4-1", [
      CardStatus.CONTROL,
      CardStatus.SURVIVAL,
      CardStatus.SURVIVAL,
    ]);
  });
});
