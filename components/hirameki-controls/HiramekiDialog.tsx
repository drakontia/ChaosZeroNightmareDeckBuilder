import { useTranslations } from "next-intl";

import { HIDDEN_HIRAMEKI_EFFECTS } from "@/lib/hidden-hirameki";
import { getCardInfo } from "@/lib/deck-utils";
import { DeckCard } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardFrame } from "@/components/CardFrame";
import { DialogCloseButton } from "@/components/DialogCloseButton";
import { cn } from "@/lib/utils";

const dialogContentClass = "max-h-[92vh] overflow-hidden w-[90vw] max-w-7xl flex flex-col";
const previewGridClass =
  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6";

interface HiramekiDialogProps {
  card: DeckCard;
  egoLevel: number;
  hasPotential: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateHirameki: (deckId: string, hiramekiLevel: number) => void;
  onSetHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
}

function HiramekiPreviewButton({
  card,
  preview,
  selected,
  egoLevel,
  hasPotential,
  onSelect,
}: {
  card: DeckCard;
  preview: DeckCard;
  selected: boolean;
  egoLevel: number;
  hasPotential: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations();
  const localizedPreview = preview.id.startsWith("persona_")
    ? {
        ...preview,
        name: t(`cards.${preview.id}.name`, { defaultValue: preview.name }),
        hiramekiVariations: preview.hiramekiVariations.map((variation) => ({
          ...variation,
          name: variation.name
            ? t(`cards.${preview.id}.name.${variation.level}`, { defaultValue: variation.name })
            : variation.name,
          description: t(`cards.${preview.id}.descriptions.${variation.level}`, {
            defaultValue: variation.description,
          }),
        })),
      }
    : preview;
  const info = getCardInfo(localizedPreview, egoLevel, hasPotential, undefined, {
    persona: {
      getName: (variant) => t(`cards.personaMeta.names.${variant}`),
      getEngravingDescription: (definition) =>
        t(`cards.personaMeta.engravings.${definition.descriptionKey}`, {
          defaultValue: definition.description,
        }),
    },
    translateGodEffect: (effectId, fallback) =>
      t(`godEffects.${effectId}`, { defaultValue: fallback }),
    translateHiddenEffect: (effectId, fallback) =>
      t(`hiddenEffects.${effectId}`, { defaultValue: fallback }),
  });
  const hasPersonaEngravings =
    preview.id.startsWith("persona_") && (preview.personaEngravings?.length ?? 0) > 0;
  const variationName = localizedPreview.hiramekiVariations[preview.selectedHiramekiLevel]?.name;
  const nameId = hasPersonaEngravings
    ? undefined
    : variationName
      ? `cards.${card.id}.name.${preview.selectedHiramekiLevel}`
      : `cards.${card.id}.name`;
  return (
    <button
      className={cn("rounded-md", selected ? "ring-2 ring-primary" : "")}
      onClick={onSelect}
      title={`Lv${preview.selectedHiramekiLevel}`}
    >
      <CardFrame
        imgUrl={info.imgUrl ?? card.imgUrl}
        alt={info.name}
        cost={info.cost}
        name={hasPersonaEngravings ? info.name : undefined}
        nameId={nameId}
        nameFallback={variationName ?? info.name}
        category={t(`category.${info.category ?? card.category}`)}
        categoryId={info.category ?? card.category}
        description={hasPersonaEngravings ? info.description : undefined}
        descriptionId={
          hasPersonaEngravings
            ? undefined
            : `cards.${card.id}.descriptions.${preview.selectedHiramekiLevel}`
        }
        descriptionFallback={info.description}
        statuses={info.statuses?.map((status) => t(`status.${status}`))}
        className="border"
      />
    </button>
  );
}

function HiddenHiramekiButton({
  card,
  hiddenId,
  egoLevel,
  hasPotential,
  selected,
  onSelect,
}: {
  card: DeckCard;
  hiddenId: string;
  egoLevel: number;
  hasPotential: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations();
  const preview = { ...card, selectedHiddenHiramekiId: hiddenId } as DeckCard;
  const localizedPreview = preview.id.startsWith("persona_")
    ? {
        ...preview,
        name: t(`cards.${preview.id}.name`, { defaultValue: preview.name }),
        hiramekiVariations: preview.hiramekiVariations.map((variation) => ({
          ...variation,
          name: variation.name
            ? t(`cards.${preview.id}.name.${variation.level}`, { defaultValue: variation.name })
            : variation.name,
          description: t(`cards.${preview.id}.descriptions.${variation.level}`, {
            defaultValue: variation.description,
          }),
        })),
      }
    : preview;
  const info = getCardInfo(localizedPreview, egoLevel, hasPotential, undefined, {
    persona: {
      getName: (variant) => t(`cards.personaMeta.names.${variant}`),
      getEngravingDescription: (definition) =>
        t(`cards.personaMeta.engravings.${definition.descriptionKey}`, {
          defaultValue: definition.description,
        }),
    },
    translateGodEffect: (effectId, fallback) =>
      t(`godEffects.${effectId}`, { defaultValue: fallback }),
    translateHiddenEffect: (effectId, fallback) =>
      t(`hiddenEffects.${effectId}`, { defaultValue: fallback }),
  });
  const hasPersonaEngravings =
    preview.id.startsWith("persona_") && (preview.personaEngravings?.length ?? 0) > 0;
  return (
    <button
      className={cn("rounded-md", selected ? "ring-2 ring-purple-400" : "")}
      onClick={onSelect}
      title={hiddenId}
    >
      <CardFrame
        imgUrl={info.imgUrl ?? card.imgUrl}
        alt={info.name}
        cost={info.cost}
        name={hasPersonaEngravings ? info.name : undefined}
        nameId={hasPersonaEngravings ? undefined : `cards.${card.id}.name`}
        nameFallback={info.name}
        category={t(`category.${info.category ?? card.category}`)}
        categoryId={info.category ?? card.category}
        description={hasPersonaEngravings ? info.description : undefined}
        descriptionId={hasPersonaEngravings ? undefined : `cards.${card.id}.descriptions.0`}
        descriptionFallback={card.hiramekiVariations[0].description}
        hiddenEffectId={hasPersonaEngravings ? undefined : hiddenId}
        hiddenEffectFallback={
          hasPersonaEngravings
            ? undefined
            : HIDDEN_HIRAMEKI_EFFECTS.find((effect) => effect.id === hiddenId)?.additionalEffect
        }
        statuses={info.statuses?.map((status) => t(`status.${status}`))}
        className="border border-purple-300"
        variant="default"
      />
    </button>
  );
}

export function HiramekiDialog(props: HiramekiDialogProps) {
  const t = useTranslations();
  const maxHiramekiLevel = props.card.hiramekiVariations.length - 1;
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>{t("card.hirameki")}</DialogTitle>
          <DialogCloseButton
            onClick={() => {
              props.onUpdateHirameki(props.card.deckId, 0);
              props.onSetHiddenHirameki(props.card.deckId, null);
              props.onOpenChange(false);
            }}
          />
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className={cn(previewGridClass, "mb-4")}>
            {Array.from({ length: maxHiramekiLevel }, (_, index) => index + 1).map((level) => (
              <HiramekiPreviewButton
                key={level}
                card={props.card}
                preview={
                  {
                    ...props.card,
                    selectedHiramekiLevel: level,
                    selectedHiddenHiramekiId: null,
                  } as DeckCard
                }
                selected={
                  props.card.selectedHiramekiLevel === level &&
                  props.card.selectedHiddenHiramekiId === null
                }
                egoLevel={props.egoLevel}
                hasPotential={props.hasPotential}
                onSelect={() => {
                  props.onUpdateHirameki(props.card.deckId, level);
                  props.onSetHiddenHirameki(props.card.deckId, null);
                  props.onOpenChange(false);
                }}
              />
            ))}
          </div>
          {HIDDEN_HIRAMEKI_EFFECTS.length > 0 && props.card.selectedHiramekiLevel === 0 ? (
            <Accordion type="single" collapsible className="mt-6">
              <AccordionItem value="hidden-hirameki">
                <AccordionTrigger className="text-lg font-semibold">
                  {t("card.hiddenHirameki", { defaultValue: "隠しヒラメキ" })}
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className={previewGridClass}>
                    {HIDDEN_HIRAMEKI_EFFECTS.map((effect) => (
                      <HiddenHiramekiButton
                        key={effect.id}
                        card={props.card}
                        hiddenId={effect.id}
                        egoLevel={props.egoLevel}
                        hasPotential={props.hasPotential}
                        selected={props.card.selectedHiddenHiramekiId === effect.id}
                        onSelect={() => {
                          props.onSetHiddenHirameki(props.card.deckId, effect.id);
                          props.onOpenChange(false);
                        }}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
