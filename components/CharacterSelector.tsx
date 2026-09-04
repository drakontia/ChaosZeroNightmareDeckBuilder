"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { Character } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Field } from "./ui/field";
import { getJobIcon } from "@/lib/jobIcons";
import { getElementIcon } from "@/lib/elementIcons";
import { Eye, EyeOff } from "lucide-react";
import { useCharacterSelection } from "@/hooks/useCharacterSelection";

const formatEgoLevel = (level?: number) => String(level ?? 0).padStart(2, "0");

interface CharacterSelectorProps {
  characters: Character[];
  character: Character | null;
  onSelect: (character: Character) => void;
  onEgoLevelChange: (level: number) => void;
  hasPotential: boolean;
  onTogglePotential: () => void;
}

export function CharacterSelector({
  characters,
  character,
  onSelect,
  onEgoLevelChange,
  hasPotential,
  onTogglePotential,
}: CharacterSelectorProps) {
  const t = useTranslations();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const { isOpen, setIsOpen, getEgoLevel, handleEgoIncrement, handleSelect } =
    useCharacterSelection({ character, onSelect, onEgoLevelChange });

  const handleImageError = (characterId: string) => {
    setImageErrors((prev) => new Set(prev).add(characterId));
  };

  const getImageSrc = (characterImgUrl: string, characterId: string) => {
    return imageErrors.has(characterId)
      ? "/images/characters/character_placeholder.png"
      : characterImgUrl;
  };

  const currentCharacter = character;
  const currentCharacterEgoLabel = currentCharacter
    ? `${t(currentCharacter.name)} ego ${formatEgoLevel(getEgoLevel(currentCharacter))}`
    : undefined;

  return (
    <Field className="mb-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="relative w-full aspect-2/1 overflow-hidden rounded-md border border-dashed border-input bg-background shadow-sm">
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="absolute inset-0 z-0 h-full w-full border-0 bg-transparent shadow-none hover:bg-accent/10"
              aria-label={currentCharacter ? t(currentCharacter.name) : t("character.select")}
            />
          </DialogTrigger>
          {currentCharacter ? (
            <>
              {currentCharacter.imgUrl && (
                <div className="absolute inset-0 z-10 overflow-hidden rounded-md bg-muted pointer-events-none">
                  <Image
                    src={getImageSrc(currentCharacter.imgUrl, currentCharacter.id)}
                    alt={t(currentCharacter.name)}
                    fill
                    className="object-cover"
                    sizes="100%"
                    onError={() => handleImageError(currentCharacter.id)}
                  />
                  <div
                    className={`absolute inset-y-0 left-0 w-4 lg:w-8 ${
                      currentCharacter.rarity === "★5"
                        ? "bg-linear-to-b from-purple-600 to-transparent"
                        : currentCharacter.rarity === "★4"
                          ? "bg-linear-to-b from-yellow-600 to-transparent"
                          : ""
                    }`}
                  />
                </div>
              )}
              <div className="absolute z-10 bottom-0 right-0 pb-4 pr-4 text-right pointer-events-none">
                <span className="text-2xl lg:text-4xl font-semibold text-gray-100 text-shadow-lg/20">
                  {t(currentCharacter.name)}
                </span>
              </div>
              <div className="absolute top-1 left-6 lg:left-10 z-20 flex flex-col items-center gap-1">
                {getJobIcon(currentCharacter.job) && (
                  <Image
                    src={getJobIcon(currentCharacter.job)}
                    alt={currentCharacter.job}
                    width={32}
                    height={32}
                    className="w-8 h-8 pointer-events-none"
                  />
                )}
                {getElementIcon(currentCharacter.element) && (
                  <Image
                    src={getElementIcon(currentCharacter.element)}
                    alt={currentCharacter.element ?? "element"}
                    width={32}
                    height={32}
                    className="w-8 h-8 pointer-events-none"
                  />
                )}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleEgoIncrement(currentCharacter, true)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleEgoIncrement(currentCharacter, true);
                    }
                  }}
                  aria-label={currentCharacterEgoLabel}
                  className="px-1 py-1 rounded border-3 border-white bg-black/80 w-8 h-8 cursor-pointer flex items-center justify-center"
                >
                  <span className="text-base font-bold leading-none text-white">
                    {formatEgoLevel(getEgoLevel(currentCharacter))}
                  </span>
                </div>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={onTogglePotential}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onTogglePotential();
                    }
                  }}
                  aria-label={t("character.potential", { defaultValue: "潜在力" })}
                  aria-pressed={hasPotential}
                  className="p-2 rounded border border-white bg-black/80 text-white w-8 h-8 cursor-pointer flex items-center justify-center"
                >
                  {hasPotential ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <span className="text-muted-foreground font-semibold">{t("character.select")}</span>
            </div>
          )}
        </div>

        <DialogContent className="w-[90vw] max-w-6xl max-h-[90vh] overflow-hidden p-4">
          <DialogHeader>
            <DialogTitle>{t("character.select")}</DialogTitle>
          </DialogHeader>
          <div className="p-2 pt-0 overflow-y-auto max-h-[65vh]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {characters.map((candidate) => (
                <Button
                  key={candidate.id}
                  type="button"
                  variant={currentCharacter?.id === candidate.id ? "secondary" : "outline"}
                  className="h-auto w-full flex-col justify-start p-2 text-center"
                  aria-label={t(candidate.name)}
                  aria-pressed={currentCharacter?.id === candidate.id}
                  onClick={() => handleSelect(candidate)}
                >
                  {candidate.imgUrl && (
                    <div className="relative w-full aspect-2/1 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={getImageSrc(candidate.imgUrl, candidate.id)}
                        alt={t(candidate.name)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={() => handleImageError(candidate.id)}
                      />
                      <div
                        className={`absolute inset-y-0 left-0 w-2 sm:w-5 ${
                          candidate.rarity === "★5"
                            ? "bg-linear-to-b from-purple-600 to-transparent"
                            : candidate.rarity === "★4"
                              ? "bg-linear-to-b from-yellow-600 to-transparent"
                              : ""
                        }`}
                      />
                      <div className="absolute top-1 left-2 sm:left-5 z-20 flex flex-col items-center gap-0.5">
                        {getJobIcon(candidate.job) && (
                          <Image
                            src={getJobIcon(candidate.job)}
                            alt={candidate.job}
                            width={24}
                            height={24}
                            className="w-3 sm:w-5 h-3 sm:h-5 pointer-events-none"
                          />
                        )}
                        {getElementIcon(candidate.element) && (
                          <Image
                            src={getElementIcon(candidate.element)}
                            alt={candidate.element ?? "element"}
                            width={24}
                            height={24}
                            className="w-3 sm:w-5 h-3 sm:h-5 pointer-events-none"
                          />
                        )}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEgoIncrement(candidate, currentCharacter?.id === candidate.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.stopPropagation();
                              e.preventDefault();
                              handleEgoIncrement(candidate, currentCharacter?.id === candidate.id);
                            }
                          }}
                          aria-label={`${t(candidate.name)} ego ${formatEgoLevel(getEgoLevel(candidate))}`}
                          className="px-0.5 sm:px-1.5 py-0.5 rounded border-2 border-white bg-black/80 cursor-pointer pointer-events-auto"
                        >
                          <span className="text-xs font-semibold leading-none text-white">
                            {formatEgoLevel(getEgoLevel(candidate))}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute bottom-2 right-2 text-right text-gray-100 text-sm font-semibold text-shadow-lg/20">
                          {t(candidate.name)}
                        </div>
                      </div>
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Field>
  );
}
