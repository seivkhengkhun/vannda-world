"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/search/SearchOverlay";

const routes: { href: string; key: "home" | "music" | "universe" | "journey" | "videos" | "archive" | "fanZone" }[] = [
  { href: "/", key: "home" },
  { href: "/music", key: "music" },
  { href: "/universe", key: "universe" },
  { href: "/journey", key: "journey" },
  { href: "/videos", key: "videos" },
  { href: "/archive", key: "archive" },
  { href: "/fan-zone", key: "fanZone" },
];

export function Nav() {
  const { t, lang, toggleLang } = useLanguage();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-hairline bg-void/70 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-display text-lg tracking-[0.15em] text-ink">
            VANNDA<span className="text-gold">.</span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {routes.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className={cn(
                  "font-display text-xs uppercase tracking-[0.2em] transition-colors",
                  pathname === r.href ? "text-gold" : "text-ink-dim hover:text-ink",
                )}
              >
                {t.nav[r.key]}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t.nav.search}
              className="rounded-full p-2 text-ink-dim transition-colors hover:text-gold"
            >
              <Search size={18} />
            </button>
            <button
              onClick={toggleLang}
              className="rounded-full px-2.5 py-1.5 font-display text-xs uppercase tracking-widest text-ink-dim transition-colors hover:text-gold"
            >
              {lang === "en" ? "KM" : "EN"}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="rounded-full p-2 text-ink-dim transition-colors hover:text-gold lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-void transition-opacity duration-300 lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg tracking-[0.15em] text-ink">VANNDA</span>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="rounded-full p-2 text-ink-dim hover:text-gold"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-start justify-center gap-6 px-8">
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              onClick={() => setMobileOpen(false)}
              className="font-display text-3xl tracking-wide text-ink hover:text-gold"
            >
              {t.nav[r.key]}
            </Link>
          ))}
        </nav>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
