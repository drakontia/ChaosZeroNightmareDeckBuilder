"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { useDeckBuilderStore } from "@/hooks/useDeckBuilderStore";
import { CHARACTERS, EQUIPMENT } from "@/lib/card";
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { useCallback, useMemo, useRef, useState } from 'react';
import { CznCard, Deck } from "@/types";
import { useShareDeck } from "@/hooks/useShareDeck";
import { useExportDeckImage } from "@/hooks/useExportDeckImage";
import { useDeckSaveLoad } from "@/hooks/useDeckSaveLoad";
import { Footer } from './Footer';
import { CardCatalogSection, DeckBuilderHeader, DeckWorkspace, LoadDeckDialog } from "./deck-builder";
import { useDeckBuilderAlerts } from "@/hooks/useDeckBuilderAlerts";
import { useDeckBuilderInitialization } from "@/hooks/useDeckBuilderInitialization";
import { useDeckShareLoader } from "@/hooks/useDeckShareLoader";
import { useEquipmentValidation } from "@/hooks/useEquipmentValidation";
import { useLoadedDeckSync } from "@/hooks/useLoadedDeckSync";

export type DeckBuilderProps = {
  shareId?: string;
};

export function DeckBuilder({ shareId }: DeckBuilderProps) {
  const store = useDeckBuilderStore(useShallow((state) => ({
    deck: state.deck,
    setDeck: state.setDeck,
    setCharacter: state.setCharacter,
    setEgoLevel: state.setEgoLevel,
    setPotential: state.setPotential,
    addCard: state.addCard,
    removeCard: state.removeCard,
    restoreCard: state.restoreCard,
    selectEquipment: state.selectEquipment,
    setEquipmentRefinement: state.setEquipmentRefinement,
    setEquipmentGodHammer: state.setEquipmentGodHammer,
    setEquipmentEngraving: state.setEquipmentEngraving,
    updateCardHirameki: state.updateCardHirameki,
    setCardGodHirameki: state.setCardGodHirameki,
    setCardGodHiramekiEffect: state.setCardGodHiramekiEffect,
    setCardHiddenHirameki: state.setCardHiddenHirameki,
    updateCardSeasonLevel: state.updateCardSeasonLevel,
    setCardPersonaEngravings: state.setCardPersonaEngravings,
    reset: state.reset,
    undoCard: state.undoCard,
    copyCard: state.copyCard,
    convertCard: state.convertCard,
    removeLimitReached: state.removeLimitReached,
    copyLimitReached: state.copyLimitReached,
    conversionLimitReached: state.conversionLimitReached,
    clearRemoveLimitAlert: state.clearRemoveLimitAlert,
    clearCopyLimitAlert: state.clearCopyLimitAlert,
    clearConversionLimitAlert: state.clearConversionLimitAlert,
  })));

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [, setName] = useState("");
  const [sharedDeck, setSharedDeck] = useState<Deck | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const deckCaptureRef = useRef<HTMLDivElement | null>(null);

  useDeckBuilderInitialization(store.deck, store.setDeck, { skipInitialization: Boolean(shareId) });
  useLoadedDeckSync(sharedDeck, store.setDeck);
  useDeckBuilderAlerts({
    t,
    removeLimitReached: store.removeLimitReached,
    copyLimitReached: store.copyLimitReached,
    conversionLimitReached: store.conversionLimitReached,
    clearRemoveLimitAlert: store.clearRemoveLimitAlert,
    clearCopyLimitAlert: store.clearCopyLimitAlert,
    clearConversionLimitAlert: store.clearConversionLimitAlert,
  });
  useDeckShareLoader(shareId, store.setDeck, setShareError, t);

  // DeckDisplay用: (deckId: string, targetCard: CznCard) => void にラップ
  const handleConvertCard = useCallback((deckId: string, targetCard: CznCard, options?: { asExclusion?: boolean }) => {
    store.convertCard(deckId, targetCard.id, options);
  }, [store]);

  const handleRemoveCard = useCallback((deckId: string) => {
    if (!store.deck) return;
    store.removeCard(deckId);
  }, [store]);

  const handleCopyCard = useCallback((deckId: string) => {
    if (!store.deck) return;
    store.copyCard(deckId);
  }, [store]);

  const { isSharing, handleShareDeck: shareHandler } = useShareDeck();
  const { isExporting, handleExportDeckImage: exportHandler } = useExportDeckImage();
  const {
    savedList,
    loadOpen,
    setLoadOpen,
    handleSaveDeck: saveHandler,
    openLoadDialog,
    handleLoadDeck,
    handleDeleteSaved,
  } = useDeckSaveLoad({ deck: store.deck ?? undefined, setName, setSharedDeck, setShareError, t });
  const validateEquipment = useEquipmentValidation(store.deck, t);

  const handleSaveDeck = useCallback(() => {
    if (!validateEquipment()) return;
    saveHandler();
  }, [validateEquipment, saveHandler]);

  const handleExportImage = useCallback(() => {
    if (!validateEquipment()) return;
    exportHandler(deckCaptureRef, store.deck?.name || 'deck');
  }, [validateEquipment, exportHandler, store.deck?.name, deckCaptureRef]);

  const handleShareDeck = useCallback(() => {
    if (!store.deck || !validateEquipment()) return;
    shareHandler(store.deck);
  }, [store.deck, validateEquipment, shareHandler]);

  const handleClearDeck = useCallback(() => {
    store.reset();
    router.push('/');
  }, [store, router]);

  const currentDeck = store.deck;
  const faintMemoryPoints = useMemo(() => calculateFaintMemory(currentDeck), [currentDeck]);

  if (!currentDeck) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-400 mx-auto">
        <DeckBuilderHeader locale={locale} title={t('app.title')} description={t('app.description')} challengeCheckerLabel={t('app.challengeChecker')} />
        {shareError ? <div className="mb-4 text-sm text-destructive">{shareError}</div> : null}
        <main ref={deckCaptureRef}>
          <DeckWorkspace
            deck={currentDeck}
            equipment={EQUIPMENT}
            characters={CHARACTERS}
            deckNamePlaceholder={t('deck.namePlaceholder')}
            saveLabel={t('deck.save', { defaultValue: 'デッキを保存' })}
            loadLabel={t('deck.load', { defaultValue: 'デッキを読み込み' })}
            shareLabel={t('deck.share')}
            exportLabel={t('deck.exportImage')}
            clearLabel={t('deck.clear')}
            createdDateLabel={t('deck.createdDate')}
            totalCardsLabel={t('deck.totalCards')}
            faintMemoryLabel={t('character.faintMemory')}
            copiedCardsLabel={t('deck.copiedCards')}
            removedCardsLabel={t('deck.removedCards')}
            faintMemoryPoints={faintMemoryPoints}
            isSharing={isSharing}
            isExporting={isExporting}
            onDeckNameChange={(value) => {
              store.setDeck({ ...currentDeck, name: value });
              setName(value);
            }}
            onSave={handleSaveDeck}
            onLoad={openLoadDialog}
            onShare={handleShareDeck}
            onExport={handleExportImage}
            onClear={handleClearDeck}
            onSelectCharacter={store.setCharacter}
            onEgoLevelChange={(level) => {
              if (!currentDeck.character) return;
              store.setEgoLevel(currentDeck.character.id, level);
            }}
            onTogglePotential={() => store.setPotential(!currentDeck.hasPotential)}
            onEquipmentSelect={(equipment, type) => type && store.selectEquipment(type, equipment)}
            onEquipmentRefinementChange={store.setEquipmentRefinement}
            onEquipmentGodHammerChange={store.setEquipmentGodHammer}
            onEquipmentEngravingChange={store.setEquipmentEngraving}
            onRemoveCard={handleRemoveCard}
            onUndoCard={store.undoCard}
            onCopyCard={handleCopyCard}
            onConvertCard={handleConvertCard}
            onUpdateHirameki={store.updateCardHirameki}
            onSetGodHirameki={store.setCardGodHirameki}
            onSetGodHiramekiEffect={store.setCardGodHiramekiEffect}
            onSetHiddenHirameki={store.setCardHiddenHirameki}
            onSetPersonaEngravings={store.setCardPersonaEngravings}
            onUpdateSeasonLevel={store.updateCardSeasonLevel}
          />
        </main>
        <LoadDeckDialog
          open={loadOpen}
          onOpenChange={setLoadOpen}
          savedList={savedList}
          title={t('deck.loadTitle', { defaultValue: '保存されたデッキを読み込み' })}
          emptyLabel={t('deck.noSavedDecks', { defaultValue: '保存されたデッキはありません' })}
          loadLabel={t('deck.load', { defaultValue: '呼び出し' })}
          deleteLabel={t('common.delete', { defaultValue: '削除' })}
          onLoad={handleLoadDeck}
          onDelete={handleDeleteSaved}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <CardCatalogSection
              deck={currentDeck}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              searchLabel={t('card.search')}
              title={t('card.add')}
              onAddCard={store.addCard}
              onRestoreCard={store.restoreCard}
            />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
