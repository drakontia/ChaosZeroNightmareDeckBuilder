"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { HardHat, Hammer, Sparkles, Swords } from "lucide-react";

import { EQUIPMENT_ENGRAVING_EFFECTS } from "@/lib/equipment-engraving";
import { Equipment, EquipmentSlot, EquipmentType } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { InfoDialog } from "./InfoDialog";
import { DialogCloseButton } from "./DialogCloseButton";

const EQUIPMENT_PLACEHOLDER: Record<EquipmentType, string> = {
  [EquipmentType.WEAPON]: "/images/equipment/weapons_placeholder.png",
  [EquipmentType.ARMOR]: "/images/equipment/armors_placeholder.png",
  [EquipmentType.PENDANT]: "/images/equipment/pendants_placeholder.png",
};

const EQUIPMENT_TYPES: EquipmentType[] = [EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.PENDANT];

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: Record<EquipmentType, EquipmentSlot | null>;
  onSelect: (equipment: Equipment | null, type?: EquipmentType) => void;
  onRefinementChange?: (type: EquipmentType, refinementId: string | null) => void;
  onGodHammerChange?: (type: EquipmentType, equipmentId: string | null) => void;
  onEquipmentEngravingChange?: (type: EquipmentType, engravingId: string | null) => void;
}

interface EquipmentDescriptions {
  engraving?: string;
}

const isMythicalEquipment = (equipment: Equipment) => equipment.rarity === "equipment.rarity.mythical";

const getSelectedMythicalType = (selectedEquipment: Record<EquipmentType, EquipmentSlot | null>) =>
  EQUIPMENT_TYPES.find((type) => {
    const item = selectedEquipment[type]?.item;
    return item ? isMythicalEquipment(item) : false;
  }) ?? null;

const getEquipmentDescriptions = (slot: EquipmentSlot | null, t: ReturnType<typeof useTranslations>): EquipmentDescriptions => {
  if (!slot?.engravingId) {
    return {};
  }
  const engraving = EQUIPMENT_ENGRAVING_EFFECTS.find((effect) => effect.id === slot.engravingId);
  if (!engraving) {
    return {};
  }
  return {
    engraving: t(`equipment.engravingEffects.${engraving.id}`, { defaultValue: engraving.description }),
  };
};

function EnhancementBadges({ slot }: { slot: EquipmentSlot | null }) {
  if (!slot) return null;
  return (
    <div className="absolute top-1 right-1 z-10 flex gap-1">
      {slot.godHammerEquipmentId ? <div className="rounded-full bg-black/60 p-1"><Hammer size={16} className="text-orange-400" /></div> : null}
      {slot.refinement ? <div className="rounded-full bg-black/60 p-1"><HardHat size={16} className="text-orange-400" /></div> : null}
      {slot.engravingId ? <div className="rounded-full bg-black/60 p-1"><Sparkles size={16} className={slot.engravingId.includes("umbra") ? "text-violet-400" : "text-yellow-400"} /></div> : null}
    </div>
  );
}

interface EquipmentPreviewButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'slot'> {
  title: string;
  slot: EquipmentSlot | null;
  imageSrc: string;
  imageAlt: string;
  onImageError: () => void;
}

const EquipmentPreviewButton = React.forwardRef<HTMLButtonElement, EquipmentPreviewButtonProps>(
  function EquipmentPreviewButton({ title, slot, imageSrc, imageAlt, onImageError, ...rest }, ref) {
  return (
    <Button ref={ref} variant="outline" className="w-full h-20 sm:h-16 lg:h-24 xl:h-32 border-double bg-gray-500 relative overflow-hidden" {...rest}>
      <div className="absolute inset-0 rounded-md overflow-hidden bg-muted">
        <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes="100%" onError={onImageError} />
      </div>
      {slot?.item ? <EnhancementBadges slot={slot} /> : null}
      {slot?.item ? <div className="absolute bottom-1 z-10 flex flex-col text-center px-2"><span className="text-sm font-semibold text-white">{title}</span></div> : null}
      {!slot?.item && <span className="sr-only">{title}</span>}
    </Button>
  );
}
);
EquipmentPreviewButton.displayName = "EquipmentPreviewButton";

interface EquipmentOptionCardProps {
  selected: boolean;
  imageSrc: string;
  onImageError: () => void;
  name: string;
  rarity: string;
  description?: string;
  onSelect: () => void;
}

function EquipmentOptionCard({ selected, imageSrc, onImageError, name, rarity, description, onSelect }: EquipmentOptionCardProps) {
  return (
    <div className="relative">
      <Button variant={selected ? "secondary" : "outline"} className="h-auto flex-col justify-start p-2 text-center relative w-full" onClick={onSelect}>
        <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
          <Image src={imageSrc} alt={name} fill className="object-cover" sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" onError={onImageError} />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-xs md:text-sm">{name}</span>
        </div>
      </Button>
      {description ? <InfoDialog description={description} rarity={rarity} /> : null}
    </div>
  );
}

interface EquipmentFieldProps extends EquipmentSelectorProps {
  type: EquipmentType;
  titleKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageErrors: Set<string>;
  onImageError: (equipmentId: string) => void;
}

function EquipmentField(props: EquipmentFieldProps) {
  const t = useTranslations();
  const items = props.equipment.filter((item) => item.type === props.type);
  const slot = props.selectedEquipment[props.type];
  const selected = slot?.item ?? null;
  const imageSrc = props.imageErrors.has(selected?.id ?? "") ? "/images/equipment/equipment_placeholder.png" : selected?.imgUrl ?? EQUIPMENT_PLACEHOLDER[props.type];
  const descriptions = useMemo(() => getEquipmentDescriptions(slot, t), [slot, t]);

  return (
    <Field>
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <div className="relative">
          <DialogTrigger asChild>
            <EquipmentPreviewButton title={selected ? t(selected.name) : t(props.titleKey)} slot={slot} imageSrc={imageSrc} imageAlt={selected ? t(selected.name) : t(props.titleKey)} onImageError={() => selected && props.onImageError(selected.id)} />
          </DialogTrigger>
          {selected?.description ? <InfoDialog description={t(selected.description)} rarity={t(selected.rarity)} showEnhancements refinement={slot?.refinement ?? null} onRefinementChange={(refinementId) => props.onRefinementChange?.(props.type, refinementId)} equipmentEngravingId={slot?.engravingId ?? null} onEquipmentEngravingChange={(engravingId) => props.onEquipmentEngravingChange?.(props.type, engravingId)} equipment={props.equipment} godHammerEquipmentId={slot?.godHammerEquipmentId ?? null} onGodHammerEquipmentSelect={(equipmentId) => props.onGodHammerChange?.(props.type, equipmentId)} /> : null}
        </div>
        <DialogContent className="max-h-[90vh] overflow-hidden w-[80vw] max-w-5xl flex flex-col">
          <DialogHeader className="flex-row items-center justify-between space-y-0 shrink-0">
            <div className="flex items-center gap-3"><DialogTitle>{t(props.titleKey)}</DialogTitle></div>
            <DialogCloseButton onClick={() => { props.onSelect(null, props.type); props.onOpenChange(false); }} />
          </DialogHeader>
          <div className="flex-1 p-2 md:p-6 pt-0 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {items.map((item) => (
                <EquipmentOptionCard key={item.id} selected={selected?.id === item.id} imageSrc={props.imageErrors.has(item.id) ? "/images/equipment/equipment_placeholder.png" : item.imgUrl ?? "/images/equipment/equipment_placeholder.png"} onImageError={() => props.onImageError(item.id)} name={t(item.name)} rarity={t(item.rarity)} description={item.description ? t(item.description) : undefined} onSelect={() => props.onSelect(item, props.type)} />
              ))}
            </div>
            {descriptions.engraving ? <div className="mt-4 text-sm text-muted-foreground"><span className="font-semibold">{t("equipment.engraving", { defaultValue: "刻印" })}: </span>{descriptions.engraving}</div> : null}
          </div>
        </DialogContent>
      </Dialog>
    </Field>
  );
}

export function EquipmentSelector(props: EquipmentSelectorProps) {
  const t = useTranslations();
  const [openType, setOpenType] = useState<EquipmentType | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (equipmentId: string) => {
    setImageErrors((previous) => new Set(previous).add(equipmentId));
  };

  const handleSelect = (item: Equipment | null, type?: EquipmentType) => {
    if (item && type && isMythicalEquipment(item)) {
      const selectedMythicalType = getSelectedMythicalType(props.selectedEquipment);
      if (selectedMythicalType && selectedMythicalType !== type) {
        toast.error(t("equipment.duplicate.warning", { type: t(`equipment.${selectedMythicalType}.title`) }), { duration: 3000, position: "top-center" });
        return;
      }
    }
    props.onSelect(item, type);
    if (type) setOpenType(null);
  };

  return (
    <FieldGroup className="pt-4 gap-2">
      <FieldLabel className="text-base lg:text-2xl text-gray-500"><Swords />{t("equipment.title")}</FieldLabel>
      <div className="grid grid-cols-3 gap-2">
        {EQUIPMENT_TYPES.map((type) => <EquipmentField key={type} {...props} type={type} titleKey={`equipment.${type}.title`} open={openType === type} onOpenChange={(open) => setOpenType(open ? type : null)} imageErrors={imageErrors} onImageError={handleImageError} onSelect={handleSelect} />)}
      </div>
    </FieldGroup>
  );
}
