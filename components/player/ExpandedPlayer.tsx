"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Pause, Play, SkipBack, SkipForward, X, Sparkles } from "lucide-react";
import { usePlayer } from "./PlayerProvider";
import { SmartMixPanel } from "./SmartMixPanel";
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
            className="mx-auto flex h-full max-w-3xl flex-col overflow-y-auto px-4 pb-28 pt-8 sm:px-6"
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
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-xl border border-hairline bg-raised">
              <AnimatePresence>
                {player.isTransitioning && currentSong && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-10 flex items-center justify-center bg-void"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSong.slug}
                        initial={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0"
                      >
                        {currentSong.youtubeId && (
                          <Image
                            src={ytThumbnail(currentSong.youtubeId, "hq")}
                            alt=""
                            fill
                            unoptimized
                            className="object-cover opacity-70"
                          />
                        )}
                      </motion.div>
                    </AnimatePresence>
                    <span className="relative z-10 flex items-center gap-2 rounded-full bg-void/70 px-4 py-2 font-display text-[10px] uppercase tracking-[0.25em] text-gold backdrop-blur">
                      <Sparkles size={12} className="fill-gold" />
                      Smart Transition
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

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

            <SmartMixPanel />

            <div className="mt-8 flex-1">
              {player.smartMixEnabled ? (
                <>
                  <h3 className="mb-3 font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Now</h3>
                  {currentSong && (
                    <div className="mb-6 flex items-center gap-3 rounded-lg bg-raised px-2 py-2 text-gold">
                      {currentSong.youtubeId && (
                        <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-hairline">
                          <Image src={ytThumbnail(currentSong.youtubeId, "mq")} alt="" fill sizes="36px" className="object-cover" unoptimized />
                        </span>
                      )}
                      <span className="min-w-0 flex-1 truncate text-sm">{currentSong.title}</span>
                      {player.isPlaying && <span className="text-[10px] uppercase tracking-widest text-gold">●</span>}
                    </div>
                  )}
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Up Next</h3>
                    <span className="font-display text-[9px] uppercase tracking-[0.2em] text-ink-faint">Auto Generated</span>
                  </div>
                  <ul className="space-y-1">
                    {player.smartQueue.slice(0, 12).map((slug, i) => {
                      const s = songs.find((song) => song.slug === slug);
                      if (!s) return null;
                      return (
                        <li key={slug} className="group flex items-center gap-3 rounded-lg px-2 py-2 text-ink-dim transition-colors hover:bg-raised/60">
                          <span className="w-4 shrink-0 text-right text-[10px] tabular-nums text-ink-faint">{i + 1}</span>
                          <button onClick={() => player.playSong(slug)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                            {s.youtubeId && (
                              <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded border border-hairline">
                                <Image src={ytThumbnail(s.youtubeId, "mq")} alt="" fill sizes="36px" className="object-cover" unoptimized />
                              </span>
                            )}
                            <span className="min-w-0 flex-1 truncate text-sm hover:text-ink">{s.title}</span>
                          </button>
                          <button
                            onClick={() => player.removeFromSmartQueue(slug)}
                            aria-label={`Remove ${s.title} from queue`}
                            className="shrink-0 text-ink-faint opacity-0 transition-opacity hover:text-gold group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
