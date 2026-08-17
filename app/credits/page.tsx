import type { Metadata } from "next";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { disclaimer, creditsList, creditsClosing, copyrightContactEmail } from "@/content/credits";
import { officialLinks, baramyOfficialLinks } from "@/content/officialLinks";

export const metadata: Metadata = {
  title: "Credits & Copyright",
  description: "Copyright disclaimer, credits, and official sources for VANNDA WORLD — an unofficial fan archive.",
};

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading kicker="Legal" title="Copyright & Disclaimer" align="center" className="mx-auto" />
      <Reveal delay={0.1}>
        <p className="mt-10 leading-relaxed text-ink-dim">{disclaimer}</p>
        <div className="mt-8 rounded-lg border border-hairline-strong bg-surface p-5">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-gold">
            Copyright / Content Removal Contact
          </p>
          <a href={`mailto:${copyrightContactEmail}`} className="mt-2 block text-ink hover:text-gold">
            {copyrightContactEmail}
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-16">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Credits</h2>
        <ul className="mt-5 space-y-3">
          {creditsList.map((c) => (
            <li key={c} className="text-sm leading-relaxed text-ink-dim">
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-6 font-display text-sm italic text-gold">{creditsClosing}</p>
      </Reveal>

      <Reveal delay={0.2} className="mt-16">
        <h2 className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Official Sources</h2>
        <ul className="mt-5 space-y-2">
          {[...officialLinks, ...baramyOfficialLinks].map((link) => (
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
    </div>
  );
}
