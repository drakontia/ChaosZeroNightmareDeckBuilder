"use client";

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
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
  hasPotential: boolean;
  onTogglePotential: () => void;
}

export function CharacterSelector({ characters, character, onSelect, hasPotential, onTogglePotential }: CharacterSelectorProps) {
  const t = useTranslations();
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  const {
    isOpen,
    setIsOpen,
    getEgoLevel,
    handleEgoIncrement,
    handleSelect,
  } = useCharacterSelection({ character, onSelect });

  const handleImageError = (characterId: string) => {
    setImageErrors(prev => new Set(prev).add(characterId));
  };

  const getImageSrc = (characterImgUrl: string, characterId: string) => {
    return imageErrors.has(characterId) ? '/images/characters/character_placeholder.png' : characterImgUrl;
  };

  return (
    <Field className="mb-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full aspect-2/1 h-auto border-dashed relative overflow-hidden"
          >
            {character ? (
              <>
                {character.imgUrl && (
                  <div className="absolute inset-0 rounded-md overflow-hidden bg-muted">
                    <Image
                      src={getImageSrc(character.imgUrl, character.id)}
                      alt={t(character.name)}
                      fill
                      className="object-cover"
                      sizes="100%"
                      onError={() => handleImageError(character.id)}
                    />
                    {/* Rarity gradient band */}
                    <div className={`absolute inset-y-0 left-0 w-4 lg:w-8 ${character.rarity === '★5'
                        ? 'bg-linear-to-b from-purple-600 to-transparent'
                        : character.rarity === '★4'
                          ? 'bg-linear-to-b from-yellow-600 to-transparent'
                          : ''
                      }`} />
                    {/* Job, element icons and ego level */}
                    <div className="absolute top-1 left-6 lg:left-10 z-20 flex flex-col items-center gap-1">
                      {getJobIcon(character.job) && (
                        <Image
                          src={getJobIcon(character.job)}
                          alt={character.job}
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      )}
                      {getElementIcon(character.element) && (
                        <Image
                          src={getElementIcon(character.element)}
                          alt={character.element ?? "element"}
                          width={32}
                          height={32}
                          className="w-8 h-8"
                        />
                      )}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleEgoIncrement(character, true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEgoIncrement(character, true);
                          }
                        }}
                        className="px-1 py-1 rounded border-3 border-white bg-black/80 w-8 h-8 cursor-pointer"
                      >
                        <span className="text-base font-bold leading-none text-white">
                          {formatEgoLevel(getEgoLevel(character))}
                        </span>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onTogglePotential();
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.stopPropagation();
                            e.preventDefault();
                            onTogglePotential();
                          }
                        }}
                        aria-label="toggle potential"
                        className="p-2 rounded border border-white bg-black/80 text-white w-8 h-8 cursor-pointer"
                      >
                        {hasPotential ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className="absolute z-10 bottom-0 right-0 pb-4 pr-4 text-right"
                >
                  <span className="text-2xl lg:text-4xl font-semibold text-gray-100 text-shadow-lg/20">{t(character.name)}</span>
                </div>
              </>
            ) : (
              <span className="text-muted-foreground font-semibold">{t('character.select')}</span>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[90vw] max-w-6xl max-h-[90vh] overflow-hidden p-4">
          <DialogHeader>
            <DialogTitle>{t('character.select')}</DialogTitle>
          </DialogHeader>
          <div className="p-2 pt-0 overflow-y-auto max-h-[65vh]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {characters.map((character) => (
                <Button
                  key={character.id}
                  variant={character?.id === character.id ? "secondary" : "outline"}
                  className="h-auto w-full flex-col justify-start p-2 text-center"
                  aria-label={t(character.name)}
                  onClick={() => handleSelect(character)}
                >
                  {character.imgUrl && (
                    <div className="relative w-full aspect-2/1 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={getImageSrc(character.imgUrl, character.id)}
                        alt={t(character.name)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        onError={() => handleImageError(character.id)}
                      />
                      {/* Rarity gradient band */}
                       <div className={`absolute inset-y-0 left-0 w-2 sm:w-5 ${character.rarity === '★5'
                          ? 'bg-linear-to-b from-purple-600 to-transparent'
                          : character.rarity === '★4'
                            ? 'bg-linear-to-b from-yellow-600 to-transparent'
                            : ''
                        }`} />
                      {/* Job, element icons and ego level */}
                      <div className="absolute top-1 left-2 sm:left-5 z-20 flex flex-col items-center gap-1">
                        {getJobIcon(character.job) && (
                          <Image
                            src={getJobIcon(character.job)}
                            alt={character.job}
                              width={24}
                              height={24}
                              className="w-3 sm:w-5 h-3 sm:h-5"
                          />
                        )}
                        {getElementIcon(character.element) && (
                          <Image
                            src={getElementIcon(character.element)}
                            alt={character.element ?? "element"}
                              width={18}
                              height={18}
                              className="w-3 sm:w-5 h-3 sm:h-5"
                          />
                        )}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEgoIncrement(character, character?.id === character.id);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              e.preventDefault();
                              handleEgoIncrement(character, character?.id === character.id);
                            }
                          }}
                            className="px-0.5 sm:px-1.5 py-0.5 rounded border-2 border-white bg-black/80 cursor-pointer pointer-events-auto"
                        >
                            <span className="text-xs font-semibold leading-none text-white w-3 sm:w-5 h-3 sm:h-5">
                            {formatEgoLevel(getEgoLevel(character))}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute bottom-2 right-2 text-right text-gray-100 text-sm font-semibold text-shadow-lg/20">
                          {t(character.name)}
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
