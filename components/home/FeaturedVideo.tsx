import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SourceTag } from "@/components/ui/SourceTag";
import { videos } from "@/content/videos";

export function FeaturedVideo() {
  const video = videos.find((v) => v.id === "time-to-rise")!;

  return (
    <section className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal>
        <SectionHeading kicker="Watch" title="Featured Video" align="center" />
      </Reveal>
      <Reveal delay={0.1} className="mt-12 overflow-hidden rounded-xl border border-hairline">
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </Reveal>
      <Reveal delay={0.15} className="mt-4 text-center">
        <p className="text-ink-dim">{video.title}</p>
        <SourceTag sources={video.sources} label="Source" />
      </Reveal>
    </section>
  );
}
