import Fuse from "fuse.js";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";
import { timeline } from "@/content/timeline";
import { videos } from "@/content/videos";
import { gallery } from "@/content/gallery";

export type SearchEntryType = "Song" | "Album" | "Journey" | "Video" | "Archive";

export interface SearchEntry {
  type: SearchEntryType;
  title: string;
  subtitle: string;
  url: string;
  keywords: string;
}

function songSubtitle(s: (typeof songs)[number]) {
  if (s.category === "featured") return `${s.primaryArtist} feat. VannDa`;
  if (s.featuring.length) return `feat. ${s.featuring.join(", ")}`;
  return s.releaseDateLabel;
}

export const searchEntries: SearchEntry[] = [
  ...songs.map((s): SearchEntry => ({
    type: "Song",
    title: s.title,
    subtitle: songSubtitle(s),
    url: `/songs/${s.slug}`,
    keywords: [
      s.titleKm,
      s.primaryArtist,
      String(s.releaseYear),
      s.category,
      ...s.tags,
      ...s.featuring,
    ]
      .filter(Boolean)
      .join(" "),
  })),
  ...albums.map((a): SearchEntry => ({
    type: "Album",
    title: a.title,
    subtitle: a.releaseDateLabel,
    url: `/albums/${a.slug}`,
    keywords: [a.type, String(a.releaseYear)].join(" "),
  })),
  ...timeline.map((t): SearchEntry => ({
    type: "Journey",
    title: t.title,
    subtitle: t.dateLabel,
    url: `/journey#${t.id}`,
    keywords: [t.description, String(t.year)].join(" "),
  })),
  ...videos.map((v): SearchEntry => ({
    type: "Video",
    title: v.title,
    subtitle: v.channel,
    url: `/videos#${v.id}`,
    keywords: [v.category, String(v.year)].join(" "),
  })),
  ...gallery.map((g): SearchEntry => ({
    type: "Archive",
    title: g.title,
    subtitle: g.attribution,
    url: `/archive#${g.id}`,
    keywords: g.category,
  })),
];

export function createSearchFuse() {
  return new Fuse(searchEntries, {
    keys: [
      { name: "title", weight: 2 },
      { name: "keywords", weight: 1 },
      { name: "subtitle", weight: 0.5 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
}
