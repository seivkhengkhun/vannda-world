"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { en } from "@/content/i18n/en";
import { km } from "@/content/i18n/km";
import type { Dictionary } from "@/content/i18n/types";

export type Lang = "en" | "km";

const dictionaries: Record<Lang, Dictionary> = { en, km };

interface LanguageContextValue {
  lang: Lang;
  t: Dictionary;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "vannda-world:lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // localStorage doesn't exist during the static server render, so the saved
  // language preference genuinely can't be read any earlier than this effect.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "en" || stored === "km") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      t: dictionaries[lang],
      setLang: setLangState,
      toggleLang: () => setLangState((prev) => (prev === "en" ? "km" : "en")),
    }),
    [lang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
