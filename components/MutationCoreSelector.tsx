"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";

import { MUTATION_CORE_EFFECTS, getMutationCoreEffectsByCategory } from "@/lib/mutation-core";
import { MutationCoreEffectCategory } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field } from "./ui/field";
import { DialogCloseButton } from "./DialogCloseButton";

interface MutationCoreSelectorProps {
  selectedEffectId: string | null;
  onSelect: (effectId: string | null) => void;
}

const CATEGORIES = [
  MutationCoreEffectCategory.BASIC_STATS,
  MutationCoreEffectCategory.CARD_DAMAGE,
  MutationCoreEffectCategory.SHIELD,
  MutationCoreEffectCategory.HEAL,
  MutationCoreEffectCategory.SPECIAL,
] as const;

function MutationCorePreviewButton({ selectedEffectId, onOpenChange }: { selectedEffectId: string | null; onOpenChange: (open: boolean) => void }) {
  const t = useTranslations();
  const selectedEffect = MUTATION_CORE_EFFECTS.find((e) => e.id === selectedEffectId);
  const displayText = selectedEffect ? t(`mutationCore.effects.${selectedEffectId}`, { defaultValue: selectedEffect.description }) : t("mutationCore.noEffect");

  return (
    <Button onClick={() => onOpenChange(true)} variant="outline" className="w-full h-20 sm:h-16 lg:h-20 border-2 border-purple-600 bg-purple-600/10 text-purple-700 dark:text-purple-300 hover:bg-purple-600/20 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5" />
        <span className="font-semibold text-sm">{t("mutationCore.title")}</span>
      </div>
      <span className="text-xs text-center flex-1 ml-2">{displayText}</span>
    </Button>
  );
}

function MutationCoreOptionCard({ effect, selected, onSelect }: { effect: (typeof MUTATION_CORE_EFFECTS)[0]; selected: boolean; onSelect: () => void }) {
  const t = useTranslations();
  const description = t(`mutationCore.effects.${effect.id}`, { defaultValue: effect.description });

  return (
    <Button variant={selected ? "default" : "outline"} className={`h-auto flex-col justify-start p-3 text-left w-full ${selected ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 dark:border-gray-600"}`} onClick={onSelect}>
      <div className="w-full">
        <span className="text-sm font-semibold">{description}</span>
        {effect.costModifier && <span className="text-xs text-gray-500 dark:text-gray-400 block">Cost: {effect.costModifier > 0 ? "+" : ""}{effect.costModifier}</span>}
      </div>
    </Button>
  );
}

export function MutationCoreSelector({ selectedEffectId, onSelect }: MutationCoreSelectorProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(MutationCoreEffectCategory.BASIC_STATS);

  const categoryEffects = useMemo(() => {
    const result: Record<MutationCoreEffectCategory, (typeof MUTATION_CORE_EFFECTS)> = {} as any;
    CATEGORIES.forEach((category) => {
      result[category] = getMutationCoreEffectsByCategory(category);
    });
    return result;
  }, []);

  return (
    <Field>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <MutationCorePreviewButton selectedEffectId={selectedEffectId} onOpenChange={setOpen} />
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-hidden w-[90vw] max-w-3xl flex flex-col">
          <DialogHeader className="flex-row items-center justify-between space-y-0 shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              {t("mutationCore.select")}
            </DialogTitle>
            <DialogCloseButton onClick={() => setOpen(false)} />
          </DialogHeader>

          <div className="flex-1 flex flex-col overflow-hidden gap-4">
            <div className="flex gap-2 flex-wrap shrink-0">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  onClick={() => setActiveTab(category)}
                  variant={activeTab === category ? "default" : "outline"}
                  className={`text-xs sm:text-sm ${activeTab === category ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 dark:border-gray-600"}`}
                >
                  {t(`mutationCore.categories.${category}`)}
                </Button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pr-2">
                <button className={`h-auto flex-col justify-start p-3 text-left w-full rounded-md border-2 transition-colors ${!selectedEffectId ? "bg-purple-600 text-white border-purple-600" : "border-gray-300 dark:border-gray-600 hover:border-purple-400"}`} onClick={() => { onSelect(null); setOpen(false); }}>
                  <span className="text-sm font-semibold">{t("mutationCore.noEffect")}</span>
                </button>

                {categoryEffects[activeTab].map((effect) => (
                  <div key={effect.id}>
                    <MutationCoreOptionCard effect={effect} selected={selectedEffectId === effect.id} onSelect={() => { onSelect(effect.id); setOpen(false); }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Field>
  );
}

