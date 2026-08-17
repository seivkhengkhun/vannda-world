export interface Source {
  label: string;
  url: string;
}

export type Era =
  | "independent"
  | "skull"
  | "skull2"
  | "breakthrough"
  | "baramey-crew"
  | "treyvisai"
  | "global"
  | "current";

/**
 * How a song relates to VannDa's own catalogue:
 * - "album-track": part of one of his albums/mini-albums (see Song.albumSlug)
 * - "single": his own standalone release, not part of an album
 * - "collaboration": jointly billed with another artist (e.g. "F.HERO x VannDa")
 * - "featured": another artist's release on which VannDa appears as a guest
 */
export type SongCategory = "album-track" | "single" | "collaboration" | "featured";

export interface Song {
  slug: string;
  title: string;
  titleKm?: string;
  category: SongCategory;
  era: Era;
  releaseYear: number;
  releaseDateLabel: string;
  albumSlug?: string;
  trackNumber?: number;
  durationSeconds?: number;
  /** For "featured": who the primary/lead artist is (their release, not VannDa's). */
  primaryArtist?: string;
  featuring: string[];
  youtubeId?: string;
  youtubeChannel?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  deezerUrl?: string;
  about: string;
  aboutKm?: string;
  fanInterpretation?: string;
  tags: string[];
  sources: Source[];
}

export interface Album {
  slug: string;
  title: string;
  subtitle?: string;
  type: "album" | "mini-album";
  era: Era;
  releaseYear: number;
  releaseDateLabel: string;
  description: string;
  descriptionKm?: string;
  /** Complete, ordered tracklist — every slug must exist in songs.ts. */
  trackSlugs: string[];
  totalTracks: number;
  coverYoutubeId: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  deezerUrl?: string;
  sources: Source[];
}

export interface TimelineEvent {
  id: string;
  year: number;
  dateLabel: string;
  title: string;
  titleKm?: string;
  description: string;
  relatedSongSlug?: string;
  youtubeId?: string;
  sources: Source[];
}

export type VideoCategory =
  | "music-video"
  | "performance"
  | "collaboration"
  | "audio";

export interface VideoEntry {
  id: string;
  youtubeId: string;
  title: string;
  category: VideoCategory;
  year: number;
  channel: string;
  relatedSongSlug?: string;
  sources: Source[];
}

export type GalleryCategory = "performance" | "music-video" | "cultural";

export interface GalleryItem {
  id: string;
  category: GalleryCategory;
  title: string;
  youtubeId: string;
  attribution: string;
  sourceUrl: string;
}

export interface OfficialLink {
  platform: string;
  handle: string;
  url: string;
}
