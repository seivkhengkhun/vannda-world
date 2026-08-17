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
  | "global";

export interface Song {
  slug: string;
  title: string;
  titleKm?: string;
  era: Era;
  releaseYear: number;
  releaseDateLabel: string;
  albumSlug?: string;
  featuring: string[];
  youtubeId?: string;
  youtubeChannel?: string;
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
  notableTrackSlugs: string[];
  coverYoutubeId: string;
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
