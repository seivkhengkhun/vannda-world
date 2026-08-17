"use client";

import { useState } from "react";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";
import { SongCard } from "@/components/music/SongCard";
import { AlbumCard } from "@/components/music/AlbumCard";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type Tab = "albums" | "singles" | "collaborations";

const tabs: { key: Tab; label: string }[] = [
  { key: "albums", label: "Albums" },
  { key: "singles", label: "Singles" },
  { key: "collaborations", label: "Collaborations" },
];

export function MusicArchive() {
  const [tab, setTab] = useState<Tab>("albums");

  const singles = songs.filter((s) => s.featuring.length === 0);
  const collaborations = songs.filter((s) => s.featuring.length > 0);

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

      {tab === "albums" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {albums.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.05}>
              <AlbumCard album={a} />
            </Reveal>
          ))}
        </div>
      )}

      {tab === "singles" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {singles.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <SongCard song={s} />
            </Reveal>
          ))}
        </div>
      )}

      {tab === "collaborations" && (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {collaborations.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.04}>
              <SongCard song={s} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
