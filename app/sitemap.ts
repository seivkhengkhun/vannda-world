import type { MetadataRoute } from "next";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";

export const dynamic = "force-static";

const BASE_URL = "https://vannda-fanworld.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/music",
    "/journey",
    "/universe",
    "/videos",
    "/archive",
    "/fan-zone",
    "/baramey",
    "/credits",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
    })),
    ...songs.map((s) => ({ url: `${BASE_URL}/songs/${s.slug}`, lastModified: new Date() })),
    ...albums.map((a) => ({ url: `${BASE_URL}/albums/${a.slug}`, lastModified: new Date() })),
  ];
}
