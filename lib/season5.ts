import type { CznCard, DeckCard, MemoryLevelVariation } from "@/types";

export const isMemoryCard = (card: Pick<CznCard, "isMemoryCard">): boolean =>
  card.isMemoryCard === true;

export const normalizeMemoryLevel = (level: number | undefined): 1 | 2 | 3 | 4 =>
  level === 2 || level === 3 || level === 4 ? level : 1;

export const getMemoryLevelVariation = (
  card: CznCard | DeckCard,
  level: number | undefined,
): MemoryLevelVariation | undefined => {
  if (!isMemoryCard(card) || !card.memoryLevelVariations?.length) return undefined;
  const normalizedLevel = normalizeMemoryLevel(level);
  return (
    card.memoryLevelVariations.find((variation) => variation.level === normalizedLevel) ??
    card.memoryLevelVariations[0]
  );
};
