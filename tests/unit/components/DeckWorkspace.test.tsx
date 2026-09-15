import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";

import { DeckWorkspace } from "@/components/deck-builder/DeckWorkspace";
import type { Deck } from "@/types";

vi.mock("@/components/CharacterSelector", () => ({
  CharacterSelector: () => <div data-testid="character-selector" />,
}));
vi.mock("@/components/EquipmentSelector", () => ({
  EquipmentSelector: () => <div data-testid="equipment-selector" />,
}));
vi.mock("@/components/MutationCoreSelector", () => ({
  MutationCoreSelector: () => <div data-testid="mutation-core-selector" />,
}));
vi.mock("@/components/DeckDisplay", () => ({
  DeckDisplay: () => <div data-testid="deck-display" />,
}));
vi.mock("@/components/deck-builder/DeckStatsPanel", () => ({
  DeckStatsPanel: () => <div data-testid="deck-stats-panel" />,
}));
vi.mock("@/components/deck-builder/DeckBuilderToolbar", () => ({
  DeckBuilderToolbar: () => <div data-testid="deck-builder-toolbar" />,
}));

function createDeck(): Deck {
  return {
    name: "テストデッキ",
    character: null,
    equipment: {
      weapon: { item: null, refinement: null, godHammerEquipmentId: null },
      armor: { item: null, refinement: null, godHammerEquipmentId: null },
      pendant: { item: null, refinement: null, godHammerEquipmentId: null },
    },
    cards: [],
    egoLevel: 0,
    hasPotential: false,
    createdAt: new Date("2024-05-06T00:00:00Z"),
    removedCards: new Map(),
    copiedCards: new Map(),
    convertedCards: new Map(),
    selectedMutationCoreId: null,
  };
}

const noop = vi.fn();

function renderWorkspace() {
  return render(
    <DeckWorkspace
      deck={createDeck()}
      equipment={[]}
      characters={[]}
      deckNamePlaceholder="デッキ名"
      saveLabel="保存"
      loadLabel="読込"
      shareLabel="共有"
      exportLabel="エクスポート"
      clearLabel="クリア"
      totalCardsLabel="カード数"
      faintMemoryLabel="曖昧な記憶"
      faintMemoryUnitLabel="pt"
      copiedCardsLabel="コピー"
      removedCardsLabel="排除"
      maxCopiedCards={3}
      maxRemovedCards={5}
      faintMemoryPoints={0}
      isSharing={false}
      isExporting={false}
      onDeckNameChange={noop}
      onSave={noop}
      onLoad={noop}
      onShare={noop}
      onExport={noop}
      onClear={noop}
      onSelectCharacter={noop}
      onEgoLevelChange={noop}
      onTogglePotential={noop}
      onEquipmentSelect={noop}
      onEquipmentRefinementChange={noop}
      onEquipmentGodHammerChange={noop}
      onEquipmentEngravingChange={noop}
      onRemoveCard={noop}
      onUndoCard={noop}
      onCopyCard={noop}
      onConvertCard={noop}
      onUpdateHirameki={noop}
      onSetGodHirameki={noop}
      onSetGodHiramekiEffect={noop}
      onSetHiddenHirameki={noop}
      onSetPersonaEngravings={noop}
      onUpdateSeasonLevel={noop}
      onUpdateSeasonStatuses={noop}
      onSetDeckMutationCore={noop}
    />,
  );
}

describe("DeckWorkspace", () => {
  it("保存日をデッキ名の隣に半分のサイズで表示する", () => {
    renderWorkspace();

    const dateBadge = screen.getByTestId("deck-created-date");
    expect(dateBadge.textContent).toBe("24.05.06");
    expect(dateBadge.className).toContain("text-xs");
    expect(dateBadge.querySelector("svg")).not.toBeNull();
  });

  it("獲得装備セレクターをキャラクターセレクターの直後に配置する", () => {
    renderWorkspace();

    const character = screen.getByTestId("character-selector");
    const equipment = screen.getByTestId("equipment-selector");

    const position = character.compareDocumentPosition(equipment);
    // eslint-disable-next-line no-bitwise
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    // 同じ親グループ配下にあること（statsパネルとは別グループ）
    expect(character.parentElement).toBe(equipment.parentElement);
  });

  it("キャラクターセレクターと装備セレクターの間隔を詰める", () => {
    renderWorkspace();

    const character = screen.getByTestId("character-selector");
    const group = character.parentElement;

    expect(group?.className).toContain("space-y-2");
    expect(group?.className).not.toContain("space-y-4");
  });
});
