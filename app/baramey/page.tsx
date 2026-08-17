import type { Metadata } from "next";
import { SourceTag } from "@/components/ui/SourceTag";
import { Reveal } from "@/components/ui/Reveal";
import { SongCard } from "@/components/music/SongCard";
import { baramey } from "@/content/baramey";
import { songs } from "@/content/songs";

export const metadata: Metadata = {
  title: "Baramey Production",
  description: "About Baramey Production, the Cambodian label VannDa is associated with — and the wider Baramey Crew roster.",
};

export default function BarameyPage() {
  const crewSongs = songs.filter((s) => s.tags.includes("baramey"));

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal>
        <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-gold">The Label</p>
        <h1 className="mt-3 text-center font-display text-4xl tracking-wide text-ink sm:text-5xl">
          {baramey.name}
        </h1>
        <p className="mt-3 text-center text-ink-dim">{baramey.tagline}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-12">
        <p className="leading-relaxed text-ink-dim">{baramey.description}</p>
        <div className="mt-6 rounded-lg border border-hairline-strong bg-surface p-5">
          <p className="text-sm text-ink-dim">{baramey.relationshipNote}</p>
        </div>
        <SourceTag sources={baramey.sources} label="Source" />
      </Reveal>

      <Reveal delay={0.15} className="mt-12">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Official Links</h2>
        <ul className="mt-4 space-y-2">
          {baramey.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink transition-colors hover:text-gold"
              >
                {link.platform} — {link.handle}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      {crewSongs.length > 0 && (
        <Reveal delay={0.2} className="mt-16">
          <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Baramey Crew Collaborations</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {crewSongs.map((s) => (
              <SongCard key={s.slug} song={s} />
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
