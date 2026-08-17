import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

export function FanQuoteTeaser() {
  return (
    <section className="border-y border-hairline bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 sm:py-32">
        <Reveal>
          <p className="font-display text-2xl leading-relaxed text-ink sm:text-4xl">
            &ldquo;From a market stall in Sihanoukville to the Paris Olympics stage — this is what it
            sounds like when a generation finds its voice.&rdquo;
          </p>
          <p className="mt-6 font-display text-xs uppercase tracking-[0.3em] text-gold">
            VANNDA WORLD — Fan Editorial
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10">
          <Button href="/fan-zone" variant="outline">
            Enter The Fan Zone
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
