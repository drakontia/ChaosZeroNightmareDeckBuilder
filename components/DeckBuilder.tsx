"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDeckBuilderStore } from "@/hooks/useDeckBuilderStore";
import { DeckCard, CznCard, Equipment, EquipmentType } from "@/types";
import { CardType } from "@/types";
import { CharacterSelector } from "./CharacterSelector";
import { EquipmentSelector } from "./EquipmentSelector";
import { CardSelector } from "./CardSelector";
import { DeckDisplay } from "./DeckDisplay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LimitAlert } from "./LimitAlert";
import { CHARACTERS, EQUIPMENT } from "@/lib/card";
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Field, FieldLabel, FieldGroup, FieldSet } from "./ui/field";
import { Input } from './ui/input';
import { Brain, CardSim, Clock12, Share2, Save as SaveIcon, FolderOpen, Eraser } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { decodeDeckShare } from "@/lib/deck-share";
import { Deck } from "@/types";
import { useShareDeck } from "@/hooks/useShareDeck";
import { useExportDeckImage } from "@/hooks/useExportDeckImage";
import { useDeckSaveLoad } from "@/hooks/useDeckSaveLoad";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Footer } from './Footer';

export type DeckBuilderProps = {
  shareId?: string;
};

export function DeckBuilder({ shareId }: DeckBuilderProps) {
  // Zustandストアから状態と操作を取得（必ず最初に呼ぶ）
  const deck = useDeckBuilderStore((s) => s.deck);
  const setDeck = useDeckBuilderStore((s) => s.setDeck);
  const setCharacter = useDeckBuilderStore((s) => s.setCharacter);
  const setPotential = useDeckBuilderStore((s) => s.setPotential);
  const addCard = useDeckBuilderStore((s) => s.addCard);
  const removeCard = useDeckBuilderStore((s) => s.removeCard);
  const restoreCard = useDeckBuilderStore((s) => s.restoreCard);
  const selectEquipment = useDeckBuilderStore((s) => s.selectEquipment);
  const updateCardHirameki = useDeckBuilderStore((s) => s.updateCardHirameki);
  const setCardGodHirameki = useDeckBuilderStore((s) => s.setCardGodHirameki);
  const setCardGodHiramekiEffect = useDeckBuilderStore((s) => s.setCardGodHiramekiEffect);
  const setCardHiddenHirameki = useDeckBuilderStore((s) => s.setCardHiddenHirameki);
  const reset = useDeckBuilderStore((s) => s.reset);
  const undoCard = useDeckBuilderStore((s) => s.undoCard);
  const copyCard = useDeckBuilderStore((s) => s.copyCard);
  const convertCard = useDeckBuilderStore((s) => s.convertCard);

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deckName, setName] = useState("");
  const [sharedDeck, setSharedDeck] = useState<Deck | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const removeLimitReached = useDeckBuilderStore((s) => s.removeLimitReached);
  const copyLimitReached = useDeckBuilderStore((s) => s.copyLimitReached);
  const clearRemoveLimitAlert = useDeckBuilderStore((s) => s.clearRemoveLimitAlert);
  const clearCopyLimitAlert = useDeckBuilderStore((s) => s.clearCopyLimitAlert);
  const hasLoadedShare = useRef(false);
  const deckCaptureRef = useRef<HTMLDivElement | null>(null);

  // デッキがnullなら初期化（初回表示時やリセット直後）
  useEffect(() => {
    if (!deck) {
      setDeck({
        name: '',
        character: null,
        equipment: { weapon: null, armor: null, pendant: null },
        cards: [],
        egoLevel: 0,
        hasPotential: false,
        createdAt: new Date(),
        removedCards: new Map(),
        copiedCards: new Map(),
        convertedCards: new Map(),
      });
    }
  }, [deck, setDeck]);

  // 読込ダイアログでsharedDeckがセットされたらZustandストアに反映
  useEffect(() => {
    if (sharedDeck) {
      setDeck(sharedDeck);
    }
  }, [sharedDeck, setDeck]);

  // DeckDisplay用: (deckId: string, targetCard: CznCard) => void にラップ
  const handleConvertCard = useCallback((deckId: string, targetCard: CznCard, options?: { asExclusion?: boolean }) => {
    convertCard(deckId, targetCard.id, options);
  }, [convertCard]);

  const handleRemoveCard = useCallback((deckId: string) => {
    if (!deck) return;
    removeCard(deckId);
  }, [deck, removeCard]);

  const handleCopyCard = useCallback((deckId: string) => {
    if (!deck) return;
    copyCard(deckId);
  }, [copyCard, deck]);

  const { isSharing, handleShareDeck: shareHandler } = useShareDeck();
  const { isExporting, handleExportDeckImage: exportHandler } = useExportDeckImage();
  // deckがnullのときはundefinedを渡す（useDeckSaveLoad側でnull/undefined対応必須）
  const {
    savedList,
    loadOpen,
    setLoadOpen,
    handleSaveDeck,
    openLoadDialog,
    handleLoadDeck,
    handleDeleteSaved,
  } = useDeckSaveLoad({ deck: deck ?? undefined, setName, setSharedDeck, setShareError, t });

  // 共有デッキ読み込み（shareIdがある場合のみ1回だけ）
  useEffect(() => {
    if (!shareId || hasLoadedShare.current) return;
    const decoded = decodeDeckShare(shareId);
    console.log('[デバッグ] 共有デッキデコード結果:', decoded);
    if (decoded) {
      console.log('[デバッグ] character:', decoded.character);
      console.log('[デバッグ] cards:', decoded.cards);
      setDeck(decoded);
    } else {
      setShareError(t('deck.shareInvalid', { defaultValue: '共有リンクが無効です。' }));
    }
    hasLoadedShare.current = true;
  }, [shareId, t, setDeck, setCharacter]);


  const handleShareDeck = useCallback(() => {
    if (deck) shareHandler(deck);
  }, [deck, shareHandler]);

  const handleClearDeck = useCallback(() => {
    reset();
    router.push('/');
  }, [reset, router]);

  const faintMemoryPoints = deck ? calculateFaintMemory(deck) : 0;

  // 統一されたテキストスタイル定数
  const statLabelClass = "text-sm sm:text-base md:text-lg lg:text-2xl text-gray-500";
  const statValueClass = "text-sm sm:text-base md:text-lg lg:text-2xl font-bold text-gray-500";

  // Hooks呼び出し後に初期化中判定（必ず1箇所のみ）
  if (!deck) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading...</div>;
  }
  return (
    <div className="min-h-screen p-4 lg:p-8 bg-gray-50 dark:bg-gray-900">
      <LimitAlert
        isOpen={removeLimitReached}
        title={t('alert.removeLimitTitle', { defaultValue: '排除上限に達しました' })}
        message={t('alert.removeLimitMessage', { defaultValue: '排除は5回までです。これ以上排除できません。' })}
        onClose={clearRemoveLimitAlert}
        closeLabel={t('common.close', { defaultValue: '閉じる' })}
      />
      <LimitAlert
        isOpen={copyLimitReached}
        title={t('alert.copyLimitTitle', { defaultValue: 'コピー上限に達しました' })}
        message={t('alert.copyLimitMessage', { defaultValue: 'コピーは4回までです。これ以上コピーできません。' })}
        onClose={clearCopyLimitAlert}
        closeLabel={t('common.close', { defaultValue: '閉じる' })}
      />
      
      <div className="max-w-400 mx-auto">
        <header className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between items-end sm:items-start gap-2 mb-2">
            <div className="flex items-center gap-3 w-full sm:w-auto justify-end order-1 sm:order-2">
              <iframe src="https://github.com/sponsors/drakontia/button" title="Sponsor drakontia" height="32" width="114" style={{border: 0, borderRadius: '6px'}}></iframe>
              <LanguageSwitcher currentLocale={locale} />
            </div>
            <div className="order-2 sm:order-1 w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2">
                <Link href="/" className="hover:underline">
                  {t('app.title')}
                </Link>
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('app.description')}
              </p>
            </div>
          </div>
        </header>

      {shareError && (
        <div className="mb-4 text-sm text-destructive">
          {shareError}
        </div>
      )}

        <main ref={deckCaptureRef}>
          <FieldSet className="grid grid-cols-1 sm:grid-cols-6 lg:grid-cols-12 gap-6 mb-6 p-3 lg:p-6 rounded-xl border bg-card">
            {/* Top side - Deck name, Deck control */}
            <FieldGroup className="sm:col-span-6 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
              <Field orientation={'horizontal'} className="col-span-1 md:col-span-4 lg:col-span-4">
                <Input
                  id="deck-name"
                  type="text"
                  value={deck.name ?? ""}
                  onChange={(e) => {
                    setDeck({ ...deck, name: e.target.value });
                    setName(e.target.value);
                  }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl h-12 font-bold"
                  placeholder={t('deck.namePlaceholder')}
                />
              </Field>
              <div className="col-span-1 md:col-span-8 lg:col-span-8 flex justify-end gap-2">
                <Button
                  onClick={handleSaveDeck}
                  variant="secondary"
                  disabled={!deck.character}
                  title={t('deck.save', { defaultValue: 'デッキを保存' })}
                  aria-label={t('deck.save', { defaultValue: 'デッキを保存' })}
                >
                  <SaveIcon className="lg:mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{t('deck.save', { defaultValue: 'デッキを保存' })}</span>
                </Button>
                <Button
                  onClick={openLoadDialog}
                  variant="secondary"
                  title={t('deck.load', { defaultValue: 'デッキを読み込み' })}
                  aria-label={t('deck.load', { defaultValue: 'デッキを読み込み' })}
                >
                  <FolderOpen className="lg:mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{t('deck.load', { defaultValue: 'デッキを読み込み' })}</span>
                </Button>
                <Button
                  onClick={handleShareDeck}
                  variant="secondary"
                  disabled={isSharing || !deck.character}
                  title={t('deck.share')}
                  aria-label={t('deck.share')}
                >
                  <Share2 className="lg:mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{t('deck.share')}</span>
                </Button>
                <Button
                  onClick={() => exportHandler(deckCaptureRef, deck.name || 'deck')}
                  variant="secondary"
                  disabled={isExporting}
                  title={t('deck.exportImage')}
                  aria-label={t('deck.exportImage')}
                >
                  <Camera className="lg:mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{t('deck.exportImage')}</span>
                </Button>
                <Button
                  onClick={handleClearDeck}
                  variant="destructive"
                >
                  <Eraser className="lg:mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">{t('deck.clear')}</span>
                </Button>
              </div>
            </FieldGroup>

            {/* Left side - Character, Points, Equipment */}
            <div className="sm:col-span-6 lg:col-span-4 space-y-6">
              {/* Character Selection */}
              <Card>
                <CardContent className="p-2 lg:p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* 左列: キャラクター画像 */}
                    <div>
                      <CharacterSelector
                        characters={CHARACTERS}
                        character={deck.character}
                        onSelect={setCharacter}
                        hasPotential={deck.hasPotential}
                        onTogglePotential={() => setPotential(!deck.hasPotential)}
                      />
                    </div>

                    {/* 右列: 情報と装備 */}
                    <div className="space-y-4">
                      {/* Points/Stats Section */}
                      <FieldGroup className='gap-2'>
                        <Field orientation={'horizontal'} className='border-b'>
                          <FieldLabel className={`${statLabelClass} align-middle`}><Clock12 className='align-middle' />{t('deck.createdDate')}</FieldLabel>
                          <div className="flex justify-between items-center p-1">
                            <span className={statValueClass}>
                              {(() => {
                                const d = new Date(deck.createdAt);
                                const yy = String(d.getFullYear()).slice(-2);
                                const mm = String(d.getMonth() + 1).padStart(2, '0');
                                const dd = String(d.getDate()).padStart(2, '0');
                                return `${yy}.${mm}.${dd}`;
                              })()}
                            </span>
                          </div>
                        </Field>
                        <Field orientation={'horizontal'} className='border-b' data-testid="total-cards">
                          <FieldLabel className={statLabelClass}><CardSim />{t('deck.totalCards')}</FieldLabel>
                          <div className="flex justify-between items-center p-1">
                            <span className={statValueClass}>{deck.cards.length}</span>
                          </div>
                        </Field>
                        <Field orientation={'horizontal'} data-testid="faint-memory">
                          <FieldLabel className={statLabelClass}><Brain />{t('character.faintMemory')}</FieldLabel>
                          <div className="flex justify-between items-center p-1">
                            <span className={statValueClass} data-testid="faint-memory-points">{faintMemoryPoints} points</span>
                          </div>
                        </Field>
                      </FieldGroup>
                      {/* Equipment Section */}
                      <EquipmentSelector
                        equipment={EQUIPMENT}
                        selectedEquipment={deck.equipment}
                        onSelect={(equipment: Equipment | null, type?: EquipmentType) => {
                          if (type) selectEquipment(type, equipment);
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right side - Cards in 4-column grid */}
            <div className="sm:col-span-6 lg:col-span-8 space-y-6">
              <Card>
                <CardContent className="p-2 lg:p-6">
                  <DeckDisplay
                    cards={deck.cards}
                    egoLevel={deck.egoLevel}
                    hasPotential={deck.hasPotential}
                    allowedJob={deck.character?.job}
                    onRemoveCard={handleRemoveCard}
                    onUndoCard={undoCard}
                    onCopyCard={handleCopyCard}
                    onConvertCard={handleConvertCard}
                    onUpdateHirameki={updateCardHirameki}
                    onSetGodHirameki={setCardGodHirameki}
                    onSetGodHiramekiEffect={setCardGodHiramekiEffect}
                    onSetHiddenHirameki={setCardHiddenHirameki}
                  />

                </CardContent>
              </Card>
            </div>
          </FieldSet>
        </main>

        {/* Load dialog */}
        <Dialog open={loadOpen} onOpenChange={setLoadOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('deck.loadTitle', { defaultValue: '保存されたデッキを読み込み' })}</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-80 overflow-auto">
              {savedList.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  {t('deck.noSavedDecks', { defaultValue: '保存されたデッキはありません' })}
                </div>
              ) : (
                savedList.map(({ name, savedAt }) => (
                  <div key={name} className="flex items-center justify-between rounded border p-2 gap-2">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(savedAt).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => handleLoadDeck(name)}>
                        {t('deck.load', { defaultValue: '呼び出し' })}
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteSaved(name)}>
                        {t('common.delete', { defaultValue: '削除' })}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between p-4">
                <CardTitle>{t('card.add')}</CardTitle>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-32 sm:w-64"
                  placeholder={t('card.search')}
                />
              </CardHeader>
              <CardContent className="p-4 lg:p-6 pt-2">
                {/* Card Selection for adding cards */}
                  <CardSelector
                    character={deck.character}
                    onAddCard={(card: CznCard) => {
                      const deckCard: DeckCard = {
                        ...card,
                        deckId: `${card.id}_${Date.now()}_${Math.random()}`,
                        selectedHiramekiLevel: 0,
                        godHiramekiType: null,
                        godHiramekiEffectId: null,
                        selectedHiddenHiramekiId: null,
                      };
                      addCard(deckCard);
                    }}
                    onRestoreCard={(card: CznCard) => {
                      const deckCard: DeckCard = {
                        ...card,
                        deckId: `${card.id}_${Date.now()}_${Math.random()}`,
                        selectedHiramekiLevel: 0,
                        godHiramekiType: null,
                        godHiramekiEffectId: null,
                        selectedHiddenHiramekiId: null,
                      };
                      restoreCard(deckCard);
                    }}
                    removedCards={deck.removedCards}
                    convertedCards={deck.convertedCards}
                    presentHiramekiIds={new Set(
                      deck.cards
                        .filter(c => c.type === CardType.CHARACTER)
                        .map(c => c.id)
                    )}
                    searchQuery={searchQuery}
                  />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
