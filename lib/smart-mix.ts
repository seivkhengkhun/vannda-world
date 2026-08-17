import type { Era, Song } from "@/content/types";

export type MixMode = "vibe" | "chill" | "hype" | "night" | "journey" | "random-smart";

export const MIX_MODES: { key: MixMode; label: string; description: string }[] = [
  { key: "vibe", label: "VannDa Vibe", description: "A balanced overall listening experience" },
  { key: "chill", label: "Chill", description: "Lower energy, smoother transitions" },
  { key: "hype", label: "Hype", description: "High energy, stronger tracks" },
  { key: "night", label: "Night", description: "A darker, atmospheric session" },
  { key: "journey", label: "Journey", description: "Chronological, era by era" },
  { key: "random-smart", label: "Random Smart", description: "Random start, smart transitions" },
];

/**
 * Chronological order of eras (by when each one actually happened), used for
 * Journey mode and for scoring how "close" two songs are in VannDa's career.
 */
const ERA_CHRONOLOGY: Era[] = [
  "independent",
  "skull",
  "breakthrough",
  "skull2",
  "baramey-crew",
  "global",
  "treyvisai",
  "current",
];

/**
 * There is no real audio-analysis data (BPM, measured energy, mood) for this
 * catalogue, and we don't fabricate any. Instead this derives a rough 0-100
 * "energy" heuristic purely from metadata that's already real and sourced:
 * category, tags, duration, and era. It's a stand-in for "energy level" using
 * the metadata that's actually available, not a claim about the audio itself.
 */
export function heuristicEnergy(song: Song): number {
  let score = 50;
  if (song.tags.includes("interlude")) score -= 30;
  if (song.tags.includes("cultural") || song.tags.includes("traditional")) score -= 12;
  if (song.category === "collaboration") score += 10;
  if (song.category === "single") score += 6;
  if (song.category === "featured") score += 4;
  if (song.durationSeconds) {
    if (song.durationSeconds < 180) score += 12;
    else if (song.durationSeconds > 300) score -= 12;
  }
  if (song.era === "current" || song.era === "treyvisai") score += 6;
  if (song.era === "independent") score -= 10;
  return Math.max(0, Math.min(100, score));
}

function eraDistance(a: Era, b: Era): number {
  const ia = ERA_CHRONOLOGY.indexOf(a);
  const ib = ERA_CHRONOLOGY.indexOf(b);
  return Math.abs(ia - ib);
}

function tagOverlap(a: Song, b: Song): number {
  const setA = new Set(a.tags);
  const setB = new Set(b.tags);
  const shared = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...setA, ...setB]).size;
  return union ? shared / union : 0;
}

function collaboratorOverlap(a: Song, b: Song): number {
  const artistsA = new Set([...a.featuring, a.primaryArtist].filter(Boolean) as string[]);
  const artistsB = new Set([...b.featuring, b.primaryArtist].filter(Boolean) as string[]);
  let shared = 0;
  for (const x of artistsA) if (artistsB.has(x)) shared++;
  return shared;
}

interface TransitionContext {
  recentEras: Era[];
  recentAlbums: (string | undefined)[];
}

/** How well `to` follows `from` — higher is a more natural transition. */
export function scoreTransition(from: Song, to: Song, ctx: TransitionContext): number {
  let score = 0;
  score += Math.max(0, 100 - eraDistance(from.era, to.era) * 20);
  score += tagOverlap(from, to) * 40;
  score += collaboratorOverlap(from, to) * 25;
  const energyDiff = Math.abs(heuristicEnergy(from) - heuristicEnergy(to));
  score += Math.max(0, 30 - energyDiff * 0.5);
  if (from.albumSlug && from.albumSlug === to.albumSlug) score += 15;
  if (ctx.recentEras.includes(to.era)) score -= 15;
  if (to.albumSlug && ctx.recentAlbums.includes(to.albumSlug)) score -= 10;
  return score;
}

function modeBias(song: Song, mode: MixMode): number {
  const e = heuristicEnergy(song);
  switch (mode) {
    case "chill":
      return -Math.abs(e - 25);
    case "hype":
      return -Math.abs(e - 80);
    case "night": {
      let b = -Math.abs(e - 35);
      if (song.era === "current" || song.era === "treyvisai" || song.era === "global") b += 10;
      if (song.tags.includes("cultural")) b -= 8;
      return b;
    }
    default:
      return 0;
  }
}

function chronologicalOrder(songs: Song[]): Song[] {
  return [...songs].sort((a, b) => {
    const eraDiff = ERA_CHRONOLOGY.indexOf(a.era) - ERA_CHRONOLOGY.indexOf(b.era);
    if (eraDiff !== 0) return eraDiff;
    if (a.releaseYear !== b.releaseYear) return a.releaseYear - b.releaseYear;
    return (a.trackNumber ?? 0) - (b.trackNumber ?? 0);
  });
}

/** Only songs the player can actually queue and play. */
export function playableSongs(all: Song[]): Song[] {
  return all.filter((s) => Boolean(s.youtubeId));
}

export function pickRandomSeed(pool: Song[]): Song | undefined {
  if (!pool.length) return undefined;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Builds a Smart Mix queue starting from (but not including) `seed`, using
 * greedy nearest-neighbor selection by scoreTransition + mode bias, with a
 * little randomness among the top candidates each step so the same seed
 * doesn't always produce an identical queue.
 */
export function buildSmartQueue(options: {
  seed: Song | undefined;
  mode: MixMode;
  pool: Song[];
  length?: number;
}): Song[] {
  const { seed, mode, pool, length = 25 } = options;
  const playable = playableSongs(pool);

  if (mode === "journey") {
    const ordered = chronologicalOrder(playable);
    const startIndex = seed ? ordered.findIndex((s) => s.slug === seed.slug) : -1;
    const rotated = startIndex >= 0 ? [...ordered.slice(startIndex + 1), ...ordered.slice(0, startIndex + 1)] : ordered;
    return rotated.filter((s) => s.slug !== seed?.slug).slice(0, length);
  }

  const usedSlugs = new Set<string>(seed ? [seed.slug] : []);
  let current = seed ?? pickRandomSeed(playable);
  if (!current) return [];

  const recentEras: Era[] = [];
  const recentAlbums: (string | undefined)[] = [];
  const queue: Song[] = [];

  for (let i = 0; i < length; i++) {
    const candidates = playable.filter((s) => !usedSlugs.has(s.slug));
    if (!candidates.length) break;

    const scored = candidates
      .map((c) => ({
        song: c,
        score: scoreTransition(current!, c, { recentEras, recentAlbums }) + modeBias(c, mode) * 1.2 + Math.random() * 8,
      }))
      .sort((a, b) => b.score - a.score);

    const topPool = scored.slice(0, Math.min(5, scored.length));
    const pick = topPool[Math.floor(Math.random() * topPool.length)].song;

    queue.push(pick);
    usedSlugs.add(pick.slug);
    recentEras.push(pick.era);
    if (recentEras.length > 3) recentEras.shift();
    recentAlbums.push(pick.albumSlug);
    if (recentAlbums.length > 3) recentAlbums.shift();
    current = pick;
  }

  return queue;
}
