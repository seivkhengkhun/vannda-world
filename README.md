# VANNDA WORLD — Fan Archive

An unofficial, fan-made digital archive of Cambodian artist VannDa — his music, journey, and universe. Built as a fully static site with no backend, no database, and no user accounts: all content lives in typed, source-attributed TypeScript files under [`content/`](content) and is edited by hand.

**This is not affiliated with, operated by, sponsored by, or endorsed by VannDa or Baramey Production.** See [`/credits`](app/credits/page.tsx) for the full disclaimer, credits, and official links.

## Stack

- Next.js (App Router) + TypeScript, `output: "export"` — pure static HTML/CSS/JS, deployable to Vercel, Netlify, Cloudflare Pages, or any static host
- Tailwind CSS v4 for styling against the design tokens in `app/globals.css`
- Motion (Framer Motion) for entrance choreography, parallax, and page transitions
- d3-force + a hand-rolled Canvas renderer for the interactive `/universe` graph
- Fuse.js for client-side search over a build-time content index
- The persistent music player remote-controls real, official YouTube embeds via the YouTube IFrame Player API — no audio is downloaded or rehosted

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export -> /out
npm run lint
```

## Content

Every song, album, timeline event, and video in `content/` carries a `sources` field linking back to where it was verified (Wikipedia, baramey.com, official press coverage). `scripts/verify-youtube.mjs` checks candidate YouTube video IDs against an allow-list of official channels before they're wired into the site — run it with `node scripts/verify-youtube.mjs` (or `node scripts/verify-youtube.mjs "some query"` for an ad-hoc lookup).

To update content, edit the relevant file in `content/` and redeploy — there is no admin panel or database.

Before deploying publicly, replace the placeholder copyright contact email in `content/credits.ts` (`copyrightContactEmail`) with a real address you control.
