/**
 * Everything here is editorial/curated by this fan site, or purely local
 * client-side interaction (the Era Quiz). None of it claims to be
 * real-time aggregated community data — there is no backend to tally that
 * honestly, so we don't pretend to have it.
 */

export const fanFavoriteSongSlugs = ["time-to-rise", "coda", "no-disrespect", "golden-land"];

export interface EraQuizOption {
  label: string;
  eraSlug: string;
}

export interface EraQuizQuestion {
  id: string;
  prompt: string;
  options: EraQuizOption[];
}

export interface EraResult {
  eraSlug: string;
  title: string;
  description: string;
  representativeSongSlug: string;
}

export const eraQuizQuestions: EraQuizQuestion[] = [
  {
    id: "sound",
    prompt: "What pulls you into a VannDa track first?",
    options: [
      { label: "Traditional instruments meeting modern beats", eraSlug: "breakthrough" },
      { label: "Raw, hard-hitting bars", eraSlug: "skull2" },
      { label: "The crew energy of a posse cut", eraSlug: "baramey-crew" },
      { label: "Big, cinematic production", eraSlug: "treyvisai" },
    ],
  },
  {
    id: "moment",
    prompt: "Which moment defines VannDa for you?",
    options: [
      { label: "Kong Nay's chapei on \"Time To Rise\"", eraSlug: "breakthrough" },
      { label: "SKULL 2 landing after the breakthrough", eraSlug: "skull2" },
      { label: "The Baramey Crew coming together", eraSlug: "baramey-crew" },
      { label: "Standing on the Paris Olympics stage", eraSlug: "global" },
    ],
  },
  {
    id: "vibe",
    prompt: "Pick a vibe.",
    options: [
      { label: "National Museum at golden hour", eraSlug: "breakthrough" },
      { label: "Late-night studio session", eraSlug: "skull2" },
      { label: "Khmer New Year block party", eraSlug: "baramey-crew" },
      { label: "Cypher with rappers from four countries", eraSlug: "global" },
    ],
  },
];

export const eraResults: EraResult[] = [
  {
    eraSlug: "breakthrough",
    title: "The Breakthrough Era",
    description: "You're drawn to where VannDa's world began to open — tradition and hip-hop meeting on equal terms.",
    representativeSongSlug: "time-to-rise",
  },
  {
    eraSlug: "skull2",
    title: "The SKULL 2 Era",
    description: "You want the bars and the grit — the album that proved the breakthrough wasn't a one-off.",
    representativeSongSlug: "coda",
  },
  {
    eraSlug: "baramey-crew",
    title: "The Baramey Crew Era",
    description: "You're here for the collective — the label's whole roster showing up together.",
    representativeSongSlug: "legacy",
  },
  {
    eraSlug: "treyvisai",
    title: "The TREYVISAI Era",
    description: "You're locked into the current chapter — the biggest, most cinematic version of VannDa yet.",
    representativeSongSlug: "no-disrespect",
  },
  {
    eraSlug: "global",
    title: "The Global Era",
    description: "You follow VannDa as a world artist — Olympic stages and cross-continent cyphers.",
    representativeSongSlug: "asian-state-of-mind",
  },
];
