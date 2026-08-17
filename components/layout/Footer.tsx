import Link from "next/link";
import { officialLinks } from "@/content/officialLinks";
import { siteName, siteTagline } from "@/content/credits";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <p className="font-display text-xl tracking-[0.15em] text-ink">
              {siteName}
              <span className="text-gold"> — {siteTagline}</span>
            </p>
            <p className="mt-3 max-w-sm text-sm text-ink-dim">
              A fan-made digital archive of VannDa&rsquo;s artistic universe. Not affiliated with,
              operated by, or endorsed by VannDa or Baramey Production.
            </p>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Explore</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-dim">
              <li><Link href="/baramey" className="hover:text-gold">Baramey Production</Link></li>
              <li><Link href="/credits" className="hover:text-gold">Credits & Copyright</Link></li>
              <li><Link href="/fan-zone" className="hover:text-gold">Fan Zone</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">Official Sources</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-dim">
              {officialLinks.map((link) => (
                <li key={link.platform}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6 text-xs text-ink-faint">
          © {new Date().getFullYear()} {siteName} — Unofficial fan archive. All music, video, and imagery
          belong to their respective rights holders.
        </div>
      </div>
    </footer>
  );
}
