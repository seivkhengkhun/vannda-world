"use client";

import Image from "next/image";
import Link from "next/link";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, ChevronUp, Sparkles } from "lucide-react";
import { usePlayer } from "./PlayerProvider";
import { songs } from "@/content/songs";
import { ytThumbnail } from "@/lib/youtube";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MiniPlayer() {
  const player = usePlayer();
  const { t } = useLanguage();
  const song = songs.find((s) => s.slug === player.currentSlug);

  if (!song) return null;

  const pct = player.progress.duration
    ? (player.progress.current / player.progress.duration) * 100
    : 0;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-surface/90 backdrop-blur-xl transition-transform duration-500",
        player.isExpanded && "translate-y-full md:translate-y-0",
      )}
    >
      <div className="h-0.5 w-full bg-raised-2">
        <div
          className={cn("h-full transition-[width]", player.isTransitioning ? "bg-gold/50" : "bg-gold")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3">
        <button
          onClick={() => player.setExpanded(true)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          {song.youtubeId && (
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded border border-hairline sm:h-12 sm:w-12">
              <Image
                src={ytThumbnail(song.youtubeId, "mq")}
                alt=""
                fill
                sizes="48px"
                className={cn("object-cover transition-opacity duration-500", player.isTransitioning && "opacity-60")}
                unoptimized
              />
            </span>
          )}
          <span className="min-w-0">
            <span className="block truncate font-display text-sm tracking-wide text-ink">{song.title}</span>
            <span className="block truncate text-xs text-ink-dim">
              {player.isTransitioning
                ? "Smart transition…"
                : song.featuring.length
                  ? `${t.common.featuring} ${song.featuring.join(", ")}`
                  : t.player.nowPlaying}
            </span>
          </span>
        </button>

        <button
          aria-label="Smart Mix"
          aria-pressed={player.smartMixEnabled}
          onClick={player.toggleSmartMix}
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] transition-colors sm:flex",
            player.smartMixEnabled
              ? "border-gold bg-gold/10 text-gold"
              : "border-hairline-strong text-ink-faint hover:text-ink-dim",
          )}
        >
          <Sparkles size={13} className={player.smartMixEnabled ? "fill-gold" : ""} />
          Smart Mix
        </button>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            aria-label={t.player.previous}
            onClick={player.previous}
            className="rounded-full p-2 text-ink-dim transition-colors hover:text-gold"
          >
            <SkipBack size={18} />
          </button>
          <button
            aria-label={player.isPlaying ? t.player.pause : t.player.play}
            onClick={player.togglePlay}
            className="rounded-full bg-gold p-2.5 text-void transition-transform hover:scale-105"
          >
            {player.isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            aria-label={t.player.next}
            onClick={player.next}
            className="rounded-full p-2 text-ink-dim transition-colors hover:text-gold"
          >
            <SkipForward size={18} />
          </button>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <span className="w-9 text-right text-xs tabular-nums text-ink-faint">
            {formatTime(player.progress.current)}
          </span>
          <button
            aria-label={player.muted ? t.player.unmute : t.player.mute}
            onClick={player.toggleMute}
            className="rounded-full p-2 text-ink-dim transition-colors hover:text-gold"
          >
            {player.muted || player.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            aria-label="Volume"
            type="range"
            min={0}
            max={100}
            value={player.muted ? 0 : player.volume}
            onChange={(e) => player.setVolume(Number(e.target.value))}
            className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-raised-2 accent-gold"
          />
        </div>

        <button
          aria-label={t.player.expand}
          onClick={() => player.setExpanded(true)}
          className="rounded-full p-2 text-ink-dim transition-colors hover:text-gold"
        >
          <ChevronUp size={18} />
        </button>
      </div>
      <Link href={`/songs/${song.slug}`} className="sr-only">
        {song.title}
      </Link>
    </div>
  );
}
