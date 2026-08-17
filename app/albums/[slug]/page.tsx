import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { albums } from "@/content/albums";
import { songs } from "@/content/songs";
import { SongCard } from "@/components/music/SongCard";
import { SourceTag } from "@/components/ui/SourceTag";
import { Reveal } from "@/components/ui/Reveal";
import { ytThumbnail } from "@/lib/youtube";

export function generateStaticParams() {
  return albums.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const album = albums.find((a) => a.slug === slug);
  if (!album) return {};
  return { title: album.title, description: album.description };
}

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const album = albums.find((a) => a.slug === slug);
  if (!album) notFound();

  const notableTracks = album.notableTrackSlugs
    .map((s) => songs.find((song) => song.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-10 sm:grid-cols-[280px_1fr] sm:items-start">
        <Reveal>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-hairline">
            <Image src={ytThumbnail(album.coverYoutubeId, "hq")} alt={album.title} fill unoptimized className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">
            {album.type === "mini-album" ? "Mini-Album" : "Album"} · {album.releaseDateLabel}
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-wide text-ink sm:text-5xl">{album.title}</h1>
          <p className="mt-5 max-w-xl text-ink-dim">{album.description}</p>
          <SourceTag sources={album.sources} label="Source" />
        </Reveal>
      </div>

      {notableTracks.length > 0 && (
        <Reveal delay={0.15} className="mt-16">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Notable Tracks</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {notableTracks.map((s) => (
              <SongCard key={s.slug} song={s} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
