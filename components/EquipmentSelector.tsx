"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Equipment, EquipmentType, EquipmentSlot } from "@/types";
import { toast } from 'sonner';
import { HardHat, Hammer } from 'lucide-react';

// 装備タイプごとのプレースホルダー画像
const EQUIPMENT_PLACEHOLDER: Record<EquipmentType, string> = {
  [EquipmentType.WEAPON]: '/images/equipment/weapons_placeholder.png',
  [EquipmentType.ARMOR]: '/images/equipment/armors_placeholder.png',
  [EquipmentType.PENDANT]: '/images/equipment/pendants_placeholder.png',
};
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Swords } from "lucide-react";
import { InfoDialog } from "./InfoDialog";
import { DialogCloseButton } from "./DialogCloseButton";

// 神話級装備の判定
const isMythicalEquipment = (equipment: Equipment): boolean => {
  return equipment.rarity === "equipment.rarity.mythical";
};

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: {
    weapon: EquipmentSlot | null;
    armor: EquipmentSlot | null;
    pendant: EquipmentSlot | null;
  };
  onSelect: (equipment: Equipment | null, type?: EquipmentType) => void;
  onRefinementChange?: (type: EquipmentType, value: boolean) => void;
  onGodHammerChange?: (type: EquipmentType, equipmentId: string | null) => void;
}

export function EquipmentSelector({ equipment, selectedEquipment, onSelect, onRefinementChange, onGodHammerChange }: EquipmentSelectorProps) {
  const t = useTranslations();
  const [openType, setOpenType] = useState<EquipmentType | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  // ローカル状態は表示用のみ。実際の保存はストアで行う
  const [godHammerDescriptions, setGodHammerDescriptions] = useState<Record<string, string>>({});

  // 保存されているgodHammerEquipmentIdから説明文を復元
  useEffect(() => {
    const newDescriptions: Record<string, string> = {};
    const types: EquipmentType[] = [EquipmentType.WEAPON, EquipmentType.ARMOR, EquipmentType.PENDANT];
    
    for (const type of types) {
      const slot = selectedEquipment[type];
      if (slot?.godHammerEquipmentId) {
        const eq = equipment.find(e => e.id === slot.godHammerEquipmentId);
        if (eq?.description) {
          newDescriptions[type] = t(eq.description);
        }
      }
    }
    setGodHammerDescriptions(newDescriptions);
  }, [selectedEquipment, equipment, t]);

  const handleImageError = (equipmentId: string) => {
    setImageErrors(prev => new Set(prev).add(equipmentId));
  };

  const getImageSrc = (imgUrl: string, equipmentId: string) => {
    return imageErrors.has(equipmentId) ? '/images/equipment/equipment_placeholder.png' : imgUrl;
  };

  const getEquipmentByType = (type: EquipmentType) => {
    return equipment.filter(eq => eq.type === type);
  };

  // 他の種類で選択されている神話級装備を検索
  const getSelectedMythicalType = (): EquipmentType | null => {
    for (const [type, slot] of Object.entries(selectedEquipment) as [EquipmentType, EquipmentSlot][]) {
      if (slot.item && isMythicalEquipment(slot.item)) {
        return type;
      }
    }
    return null;
  };

  // 装備選択時の処理
  const handleEquipmentSelect = (item: Equipment, type: EquipmentType) => {
    // 神話級装備を選択する場合
    if (isMythicalEquipment(item)) {
      const selectedMythicalType = getSelectedMythicalType();
      // すでに別の種類で神話級装備が選ばれている場合
      if (selectedMythicalType && selectedMythicalType !== type) {
        toast.error(t('equipment.duplicate.warning', {
          type: t(`equipment.${selectedMythicalType}.title`)
        }), {
          duration: 3000,
          position: "top-center"
        });
        return; // モーダルを閉じない
      }
    }

    // 通常の処理
    onSelect(item, type);
    setOpenType(null);
  };

  const renderEquipmentSection = (type: EquipmentType, titleKey: string) => {
    const items = getEquipmentByType(type);
    const slot = selectedEquipment[type];
    const selected = slot?.item;
    const isOpen = openType === type;

    // slotがnullの場合は空のスロットを表示
    const refinement = slot?.refinement ?? false;

    return (
      <Field>
        <Dialog open={isOpen} onOpenChange={(open) => setOpenType(open ? type : null)}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-20 sm:h-16 lg:h-24 xl:h-32 border-double bg-gray-500 relative overflow-hidden"
            >
              {selected ? (
                <>
                  {selected.imgUrl && (
                    <div className="absolute inset-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={getImageSrc(selected.imgUrl, selected.id)}
                        alt={t(selected.name)}
                        fill
                        className="object-cover"
                        sizes="100%"
                        onError={() => handleImageError(selected.id)}
                      />
                      {/* 精錬と神のハンマーアイコン（神のハンマー優先表示） */}
                      <div className="absolute top-1 right-1 z-10 flex gap-1">
                        {slot?.godHammerEquipmentId ? (
                          <div className="rounded-full bg-black/60 p-1">
                            <Hammer size={16} className="text-orange-400" />
                          </div>
                        ) : refinement ? (
                          <div className="rounded-full bg-black/60 p-1">
                            <HardHat size={16} className="text-orange-400" />
                          </div>
                        ) : null}
                      </div>
                      {selected.description && slot && (
                        <InfoDialog
                          description={t(selected.description)}
                          rarity={t(selected.rarity)}
                          triggerAsChild
                          showEnhancements={true}
                          refinement={refinement}
                          onRefinementChange={(value) => onRefinementChange?.(type, value)}
                          equipment={equipment}
                          godHammerDescription={godHammerDescriptions[type] || ''}
                          onGodHammerDescriptionSelect={(description) => {
                            setGodHammerDescriptions({
                              ...godHammerDescriptions,
                              [type]: description,
                            });
                            // 説明文から装備IDを逆引きして保存
                            if (description) {
                              const foundEquipment = equipment.find(eq => eq.description && t(eq.description) === description);
                              onGodHammerChange?.(type, foundEquipment?.id || null);
                            } else {
                              onGodHammerChange?.(type, null);
                            }
                          }}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className="absolute bottom-1 z-10 flex flex-col text-center pr-2 pl-2"
                  >
                    <span className="text-sm font-semibold text-white">{t(selected.name)}</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={EQUIPMENT_PLACEHOLDER[type]}
                    alt={t(titleKey)}
                    fill
                    className="object-cover"
                    sizes="100%"
                  />
                </div>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-hidden w-[80vw] max-w-5xl flex flex-col">
            <DialogHeader className="flex-row items-center justify-between space-y-0 shrink-0">
              <div className="flex items-center gap-3">
                <DialogTitle>{t(titleKey)}</DialogTitle>
              </div>
              <DialogCloseButton
                onClick={() => {
                  onSelect(null, type);
                  setOpenType(null);
                }}
              />
            </DialogHeader>
            <div className="flex-1 p-2 md:p-6 pt-0 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {items.map((item) => (
                  <Button
                    key={item.id}
                    variant={selected?.id === item.id ? "secondary" : "outline"}
                    className="h-auto flex-col justify-start p-2 text-center relative"
                    onClick={() => {
                      handleEquipmentSelect(item, type);
                    }}
                  >
                    {item.imgUrl && (
                      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted">
                        <Image
                          src={getImageSrc(item.imgUrl, item.id)}
                          alt={t(item.name)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          onError={() => handleImageError(item.id)}
                        />
                        {item.description && (
                          <InfoDialog
                            description={t(item.description)}
                            rarity={t(item.rarity)}
                            triggerAsChild
                          />
                        )}
                      </div>
                    )}
                    <div className="flex flex-col w-full">
                      <span className="text-xs md:text-sm">{t(item.name)}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Field>
    );
  };

  return (
    <FieldGroup className="pt-4 gap-2">
      <FieldLabel className="text-base lg:text-2xl text-gray-500"><Swords />{t('equipment.title')}</FieldLabel>
      <div className="grid grid-cols-3 gap-2">
        {renderEquipmentSection(EquipmentType.WEAPON, "equipment.weapon.title")}
        {renderEquipmentSection(EquipmentType.ARMOR, "equipment.armor.title")}
        {renderEquipmentSection(EquipmentType.PENDANT, "equipment.pendant.title")}
      </div>
    </FieldGroup>
  );
}
