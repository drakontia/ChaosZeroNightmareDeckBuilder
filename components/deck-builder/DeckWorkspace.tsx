import { CharacterSelector } from "@/components/CharacterSelector";
import { DeckDisplay } from "@/components/DeckDisplay";
import { EquipmentSelector } from "@/components/EquipmentSelector";
import { MutationCoreSelector } from "@/components/MutationCoreSelector";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DeckStatsPanel } from "./DeckStatsPanel";
import { DeckBuilderToolbar } from "./DeckBuilderToolbar";
import type {
  Character,
  Deck,
  Equipment,
  EquipmentType,
  JobType,
  CznCard,
  GodType,
  PersonaEngraving,
  Season4DesireStatus,
} from "@/types";

interface DeckWorkspaceProps {
  deck: Deck;
  equipment: Equipment[];
  characters: Character[];
  deckNamePlaceholder: string;
  saveLabel: string;
  loadLabel: string;
  shareLabel: string;
  exportLabel: string;
  clearLabel: string;
  createdDateLabel: string;
  totalCardsLabel: string;
  faintMemoryLabel: string;
  copiedCardsLabel: string;
  removedCardsLabel: string;
  faintMemoryPoints: number;
  isSharing: boolean;
  isExporting: boolean;
  onDeckNameChange: (value: string) => void;
  onSave: () => void;
  onLoad: () => void;
  onShare: () => void;
  onExport: () => void;
  onClear: () => void;
  onSelectCharacter: (character: Character) => void;
  onEgoLevelChange: (level: number) => void;
  onTogglePotential: () => void;
  onEquipmentSelect: (equipment: Equipment | null, type?: EquipmentType) => void;
  onEquipmentRefinementChange: (type: EquipmentType, refinementId: string | null) => void;
  onEquipmentGodHammerChange: (type: EquipmentType, equipmentId: string | null) => void;
  onEquipmentEngravingChange: (type: EquipmentType, engravingId: string | null) => void;
  onRemoveCard: (deckId: string) => void;
  onUndoCard: (deckId: string) => void;
  onCopyCard: (deckId: string) => void;
  onConvertCard: (deckId: string, targetCard: CznCard, options?: { asExclusion?: boolean }) => void;
  onUpdateHirameki: (deckId: string, hiramekiLevel: number) => void;
  onSetGodHirameki: (deckId: string, godType: GodType | null) => void;
  onSetGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  onSetHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
  onSetPersonaEngravings: (deckId: string, engravings: PersonaEngraving[]) => void;
  onUpdateSeasonLevel: (deckId: string, level: 1 | 2 | 3) => void;
  onUpdateSeasonStatuses: (deckId: string, statuses: Season4DesireStatus[]) => void;
  onSetDeckMutationCore: (effectId: string | null) => void;
}

const countTrackedActions = (entries: Iterable<number | { count: number }>) =>
  Array.from(entries).reduce<number>(
    (sum, entry) => sum + (typeof entry === "number" ? entry : (entry.count ?? 0)),
    0,
  );

export function DeckWorkspace(props: DeckWorkspaceProps) {
  const copiedTotal = countTrackedActions(props.deck.copiedCards.values());
  const removedTotal = countTrackedActions(props.deck.removedCards.values());

  return (
    <FieldSet className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-6 mb-6 p-3 lg:p-6 rounded-xl border bg-card">
      <FieldGroup className="sm:col-span-6 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
        <Field orientation="horizontal" className="col-span-1 md:col-span-4 lg:col-span-4">
          <Input
            id="deck-name"
            type="text"
            value={props.deck.name ?? ""}
            onChange={(event) => props.onDeckNameChange(event.target.value)}
            className="text-base sm:text-lg md:text-xl lg:text-2xl h-12 font-bold"
            placeholder={props.deckNamePlaceholder}
          />
        </Field>
        <DeckBuilderToolbar
          disabled={!props.deck.character || props.isSharing}
          isSharing={props.isSharing}
          isExporting={props.isExporting}
          onSave={props.onSave}
          onLoad={props.onLoad}
          onShare={props.onShare}
          onExport={props.onExport}
          onClear={props.onClear}
          saveLabel={props.saveLabel}
          loadLabel={props.loadLabel}
          shareLabel={props.shareLabel}
          exportLabel={props.exportLabel}
          clearLabel={props.clearLabel}
        />
      </FieldGroup>
      <div className="sm:col-span-6 lg:col-span-4 space-y-6">
        <Card>
          <CardContent className="p-2 lg:p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <CharacterSelector
                characters={props.characters}
                character={props.deck.character}
                onSelect={props.onSelectCharacter}
                onEgoLevelChange={props.onEgoLevelChange}
                hasPotential={props.deck.hasPotential}
                onTogglePotential={props.onTogglePotential}
              />
              <div className="space-y-4">
                <DeckStatsPanel
                  createdAt={new Date(props.deck.createdAt)}
                  totalCards={props.deck.cards.length}
                  faintMemoryPoints={props.faintMemoryPoints}
                  copiedCards={copiedTotal}
                  removedCards={removedTotal}
                  createdDateLabel={props.createdDateLabel}
                  totalCardsLabel={props.totalCardsLabel}
                  faintMemoryLabel={props.faintMemoryLabel}
                  copiedCardsLabel={props.copiedCardsLabel}
                  removedCardsLabel={props.removedCardsLabel}
                />
                <EquipmentSelector
                  equipment={props.equipment}
                  selectedEquipment={props.deck.equipment}
                  onSelect={props.onEquipmentSelect}
                  onRefinementChange={props.onEquipmentRefinementChange}
                  onGodHammerChange={props.onEquipmentGodHammerChange}
                  onEquipmentEngravingChange={props.onEquipmentEngravingChange}
                />
                <MutationCoreSelector
                  selectedEffectId={props.deck.selectedMutationCoreId ?? null}
                  onSelect={props.onSetDeckMutationCore}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="sm:col-span-6 lg:col-span-8 space-y-6">
        <Card>
          <CardContent className="p-2 lg:p-6">
            <DeckDisplay
              cards={props.deck.cards}
              egoLevel={props.deck.egoLevel}
              hasPotential={props.deck.hasPotential}
              allowedJob={props.deck.character?.job as JobType | undefined}
              onRemoveCard={props.onRemoveCard}
              onUndoCard={props.onUndoCard}
              onCopyCard={props.onCopyCard}
              onConvertCard={props.onConvertCard}
              onUpdateHirameki={props.onUpdateHirameki}
              onSetGodHirameki={props.onSetGodHirameki}
              onSetGodHiramekiEffect={props.onSetGodHiramekiEffect}
              onSetHiddenHirameki={props.onSetHiddenHirameki}
              onSetPersonaEngravings={props.onSetPersonaEngravings}
              onUpdateSeasonLevel={props.onUpdateSeasonLevel}
              onUpdateSeasonStatuses={props.onUpdateSeasonStatuses}
            />
          </CardContent>
        </Card>
      </div>
    </FieldSet>
  );
}
