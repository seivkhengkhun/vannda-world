import Image from "next/image";
import { timeline } from "@/content/timeline";
import { Reveal } from "@/components/ui/Reveal";
import { SourceTag } from "@/components/ui/SourceTag";
import { ytThumbnail } from "@/lib/youtube";

export function TimelineFull() {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-hairline-strong sm:left-1/2" />
      <div className="space-y-16">
        {timeline.map((event, i) => (
          <Reveal key={event.id} delay={Math.min(i * 0.05, 0.3)} className="relative pl-12 sm:pl-0">
            <div id={event.id} className="absolute -top-24" />
            <div className={`sm:flex sm:items-start sm:gap-10 ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}>
              <div className="hidden sm:block sm:w-1/2" />
              <div className="absolute left-4 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-void bg-gold sm:left-1/2" />
              <div className={`sm:w-1/2 ${i % 2 === 1 ? "sm:text-right" : ""}`}>
                <p className="font-display text-xs uppercase tracking-[0.2em] text-gold">{event.dateLabel}</p>
                <h3 className="mt-2 font-display text-xl text-ink sm:text-2xl">{event.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-dim sm:ml-auto">
                  {event.description}
                </p>
                {event.youtubeId && (
                  <div
                    className={`relative mt-4 aspect-video w-full max-w-sm overflow-hidden rounded-lg border border-hairline ${
                      i % 2 === 1 ? "sm:ml-auto" : ""
                    }`}
                  >
                    <Image src={ytThumbnail(event.youtubeId, "hq")} alt={event.title} fill unoptimized className="object-cover" />
                  </div>
                )}
                <SourceTag sources={event.sources} label="Source" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
