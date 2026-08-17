"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { createSearchFuse } from "@/lib/search-index";
import { useLanguage } from "@/lib/i18n";

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [wasOpen, setWasOpen] = useState(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuse = useMemo(() => createSearchFuse(), []);

  // Reset the query whenever the overlay transitions from closed to open.
  // Adjusting state during render (rather than in an effect) avoids an extra
  // render with stale text before the reset takes effect.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setQuery("");
  }

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const results = query.trim() ? fuse.search(query).slice(0, 20) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 bg-void/95 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mx-auto mt-24 max-w-2xl px-4 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-hairline-strong pb-4">
              <Search size={20} className="text-gold" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.nav.search + "…"}
                className="flex-1 bg-transparent font-display text-xl tracking-wide text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button onClick={onClose} aria-label="Close" className="text-ink-dim hover:text-gold">
                <X size={20} />
              </button>
            </div>

            <ul className="mt-4 max-h-[60vh] space-y-1 overflow-y-auto">
              {results.map(({ item }) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    onClick={onClose}
                    className="flex items-center justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-raised"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-ink">{item.title}</span>
                      <span className="block truncate text-xs text-ink-dim">{item.subtitle}</span>
                    </span>
                    <span className="shrink-0 font-display text-[10px] uppercase tracking-widest text-ink-faint">
                      {item.type}
                    </span>
                  </Link>
                </li>
              ))}
              {query.trim() && results.length === 0 && (
                <li className="px-3 py-6 text-center text-ink-dim">{t.common.noResults}</li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
