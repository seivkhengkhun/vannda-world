import { timeline } from "@/content/timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

const PREVIEW_IDS = ["joins-baramey", "time-to-rise", "100-million-views", "paris-olympics", "treyvisai-trilogy"];

export function JourneyPreview() {
  const events = PREVIEW_IDS.map((id) => timeline.find((e) => e.id === id)).filter(
    (e): e is NonNullable<typeof e> => Boolean(e),
  );

  return (
    <section className="border-y border-hairline bg-surface">
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 sm:py-32">
        <Reveal>
          <SectionHeading kicker="The Story" title="His Journey" align="center" />
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute left-4 top-0 h-full w-px bg-hairline-strong sm:left-1/2" />
          <div className="space-y-12">
            {events.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.08} className="relative pl-12 sm:pl-0">
                <div
                  className={`sm:flex sm:items-center sm:gap-8 ${i % 2 === 1 ? "sm:flex-row-reverse" : ""}`}
                >
                  <div className="sm:w-1/2" />
                  <div className="absolute left-4 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-gold sm:left-1/2" />
                  <div className={`sm:w-1/2 ${i % 2 === 1 ? "sm:text-right" : ""}`}>
                    <p className="font-display text-xs uppercase tracking-[0.2em] text-gold">{event.dateLabel}</p>
                    <h3 className="mt-1 font-display text-lg text-ink">{event.title}</h3>
                    <p className="mt-2 text-sm text-ink-dim">{event.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-16 flex justify-center">
          <Button href="/journey" variant="outline">
            View Full Journey
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
