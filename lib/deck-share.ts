import { CHARACTERS, EQUIPMENT, getCardById } from "@/lib/card";
import { CznCard, Deck, DeckCard, Equipment, EquipmentType } from "@/types";

interface SharedDeckCard {
  id: string;
  selectedHiramekiLevel?: number;
  godHiramekiType?: DeckCard["godHiramekiType"];
  godHiramekiEffectId?: DeckCard["godHiramekiEffectId"];
  isCopied?: boolean;
  copiedFromCardId?: string;
}

import type { RemovedCardEntry, CopiedCardEntry, ConvertedCardEntry } from "@/types";

interface SharedDeckPayload {
  v: 1;
  n?: string;
  c?: string | null;
  e?: {
    w?: string | null;
    a?: string | null;
    p?: string | null;
  };
  k: SharedDeckCard[];
  ego?: number;
  pot?: boolean;
  ct?: string;
  rm?: Array<[string, number | RemovedCardEntry]>;
  cp?: Array<[string, number | CopiedCardEntry]>;
  cv?: Array<[string, string | ConvertedCardEntry]>;
}

const DEFAULT_VERSION = 1;

const encodeText = (value: string): string => {
  // Try Node.js Buffer first
  if (typeof Buffer !== "undefined" && Buffer.from) {
    try {
      return Buffer.from(value, "utf-8").toString("base64");
    } catch (e) {
      // Fall through to TextEncoder method
    }
  }
  
  // TextEncoder method for Edge Runtime/Browser
  const utf8Bytes = new TextEncoder().encode(value);
  let binaryString = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binaryString);
};

const decodeText = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  
  // Try Node.js Buffer first
  if (typeof Buffer !== "undefined" && Buffer.from) {
    try {
      return Buffer.from(padded, "base64").toString("utf-8");
    } catch (e) {
      // Fall through to atob method
    }
  }
  
  // atob + TextDecoder method for Edge Runtime/Browser
  const binaryString = atob(padded);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
};

const toBase64Url = (value: string): string =>
  encodeText(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64Url = (value: string): string => decodeText(value);

const createNonce = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const createDeckId = (prefix: string): string => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random()}`;
};

const pickCard = (cardId: string): CznCard | null => getCardById(cardId) ?? null;

const pickEquipment = (id: string | null | undefined, type: EquipmentType): Equipment | null => {
  if (!id) return null;
  return EQUIPMENT.find((item) => item.id === id && item.type === type) ?? null;
};

const pickCharacter = (id: string | null | undefined) => CHARACTERS.find((char) => char.id === id) ?? null;

export function encodeDeckShare(deck: Deck): string {
  const payload: SharedDeckPayload = {
    v: DEFAULT_VERSION,
    ...(deck.name && { n: deck.name }),
    ...(deck.character && { c: deck.character.id }),
    ...((deck.equipment.weapon || deck.equipment.armor || deck.equipment.pendant) && {
      e: {
        ...(deck.equipment.weapon && { w: deck.equipment.weapon.id }),
        ...(deck.equipment.armor && { a: deck.equipment.armor.id }),
        ...(deck.equipment.pendant && { p: deck.equipment.pendant.id }),
      },
    }),
    k: deck.cards.map((card) => ({
      id: card.id,
      ...(card.selectedHiramekiLevel !== undefined && { selectedHiramekiLevel: card.selectedHiramekiLevel }),
      ...(card.godHiramekiType && { godHiramekiType: card.godHiramekiType }),
      ...(card.godHiramekiEffectId && { godHiramekiEffectId: card.godHiramekiEffectId }),
      ...(card.isCopied && { isCopied: card.isCopied }),
      ...(card.copiedFromCardId && { copiedFromCardId: card.copiedFromCardId }),
    })),
    ...(deck.egoLevel && { ego: deck.egoLevel }),
    ...(deck.hasPotential && { pot: deck.hasPotential }),
    // createdAt を安全に ISO 文字列に変換
    ct: (() => {
      if (deck.createdAt instanceof Date) {
        return deck.createdAt.toISOString();
      }
      if (typeof deck.createdAt === 'string') {
        return deck.createdAt;
      }
      // フォールバック：現在時刻を使用
      return new Date().toISOString();
    })(),
    ...(deck.removedCards.size && {
      rm: Array.from(deck.removedCards.entries()).map(([id, entry]) => {
        if (typeof entry === 'number') {
          return [id, entry];
        } else {
          return [id, entry]; // entryはRemovedCardEntry型
        }
      })
    }),
    ...(deck.copiedCards.size && {
      cp: Array.from(deck.copiedCards.entries()).map(([id, entry]) => {
        if (typeof entry === 'number') {
          return [id, entry];
        } else {
          return [id, entry]; // entryはCopiedCardEntry型
        }
      })
    }),
    ...(deck.convertedCards.size && {
      cv: Array.from(deck.convertedCards.entries()).map(([id, entry]) => {
        if (typeof entry === 'string') {
          return [id, entry];
        } else {
          return [id, entry]; // entryはConvertedCardEntry型
        }
      })
    }),
  };

  const json = JSON.stringify(payload);
  return toBase64Url(json);
}

const toDeckCard = (card: CznCard, shared: SharedDeckCard): DeckCard => {
  const maxLevel = Math.max(0, card.hiramekiVariations.length - 1);
  const safeLevel = Math.min(Math.max(shared.selectedHiramekiLevel ?? 0, 0), maxLevel);
  return {
    ...card,
    deckId: createDeckId(card.id),
    selectedHiramekiLevel: safeLevel,
    godHiramekiType: shared.godHiramekiType ?? null,
    godHiramekiEffectId: shared.godHiramekiEffectId ?? null,
    isCopied: shared.isCopied,
    copiedFromCardId: shared.copiedFromCardId,
    selectedHiddenHiramekiId: null,
  };
};

export function decodeDeckShare(value: string): Deck | null {
  try {
    const json = fromBase64Url(value);
    const payload = JSON.parse(json) as SharedDeckPayload;

    if (payload.v !== DEFAULT_VERSION) {
      return null;
    }

    const character = payload.c ? pickCharacter(payload.c) : null;

    const equipment = {
      weapon: payload.e?.w ? pickEquipment(payload.e.w, EquipmentType.WEAPON) : null,
      armor: payload.e?.a ? pickEquipment(payload.e.a, EquipmentType.ARMOR) : null,
      pendant: payload.e?.p ? pickEquipment(payload.e.p, EquipmentType.PENDANT) : null,
    };

    const cards: DeckCard[] = (payload.k ?? [])
      .map((shared) => {
        const card = pickCard(shared.id);
        if (!card) return null;
        return toDeckCard(card, shared);
      })
      .filter((card): card is DeckCard => Boolean(card));

    // createdAt を安全に Date に変換
    let validCreatedAt = new Date();
    if (payload.ct) {
      const parsed = new Date(payload.ct);
      if (!Number.isNaN(parsed.getTime())) {
        validCreatedAt = parsed;
      }
    }

    return {
      name: payload.n ?? "",
      character,
      equipment,
      cards,
      egoLevel: payload.ego ?? 0,
      hasPotential: payload.pot ?? false,
      createdAt: validCreatedAt,
      removedCards: new Map<string, number | RemovedCardEntry>((payload.rm ?? []).map(([id, entry]) => [id, entry])),
      copiedCards: new Map<string, number | CopiedCardEntry>((payload.cp ?? []).map(([id, entry]) => [id, entry])),
      convertedCards: new Map<string, string | ConvertedCardEntry>((payload.cv ?? []).map(([id, entry]) => [id, entry])),
    };
  } catch (error) {
    console.error("Failed to decode deck share", error);
    return null;
  }
}
