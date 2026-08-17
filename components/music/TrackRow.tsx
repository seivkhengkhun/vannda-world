"use client";

import Link from "next/link";
import { Pause, Play, Video, Music2 } from "lucide-react";
import type { Song } from "@/content/types";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useLanguage } from "@/lib/i18n";
import { ytWatchUrl } from "@/lib/youtube";
import { cn } from "@/lib/utils";

function formatDuration(seconds?: number) {
  if (!seconds) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function TrackRow({ song }: { song: Song }) {
  const player = usePlayer();
  const { t } = useLanguage();
  const isCurrent = player.currentSlug === song.slug;
  const isPlaying = isCurrent && player.isPlaying;

  return (
    <div
      className={cn(
        "group flex items-center gap-4 border-b border-hairline px-2 py-3 transition-colors hover:bg-raised/50",
        isCurrent && "bg-raised/70",
      )}
    >
      <span className="w-6 shrink-0 text-right font-display text-xs text-ink-faint tabular-nums">
        {song.trackNumber?.toString().padStart(2, "0")}
      </span>

      {song.youtubeId ? (
        <button
          onClick={() => (isPlaying ? player.togglePlay() : player.playSong(song.slug))}
          aria-label={isPlaying ? t.player.pause : t.common.listenNow}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-dim transition-colors hover:bg-gold hover:text-void",
            isCurrent && "bg-gold text-void",
          )}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center text-ink-faint">
          <Music2 size={14} />
        </span>
      )}

      <Link href={`/songs/${song.slug}`} className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm", isCurrent ? "text-gold" : "text-ink")}>{song.title}</span>
        {song.featuring.length > 0 && (
          <span className="block truncate text-xs text-ink-dim">
            {t.common.featuring} {song.featuring.join(", ")}
          </span>
        )}
      </Link>

      <div className="hidden shrink-0 items-center gap-3 sm:flex">
        {song.youtubeId && (
          <a
            href={ytWatchUrl(song.youtubeId)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.common.watchOfficial}
            className="text-ink-faint transition-colors hover:text-gold"
          >
            <Video size={15} />
          </a>
        )}
        {song.spotifyUrl && (
          <a
            href={song.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[10px] uppercase tracking-wide text-ink-faint transition-colors hover:text-gold"
          >
            Spotify
          </a>
        )}
        {song.appleMusicUrl && (
          <a
            href={song.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[10px] uppercase tracking-wide text-ink-faint transition-colors hover:text-gold"
          >
            Apple
          </a>
        )}
      </div>

      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-ink-faint">
        {formatDuration(song.durationSeconds) ?? ""}
      </span>
    </div>
  );
}
