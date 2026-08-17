import type { Metadata } from "next";
import { AtSign, Hash } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SongCard } from "@/components/music/SongCard";
import { EraQuiz } from "@/components/fanzone/EraQuiz";
import { songs } from "@/content/songs";
import { fanFavoriteSongSlugs } from "@/content/faves";
import { officialLinks } from "@/content/officialLinks";

export const metadata: Metadata = {
  title: "Fan Zone",
  description: "Fan favorites, an interactive era quiz, and a home for the VannDa community — curated by this fan archive.",
};

export default function FanZonePage() {
  const favorites = fanFavoriteSongSlugs
    .map((slug) => songs.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const instagram = officialLinks.find((l) => l.platform === "Instagram");

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading kicker="Fan Zone" title="Fan Favorites" align="center" description="Curated by this fan archive — not a live vote tally, just our picks." className="mx-auto" />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {favorites.map((song, i) => (
            <Reveal key={song.slug} delay={i * 0.06}>
              <SongCard song={song} />
            </Reveal>
          ))}
        </div>
      </div>

      <div className="border-y border-hairline bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
          <SectionHeading kicker="Find Yourself" title="What's Your VannDa Era?" align="center" className="mx-auto" />
          <div className="mt-14">
            <EraQuiz />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <SectionHeading kicker="Community" title="Join The Community" align="center" className="mx-auto" />
        <p className="mx-auto mt-6 max-w-xl text-ink-dim">
          The heart of the VannDa fan community lives on social media. Share your favorite moment, your
          fan art, or your own cover — tag it and it might inspire the next update to this archive.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <span className="flex items-center gap-2 border border-hairline-strong px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-ink-dim">
            <Hash size={14} /> VannDa · វណ្ណដា
          </span>
          {instagram && (
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-hairline-strong px-6 py-3 font-display text-xs uppercase tracking-[0.2em] text-ink-dim transition-colors hover:border-gold hover:text-gold"
            >
              <AtSign size={14} /> {instagram.handle}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
