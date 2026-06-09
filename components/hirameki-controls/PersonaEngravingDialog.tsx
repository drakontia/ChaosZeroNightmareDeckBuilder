import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import { PERSONA_CARD_ENGRAVINGS } from "@/lib/persona";
import { getCardInfo } from "@/lib/deck-utils";
import { DeckCard, JobType, PersonaEngraving } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CardFrame } from "@/components/CardFrame";
import { DialogCloseButton } from "@/components/DialogCloseButton";

const dialogContentClass = "max-h-[92vh] overflow-hidden w-[90vw] max-w-7xl flex flex-col";

interface PersonaEngravingDialogProps {
  card: DeckCard;
  egoLevel: number;
  hasPotential: boolean;
  allowedJob?: JobType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetPersonaEngravings: (deckId: string, engravings: PersonaEngraving[]) => void;
}

function PersonaEngravingSection({ title, engravings, selectedEngravings, onToggle }: { title: string; engravings: typeof PERSONA_CARD_ENGRAVINGS; selectedEngravings: PersonaEngraving[]; onToggle: (engraving: PersonaEngraving) => void; }) {
  const t = useTranslations();
  const selectedCount = selectedEngravings.filter((engraving) =>
    engravings.some((definition) => definition.id === engraving.id && definition.alignment === engraving.alignment)
  ).length;

  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <span className="flex items-center gap-2">
          {title}
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium w-5 h-5 shrink-0">
              {selectedCount}
            </span>
          )}
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-2">
          {engravings.map((definition) => {
            const selectedTimes = selectedEngravings.filter(
              (engraving) => engraving.id === definition.id && engraving.alignment === definition.alignment
            ).length;
            const isSelected = selectedTimes > 0;
            return (
              <Button
                key={definition.id}
                type="button"
                variant={isSelected ? "secondary" : "outline"}
                className="h-auto justify-start whitespace-normal text-left gap-2"
                onClick={() => onToggle({ id: definition.id, alignment: definition.alignment })}
              >
                <span className={`shrink-0 w-4 h-4 flex items-center justify-center rounded-full border ${isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"}`}>
                  {isSelected && <Check className="w-3 h-3" />}
                </span>
                {selectedTimes > 1 && (
                  <span className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-medium w-4 h-4 shrink-0">
                    {selectedTimes}
                  </span>
                )}
                {t(`cards.personaMeta.engravings.${definition.descriptionKey}`, { defaultValue: definition.description })}
              </Button>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function PersonaEngravingDialog(props: PersonaEngravingDialogProps) {
  const t = useTranslations();
  const [pendingEngravings, setPendingEngravings] = useState<PersonaEngraving[]>([]);

  useEffect(() => {
    if (props.open) {
      setPendingEngravings(props.card.personaEngravings ?? []);
    }
  }, [props.open, props.card.personaEngravings]);

  const definitions = PERSONA_CARD_ENGRAVINGS.filter((definition) => !props.allowedJob || definition.allowedJobs === "all" || definition.allowedJobs.includes(props.allowedJob));
  const previewCard = {
    ...props.card,
    name: t(`cards.${props.card.id}.name`, { defaultValue: props.card.name }),
    hiramekiVariations: props.card.hiramekiVariations.map((variation) => ({
      ...variation,
      name: variation.name ? t(`cards.${props.card.id}.name.${variation.level}`, { defaultValue: variation.name }) : variation.name,
      description: t(`cards.${props.card.id}.descriptions.${variation.level}`, { defaultValue: variation.description }),
    })),
    personaEngravings: pendingEngravings,
  } as DeckCard;
  const preview = getCardInfo(previewCard, props.egoLevel, props.hasPotential, undefined, {
    persona: {
      getName: (variant) => t(`cards.personaMeta.names.${variant}`),
      getEngravingDescription: (definition) =>
        t(`cards.personaMeta.engravings.${definition.descriptionKey}`, { defaultValue: definition.description }),
    },
    translateGodEffect: (effectId, fallback) => t(`godEffects.${effectId}`, { defaultValue: fallback }),
    translateHiddenEffect: (effectId, fallback) => t(`hiddenEffects.${effectId}`, { defaultValue: fallback }),
  });
  const toggleEngraving = (engraving: PersonaEngraving) =>
    setPendingEngravings((current) => {
      const sameCount = current.filter(
        (item) => item.id === engraving.id && item.alignment === engraving.alignment
      ).length;
      if (sameCount >= 2) {
        return current.filter((item) => !(item.id === engraving.id && item.alignment === engraving.alignment));
      }
      if (current.length >= 2) {
        return current;
      }
      return [...current, engraving];
    });

  const selectedDescriptions = pendingEngravings.map((engraving) => {
    const definition = PERSONA_CARD_ENGRAVINGS.find((d) => d.id === engraving.id && d.alignment === engraving.alignment);
    if (!definition) return null;
    return t(`cards.personaMeta.engravings.${definition.descriptionKey}`, { defaultValue: definition.description });
  }).filter(Boolean);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader><DialogTitle>{t("card.personaEngraving", { defaultValue: "刻印" })}</DialogTitle><DialogCloseButton label={t("common.close", { defaultValue: "閉じる" })} onClick={() => props.onOpenChange(false)} /></DialogHeader>
        <div className="flex-1 overflow-y-auto space-y-6">
          <div className="space-y-3">
            <div className="text-sm text-muted-foreground">{t("card.personaEngravingSelect", { defaultValue: "刻印効果を最大2つまで選択してください" })}</div>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-36 sm:w-44 shrink-0">
                <CardFrame imgUrl={preview.imgUrl ?? props.card.imgUrl} alt={preview.name} cost={preview.cost} name={preview.name} nameFallback={preview.name} category={t(`category.${preview.category ?? props.card.category}`)} categoryId={preview.category ?? props.card.category} description={preview.description} descriptionFallback={preview.description} statuses={preview.statuses?.map((status) => t(`status.${status}`))} className="border" />
              </div>
              {selectedDescriptions.length > 0 && (
                <div className="flex-1 space-y-1.5">
                  <div className="text-xs font-medium text-muted-foreground">{t("card.personaEngravingSelected", { defaultValue: "選択中の刻印" })} ({selectedDescriptions.length}/2)</div>
                  <ul className="space-y-1">
                    {selectedDescriptions.map((desc, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-sm">
                        <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={() => setPendingEngravings([])}>{t("actions.clear", { defaultValue: "クリア" })}</Button><Button type="button" onClick={() => { props.onSetPersonaEngravings(props.card.deckId, pendingEngravings); props.onOpenChange(false); }}>{t("actions.select", { defaultValue: "選択" })}</Button></div>
          <Accordion type="multiple" className="w-full">
            <PersonaEngravingSection title={t("card.personaLightEngraving", { defaultValue: "光の刻印" })} engravings={definitions.filter((definition) => definition.alignment === "light")} selectedEngravings={pendingEngravings} onToggle={toggleEngraving} />
            <PersonaEngravingSection title={t("card.personaDarkEngraving", { defaultValue: "闇の刻印" })} engravings={definitions.filter((definition) => definition.alignment === "dark")} selectedEngravings={pendingEngravings} onToggle={toggleEngraving} />
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
