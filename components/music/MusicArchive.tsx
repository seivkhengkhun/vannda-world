"use client";

import { useMemo, useState } from "react";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";
import { SongCard } from "@/components/music/SongCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Tab = "all" | "albums" | "projects" | "singles" | "collaborations" | "features";

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "albums", label: "Albums" },
  { key: "projects", label: "Projects" },
  { key: "singles", label: "Singles" },
  { key: "collaborations", label: "Collaborations" },
  { key: "features", label: "Features" },
];

export function MusicArchive() {
  const [tab, setTab] = useState<Tab>("all");
  const [year, setYear] = useState<number | "all">("all");

  const years = useMemo(
    () =>
      Array.from(new Set([...albums.map((a) => a.releaseYear), ...songs.map((s) => s.releaseYear)])).sort(
        (a, b) => b - a,
      ),
    [],
  );

  const fullAlbums = albums.filter((a) => a.type === "album");
  const projects = albums.filter((a) => a.type === "mini-album");
  const singles = songs.filter((s) => s.category === "single");
  const collaborations = songs.filter((s) => s.category === "collaboration");
  const features = songs.filter((s) => s.category === "featured");

  const matchesYear = (y: number) => year === "all" || y === year;

  const allItems = useMemo(() => {
    const items: { year: number; node: React.ReactNode }[] = [
      ...albums.map((a) => ({ year: a.releaseYear, node: <AlbumCard key={`al-${a.slug}`} album={a} /> })),
      ...songs
        .filter((s) => s.category !== "album-track")
        .map((s) => ({ year: s.releaseYear, node: <SongCard key={`sg-${s.slug}`} song={s} /> })),
    ];
    return items.sort((a, b) => b.year - a.year);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 border-b border-hairline pb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-5 py-2.5 font-display text-xs uppercase tracking-[0.2em] transition-colors",
              tab === t.key ? "bg-gold text-void" : "text-ink-dim hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setYear("all")}
          className={cn(
            "px-3 py-1 font-display text-[11px] uppercase tracking-[0.15em] transition-colors",
            year === "all" ? "text-gold" : "text-ink-faint hover:text-ink-dim",
          )}
        >
          All Years
        </button>
        {years.map((y) => (
          <button
            key={y}
            onClick={() => setYear(y)}
            className={cn(
              "px-3 py-1 font-display text-[11px] uppercase tracking-[0.15em] transition-colors",
              year === y ? "text-gold" : "text-ink-faint hover:text-ink-dim",
            )}
          >
            {y}
          </button>
        ))}
      </div>

      {tab === "all" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {allItems
            .filter((item) => matchesYear(item.year))
            .map((item, i) => (
              <Reveal key={i} delay={Math.min(i * 0.03, 0.3)}>
                {item.node}
              </Reveal>
            ))}
        </div>
      )}

      {tab === "albums" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {fullAlbums
            .filter((a) => matchesYear(a.releaseYear))
            .map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.05}>
                <AlbumCard album={a} />
              </Reveal>
            ))}
        </div>
      )}

      {tab === "projects" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {projects
            .filter((a) => matchesYear(a.releaseYear))
            .map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.05}>
                <AlbumCard album={a} />
              </Reveal>
            ))}
        </div>
      )}

      {tab === "singles" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {singles
            .filter((s) => matchesYear(s.releaseYear))
            .map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <SongCard song={s} />
              </Reveal>
            ))}
        </div>
      )}

      {tab === "collaborations" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {collaborations
            .filter((s) => matchesYear(s.releaseYear))
            .map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <SongCard song={s} />
              </Reveal>
            ))}
        </div>
      )}

      {tab === "features" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {features
            .filter((s) => matchesYear(s.releaseYear))
            .map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.04}>
                <SongCard song={s} />
              </Reveal>
            ))}
        </div>
      )}
    </div>
  );
}
