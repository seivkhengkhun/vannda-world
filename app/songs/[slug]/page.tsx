import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Music2 } from "lucide-react";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";
import { timeline } from "@/content/timeline";
import { SongCard } from "@/components/music/SongCard";
import { SongHeroActions } from "@/components/music/SongHeroActions";
import { SourceTag } from "@/components/ui/SourceTag";
import { Reveal } from "@/components/ui/Reveal";
import { ytThumbnail } from "@/lib/youtube";

export function generateStaticParams() {
  return songs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const song = songs.find((s) => s.slug === slug);
  if (!song) return {};
  return { title: song.title, description: song.about };
}

export default async function SongPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const song = songs.find((s) => s.slug === slug);
  if (!song) notFound();

  const album = song.albumSlug ? albums.find((a) => a.slug === song.albumSlug) : undefined;
  const thumbnailId = song.youtubeId ?? album?.coverYoutubeId;

  const relatedSongs = songs
    .filter((s) => s.slug !== song.slug && s.era === song.era)
    .slice(0, 4);
  const relatedEvents = timeline.filter((e) => e.relatedSongSlug === song.slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-10 sm:grid-cols-[280px_1fr] sm:items-start">
        <Reveal>
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-hairline bg-raised">
            {thumbnailId ? (
              <Image src={ytThumbnail(thumbnailId, "hq")} alt={song.title} fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Music2 className="text-ink-faint" size={40} />
              </div>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-display text-xs uppercase tracking-[0.3em] text-gold">{song.releaseDateLabel}</p>
          <h1 className="mt-3 font-display text-4xl tracking-wide text-ink sm:text-5xl">{song.title}</h1>
          {song.titleKm && <p className="khmer mt-1 text-lg text-ink-dim">{song.titleKm}</p>}
          {song.category === "featured" ? (
            <p className="mt-3 text-ink-dim">
              {song.primaryArtist} feat. VannDa
              {song.featuring.length > 0 ? `, ${song.featuring.join(", ")}` : ""}
            </p>
          ) : (
            song.featuring.length > 0 && <p className="mt-3 text-ink-dim">feat. {song.featuring.join(", ")}</p>
          )}
          {album && (
            <p className="mt-2 text-sm text-ink-faint">
              Track {song.trackNumber} on{" "}
              <Link href={`/albums/${album.slug}`} className="text-ink-dim underline decoration-hairline-strong underline-offset-2 hover:text-gold">
                {album.title}
              </Link>
            </p>
          )}
          <SongHeroActions song={song} />
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mt-16 max-w-2xl">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">About This Song</h2>
        <p className="mt-4 leading-relaxed text-ink-dim">{song.about}</p>
        <SourceTag sources={song.sources} label="Source" />
      </Reveal>

      {song.fanInterpretation && (
        <Reveal delay={0.2} className="mt-12 max-w-2xl border-l-2 border-gold/50 pl-6">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Fan Interpretation</h2>
          <p className="mt-4 italic leading-relaxed text-ink-dim">{song.fanInterpretation}</p>
        </Reveal>
      )}

      {relatedEvents.length > 0 && (
        <Reveal delay={0.22} className="mt-12 max-w-2xl">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Related Timeline Events</h2>
          <ul className="mt-4 space-y-3">
            {relatedEvents.map((e) => (
              <li key={e.id}>
                <a href={`/journey#${e.id}`} className="text-ink transition-colors hover:text-gold">
                  {e.dateLabel} — {e.title}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {relatedSongs.length > 0 && (
        <Reveal delay={0.25} className="mt-16">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Related Songs</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedSongs.map((s) => (
              <SongCard key={s.slug} song={s} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
