"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useLanguage } from "@/lib/i18n";
import { ytThumbnail } from "@/lib/youtube";
import { ParticleField } from "@/components/layout/ParticleField";

const STORAGE_KEY = "vannda-world:entered";
const FEATURED_SLUG = "6-years-in-the-game";
const FEATURED_YOUTUBE_ID = "UAoI1SyWprI";

export function EnterGate() {
  const [entered, setEntered] = useState<boolean | null>(null);
  const { t } = useLanguage();
  const player = usePlayer();

  // sessionStorage doesn't exist during the static server render, so whether the
  // gate has already been dismissed genuinely can't be known before this effect.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEntered(window.sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (entered === null || entered) return null;

  function handleEnter() {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setEntered(true);
    player.playSong(FEATURED_SLUG);
  }

  return (
    <AnimatePresence>
      {!entered && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-void"
        >
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={ytThumbnail(FEATURED_YOUTUBE_ID)}
              alt=""
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-linear-to-t from-void via-void/70 to-void/40" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, rgba(10,9,8,0.75) 100%)",
            }}
          />
          <ParticleField className="absolute inset-0 h-full w-full opacity-70" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center px-6 text-center"
          >
            <p className="mb-5 font-display text-[11px] uppercase tracking-[0.4em] text-gold">
              {t.enter.kicker}
            </p>
            <h1 className="font-display text-6xl tracking-[0.05em] text-ink sm:text-8xl md:text-9xl">
              {t.enter.title}
            </h1>
            <p className="mt-4 font-display text-sm uppercase tracking-[0.5em] text-ink-dim sm:text-base">
              {t.enter.subtitle}
            </p>

            <button
              onClick={handleEnter}
              className="group relative mt-12 overflow-hidden border border-gold/60 px-10 py-4 font-display text-xs uppercase tracking-[0.3em] text-ink transition-colors duration-500 hover:text-void"
            >
              <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative">{t.enter.cta}</span>
            </button>
            <p className="mt-5 text-xs text-ink-faint">{t.enter.hint}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
