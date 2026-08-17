import Image from "next/image";
import Link from "next/link";
import type { Album } from "@/content/types";
import { ytThumbnail } from "@/lib/youtube";

export function AlbumCard({ album }: { album: Album }) {
  return (
    <Link
      href={`/albums/${album.slug}`}
      className="group flex flex-col overflow-hidden border border-hairline bg-surface transition-colors hover:border-hairline-strong"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={ytThumbnail(album.coverYoutubeId, "hq")}
          alt={album.title}
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 bg-void/70 px-2 py-1 font-display text-[10px] uppercase tracking-widest text-gold backdrop-blur">
          {album.type === "mini-album" ? "Mini-Album" : "Album"}
        </div>
      </div>
      <div className="p-4">
        <span className="font-display text-sm tracking-wide text-ink">{album.title}</span>
        <span className="mt-1 block text-xs text-ink-dim">{album.releaseDateLabel}</span>
      </div>
    </Link>
  );
}
