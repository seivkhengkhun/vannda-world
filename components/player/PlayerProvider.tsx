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
import { buildSmartQueue, pickRandomSeed, type MixMode } from "@/lib/smart-mix";

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
const CROSSFADE_DURATIONS = [3, 5, 8, 10] as const;
export type CrossfadeDuration = (typeof CROSSFADE_DURATIONS)[number];

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
  // Smart Mix
  smartMixEnabled: boolean;
  toggleSmartMix: () => void;
  mixMode: MixMode;
  setMixMode: (m: MixMode) => void;
  crossfadeEnabled: boolean;
  setCrossfadeEnabled: (v: boolean) => void;
  crossfadeDuration: CrossfadeDuration;
  setCrossfadeDuration: (v: CrossfadeDuration) => void;
  smartQueue: string[];
  isTransitioning: boolean;
  removeFromSmartQueue: (slug: string) => void;
  shuffleSmartQueue: () => void;
  regenerateSmartQueue: () => void;
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

  const [smartMixEnabled, setSmartMixEnabled] = useState(false);
  const [mixMode, setMixModeState] = useState<MixMode>("vibe");
  const [crossfadeEnabled, setCrossfadeEnabledState] = useState(true);
  const [crossfadeDuration, setCrossfadeDurationState] = useState<CrossfadeDuration>(5);
  const [smartQueue, setSmartQueue] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const pendingSlugRef = useRef<string | null>(null);
  const isExpandedRef = useRef(isExpanded);
  useEffect(() => {
    isExpandedRef.current = isExpanded;
  }, [isExpanded]);

  // Latest-ref mirrors so imperative callbacks (YT event handlers, fade
  // timers) never close over stale values.
  const smartMixEnabledRef = useRef(smartMixEnabled);
  const mixModeRef = useRef(mixMode);
  const crossfadeEnabledRef = useRef(crossfadeEnabled);
  const crossfadeDurationRef = useRef<CrossfadeDuration>(crossfadeDuration);
  const volumeRef = useRef(volume);
  const smartQueueRef = useRef<string[]>(smartQueue);
  const transitioningRef = useRef(false);
  const smartHistoryRef = useRef<string[]>([]);
  const fadeTimersRef = useRef<number[]>([]);
  const currentSlugRef = useRef<string | null>(currentSlug);
  useEffect(() => {
    currentSlugRef.current = currentSlug;
  }, [currentSlug]);
  useEffect(() => {
    smartMixEnabledRef.current = smartMixEnabled;
  }, [smartMixEnabled]);
  useEffect(() => {
    mixModeRef.current = mixMode;
  }, [mixMode]);
  useEffect(() => {
    crossfadeEnabledRef.current = crossfadeEnabled;
  }, [crossfadeEnabled]);
  useEffect(() => {
    crossfadeDurationRef.current = crossfadeDuration;
  }, [crossfadeDuration]);
  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);
  useEffect(() => {
    smartQueueRef.current = smartQueue;
  }, [smartQueue]);

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
          smartMixEnabled?: boolean;
          mixMode?: MixMode;
          crossfadeEnabled?: boolean;
          crossfadeDuration?: CrossfadeDuration;
        };
        /* eslint-disable react-hooks/set-state-in-effect */
        if (saved.queue?.length) setQueue(saved.queue);
        if (saved.slug) setCurrentSlug(saved.slug);
        if (typeof saved.volume === "number") setVolumeState(saved.volume);
        if (typeof saved.muted === "boolean") setMutedState(saved.muted);
        if (saved.mixMode) setMixModeState(saved.mixMode);
        if (typeof saved.crossfadeEnabled === "boolean") setCrossfadeEnabledState(saved.crossfadeEnabled);
        if (saved.crossfadeDuration && CROSSFADE_DURATIONS.includes(saved.crossfadeDuration)) {
          setCrossfadeDurationState(saved.crossfadeDuration);
        }
        if (saved.smartMixEnabled) {
          setSmartMixEnabled(true);
          const seed = saved.slug ? songs.find((s) => s.slug === saved.slug) : undefined;
          const generated = buildSmartQueue({ seed, mode: saved.mixMode ?? "vibe", pool: songs, length: 25 });
          setSmartQueue(generated.map((s) => s.slug));
        }
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {
      // ignore corrupt storage
    }
  }, []);

  // Persist state. Skip the very first run: it fires in the same initial
  // effects pass as the restore effect above, with this render's still-default
  // closure values, and would otherwise immediately clobber whatever the
  // restore effect just read from localStorage before it can take effect.
  const skippedFirstPersistRef = useRef(false);
  useEffect(() => {
    if (!skippedFirstPersistRef.current) {
      skippedFirstPersistRef.current = true;
      return;
    }
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ slug: currentSlug, volume, muted, queue, smartMixEnabled, mixMode, crossfadeEnabled, crossfadeDuration }),
    );
  }, [currentSlug, volume, muted, queue, smartMixEnabled, mixMode, crossfadeEnabled, crossfadeDuration]);

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
              handleTrackEndRef.current();
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
      // A manually-chosen song while Smart Mix is on should redirect the
      // session from here, not reset it randomly.
      if (smartMixEnabledRef.current) {
        const generated = buildSmartQueue({ seed: song, mode: mixModeRef.current, pool: songs, length: 25 });
        setSmartQueue(generated.map((s) => s.slug));
        smartHistoryRef.current = [];
      }
    },
    [isReady, queue],
  );
  const playSongRef = useRef(playSong);
  useEffect(() => {
    playSongRef.current = playSong;
  }, [playSong]);

  const clearFadeTimers = useCallback(() => {
    for (const id of fadeTimersRef.current) window.clearInterval(id);
    fadeTimersRef.current = [];
  }, []);

  /** Advances to the next Smart Mix track without touching the manual `queue`. */
  const advanceSmartQueueInternal = useCallback(() => {
    const sq = smartQueueRef.current;
    const nextSlug = sq[0];
    if (!nextSlug) return;
    const song = songs.find((s) => s.slug === nextSlug);
    if (!song?.youtubeId) return;

    if (currentSlugRef.current) {
      smartHistoryRef.current = [...smartHistoryRef.current, currentSlugRef.current].slice(-20);
    }
    setCurrentSlug(nextSlug);
    playerRef.current?.loadVideoById(song.youtubeId);
    playerRef.current?.playVideo();

    const rest = sq.slice(1);
    if (rest.length < 6) {
      const additional = buildSmartQueue({ seed: song, mode: mixModeRef.current, pool: songs, length: 15 });
      setSmartQueue([...new Set([...rest, ...additional.map((s) => s.slug)])]);
    } else {
      setSmartQueue(rest);
    }
  }, []);

  /** Fade the current track out, switch, then fade the new one in. */
  const beginSmartTransition = useCallback(() => {
    if (transitioningRef.current) return;
    if (!smartQueueRef.current.length) return;
    transitioningRef.current = true;
    setIsTransitioning(true);

    const target = volumeRef.current;
    const totalMs = crossfadeDurationRef.current * 1000;
    const steps = 20;
    const stepMs = totalMs / steps;
    let i = 0;

    const fadeOut = window.setInterval(() => {
      i++;
      playerRef.current?.setVolume(Math.max(0, target * (1 - i / steps)));
      if (i >= steps) {
        window.clearInterval(fadeOut);
        advanceSmartQueueInternal();

        const resumeTimeout = window.setTimeout(() => {
          let j = 0;
          const fadeIn = window.setInterval(() => {
            j++;
            playerRef.current?.setVolume(Math.min(target, target * (j / steps)));
            if (j >= steps) {
              window.clearInterval(fadeIn);
              transitioningRef.current = false;
              setIsTransitioning(false);
            }
          }, stepMs);
          fadeTimersRef.current.push(fadeIn);
        }, 350);
        fadeTimersRef.current.push(resumeTimeout as unknown as number);
      }
    }, stepMs);
    fadeTimersRef.current.push(fadeOut);
  }, [advanceSmartQueueInternal]);
  const beginSmartTransitionRef = useRef(beginSmartTransition);
  useEffect(() => {
    beginSmartTransitionRef.current = beginSmartTransition;
  }, [beginSmartTransition]);

  // Watch playback progress to trigger a Smart Mix fade near the end of a track.
  useEffect(() => {
    if (!smartMixEnabled || !crossfadeEnabled || !isPlaying) return;
    if (transitioningRef.current) return;
    const remaining = progress.duration - progress.current;
    if (progress.duration > 0 && remaining > 0 && remaining <= crossfadeDuration) {
      beginSmartTransitionRef.current();
    }
  }, [progress, smartMixEnabled, crossfadeEnabled, isPlaying, crossfadeDuration]);

  const togglePlay = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (isPlaying) {
      p.pauseVideo();
    } else if (currentSlug) {
      p.playVideo();
    } else if (smartMixEnabled && smartQueue[0]) {
      playSong(smartQueue[0]);
      window.setTimeout(() => playerRef.current?.playVideo(), 300);
    } else if (queue[0]) {
      playSong(queue[0]);
      window.setTimeout(() => playerRef.current?.playVideo(), 300);
    }
  }, [isPlaying, currentSlug, queue, playSong, smartMixEnabled, smartQueue]);

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

  const next = useCallback(() => {
    if (smartMixEnabledRef.current) {
      clearFadeTimers();
      transitioningRef.current = false;
      setIsTransitioning(false);
      if (currentSlugRef.current) playerRef.current?.setVolume(volumeRef.current);
      advanceSmartQueueInternal();
      return;
    }
    step(1);
  }, [step, advanceSmartQueueInternal, clearFadeTimers]);

  const previous = useCallback(() => {
    if (smartMixEnabledRef.current) {
      const history = smartHistoryRef.current;
      const prevSlug = history[history.length - 1];
      if (prevSlug) {
        const song = songs.find((s) => s.slug === prevSlug);
        if (song?.youtubeId) {
          smartHistoryRef.current = history.slice(0, -1);
          if (currentSlugRef.current) {
            setSmartQueue((sq) => [currentSlugRef.current as string, ...sq]);
          }
          setCurrentSlug(prevSlug);
          playerRef.current?.loadVideoById(song.youtubeId);
          playerRef.current?.playVideo();
          return;
        }
      }
    }
    step(-1);
  }, [step]);

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

  const toggleSmartMix = useCallback(() => {
    setSmartMixEnabled((was) => {
      const enabling = !was;
      if (enabling) {
        const seed = currentSlugRef.current
          ? songs.find((s) => s.slug === currentSlugRef.current)
          : pickRandomSeed(songs.filter((s) => Boolean(s.youtubeId)));
        const generated = buildSmartQueue({ seed, mode: mixModeRef.current, pool: songs, length: 25 });
        setSmartQueue(generated.map((s) => s.slug));
        smartHistoryRef.current = [];
        if (!currentSlugRef.current && seed) {
          playSongRef.current(seed.slug);
          window.setTimeout(() => playerRef.current?.playVideo(), 300);
        }
      } else {
        clearFadeTimers();
        transitioningRef.current = false;
        setIsTransitioning(false);
        playerRef.current?.setVolume(volumeRef.current);
      }
      return enabling;
    });
  }, [clearFadeTimers]);

  const setMixMode = useCallback((m: MixMode) => {
    setMixModeState(m);
    if (smartMixEnabledRef.current) {
      const seed = currentSlugRef.current ? songs.find((s) => s.slug === currentSlugRef.current) : undefined;
      const generated = buildSmartQueue({ seed, mode: m, pool: songs, length: 25 });
      setSmartQueue(generated.map((s) => s.slug));
    }
  }, []);

  const setCrossfadeEnabled = useCallback((v: boolean) => setCrossfadeEnabledState(v), []);
  const setCrossfadeDuration = useCallback((v: CrossfadeDuration) => setCrossfadeDurationState(v), []);

  const removeFromSmartQueue = useCallback((slug: string) => {
    setSmartQueue((sq) => sq.filter((s) => s !== slug));
  }, []);

  const shuffleSmartQueue = useCallback(() => {
    setSmartQueue((sq) => {
      const copy = [...sq];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  }, []);

  const regenerateSmartQueue = useCallback(() => {
    const seed = currentSlugRef.current ? songs.find((s) => s.slug === currentSlugRef.current) : undefined;
    const generated = buildSmartQueue({ seed, mode: mixModeRef.current, pool: songs, length: 25 });
    setSmartQueue(generated.map((s) => s.slug));
  }, []);

  // Stable handler the YT onStateChange(ENDED) callback can always reach.
  // "Latest ref" pattern: the YouTube player is only constructed once, so its
  // ENDED handler needs a stable way to reach current step/advance logic.
  const handleTrackEndRef = useRef<() => void>(() => {});
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- see comment above
    handleTrackEndRef.current = () => {
      if (transitioningRef.current) return; // the fade engine is already advancing
      if (smartMixEnabledRef.current) {
        advanceSmartQueueInternal();
      } else {
        step(1);
      }
    };
  }, [step, advanceSmartQueueInternal]);

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
        smartMixEnabled,
        toggleSmartMix,
        mixMode,
        setMixMode,
        crossfadeEnabled,
        setCrossfadeEnabled,
        crossfadeDuration,
        setCrossfadeDuration,
        smartQueue,
        isTransitioning,
        removeFromSmartQueue,
        shuffleSmartQueue,
        regenerateSmartQueue,
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
