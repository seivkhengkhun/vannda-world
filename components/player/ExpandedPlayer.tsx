"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { usePlayer } from "./PlayerProvider";
import { songs } from "@/content/songs";
import { ytThumbnail } from "@/lib/youtube";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ExpandedPlayer() {
  const player = usePlayer();
  const { t } = useLanguage();
  const currentSong = songs.find((s) => s.slug === player.currentSlug);

  return (
    <AnimatePresence>
      {player.isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 bg-void/95 backdrop-blur-md"
          onClick={() => player.setExpanded(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto flex h-full max-w-3xl flex-col px-4 pb-28 pt-8 sm:px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label={t.player.collapse}
              onClick={() => player.setExpanded(false)}
              className="ml-auto rounded-full p-2 text-ink-dim transition-colors hover:text-gold"
            >
              <X size={22} />
            </button>

            {/* spacer reserving the space the real fixed-position YouTube iframe occupies */}
            <div className="aspect-video w-full shrink-0 rounded-xl border border-hairline bg-raised" />

            {currentSong && (
              <div className="mt-6 text-center">
                <h2 className="font-display text-2xl tracking-wide text-ink sm:text-3xl">
                  {currentSong.title}
                </h2>
                {currentSong.featuring.length > 0 && (
                  <p className="mt-1 text-sm text-ink-dim">
                    {t.common.featuring} {currentSong.featuring.join(", ")}
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-6 md:hidden">
              <button onClick={player.previous} className="text-ink-dim hover:text-gold" aria-label={t.player.previous}>
                <SkipBack size={24} />
              </button>
              <button
                onClick={player.togglePlay}
                className="rounded-full bg-gold p-4 text-void"
                aria-label={player.isPlaying ? t.player.pause : t.player.play}
              >
                {player.isPlaying ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <button onClick={player.next} className="text-ink-dim hover:text-gold" aria-label={t.player.next}>
                <SkipForward size={24} />
              </button>
            </div>

            <div className="mt-8 flex-1 overflow-y-auto">
              <h3 className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
                {t.player.queue}
              </h3>
              <ul className="space-y-1">
                {player.queue.map((slug) => {
                  const s = songs.find((song) => song.slug === slug);
                  if (!s) return null;
                  const active = slug === player.currentSlug;
                  return (
                    <li key={slug}>
                      <button
                        onClick={() => player.playSong(slug)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                          active ? "bg-raised text-gold" : "text-ink-dim hover:bg-raised/60 hover:text-ink",
                        )}
                      >
                        {s.youtubeId && (
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-hairline">
                            <Image
                              src={ytThumbnail(s.youtubeId, "mq")}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                              unoptimized
                            />
                          </span>
                        )}
                        <span className="min-w-0 flex-1 truncate text-sm">{s.title}</span>
                        {active && player.isPlaying && (
                          <span className="text-[10px] uppercase tracking-widest text-gold">●</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
