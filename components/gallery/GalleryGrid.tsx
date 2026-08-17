"use client";

import { useState } from "react";
import Image from "next/image";
import { gallery } from "@/content/gallery";
import type { GalleryCategory } from "@/content/types";
import { ytThumbnail } from "@/lib/youtube";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const categories: { key: GalleryCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cultural", label: "Cultural" },
  { key: "music-video", label: "Music Videos" },
  { key: "performance", label: "Performances" },
];

export function GalleryGrid() {
  const [filter, setFilter] = useState<GalleryCategory | "all">("all");
  const filtered = filter === "all" ? gallery : gallery.filter((g) => g.category === filter);

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

      <div className="mt-10 columns-2 gap-4 sm:columns-3 lg:columns-4">
        {filtered.map((item, i) => (
          <Reveal key={item.id} delay={Math.min(i * 0.03, 0.3)} className="mb-4 break-inside-avoid">
            <a
              id={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-lg border border-hairline"
            >
              <Image
                src={ytThumbnail(item.youtubeId, "hq")}
                alt={item.title}
                width={480}
                height={270}
                unoptimized
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-void/90 via-void/0 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-sm text-ink">{item.title}</p>
                <p className="truncate text-xs text-ink-faint">{item.attribution}</p>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
