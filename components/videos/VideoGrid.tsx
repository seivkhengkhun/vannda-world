"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { videos } from "@/content/videos";
import type { VideoCategory } from "@/content/types";
import { ytThumbnail } from "@/lib/youtube";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { VideoLightbox } from "./VideoLightbox";

const categories: { key: VideoCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "music-video", label: "Music Videos" },
  { key: "performance", label: "Performances" },
  { key: "collaboration", label: "Collaborations" },
  { key: "audio", label: "Audio" },
];

export function VideoGrid() {
  const [filter, setFilter] = useState<VideoCategory | "all">("all");
  const [active, setActive] = useState<{ id: string; title: string } | null>(null);

  const filtered = filter === "all" ? videos : videos.filter((v) => v.category === filter);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 border-b border-hairline pb-6">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={cn(
              "px-4 py-2 font-display text-xs uppercase tracking-[0.15em] transition-colors",
              filter === c.key ? "bg-gold text-void" : "text-ink-dim hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((v, i) => (
          <Reveal key={v.id} delay={Math.min(i * 0.04, 0.3)}>
            <button
              id={v.id}
              onClick={() => setActive({ id: v.youtubeId, title: v.title })}
              className="group relative block aspect-video w-full overflow-hidden rounded-lg border border-hairline text-left"
            >
              <Image
                src={ytThumbnail(v.youtubeId, "hq")}
                alt={v.title}
                fill
                unoptimized
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-void/90 via-void/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-gold/90 p-3 text-void">
                  <Play size={18} />
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="truncate text-sm text-ink">{v.title}</p>
                <p className="text-xs text-ink-dim">{v.channel} · {v.year}</p>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      <VideoLightbox youtubeId={active?.id ?? null} title={active?.title ?? ""} onClose={() => setActive(null)} />
    </div>
  );
}
