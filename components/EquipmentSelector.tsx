"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Equipment, EquipmentType } from "@/types";

// 装備タイプごとのプレースホルダー画像
const EQUIPMENT_PLACEHOLDER: Record<EquipmentType, string> = {
  [EquipmentType.WEAPON]: '/images/equipment/weapons_placeholder.png',
  [EquipmentType.ARMOR]: '/images/equipment/armors_placeholder.png',
  [EquipmentType.PENDANT]: '/images/equipment/pendants_placeholder.png',
};
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Swords, AlertCircle } from "lucide-react";
import { InfoDialog } from "./InfoDialog";
import { DialogCloseButton } from "./DialogCloseButton";

// 神話級装備の判定
const isMythicalEquipment = (equipment: Equipment): boolean => {
  return equipment.rarity === "equipment.rarity.mythical";
};

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    pendant: Equipment | null;
  };
  onSelect: (equipment: Equipment | null, type?: EquipmentType) => void;
}

export function EquipmentSelector({ equipment, selectedEquipment, onSelect }: EquipmentSelectorProps) {
  const t = useTranslations();
  const [openType, setOpenType] = useState<EquipmentType | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [mythicalWarning, setMythicalWarning] = useState<{ show: boolean; conflictType?: EquipmentType }>({ show: false });

  // 警告を3秒後に自動的に消す
  useEffect(() => {
    if (mythicalWarning.show) {
      const timer = setTimeout(() => {
        setMythicalWarning({ show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [mythicalWarning.show]);

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
    for (const [type, selected] of Object.entries(selectedEquipment) as [EquipmentType, Equipment | null][]) {
      if (selected && isMythicalEquipment(selected)) {
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
        setMythicalWarning({
          show: true,
          conflictType: selectedMythicalType
        });
        return; // モーダルを閉じない
      }
    }

    // 通常の処理
    onSelect(item, type);
    setOpenType(null);
    setMythicalWarning({ show: false });
  };

  const renderEquipmentSection = (type: EquipmentType, titleKey: string) => {
    const items = getEquipmentByType(type);
    const selected = selectedEquipment[type];
    const isOpen = openType === type;

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
                      {selected.description && (
                        <InfoDialog
                          description={t(selected.description)}
                          rarity={t(selected.rarity)}
                          triggerAsChild
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
                {mythicalWarning.show && openType === type && (
                  <div className="flex items-center gap-2 text-sm animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span className="text-red-600 font-medium">
                      {t('equipment.duplicate.warning', {
                        type: t(`equipment.${mythicalWarning.conflictType}.title`)
                      })}
                    </span>
                  </div>
                )}
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
    <FieldGroup className="pt-4 lg:pt-12 gap-2">
      <FieldLabel className="text-base lg:text-2xl text-gray-500"><Swords />{t('equipment.title')}</FieldLabel>
      <div className="grid grid-cols-3 gap-2">
        {renderEquipmentSection(EquipmentType.WEAPON, "equipment.weapon.title")}
        {renderEquipmentSection(EquipmentType.ARMOR, "equipment.armor.title")}
        {renderEquipmentSection(EquipmentType.PENDANT, "equipment.pendant.title")}
      </div>
    </FieldGroup>
  );
}
