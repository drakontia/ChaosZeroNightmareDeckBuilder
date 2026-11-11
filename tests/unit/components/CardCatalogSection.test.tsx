import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";

import { CardCatalogSection } from "@/components/deck-builder/CardCatalogSection";
import type { Deck } from "@/types";

vi.mock("@/components/CardSelector", () => ({
  CardSelector: ({ searchQuery }: { searchQuery: string }) => (
    <div data-testid="card-search-query">{searchQuery}</div>
  ),
}));

const deck: Deck = {
  character: null,
  equipment: { weapon: null, armor: null, pendant: null },
  cards: [],
  egoLevel: 0,
  hasPotential: false,
  createdAt: new Date("2024-01-01T00:00:00Z"),
  selectedMutationCoreId: null,
  removedCards: new Map(),
  copiedCards: new Map(),
  convertedCards: new Map(),
};

describe("CardCatalogSection", () => {
  it("keeps search updates from rerendering its parent", () => {
    let parentRenderCount = 0;

    function Parent() {
      parentRenderCount += 1;

      return (
        <CardCatalogSection
          deck={deck}
          searchLabel="Search cards"
          title="Add cards"
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
        />
      );
    }

    render(<Parent />);
    expect(parentRenderCount).toBe(1);

    fireEvent.change(screen.getByPlaceholderText("Search cards"), {
      target: { value: "shared" },
    });

    expect(screen.getByTestId("card-search-query").textContent).toBe("shared");
    expect(parentRenderCount).toBe(1);
  });
});
