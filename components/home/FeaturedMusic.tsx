import { songs } from "@/content/songs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SongCard } from "@/components/music/SongCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const FEATURED_SLUGS = ["time-to-rise", "no-disrespect", "6-years-in-the-game", "coda", "golden-land", "asian-state-of-mind"];

export function FeaturedMusic() {
  const featured = FEATURED_SLUGS.map((slug) => songs.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <section id="featured-music" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal>
        <SectionHeading kicker="Listen" title="Featured Music" description="A starting point into the catalogue — official releases, verified and sourced." />
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {featured.map((song, i) => (
          <Reveal key={song.slug} delay={i * 0.06}>
            <SongCard song={song} />
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2} className="mt-10 flex justify-center">
        <Button href="/music" variant="outline">
          View Full Archive
        </Button>
      </Reveal>
    </section>
  );
}
