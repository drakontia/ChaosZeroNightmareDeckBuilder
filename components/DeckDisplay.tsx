"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { DeckCard, GodType } from "@/types";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { Card as UiCard } from "./ui/card";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { getCardInfo } from "@/lib/deck-utils";
import { cn } from "@/lib/utils";
import { CircleX, Lightbulb, LightbulbOff, Zap, ZapOff, Undo2, Copy, ArrowRightLeft } from "lucide-react";

interface DeckDisplayProps {
  cards: DeckCard[];
  egoLevel: number;
  hasPotential: boolean;
  onRemoveCard: (deckId: string) => void;
  onUndoCard: (deckId: string) => void;
  onCopyCard: (deckId: string) => void;
  onConvertCard: (deckId: string) => void;
  onUpdateHirameki: (deckId: string, hiramekiLevel: number) => void;
  onSetGodHirameki: (deckId: string, godType: GodType | null) => void;
}

export function DeckDisplay({ cards, egoLevel, hasPotential, onRemoveCard, onUndoCard, onCopyCard, onConvertCard, onUpdateHirameki, onSetGodHirameki }: DeckDisplayProps) {
  const t = useTranslations();
  const [openHiramekiFor, setOpenHiramekiFor] = useState<string | null>(null);
  const [openGodFor, setOpenGodFor] = useState<string | null>(null);
  if (cards.length === 0) {
    return (
      <UiCard className="border-dashed border-2 p-10 text-center text-muted-foreground">
        キャラクターを選択すると開始カードが表示されます
      </UiCard>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const cardInfo = getCardInfo(card, egoLevel, hasPotential);
        const maxHiramekiLevel = card.hiramekiVariations.length - 1;
        const isBasicCard = card.isBasicCard === true;

        // テキストを白＋黒縁取りに
        const textShadowStyle = {
          textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000, 2px 0 0 #000, 0 -2px 0 #000, -2px 0 0 #000'
        } as const;

        return (
          <UiCard key={card.deckId} className="relative overflow-hidden aspect-[2/3]">
            {/* 背景画像 */}
            {card.imgUrl && (
              <Image
                src={card.imgUrl}
                alt={card.name}
                fill
                className={cn("object-cover", card.isCopied && "scale-x-[-1]")}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
            {/* グラデーションで読みやすさ確保 */}
            <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/60" />

            {/* 上部オーバーレイ：左に大コスト、右に名前/種類 */}
            <div className="flex items-start p-3 gap-3 z-index-10 relative">
              <div className="flex flex-col items-start">
                <div className="text-5xl font-extrabold text-white text-shadow-2xl leading-none" >{cardInfo.cost}</div>
                {!isBasicCard && (
                  <div className="mt-2 flex flex-col gap-1">
                    {card.isCopied && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-600/90 text-white text-shadow-2xl">
                        📋 {t("card.copied", { defaultValue: "コピー済み" })}
                      </span>
                    )}
                    {card.selectedHiramekiLevel > 0 && !card.godHiramekiType && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-purple-600/90 text-white text-shadow-2xl">
                        ★ {t("card.hirameki")} {t("card.level")}{card.selectedHiramekiLevel}
                      </span>
                    )}
                    {card.godHiramekiType && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-yellow-400 text-black">
                        ✦ {GOD_HIRAMEKI_EFFECTS[card.godHiramekiType].name}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-base md:text-2xl font-bold text-white text-shadow-2xl truncate" title={card.name}>{card.name}</div>
                <div className="text-xs md:text-base text-white/90 text-shadow-4xl">{t(`category.${card.category}`)}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  aria-label={t("common.delete", { defaultValue: "削除" })}
                  onClick={() => onRemoveCard(card.deckId)}
                  className="inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground hover:opacity-90 transition h-8 w-8"
                  title={t("common.delete", { defaultValue: "削除" })}
                >
                  <CircleX className="h-5 w-5" />
                </button>
                {!card.isBasicCard && (
                  <>
                    <button
                      type="button"
                      aria-label={t("common.copy", { defaultValue: "コピー" })}
                      onClick={() => onCopyCard(card.deckId)}
                      className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:opacity-90 transition h-8 w-8"
                      title={t("common.copy", { defaultValue: "コピー" })}
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  aria-label={t("common.convert", { defaultValue: "変換" })}
                  onClick={() => onConvertCard(card.deckId)}
                  className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:opacity-90 transition h-8 w-8"
                  title={t("common.convert", { defaultValue: "変換" })}
                >
                  <ArrowRightLeft className="h-5 w-5" />
                </button>

                {!card.isStartingCard && (
                  <>
                    <button
                      type="button"
                      aria-label="戻す"
                      onClick={() => onUndoCard(card.deckId)}
                      className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:opacity-90 transition h-8 w-8"
                      title="デッキから戻す"
                    >
                      <Undo2 className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 左下：ヒラメキ/神ヒラメキボタン */}
            {!isBasicCard && (
              <div className="flex flex-col pt-1 pl-3 gap-2 z-index-10 relative">
                <button
                  type="button"
                  aria-label={t("card.hirameki")}
                  title={t("card.hirameki")}
                  onClick={() => setOpenHiramekiFor(card.deckId)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full transition h-8 w-8",
                    card.selectedHiramekiLevel > 0
                      ? "bg-yellow-400 text-black hover:bg-yellow-400/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  )}
                >
                  {card.selectedHiramekiLevel > 0 ? (
                    <Lightbulb className="h-5 w-5" />
                  ) : (
                    <LightbulbOff className="h-5 w-5" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label={t("card.godSelect")}
                  title={t("card.godSelect")}
                  onClick={() => setOpenGodFor(card.deckId)}
                  className={cn(
                    "inline-flex items-center justify-center rounded-full transition h-8 w-8",
                    card.godHiramekiType
                      ? "bg-yellow-400 text-black hover:bg-yellow-400/90"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  )}
                >
                  {card.godHiramekiType ? (
                    <Zap className="h-5 w-5" />
                  ) : (
                    <ZapOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            )}

            {/* 下部中央：ステータスと説明 */}
            <div className="absolute left-2 right-2 bottom-20 text-center text-white text-xs md:text-sm text-shadow-4xl whitespace-pre-wrap">
              {cardInfo.status && (
                <div className="mb-1 text-[11px] font-semibold text-purple-300">[{cardInfo.status}]</div>
              )}
              {cardInfo.description}
            </div>

            {/* ヒラメキ選択モーダル（画像付きカード形プレビュー） */}
            <Dialog open={openHiramekiFor === card.deckId} onOpenChange={(open) => setOpenHiramekiFor(open ? card.deckId : null)}>
              <DialogContent className="max-h-[85vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>{t("card.hirameki")}</DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-0 overflow-y-auto max-h-[65vh] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Array.from({ length: maxHiramekiLevel + 1 }, (_, i) => i).map((level) => {
                    const preview: DeckCard = { ...card, selectedHiramekiLevel: level } as DeckCard;
                    const info = getCardInfo(preview, egoLevel, hasPotential);
                    return (
                      <button
                        key={level}
                        className={cn("relative overflow-hidden aspect-[2/3] rounded-md border", card.selectedHiramekiLevel === level ? "ring-2 ring-primary" : "")}
                        onClick={() => { onUpdateHirameki(card.deckId, level); setOpenHiramekiFor(null); }}
                        title={level === 0 ? "基本" : `Lv${level}`}
                      >
                        {card.imgUrl && (
                          <Image src={card.imgUrl} alt={card.name} fill className="object-cover" sizes="25vw" />
                        )}
                        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/60" />
                        <div className="absolute top-2 left-2 right-2 flex items-start gap-3">
                          <div className="text-2xl font-extrabold text-white text-shadow-2xl">{info.cost}</div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-white text-shadow-2xl truncate">{card.name}</div>
                            <div className="text-xs text-white/90 text-shadow-2xl">{level === 0 ? t("card.basicCard") : `${t("card.level")}${level}`}</div>
                          </div>
                        </div>
                        <div className="absolute left-2 right-2 bottom-2 text-center text-white text-[11px] text-shadow-2xl">{info.description}</div>
                      </button>
                    );
                  })}
                </div>
              </DialogContent>
            </Dialog>

            {/* 神ヒラメキ選択モーダル（リスト表示） */}
            <Dialog open={openGodFor === card.deckId} onOpenChange={(open) => setOpenGodFor(open ? card.deckId : null)}>
              <DialogContent className="max-h-[80vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>{t("card.godSelect")}</DialogTitle>
                </DialogHeader>
                <div className="p-6 pt-0 overflow-y-auto max-h-[60vh] space-y-2">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { onSetGodHirameki(card.deckId, null); setOpenGodFor(null); }}>
                    {t('common.remove', { defaultValue: '外す' })}
                  </Button>
                  {[GodType.KILKEN, GodType.SECLAID, GodType.DIALOS, GodType.NIHILUM, GodType.VITOL].map((g) => (
                    <Button key={g} variant={card.godHiramekiType === g ? "secondary" : "outline"} className="w-full justify-between" onClick={() => { onSetGodHirameki(card.deckId, g); setOpenGodFor(null); }}>
                      <span>✦ {GOD_HIRAMEKI_EFFECTS[g].name}</span>
                      <span className="text-xs text-muted-foreground">{t('actions.select')}</span>
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </UiCard>
        );
      })}
    </div>
  );
}
