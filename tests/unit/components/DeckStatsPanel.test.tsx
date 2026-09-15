import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";

import { DeckStatsPanel } from "@/components/deck-builder/DeckStatsPanel";

describe("DeckStatsPanel", () => {
  it("曖昧な記憶の単位を pt で表示する", () => {
    render(
      <DeckStatsPanel
        totalCards={10}
        faintMemoryPoints={120}
        faintMemoryUnitLabel="pt"
        copiedCards={2}
        maxCopiedCards={3}
        removedCards={1}
        maxRemovedCards={5}
        totalCardsLabel="カード数"
        faintMemoryLabel="曖昧な記憶"
        copiedCardsLabel="コピー"
        removedCardsLabel="排除"
      />,
    );

    expect(screen.getByTestId("faint-memory-points").textContent).toBe("120 pt");
  });

  it("コピー数を現在数/上限の形式で表示する", () => {
    render(
      <DeckStatsPanel
        totalCards={10}
        faintMemoryPoints={0}
        faintMemoryUnitLabel="pt"
        copiedCards={2}
        maxCopiedCards={3}
        removedCards={1}
        maxRemovedCards={5}
        totalCardsLabel="カード数"
        faintMemoryLabel="曖昧な記憶"
        copiedCardsLabel="コピー"
        removedCardsLabel="排除"
      />,
    );

    expect(screen.getByTestId("copied-cards").textContent).toContain("2 / 3");
  });

  it("排除数を現在数/上限の形式で表示する", () => {
    render(
      <DeckStatsPanel
        totalCards={10}
        faintMemoryPoints={0}
        faintMemoryUnitLabel="pt"
        copiedCards={2}
        maxCopiedCards={3}
        removedCards={1}
        maxRemovedCards={5}
        totalCardsLabel="カード数"
        faintMemoryLabel="曖昧な記憶"
        copiedCardsLabel="コピー"
        removedCardsLabel="排除"
      />,
    );

    expect(screen.getByTestId("removed-cards").textContent).toContain("1 / 5");
  });

  it("保存日を表示しない（日付はデッキ名の隣に移動）", () => {
    render(
      <DeckStatsPanel
        totalCards={10}
        faintMemoryPoints={0}
        faintMemoryUnitLabel="pt"
        copiedCards={0}
        maxCopiedCards={3}
        removedCards={0}
        maxRemovedCards={5}
        totalCardsLabel="カード数"
        faintMemoryLabel="曖昧な記憶"
        copiedCardsLabel="コピー"
        removedCardsLabel="排除"
      />,
    );

    expect(screen.queryByText(/保存日/)).toBeNull();
  });
});
