"use client";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

// カテゴリアイコンのマッピング
const CATEGORY_ICONS: Record<string, string> = {
  attack: "/images/cards/card_type_attack.png",
  skill: "/images/cards/card_type_skill.png",
  upgrade: "/images/cards/card_type_upgrade.png",
};

interface CardFrameProps {
  imgUrl?: string;
  alt?: string;
  cost: number | string;
  name?: string;
  nameId?: string;
  nameFallback?: string;
  category: string;
  categoryId?: string;
  description?: string;
  descriptionId?: string;
  descriptionFallback?: string;
  godEffectId?: string;
  godEffectFallback?: string;
  hiddenEffectId?: string;
  hiddenEffectFallback?: string;
  statuses?: string[];
  className?: string;
  leftControls?: ReactNode;
  rightControls?: ReactNode;
  variant?: "default" | "compact";
  isCopied?: boolean; // Whether this card is a copy
}

export function CardFrame({
  imgUrl,
  alt,
  cost,
  name,
  nameId,
  nameFallback,
  category,
  categoryId,
  description,
  descriptionId,
  descriptionFallback,
  godEffectId,
  godEffectFallback,
  hiddenEffectId,
  hiddenEffectFallback,
  statuses,
  className,
  leftControls,
  rightControls,
  isCopied = false,
}: CardFrameProps) {
  const t = useTranslations();
  const [imageError, setImageError] = useState(false);
  
  const displayName = nameId ? t(nameId, { defaultValue: nameFallback ?? name ?? "" }) : (name ?? "");
  const displayAlt = displayName || alt || "";

  return (
    <div className={cn("relative overflow-hidden aspect-2/3 rounded-md", className)}>
      {imgUrl && (
        <Image
          src={imageError ? '/images/cards/card_placeholder.png' : imgUrl}
          alt={displayAlt}
          fill
          loading="lazy"
          className={cn("object-cover", isCopied && "scale-x-[-1]")}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImageError(true)}
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/10 to-black/60" />

      {/* Top overlay: cost + name/category */}
      <div className="flex items-start pt-1 lg:pt-3 ml-2 sm:ml-4 lg:ml-6 xl:ml-6 gap-2 z-10 relative">
        <div className="flex flex-col items-start">
          <div className="text-lg sm:text-2xl lg:text-4xl xl:text-5xl font-extrabold text-white underline underline-offset-4 decoration-1 text-shadow-2xl align-middle leading-none">{cost}</div>
        </div>
        <div className="min-w-0 flex-1 text-left">
          <div className="text-xs sm:text-base lg:text-lg text-white text-shadow-2xl truncate" title={displayName}>{displayName}</div>
          <div className="text-xs lg:text-base text-white/90 text-shadow-4xl flex items-center gap-1 h-6 lg:h-8 ">
            {categoryId && CATEGORY_ICONS[categoryId.toLowerCase()] && (
              <Image
                src={CATEGORY_ICONS[categoryId.toLowerCase()]}
                alt={category}
                width={16}
                height={16}
                className="inline-block"
              />
            )}
            {category}
          </div>
        </div>
      </div>

      {/* Controls row: left and right */}
      {(leftControls || rightControls) && (
        <div className="flex items-start pt-1 ml-4 gap-2 z-10 relative">
          {leftControls && (
            <div className="flex flex-col gap-2">
              {leftControls}
            </div>
          )}
          <div className="relative ml-auto mr-2">
            {rightControls}
          </div>
        </div>
      )}

      {/* Bottom overlay: statuses + description */}
      {((descriptionId || description) || (statuses && statuses.length > 0)) && (
        <div className="absolute left-4 right-2 bottom-2 lg:bottom-6 text-center text-white text-xs lg:text-base text-shadow-4xl whitespace-pre-wrap">
          {statuses && statuses.length > 0 && (
            <div className="mb-1 text-yellow-300">
              [{statuses.join(" / ")}]
            </div>
          )}
          {descriptionId
            ? t(descriptionId, { defaultValue: descriptionFallback ?? "" })
            : description}
          {hiddenEffectId && (
            <div className="mt-2">
              {t(`hiddenEffects.${hiddenEffectId}`, { defaultValue: hiddenEffectFallback ?? "" })}
            </div>
          )}
          {godEffectId && (
            <div className="mt-2 flex items-center justify-center gap-1">
              <Zap className="h-5 w-5" />
              <span className="text-blue-300">{t(`godEffects.${godEffectId}`, { defaultValue: godEffectFallback ?? "" })}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
