import { ElementType } from "@/types";

export const elementIcons: Record<ElementType, string> = {
  [ElementType.PASSION]: "/images/characters/elements/character_element_passion.png",
  [ElementType.JUSTICE]: "/images/characters/elements/character_element_justice.png",
  [ElementType.ORDER]: "/images/characters/elements/character_element_order.png",
  [ElementType.INSTINCT]: "/images/characters/elements/character_element_instinct.png",
  [ElementType.VOID]: "/images/characters/elements/character_element_void.png",
};

export const getElementIcon = (element?: ElementType): string => {
  if (!element) return "";
  return elementIcons[element] ?? "";
};
