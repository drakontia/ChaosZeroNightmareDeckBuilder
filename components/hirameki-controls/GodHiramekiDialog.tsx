import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { getCardInfo } from "@/lib/deck-utils";
import { DeckCard, GodType } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardFrame } from "@/components/CardFrame";
import { DialogCloseButton } from "@/components/DialogCloseButton";
import { cn } from "@/lib/utils";

const GOD_TYPES = [
  GodType.KILKEN,
  GodType.SECLAID,
  GodType.DIALOS,
  GodType.NIHILUM,
  GodType.VITOL,
  GodType.ORDER,
] as const;
const dialogContentClass = "max-h-[92vh] overflow-hidden w-[90vw] max-w-7xl flex flex-col";
const previewGridClass =
  "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6";

interface GodHiramekiDialogProps {
  card: DeckCard;
  egoLevel: number;
  hasPotential: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetGodHirameki: (deckId: string, godType: GodType | null) => void;
  onSetGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
}

function GodEffectButton({
  card,
  effectId,
  cost,
  selected,
  fallback,
  egoLevel,
  hasPotential,
  onSelect,
}: {
  card: DeckCard;
  effectId: string;
  cost: number | "X" | "unusable";
  selected: boolean;
  fallback: string;
  egoLevel: number;
  hasPotential: boolean;
  onSelect: () => void;
}) {
  const t = useTranslations();
  const previewBaseCard = {
    ...card,
    godHiramekiType: null,
    godHiramekiEffectId: null,
  };
  const localizedCard = previewBaseCard.id.startsWith("persona_")
    ? {
        ...previewBaseCard,
        name: t(`cards.${card.id}.name`, { defaultValue: card.name }),
        hiramekiVariations: previewBaseCard.hiramekiVariations.map((variation) => ({
          ...variation,
          name: variation.name
            ? t(`cards.${card.id}.name.${variation.level}`, { defaultValue: variation.name })
            : variation.name,
          description: t(`cards.${card.id}.descriptions.${variation.level}`, {
            defaultValue: variation.description,
          }),
        })),
      }
    : previewBaseCard;
  const baseInfo = getCardInfo(localizedCard, egoLevel, hasPotential, undefined, {
    persona: {
      getName: (variant) => t(`cards.personaMeta.names.${variant}`),
      getEngravingDescription: (definition) =>
        t(`cards.personaMeta.engravings.${definition.descriptionKey}`, {
          defaultValue: definition.description,
        }),
    },
    translateGodEffect: (godEffectId, defaultValue) =>
      t(`godEffects.${godEffectId}`, { defaultValue }),
    translateHiddenEffect: (hiddenEffectId, defaultValue) =>
      t(`hiddenEffects.${hiddenEffectId}`, { defaultValue }),
  });
  const hasPersonaEngravings =
    card.id.startsWith("persona_") && (card.personaEngravings?.length ?? 0) > 0;
  const variationName = localizedCard.hiramekiVariations[card.selectedHiramekiLevel]?.name;
  const nameId = hasPersonaEngravings
    ? undefined
    : variationName
      ? `cards.${card.id}.name.${card.selectedHiramekiLevel}`
      : `cards.${card.id}.name`;
  return (
    <button
      className={cn("rounded-md", selected ? "ring-2 ring-primary" : "")}
      onClick={onSelect}
      title={t(`godEffects.${effectId}`, { defaultValue: effectId })}
    >
      <CardFrame
        imgUrl={baseInfo.imgUrl ?? card.imgUrl}
        alt={baseInfo.name}
        cost={cost}
        name={hasPersonaEngravings ? baseInfo.name : undefined}
        nameId={nameId}
        nameFallback={variationName ?? baseInfo.name}
        category={t(`category.${baseInfo.category ?? card.category}`)}
        categoryId={baseInfo.category ?? card.category}
        description={hasPersonaEngravings ? baseInfo.description : undefined}
        descriptionId={
          hasPersonaEngravings
            ? undefined
            : `cards.${card.id}.descriptions.${card.selectedHiramekiLevel}`
        }
        descriptionFallback={card.hiramekiVariations[card.selectedHiramekiLevel]?.description}
        godEffectId={effectId}
        godEffectFallback={fallback}
        statuses={baseInfo.statuses?.map((status) => t(`status.${status}`))}
        className="border"
        variant="default"
      />
    </button>
  );
}

export function GodHiramekiDialog(props: GodHiramekiDialogProps) {
  const t = useTranslations();
  const [selectedGod, setSelectedGod] = useState<GodType | null>(null);

  useEffect(() => {
    if (props.open) {
      setSelectedGod(props.card.godHiramekiType ?? GodType.KILKEN);
    }
  }, [props.open, props.card.godHiramekiType]);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <div className="flex items-center gap-2 pr-14">
            <DialogTitle className="text-left">{t("card.godSelect")}</DialogTitle>
            <span aria-hidden>≫</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="default" aria-label={t("card.godSelect")}>
                  {t(`god.${selectedGod ?? GodType.KILKEN}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("card.godSelect")}</DropdownMenuLabel>
                {GOD_TYPES.map((god) => (
                  <DropdownMenuItem key={god} onClick={() => setSelectedGod(god)}>
                    {t(`god.${god}`)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DialogCloseButton
            onClick={() => {
              props.onSetGodHirameki(props.card.deckId, null);
              props.onSetGodHiramekiEffect(props.card.deckId, null);
              props.onOpenChange(false);
            }}
          />
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className={previewGridClass}>
            {GOD_HIRAMEKI_EFFECTS.filter(
              (effect) =>
                effect.gods === "all" || effect.gods.includes(selectedGod ?? GodType.KILKEN),
            ).map((effect) => {
              const previewCost = getCardInfo(
                {
                  ...props.card,
                  godHiramekiType: selectedGod ?? GodType.KILKEN,
                  godHiramekiEffectId: effect.id,
                },
                props.egoLevel,
                props.hasPotential,
              ).cost;

              return (
                <GodEffectButton
                  key={effect.id}
                  card={props.card}
                  effectId={effect.id}
                  cost={previewCost}
                  selected={
                    props.card.godHiramekiType === (selectedGod ?? GodType.KILKEN) &&
                    props.card.godHiramekiEffectId === effect.id
                  }
                  fallback={effect.additionalEffect}
                  egoLevel={props.egoLevel}
                  hasPotential={props.hasPotential}
                  onSelect={() => {
                    props.onSetGodHirameki(props.card.deckId, selectedGod ?? GodType.KILKEN);
                    props.onSetGodHiramekiEffect(props.card.deckId, effect.id);
                    props.onOpenChange(false);
                  }}
                />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
