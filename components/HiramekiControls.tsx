"use client";

import { useState, lazy, Suspense } from "react";
import dynamic from "next/dynamic";

import { useTranslations } from "next-intl";
import { Lightbulb, LightbulbOff, Sparkles, Zap, ZapOff } from "lucide-react";

import { DeckCard, GodType, JobType, PersonaEngraving } from "@/types";
import { ControlButton } from "./hirameki-controls";

const HiramekiDialog = dynamic(
  () => import("./hirameki-controls/HiramekiDialog").then((m) => ({ default: m.HiramekiDialog })),
  { ssr: false }
);

const GodHiramekiDialog = dynamic(
  () => import("./hirameki-controls/GodHiramekiDialog").then((m) => ({ default: m.GodHiramekiDialog })),
  { ssr: false }
);

const PersonaEngravingDialog = dynamic(
  () => import("./hirameki-controls/PersonaEngravingDialog").then((m) => ({ default: m.PersonaEngravingDialog })),
  { ssr: false }
);

interface HiramekiControlsProps {
  card: DeckCard;
  egoLevel: number;
  hasPotential: boolean;
  allowedJob?: JobType;
  onUpdateHirameki: (deckId: string, hiramekiLevel: number) => void;
  onSetGodHirameki: (deckId: string, godType: GodType | null) => void;
  onSetGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  onSetHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
  onSetPersonaEngravings: (deckId: string, engravings: PersonaEngraving[]) => void;
}

const actionIconClass = "h-4 xl:h-5 w-4 xl:w-5";

export function HiramekiControls(props: HiramekiControlsProps) {
  const t = useTranslations();
  const [openHirameki, setOpenHirameki] = useState(false);
  const [openGod, setOpenGod] = useState(false);
  const [openPersona, setOpenPersona] = useState(false);
  const isPersonaCard = props.card.id.startsWith("persona_");

  return (
    <>
      <ControlButton active={props.card.selectedHiramekiLevel > 0 || props.card.selectedHiddenHiramekiId !== null} label={t("card.hirameki")} onClick={() => setOpenHirameki(true)} activeIcon={<Lightbulb className={actionIconClass} />} inactiveIcon={<LightbulbOff className={actionIconClass} />} />
      <ControlButton active={Boolean(props.card.godHiramekiType)} label={t("card.godSelect")} onClick={() => setOpenGod(true)} activeIcon={<Zap className={actionIconClass} />} inactiveIcon={<ZapOff className={actionIconClass} />} />
      {isPersonaCard ? <ControlButton active={(props.card.personaEngravings?.length ?? 0) > 0} label={t("card.personaEngraving", { defaultValue: "刻印" })} onClick={() => setOpenPersona(true)} activeIcon={<Sparkles className={actionIconClass} />} inactiveIcon={<Sparkles className={actionIconClass} />} /> : null}
      <HiramekiDialog card={props.card} egoLevel={props.egoLevel} hasPotential={props.hasPotential} open={openHirameki} onOpenChange={setOpenHirameki} onUpdateHirameki={props.onUpdateHirameki} onSetHiddenHirameki={props.onSetHiddenHirameki} />
      <GodHiramekiDialog card={props.card} egoLevel={props.egoLevel} hasPotential={props.hasPotential} open={openGod} onOpenChange={setOpenGod} onSetGodHirameki={props.onSetGodHirameki} onSetGodHiramekiEffect={props.onSetGodHiramekiEffect} />
      {isPersonaCard ? <PersonaEngravingDialog card={props.card} egoLevel={props.egoLevel} hasPotential={props.hasPotential} allowedJob={props.allowedJob} open={openPersona} onOpenChange={setOpenPersona} onSetPersonaEngravings={props.onSetPersonaEngravings} /> : null}
    </>
  );
}
