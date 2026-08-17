import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import type { UniverseNode } from "@/lib/universe-graph";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";
import { ytThumbnail } from "@/lib/youtube";

export function NodeDetailPanel({ node, onClose }: { node: UniverseNode; onClose: () => void }) {
  const song = node.kind === "song" ? songs.find((s) => s.slug === node.ref) : undefined;
  const album = node.kind === "album" ? albums.find((a) => a.slug === node.ref) : undefined;
  const collabSongs =
    node.kind === "collaborator" ? songs.filter((s) => s.featuring.includes(node.ref!)) : [];
  const eraSongs = node.kind === "era" ? songs.filter((s) => s.era === node.ref) : [];

  return (
    <div className="absolute bottom-4 left-4 right-4 z-10 max-w-sm rounded-xl border border-hairline-strong bg-surface/95 p-5 backdrop-blur-lg sm:left-6 sm:right-auto">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-3 text-ink-faint hover:text-gold"
      >
        <X size={16} />
      </button>

      <p className="font-display text-[10px] uppercase tracking-[0.25em] text-gold">{node.kind}</p>
      <h3 className="mt-1 font-display text-lg text-ink">{node.label}</h3>

      {song && (
        <>
          {song.youtubeId && (
            <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg border border-hairline">
              <Image src={ytThumbnail(song.youtubeId, "hq")} alt={song.title} fill unoptimized className="object-cover" />
            </div>
          )}
          <p className="mt-3 text-sm text-ink-dim">{song.about}</p>
          <Link href={`/songs/${song.slug}`} className="mt-3 inline-block text-sm text-gold hover:underline">
            Open song page →
          </Link>
        </>
      )}

      {album && (
        <>
          <p className="mt-3 text-sm text-ink-dim">{album.description}</p>
          <Link href={`/albums/${album.slug}`} className="mt-3 inline-block text-sm text-gold hover:underline">
            Open album page →
          </Link>
        </>
      )}

      {node.kind === "collaborator" && (
        <ul className="mt-3 space-y-1">
          {collabSongs.map((s) => (
            <li key={s.slug}>
              <Link href={`/songs/${s.slug}`} className="text-sm text-ink-dim hover:text-gold">
                {s.title}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {node.kind === "era" && (
        <>
          <p className="mt-3 text-sm text-ink-dim">{eraSongs.length} track{eraSongs.length === 1 ? "" : "s"} from this era.</p>
          <Link href="/journey" className="mt-3 inline-block text-sm text-gold hover:underline">
            View journey →
          </Link>
        </>
      )}

      {node.kind === "core" && (
        <p className="mt-3 text-sm text-ink-dim">
          VannDa&rsquo;s career, visualized. Drag to pan, scroll or pinch to zoom, and click any node to
          explore.
        </p>
      )}
    </div>
  );
}
