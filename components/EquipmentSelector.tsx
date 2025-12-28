"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Equipment, EquipmentType } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Swords } from "lucide-react";
import { InfoDialog } from "./InfoDialog";

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

  const getEquipmentByType = (type: EquipmentType) => {
    return equipment.filter(eq => eq.type === type);
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
              className="w-full h-16 lg:h-32 border-double bg-gray-500 relative overflow-hidden"
            >
              {selected ? (
                <>
                  {selected.imgUrl && (
                    <div className="absolute inset-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={selected.imgUrl}
                        alt={t(selected.name)}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div
                    className="relative z-10 flex flex-col text-center pr-2 pl-2"
                  >
                    <span className="text-sm font-semibold text-white">{t(selected.name)}</span>
                    <span className="text-sm text-white">{t(`${selected.rarity}`)}</span>
                  </div>
                </>
              ) : (
                <span className="text-gray-100 font-semibold">{t(titleKey)}</span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[80vw] max-w-5xl max-h-[80vh] overflow-hidden">
            <DialogHeader className="flex-row items-center justify-between space-y-0">
              <DialogTitle>{t(titleKey)}</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onSelect(null, type);
                  setOpenType(null);
                }}
              >
                {t('common.remove', { defaultValue: '外す' })}
              </Button>
            </DialogHeader>
            <div className="p-6 pt-0 overflow-y-auto lg:max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {items.map((item) => (
                  <Button
                    key={item.id}
                    variant={selected?.id === item.id ? "secondary" : "outline"}
                    className="h-auto flex-col justify-start p-4 text-center"
                    onClick={() => {
                      onSelect(item, type);
                      setOpenType(null);
                    }}
                  >
                    {item.imgUrl && (
                      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-muted mb-3">
                        <Image
                          src={item.imgUrl}
                          alt={t(item.name)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {/* インフォメーションマークを画像右上に絶対配置 */}
                        {item.description && (
                          <InfoDialog
                            description={t(item.description)}
                            rarity={t(item.rarity)}
                            t={t}
                          />
                        )}
                      </div>
                    )}
                    <div className="flex flex-col w-full">
                      <span className="text-base font-semibold">{t(item.name)}</span>
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
      <div className="grid grid-cols-3 gap-6">
        {renderEquipmentSection(EquipmentType.WEAPON, "equipment.weapon.title")}
        {renderEquipmentSection(EquipmentType.ARMOR, "equipment.armor.title")}
        {renderEquipmentSection(EquipmentType.PENDANT, "equipment.pendant.title")}
      </div>
    </FieldGroup>
  );
}
