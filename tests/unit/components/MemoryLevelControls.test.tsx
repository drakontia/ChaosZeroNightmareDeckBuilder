import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it, vi } from "vite-plus/test";

import { MemoryLevelControls } from "@/components/MemoryLevelControls";
import { SEASON5_MEMORY_CARDS } from "@/lib/cards/season5-cards";
import type { DeckCard } from "@/types";

describe("MemoryLevelControls", () => {
  it("shows levels 1–4 and updates the selected level", () => {
    const onUpdateMemoryLevel = vi.fn();
    const card: DeckCard = {
      ...SEASON5_MEMORY_CARDS[0],
      deckId: "memory-control-test",
      selectedHiramekiLevel: 0,
      selectedMemoryLevel: 1,
      selectedHiddenHiramekiId: null,
      godHiramekiType: null,
      godHiramekiEffectId: null,
    };

    render(
      <NextIntlClientProvider
        locale="ja"
        messages={{
          common: { close: "閉じる" },
          card: { level: "Lv", memoryLevel: "記憶カードレベル" },
        }}
      >
        <MemoryLevelControls card={card} onUpdateMemoryLevel={onUpdateMemoryLevel} />
      </NextIntlClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Lv.1" }));
    fireEvent.click(screen.getByRole("button", { name: "Lv.4" }));

    expect(onUpdateMemoryLevel).toHaveBeenCalledWith("memory-control-test", 4);
  });
});
