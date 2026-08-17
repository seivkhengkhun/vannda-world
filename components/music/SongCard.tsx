"use client";

import Image from "next/image";
import Link from "next/link";
import { Music2, Pause, Play, ExternalLink } from "lucide-react";
import type { Song } from "@/content/types";
import { albums } from "@/content/albums";
import { usePlayer } from "@/components/player/PlayerProvider";
import { ytThumbnail } from "@/lib/youtube";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SongCard({ song }: { song: Song }) {
  const player = usePlayer();
  const { t } = useLanguage();
  const isCurrent = player.currentSlug === song.slug;
  const isPlaying = isCurrent && player.isPlaying;

  const fallbackCover = song.albumSlug ? albums.find((a) => a.slug === song.albumSlug)?.coverYoutubeId : undefined;
  const thumbnailId = song.youtubeId ?? fallbackCover;
  const externalListenUrl = song.spotifyUrl ?? song.appleMusicUrl ?? song.deezerUrl;

  const subtitle =
    song.category === "featured"
      ? `${song.primaryArtist} feat. VannDa`
      : song.featuring.length
        ? `${t.common.featuring} ${song.featuring.join(", ")}`
        : song.releaseDateLabel;

  return (
    <div className="group relative flex flex-col overflow-hidden border border-hairline bg-surface transition-colors hover:border-hairline-strong">
      <div className="relative aspect-square w-full overflow-hidden bg-raised">
        {thumbnailId ? (
          <Image
            src={ytThumbnail(thumbnailId, "hq")}
            alt={song.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 className="text-ink-faint" size={28} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-void/80 via-void/10 to-transparent" />
        {song.youtubeId ? (
          <button
            onClick={() => (isPlaying ? player.togglePlay() : player.playSong(song.slug))}
            aria-label={isPlaying ? t.player.pause : t.common.listenNow}
            className={cn(
              "absolute bottom-3 right-3 rounded-full bg-gold p-3 text-void opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100",
              isCurrent && "opacity-100",
            )}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        ) : externalListenUrl ? (
          <a
            href={externalListenUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.common.watchOfficial}
            className="absolute bottom-3 right-3 rounded-full bg-gold p-3 text-void opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
          >
            <ExternalLink size={16} />
          </a>
        ) : null}
      </div>
      <Link href={`/songs/${song.slug}`} className="flex flex-1 flex-col p-4">
        <span className="font-display text-sm tracking-wide text-ink">{song.title}</span>
        <span className="mt-1 text-xs text-ink-dim">{subtitle}</span>
      </Link>
    </div>
  );
}
