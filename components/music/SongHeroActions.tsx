"use client";

import { Pause, Play, Video } from "lucide-react";
import type { Song } from "@/content/types";
import { usePlayer } from "@/components/player/PlayerProvider";
import { useLanguage } from "@/lib/i18n";
import { ytWatchUrl } from "@/lib/youtube";
import { Button } from "@/components/ui/Button";

export function SongHeroActions({ song }: { song: Song }) {
  const player = usePlayer();
  const { t } = useLanguage();
  const isPlaying = player.currentSlug === song.slug && player.isPlaying;

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {song.youtubeId && (
        <>
          <Button onClick={() => (isPlaying ? player.togglePlay() : player.playSong(song.slug))}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? t.player.pause : t.common.listenNow}
          </Button>
          <Button href={ytWatchUrl(song.youtubeId)} variant="outline">
            <Video size={14} />
            {t.common.watchOfficial}
          </Button>
        </>
      )}
      {song.spotifyUrl && (
        <Button href={song.spotifyUrl} variant="outline">
          Spotify
        </Button>
      )}
      {song.appleMusicUrl && (
        <Button href={song.appleMusicUrl} variant="outline">
          Apple Music
        </Button>
      )}
      {song.deezerUrl && (
        <Button href={song.deezerUrl} variant="outline">
          Deezer
        </Button>
      )}
    </div>
  );
}
