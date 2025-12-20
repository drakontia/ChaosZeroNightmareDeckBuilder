"use client";

import { useCallback, useState } from "react";
import { Deck } from "@/types";
import { encodeDeckShare, decodeDeckShare } from "@/lib/deck-share";

type DeckUpdater = (deck: Deck | null) => void;
type NameUpdater = (name: string) => void;
type ErrorUpdater = (value: string | null) => void;

type TranslationFn = (key: string, opts?: { defaultValue?: string }) => string;

type Params = {
  deck: Deck;
  setName: NameUpdater;
  setSharedDeck: DeckUpdater;
  setShareError: ErrorUpdater;
  t: TranslationFn;
};

export function useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }: Params) {
  const [loadOpen, setLoadOpen] = useState(false);
  const [savedList, setSavedList] = useState<Array<{ name: string; savedAt: string }>>([]);

  const readStorage = useCallback((): Record<string, { id: string; savedAt: string }> => {
    if (typeof window === "undefined") return {};
    try {
      const raw = window.localStorage.getItem("cznde:savedDecks");
      if (!raw) return {};
      const parsed = JSON.parse(raw) as Record<string, { id: string; savedAt: string }>;
      return parsed || {};
    } catch {
      return {};
    }
  }, []);

  const writeStorage = useCallback((data: Record<string, { id: string; savedAt: string }>) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("cznde:savedDecks", JSON.stringify(data));
  }, []);

  const listSaved = useCallback((): Array<{ name: string; savedAt: string }> => {
    const store = readStorage();
    return Object.entries(store)
      .map(([name, entry]) => ({ name, savedAt: entry.savedAt }))
      .sort((a, b) => b.savedAt.localeCompare(a.savedAt));
  }, [readStorage]);

  const save = useCallback(
    (targetDeck: Deck, name: string, overwrite = false): boolean => {
      const store = readStorage();
      if (!overwrite && store[name]) {
        return false;
      }
      const id = encodeDeckShare(targetDeck);
      store[name] = { id, savedAt: new Date().toISOString() };
      writeStorage(store);
      return true;
    },
    [readStorage, writeStorage]
  );

  const load = useCallback(
    (name: string): Deck | null => {
      const store = readStorage();
      const entry = store[name];
      if (!entry) return null;
      return decodeDeckShare(entry.id);
    },
    [readStorage]
  );

  const remove = useCallback(
    (name: string) => {
      const store = readStorage();
      if (!store[name]) return false;
      delete store[name];
      writeStorage(store);
      return true;
    },
    [readStorage, writeStorage]
  );

  const handleSaveDeck = useCallback(() => {
    const defaultName = deck.name || "deck";
    const name = window.prompt(t("deck.savePrompt", { defaultValue: "保存名を入力" }), defaultName);
    if (!name) return;

    const deckToSave = name !== deck.name ? { ...deck, name } : deck;
    if (name !== deck.name) {
      setName(name);
    }

    const ok = save(deckToSave, name, false);
    if (!ok) {
      const confirmOverwrite = window.confirm(
        t("deck.overwriteConfirm", { defaultValue: "同名のデッキを上書きしますか？" })
      );
      if (confirmOverwrite) {
        save(deckToSave, name, true);
        alert(t("deck.saveDone", { defaultValue: "保存しました" }));
      }
    } else {
      alert(t("deck.saveDone", { defaultValue: "保存しました" }));
    }
  }, [deck, save, setName, t]);

  const openLoadDialog = useCallback(() => {
    setSavedList(listSaved());
    setLoadOpen(true);
  }, [listSaved]);

  const handleLoadDeck = useCallback(
    (name: string) => {
      const d = load(name);
      if (d) {
        setSharedDeck(d);
        setShareError(null);
        setLoadOpen(false);
      } else {
        alert(t("deck.loadFailed", { defaultValue: "読み込みに失敗しました" }));
      }
    },
    [load, setShareError, setSharedDeck, t]
  );

  const handleDeleteSaved = useCallback(
    (name: string) => {
      const ok = window.confirm(t("deck.deleteConfirm", { defaultValue: "このデッキを削除しますか？" }));
      if (!ok) return;
      if (remove(name)) {
        setSavedList(listSaved());
      }
    },
    [listSaved, remove, t]
  );

  return {
    savedList,
    loadOpen,
    setLoadOpen,
    handleSaveDeck,
    openLoadDialog,
    handleLoadDeck,
    handleDeleteSaved,
  };
}
