"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { songs } from "@/content/songs";
import { cn } from "@/lib/utils";

interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  cueVideoById(id: string): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(vol: number): void;
  getVolume(): number;
  mute(): void;
  unMute(): void;
  isMuted(): boolean;
  getCurrentTime(): number;
  getDuration(): number;
  getIframe(): HTMLIFrameElement;
}

interface YTPlayerEvent {
  target: YTPlayerInstance;
  data?: number;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement | string,
        opts: {
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: YTPlayerEvent) => void;
            onStateChange?: (e: YTPlayerEvent) => void;
          };
        },
      ) => YTPlayerInstance;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const defaultQueue = songs.filter((s) => s.youtubeId).map((s) => s.slug);

interface Progress {
  current: number;
  duration: number;
}

interface PlayerContextValue {
  queue: string[];
  currentSlug: string | null;
  isReady: boolean;
  isPlaying: boolean;
  isExpanded: boolean;
  volume: number;
  muted: boolean;
  progress: Progress;
  playSong: (slug: string) => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  setExpanded: (v: boolean) => void;
}

const PlayerContext = createContext<PlayerContextValue | null>(null);

const STORAGE_KEY = "vannda-world:player";

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<string[]>(defaultQueue);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [muted, setMutedState] = useState(false);
  const [progress, setProgress] = useState<Progress>({ current: 0, duration: 0 });
  const [portalReady, setPortalReady] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingSlugRef = useRef<string | null>(null);
  const isExpandedRef = useRef(isExpanded);
  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  // The YouTube IFrame API takes over its mount element and replaces it with a
  // real <iframe>, outside React's knowledge. Portaling that mount point
  // directly onto document.body — with no other React-managed siblings ever
  // added/removed next to it — keeps that external DOM mutation from
  // corrupting React's reconciliation of the rest of the tree.
  useEffect(() => {
    // document.body doesn't exist during the static server render, so the
    // portal target genuinely can't be created any earlier than this.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPortalReady(true);
  }, []);

  const applyIframeStyle = useCallback((iframe: HTMLIFrameElement, expanded: boolean) => {
    iframe.className = cn(
      "fixed z-40 border-0 transition-all duration-500 ease-out",
      expanded
        ? "left-1/2 top-24 w-[min(92vw,880px)] -translate-x-1/2 aspect-video rounded-xl shadow-2xl shadow-black/60"
        : "left-[-9999px] top-0 h-2 w-2 opacity-0 pointer-events-none",
    );
  }, []);

  // Restore persisted state (client-only). This is a one-time hydration-safe
  // sync from localStorage, which doesn't exist during the static server render,
  // so it genuinely can't be read any earlier than this effect.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          slug?: string;
          volume?: number;
          muted?: boolean;
          queue?: string[];
        };
        /* eslint-disable react-hooks/set-state-in-effect */
        if (saved.queue?.length) setQueue(saved.queue);
        if (saved.slug) setCurrentSlug(saved.slug);
        if (typeof saved.volume === "number") setVolumeState(saved.volume);
        if (typeof saved.muted === "boolean") setMutedState(saved.muted);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist state
  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ slug: currentSlug, volume, muted, queue }),
    );
  }, [currentSlug, volume, muted, queue]);

  // Load YouTube IFrame API + create the player exactly once. `volume`/`muted`/
  // `applyIframeStyle` are intentionally read only for the player's one-time
  // initial values — depending on them would tear down and recreate the
  // YouTube player (restarting playback) on every volume change.
  useEffect(() => {
    function createPlayer() {
      if (!mountRef.current || playerRef.current || !window.YT) return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        playerVars: { rel: 0, playsinline: 1, modestbranding: 1 },
        events: {
          onReady: (e) => {
            iframeRef.current = e.target.getIframe();
            applyIframeStyle(iframeRef.current, isExpandedRef.current);
            e.target.setVolume(volume);
            if (muted) e.target.mute();
            setIsReady(true);
            if (pendingSlugRef.current) {
              const song = songs.find((s) => s.slug === pendingSlugRef.current);
              if (song?.youtubeId) e.target.cueVideoById(song.youtubeId);
              pendingSlugRef.current = null;
            }
          },
          onStateChange: (e) => {
            if (!window.YT) return;
            if (e.data === window.YT.PlayerState.PLAYING) setIsPlaying(true);
            if (e.data === window.YT.PlayerState.PAUSED) setIsPlaying(false);
            if (e.data === window.YT.PlayerState.ENDED) {
              setIsPlaying(false);
              nextRef.current();
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prevReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevReady?.();
        createPlayer();
      };
      if (!document.getElementById("youtube-iframe-api")) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (iframeRef.current) applyIframeStyle(iframeRef.current, isExpanded);
  }, [isExpanded, applyIframeStyle]);

  // Poll progress while playing
  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      setProgress({ current: p.getCurrentTime() ?? 0, duration: p.getDuration() ?? 0 });
    }, 400);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  const playSong = useCallback(
    (slug: string) => {
      const song = songs.find((s) => s.slug === slug);
      if (!song?.youtubeId) return;
      setCurrentSlug(slug);
      if (!queue.includes(slug)) setQueue((q) => [slug, ...q]);
      if (playerRef.current && isReady) {
        playerRef.current.loadVideoById(song.youtubeId);
      } else {
        pendingSlugRef.current = slug;
      }
    },
    [isReady, queue],
  );

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) {
      p.pauseVideo();
    } else if (currentSlug) {
      p.playVideo();
    } else if (queue[0]) {
      playSong(queue[0]);
      window.setTimeout(() => playerRef.current?.playVideo(), 300);
    }
  }, [isPlaying, currentSlug, queue, playSong]);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!currentSlug) {
        if (queue[0]) playSong(queue[0]);
        return;
      }
      const idx = queue.indexOf(currentSlug);
      const nextIdx = (idx + dir + queue.length) % queue.length;
      playSong(queue[nextIdx]);
      window.setTimeout(() => playerRef.current?.playVideo(), 300);
    },
    [currentSlug, queue, playSong],
  );

  const next = useCallback(() => step(1), [step]);
  const previous = useCallback(() => step(-1), [step]);
  // "Latest ref" pattern: the YouTube player is only constructed once (mount-only
  // effect below), so its onStateChange(ENDED) handler needs a stable way to reach
  // the current `next`, which itself changes whenever the queue does.
  const nextRef = useRef(next);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- see comment above
    nextRef.current = next;
  }, [next]);

  const seek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    playerRef.current?.setVolume(v);
    if (v > 0 && muted) {
      setMutedState(false);
      playerRef.current?.unMute();
    }
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      const next = !m;
      if (next) playerRef.current?.mute();
      else playerRef.current?.unMute();
      return next;
    });
  }, []);

  const setExpanded = useCallback((v: boolean) => setIsExpanded(v), []);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentSlug,
        isReady,
        isPlaying,
        isExpanded,
        volume,
        muted,
        progress,
        playSong,
        togglePlay,
        next,
        previous,
        seek,
        setVolume,
        toggleMute,
        setExpanded,
      }}
    >
      {children}
      {portalReady && createPortal(<div ref={mountRef} />, document.body)}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
