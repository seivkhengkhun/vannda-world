import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { albums } from "@/content/albums";
import { songs } from "@/content/songs";
import { TrackRow } from "@/components/music/TrackRow";
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

  const tracks = album.trackSlugs
    .map((s) => songs.find((song) => song.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="flex flex-col items-center text-center">
        <Reveal>
          <div className="relative aspect-square w-56 overflow-hidden rounded-xl border border-hairline shadow-2xl sm:w-72">
            <Image src={ytThumbnail(album.coverYoutubeId, "hq")} alt={album.title} fill unoptimized className="object-cover" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-gold">
            {album.type === "mini-album" ? "Mini-Album" : "Album"}
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-wide text-ink sm:text-5xl">{album.title}</h1>
          <p className="mt-3 text-ink-dim">VannDa</p>
          <p className="mt-1 text-sm text-ink-faint">
            {album.releaseDateLabel} · {album.totalTracks} Track{album.totalTracks === 1 ? "" : "s"}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-ink-dim">{album.description}</p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {album.spotifyUrl && (
              <a href={album.spotifyUrl} target="_blank" rel="noopener noreferrer" className="font-display text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-gold">
                Spotify
              </a>
            )}
            {album.appleMusicUrl && (
              <a href={album.appleMusicUrl} target="_blank" rel="noopener noreferrer" className="font-display text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-gold">
                Apple Music
              </a>
            )}
            {album.deezerUrl && (
              <a href={album.deezerUrl} target="_blank" rel="noopener noreferrer" className="font-display text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:text-gold">
                Deezer
              </a>
            )}
          </div>
          <SourceTag sources={album.sources} label="Verified against" />
        </Reveal>
      </div>

      {tracks.length > 0 && (
        <Reveal delay={0.15} className="mt-16">
          <h2 className="mb-2 font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Tracklist</h2>
          <div className="border-t border-hairline">
            {tracks.map((s) => (
              <TrackRow key={s.slug} song={s} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
