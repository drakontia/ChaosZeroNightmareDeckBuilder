import { Info, Hammer, HardHat, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Toggle } from "./ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Equipment, EquipmentObtainableChaosId } from "@/types";
import { EQUIPMENT_ENGRAVING_EFFECTS } from "@/lib/equipment-engraving";
import { REFINEMENT_EFFECTS } from "@/lib/refinement";

interface InfoDialogProps {
  description: string;
  rarity: string;
  obtainableChaosIds?: EquipmentObtainableChaosId[];
  showEnhancements?: boolean;
  refinement?: string | null;
  onRefinementChange?: (refinementId: string | null) => void;
  equipmentEngravingId?: string | null;
  onEquipmentEngravingChange?: (engravingId: string | null) => void;
  equipment?: Equipment[];
  godHammerEquipmentId?: string | null;
  onGodHammerEquipmentSelect?: (equipmentId: string | null) => void;
}

export function InfoDialog({
  description,
  rarity,
  obtainableChaosIds = [],
  showEnhancements = false,
  refinement = null,
  onRefinementChange,
  equipmentEngravingId = null,
  onEquipmentEngravingChange,
  equipment = [],
  godHammerEquipmentId = null,
  onGodHammerEquipmentSelect,
}: InfoDialogProps) {
  const t = useTranslations();
  const selectedEquipmentEngraving = EQUIPMENT_ENGRAVING_EFFECTS.find(
    (effect) => effect.id === equipmentEngravingId,
  );
  const selectedGodHammer = equipment.find((item) => item.id === godHammerEquipmentId);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="absolute top-1 left-1 z-20 rounded-full bg-black/60 hover:bg-black/80 p-1 text-white shadow focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={t("equipment.info", { defaultValue: "詳細情報" })}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <Info size={18} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm text-muted-foreground bg-background border">
        <div className="font-bold mb-2">{t("equipment.info", { defaultValue: "詳細情報" })}</div>
        <div className="mb-1">
          <span className="font-semibold">
            {t("equipment.rarity.name", { defaultValue: "レアリティ" })}:{" "}
          </span>
          {rarity}
        </div>
        {obtainableChaosIds.length > 0 ? (
          <div className="mb-1">
            <span className="font-semibold">
              {t("equipment.obtainableChaos.label", { defaultValue: "入手場所" })}:{" "}
            </span>
            {obtainableChaosIds
              .map((chaosId) =>
                t(`equipment.obtainableChaos.options.${chaosId}`, { defaultValue: chaosId }),
              )
              .join(", ")}
          </div>
        ) : null}
        <div className="mb-4">{description}</div>

        {showEnhancements && (
          <div className="space-y-3">
            {/* 神のハンマードロップダウン */}
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Toggle
                    pressed={!!godHammerEquipmentId}
                    aria-label={t("equipment.godHammer", { defaultValue: "神のハンマー" })}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <Hammer size={16} className={godHammerEquipmentId ? "text-orange-400" : ""} />
                  </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onGodHammerEquipmentSelect?.(null)}>
                    {t("common.remove", { defaultValue: "除去" })}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {equipment.length > 0 &&
                    equipment.map(
                      (eq) =>
                        eq.description && (
                          <DropdownMenuItem
                            key={eq.id}
                            onClick={() => onGodHammerEquipmentSelect?.(eq.id)}
                          >
                            {t(eq.description)}
                          </DropdownMenuItem>
                        ),
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedGodHammer?.description && (
                <span className="text-xs text-muted-foreground">
                  {t(selectedGodHammer.description)}
                </span>
              )}
            </div>

            {/* 精錬ドロップダウン */}
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Toggle
                    pressed={!!refinement}
                    aria-label={t("equipment.refinement", { defaultValue: "精錬" })}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <HardHat size={16} className={refinement ? "text-orange-400" : ""} />
                  </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onRefinementChange?.(null)}>
                    {t("common.remove", { defaultValue: "除去" })}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {REFINEMENT_EFFECTS.map((effect) => (
                    <DropdownMenuItem
                      key={effect.id}
                      onClick={() => onRefinementChange?.(effect.id)}
                    >
                      {t(`equipment.refinementEffects.${effect.id}`, {
                        defaultValue: effect.description,
                      })}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {refinement && (
                <span className="text-xs text-muted-foreground">
                  {t(`equipment.refinementEffects.${refinement}`, {
                    defaultValue:
                      REFINEMENT_EFFECTS.find((e) => e.id === refinement)?.description || "",
                  })}
                </span>
              )}
            </div>

            {/* 刻印ドロップダウン */}
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Toggle
                    pressed={!!equipmentEngravingId}
                    aria-label={t("equipment.engraving", { defaultValue: "刻印" })}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <Sparkles
                      size={16}
                      className={
                        selectedEquipmentEngraving?.alignment === "dark"
                          ? "text-violet-400"
                          : equipmentEngravingId
                            ? "text-yellow-400"
                            : ""
                      }
                    />
                  </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onEquipmentEngravingChange?.(null)}>
                    {t("common.remove", { defaultValue: "除去" })}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {EQUIPMENT_ENGRAVING_EFFECTS.map((effect) => (
                    <DropdownMenuItem
                      key={effect.id}
                      onClick={() => onEquipmentEngravingChange?.(effect.id)}
                    >
                      {t(`equipment.engravingEffects.${effect.id}`, {
                        defaultValue: effect.description,
                      })}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {equipmentEngravingId && (
                <span className="text-xs text-muted-foreground">
                  {t(`equipment.engravingEffects.${equipmentEngravingId}`, {
                    defaultValue: selectedEquipmentEngraving?.description ?? "",
                  })}
                </span>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
