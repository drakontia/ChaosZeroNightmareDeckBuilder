import * as React from "react";
import { Info, Hammer, HardHat } from "lucide-react";
import { useTranslations } from "next-intl";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Toggle } from "./ui/toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Equipment } from "@/types";
import { REFINEMENT_EFFECTS } from "@/lib/refinement";

interface InfoDialogProps {
  description: string;
  rarity: string;
  triggerAsChild?: boolean;
  showEnhancements?: boolean;
  refinement?: string | null;
  onRefinementChange?: (refinementId: string | null) => void;
  equipment?: Equipment[];
  godHammerDescription?: string;
  onGodHammerDescriptionSelect?: (description: string) => void;
}

export function InfoDialog({ 
  description, 
  rarity, 
  triggerAsChild,
  showEnhancements = false,
  refinement = null,
  onRefinementChange,
  equipment = [],
  godHammerDescription = '',
  onGodHammerDescriptionSelect,
}: InfoDialogProps) {
  const t = useTranslations();
  return (
    <Popover>
      <PopoverTrigger asChild={!!triggerAsChild}>
        {triggerAsChild ? (
          <span
            className="absolute top-1 left-1 z-20 rounded-full bg-black/60 hover:bg-black/80 p-1 text-white shadow focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            aria-label={t('equipment.info', { defaultValue: '詳細情報' })}
            tabIndex={0}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            role="button"
          >
            <Info size={18} />
          </span>
        ) : (
          <button
            type="button"
            className="absolute top-1 left-1 z-20 rounded-full bg-black/60 hover:bg-black/80 p-1 text-white shadow focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={t('equipment.info', { defaultValue: '詳細情報' })}
            tabIndex={0}
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
          >
            <Info size={18} />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm text-muted-foreground bg-background border">
        <div className="font-bold mb-2">{t('equipment.info', { defaultValue: '詳細情報' })}</div>
        <div className="mb-1"><span className="font-semibold">{t('equipment.rarity.name', { defaultValue: 'レアリティ' })}: </span>{rarity}</div>
        <div className="mb-4">{description}</div>
        
        {showEnhancements && (
          <div className="space-y-3">
            {/* 精錬ドロップダウン */}
            <div 
              className="flex items-center gap-2"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Toggle
                    pressed={!!refinement}
                    aria-label={t('equipment.refinement', { defaultValue: '精錬' })}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <HardHat size={16} className={refinement ? 'text-orange-400' : ''} />
                  </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => onRefinementChange?.(null)}
                  >
                    {t('common.remove', { defaultValue: '除去' })}
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
                    defaultValue: REFINEMENT_EFFECTS.find(e => e.id === refinement)?.description || '',
                  })}
                </span>
              )}
            </div>
            
            {/* 神のハンマードロップダウン */}
            <div 
              className="flex items-center gap-2"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Toggle
                    pressed={!!godHammerDescription}
                    aria-label={t('equipment.godHammer', { defaultValue: '神のハンマー' })}
                    className="flex items-center gap-2 px-3 py-2"
                  >
                    <Hammer size={16} className={godHammerDescription ? 'text-orange-400' : ''} />
                  </Toggle>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => onGodHammerDescriptionSelect?.('')}
                  >
                    {t('common.remove', { defaultValue: '除去' })}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {equipment.length > 0 && equipment.map((eq) => (
                    eq.description && (
                      <DropdownMenuItem
                        key={eq.id}
                        onClick={() => onGodHammerDescriptionSelect?.(t(eq.description!))}
                      >
                        {t(eq.description)}
                      </DropdownMenuItem>
                    )
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {godHammerDescription && (
                <span className="text-xs text-muted-foreground">{godHammerDescription}</span>
              )}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
