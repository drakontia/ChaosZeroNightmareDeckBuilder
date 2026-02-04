"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, LightbulbOff, Zap, ZapOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeckCard, GodType } from "@/types";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { HIDDEN_HIRAMEKI_EFFECTS } from "@/lib/hidden-hirameki";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { CardFrame } from "./CardFrame";
import { DialogCloseButton } from "./DialogCloseButton";
import { getCardInfo } from "@/lib/deck-utils";

const GOD_TYPES = [GodType.KILKEN, GodType.SECLAID, GodType.DIALOS, GodType.NIHILUM, GodType.VITOL] as const;
const dialogContentClass = "max-h-[92vh] overflow-hidden w-[90vw] max-w-7xl flex flex-col";
const toggleIconButtonClass = "inline-flex items-center justify-center h-6 xl:h-9 w-6 xl:w-9 rounded-full transition";
const previewGridClass = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6";

interface HiramekiControlsProps {
  card: DeckCard;
  egoLevel: number;
  hasPotential: boolean;
  onUpdateHirameki: (deckId: string, hiramekiLevel: number) => void;
  onSetGodHirameki: (deckId: string, godType: GodType | null) => void;
  onSetGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  onSetHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
}

export function HiramekiControls({ 
  card, 
  egoLevel, 
  hasPotential, 
  onUpdateHirameki, 
  onSetGodHirameki,
  onSetGodHiramekiEffect,
  onSetHiddenHirameki,
}: HiramekiControlsProps) {
  const t = useTranslations();
  const [openHirameki, setOpenHirameki] = useState(false);
  const [openGod, setOpenGod] = useState(false);
  const [selectedGod, setSelectedGod] = useState<GodType | null>(null);
  
  useEffect(() => {
    if (openGod) {
      setSelectedGod(card.godHiramekiType ?? GodType.KILKEN);
    }
  }, [openGod, card.godHiramekiType]);
  
  const isHiramekiActive = card.selectedHiramekiLevel > 0 || card.selectedHiddenHiramekiId !== null;
  const isGodActive = Boolean(card.godHiramekiType);
  const maxHiramekiLevel = card.hiramekiVariations.length - 1;

  const actionIconClass = "h-4 xl:h-5 w-4 xl:w-5";

  return (
    <>
      <Button
        type="button"
        size="icon"
        aria-label={t("card.hirameki")}
        title={t("card.hirameki")}
        onClick={() => setOpenHirameki(true)}
        className={cn(
          toggleIconButtonClass,
          isHiramekiActive
            ? "bg-yellow-400 text-black hover:bg-yellow-400/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        )}
      >
        {isHiramekiActive ? (
          <Lightbulb className={actionIconClass} />
        ) : (
          <LightbulbOff className={actionIconClass} />
        )}
      </Button>
      <Button
        type="button"
        size="icon"
        aria-label={t("card.godSelect")}
        title={t("card.godSelect")}
        onClick={() => setOpenGod(true)}
        className={cn(
          toggleIconButtonClass,
          isGodActive
            ? "bg-yellow-400 text-black hover:bg-yellow-400/90"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
        )}
      >
        {isGodActive ? (
          <Zap className={actionIconClass} />
        ) : (
          <ZapOff className={actionIconClass} />
        )}
      </Button>

      {/* ヒラメキ選択モーダル（画像付きカード形プレビュー） */}
      <Dialog open={openHirameki} onOpenChange={setOpenHirameki}>
        <DialogContent className={dialogContentClass}>
          <DialogHeader>
            <DialogTitle>{t("card.hirameki")}</DialogTitle>
            <DialogCloseButton
              onClick={() => { onUpdateHirameki(card.deckId, 0); onSetHiddenHirameki(card.deckId, null); setOpenHirameki(false); }}
            />
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            {/* 通常のヒラメキ */}
            <div className={cn(previewGridClass, "mb-4")}>
              {Array.from({ length: maxHiramekiLevel }, (_, i) => i + 1).map((level) => {
                const preview: DeckCard = { ...card, selectedHiramekiLevel: level, selectedHiddenHiramekiId: null } as DeckCard;
                const info = getCardInfo(preview, egoLevel, hasPotential);
                const variationName = card.hiramekiVariations[level]?.name;
                const nameId = variationName
                  ? `cards.${card.id}.name.${level}`
                  : `cards.${card.id}.name`;
                const nameFallback = variationName ?? info.name;
                return (
                  <button
                    key={level}
                    className={cn("rounded-md", card.selectedHiramekiLevel === level && card.selectedHiddenHiramekiId === null ? "ring-2 ring-primary" : "")}
                    onClick={() => { onUpdateHirameki(card.deckId, level); onSetHiddenHirameki(card.deckId, null); setOpenHirameki(false); }}
                    title={`Lv${level}`}
                  >
                    <CardFrame
                      imgUrl={card.imgUrl}
                      alt={card.name}
                      cost={info.cost}
                      nameId={nameId}
                      nameFallback={nameFallback}
                      category={t(`category.${info.category ?? card.category}`)}
                      categoryId={info.category ?? card.category}
                      descriptionId={`cards.${card.id}.descriptions.${level}`}
                      descriptionFallback={info.description}
                      statuses={info.statuses?.map(s => t(`status.${s}`))}
                      className="border"
                    />
                  </button>
                );
              })}
            </div>

            {/* 隠しヒラメキセクション（Lv0の時のみ表示） */}
            {HIDDEN_HIRAMEKI_EFFECTS.length > 0 && card.selectedHiramekiLevel === 0 && card.selectedHiddenHiramekiId === null && (
              <Accordion type="single" collapsible className="mt-6">
                <AccordionItem value="hidden-hirameki">
                  <AccordionTrigger className="text-lg font-semibold">
                    {t("card.hiddenHirameki", { defaultValue: "隠しヒラメキ" })}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className={previewGridClass}>
                      {HIDDEN_HIRAMEKI_EFFECTS.map((hiddenEffect) => {
                        const preview: DeckCard = { 
                          ...card, 
                          selectedHiddenHiramekiId: hiddenEffect.id
                        } as DeckCard;
                        const info = getCardInfo(preview, egoLevel, hasPotential);
                        const variationName = card.hiramekiVariations[card.selectedHiramekiLevel]?.name;
                        const nameId = variationName
                          ? `cards.${card.id}.name.${card.selectedHiramekiLevel}`
                          : `cards.${card.id}.name`;
                        const nameFallback = variationName ?? info.name;
                        return (
                          <button
                            key={`hidden-${hiddenEffect.id}`}
                            className={cn("rounded-md", card.selectedHiddenHiramekiId === hiddenEffect.id ? "ring-2 ring-purple-400" : "")}
                            onClick={() => { 
                              onSetHiddenHirameki(card.deckId, hiddenEffect.id); 
                              setOpenHirameki(false); 
                            }}
                            title={hiddenEffect.id}
                          >
                            <CardFrame
                              imgUrl={card.imgUrl}
                              alt={card.name}
                              cost={info.cost}
                              nameId={nameId}
                              nameFallback={nameFallback}
                              category={t(`category.${info.category ?? card.category}`)}
                              categoryId={info.category ?? card.category}
                              descriptionId={`cards.${card.id}.descriptions.0`}
                              descriptionFallback={card.hiramekiVariations[0].description}
                              hiddenEffectId={hiddenEffect.id}
                              hiddenEffectFallback={hiddenEffect.additionalEffect}
                              statuses={info.statuses?.map(s => t(`status.${s}`))}
                              className="border border-purple-300"
                              variant="default"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 神ヒラメキ選択モーダル（横並びボタングループ + 効果プレビュー） */}
      <Dialog open={openGod} onOpenChange={setOpenGod}>
        <DialogContent className={dialogContentClass}>
          <DialogHeader>
            <div className="flex items-center gap-2 pr-14">
              <DialogTitle className="text-left">{t("card.godSelect")}</DialogTitle>
              <span aria-hidden>≫</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="default" aria-label={t('card.godSelect')}>
                    {t(`god.${selectedGod ?? GodType.KILKEN}`)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('card.godSelect')}</DropdownMenuLabel>
                  {GOD_TYPES.map((g) => (
                    <DropdownMenuItem key={g} onClick={() => setSelectedGod(g)}>
                      {t(`god.${g}`)}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DialogCloseButton
              onClick={() => { onSetGodHirameki(card.deckId, null); onSetGodHiramekiEffect(card.deckId, null); setOpenGod(false); }}
            />
          </DialogHeader>

          {/* 効果適用済みカードのプレビュー選択 */}
          <div className="flex-1 overflow-y-auto">
            <div className={previewGridClass}>
              {GOD_HIRAMEKI_EFFECTS.filter(e => e.gods === "all" || e.gods.includes(selectedGod ?? GodType.KILKEN)).map((effect) => {
                const activeGod = selectedGod ?? GodType.KILKEN;
                const baseInfo = getCardInfo(card, egoLevel, hasPotential);
                const variationName = card.hiramekiVariations[card.selectedHiramekiLevel]?.name;
                const nameId = variationName
                  ? `cards.${card.id}.name.${card.selectedHiramekiLevel}`
                  : `cards.${card.id}.name`;
                const nameFallback = variationName ?? baseInfo.name;
                const costWithGod = (typeof baseInfo.cost === 'number' ? baseInfo.cost : parseInt(baseInfo.cost, 10)) + (effect.costModifier ?? 0);
                const isSelected = card.godHiramekiType === activeGod && card.godHiramekiEffectId === effect.id;
                return (
                  <button
                    key={effect.id}
                    className={cn("rounded-md", isSelected ? "ring-2 ring-primary" : "")}
                    onClick={() => { onSetGodHirameki(card.deckId, activeGod); onSetGodHiramekiEffect(card.deckId, effect.id); setOpenGod(false); }}
                    title={t(`godEffects.${effect.id}`, { defaultValue: effect.id })}
                  >
                    <CardFrame
                      imgUrl={card.imgUrl}
                      alt={card.name}
                      cost={costWithGod}
                      nameId={nameId}
                      nameFallback={nameFallback}
                      category={t(`category.${baseInfo.category ?? card.category}`)}
                      categoryId={baseInfo.category ?? card.category}
                      descriptionId={`cards.${card.id}.descriptions.${card.selectedHiramekiLevel}`}
                      descriptionFallback={card.hiramekiVariations[card.selectedHiramekiLevel]?.description}
                      godEffectId={effect.id}
                      godEffectFallback={effect.additionalEffect}
                      statuses={baseInfo.statuses?.map(s => t(`status.${s}`))}
                      className="border"
                      variant="default"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
