"use client";
import { useTranslations } from 'next-intl';
import { Card } from "./ui/card";
import { CardFrame } from "./CardFrame";
import { CznCard, CardType, JobType, CardCategory } from "@/types";
import { getAddableCards } from "@/lib/data";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCard: (card: CznCard) => void;
  allowedJob?: JobType;
}

export function ConversionModal({ isOpen, onClose, onSelectCard, allowedJob }: ConversionModalProps) {
  const t = useTranslations();
  
  // 変換候補: 共用 / 禁忌のみ
  const allAddableCards = getAddableCards(allowedJob);
  const conversionCards = allAddableCards.filter(
    card => card.type === CardType.SHARED || card.type === CardType.FORBIDDEN
  );
  const sharedCards = conversionCards.filter(c => c.type === CardType.SHARED);
  const forbiddenCards = conversionCards.filter(c => c.type === CardType.FORBIDDEN);

  // 排除カード（UI専用の疑似カード。選択時は除外変換として扱う）
  const exclusionCard: CznCard = {
    id: "__exclusion__",
    name: t("cards.__exclusion__.name"),
    type: CardType.SHARED,
    category: CardCategory.SKILL,
    statuses: [],
    hiramekiVariations: [
      {
        level: 0,
        cost: 0,
        description: t("cards.__exclusion__.descriptions.0")
      }
    ]
  };

  const renderCardTile = (card: CznCard) => {
    const baseVariation = card.hiramekiVariations[0];
    const translatedName = t(`cards.${card.id}.name`, { defaultValue: card.name });
    const description = t(`cards.${card.id}.descriptions.0`, { defaultValue: baseVariation.description });
    const statuses = baseVariation.statuses?.map(s => t(`status.${s}`));

    return (
      <Card
        key={card.id}
        className="cursor-pointer hover:ring-2 hover:ring-primary"
        onClick={() => {
          onSelectCard(card);
          onClose();
        }}
        title={translatedName}
      >
        <CardFrame
          imgUrl={card.imgUrl}
          alt={translatedName}
          cost={baseVariation.cost}
          nameId={`cards.${card.id}.name`}
          nameFallback={card.name}
          category={t(`category.${card.category}`)}
          categoryId={card.category}
          description={description}
          statuses={statuses}
        />
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("common.convert", { defaultValue: "変換" })}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Accordion type="multiple" className="w-full" defaultValue={["shared", "forbidden"]}>

            {/* Shared Cards */}
            {sharedCards.length > 0 && (
              <AccordionItem value="shared">
                <AccordionTrigger className="text-lg font-semibold">
                  {t("card.sharedCards")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[...sharedCards, exclusionCard].map(card => renderCardTile(card))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Forbidden Cards */}
            {forbiddenCards.length > 0 && (
              <AccordionItem value="forbidden">
                <AccordionTrigger className="text-lg font-semibold">
                  {t("card.forbiddenCards")}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {forbiddenCards.map(card => renderCardTile(card))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
