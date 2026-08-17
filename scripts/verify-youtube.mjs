/**
 * verify-youtube.mjs
 * ------------------------------------------------------------------
 * COPYRIGHT-SAFE CONTENT TOOL for VANNDA WORLD — FAN ARCHIVE.
 *
 * This project never hosts or redistributes audio/video. Every piece of
 * music on the site is played through an *official* YouTube embed.
 *
 * This script exists to prove provenance: for a given search query it
 * finds candidate YouTube video IDs and then verifies each one through
 * YouTube's public oEmbed endpoint, returning the real channel name and
 * the real title. We only ever accept videos whose channel is on the
 * allow-list of verified official channels below.
 *
 * Usage:
 *   node scripts/verify-youtube.mjs                 # run the built-in catalogue
 *   node scripts/verify-youtube.mjs "some query"    # ad-hoc lookup
 *
 * Nothing is downloaded. Only public metadata is read.
 */

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36';

/** Channels we accept as authorised sources for embeds. */
export const OFFICIAL_CHANNELS = [
  'វណ្ណដា-VannDa Official',
  'VannDa Official',
  'Baramey Production',
  'BARAMEY PRODUCTION',
  'Sophia Kao',
  'VANTHAN',
  'Vanthan',
  'Kmeng Khmer',
  'KMENG KHMER',
  'Laura Mam',
  'YOUNGOHM',
  'F.HERO',
  'OG BOBBY',
  'AWICH',
  'Awich',
  'NORITH',
  'MESA',
  'KWAN',
  'ZEDES',
];

async function searchIds(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=en`;
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en' } });
  const html = await res.text();
  const ids = [];
  for (const m of html.matchAll(/"videoId":"([A-Za-z0-9_-]{11})"/g)) {
    if (!ids.includes(m[1])) ids.push(m[1]);
  }
  return ids.slice(0, 10);
}

async function oembed(id) {
  const url = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    `https://www.youtube.com/watch?v=${id}`,
  )}&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  return res.json();
}

export async function verifyQuery(query) {
  const ids = await searchIds(query);
  const rows = [];
  for (const id of ids) {
    const meta = await oembed(id);
    if (!meta) continue;
    rows.push({
      id,
      channel: meta.author_name,
      title: meta.title,
      official: OFFICIAL_CHANNELS.includes(meta.author_name),
    });
    await new Promise((r) => setTimeout(r, 120));
  }
  return rows;
}

const CATALOGUE = [
  'VannDa Time To Rise Master Kong Nay official music video',
  'VannDa Smoke Up YOUNGOHM official music video',
  'VannDa Golden Land official music video Treyvisai',
  'VannDa NO DISRESPECT official music video',
  'VannDa BONG OG Bobby official music video',
  'VannDa Sangkran Magic official music video',
  'VannDa 6 Years In The Game AWICH official music video',
  'VannDa Kmeng Khmer Mama official music video',
  'VannDa Skull 2 Season 1 C.O.D.A official music video',
  'VannDa RUN THE TOWN F.HERO 1MILL SPRITE official music video',
  'VannDa Young Man OG Bobby official music video',
  'VannDa Kamlos Srok Khmer Vanthan official music video',
  'VannDa Time Sophia Kao official music video',
  'VannDa MONSOON Songha official music video',
  'Asian State of Mind Awich Jay Park KRSNA Masiwei VannDa official',
  'VannDa Baby Mama official music video',
  'VannDa Fishing official music video Treyvisai',
  'VannDa Out Of My Mind official music video',
  'VannDa Lovesick Blue Thinlamphone official',
  'VannDa Varman Blood official',
  'VannDa Paris Olympics closing ceremony 2024 performance',
  'VannDa Legacy Chong Cham Savatar Baramey Crew official',
];

async function main() {
  const arg = process.argv.slice(2).join(' ').trim();
  const queries = arg ? [arg] : CATALOGUE;
  const out = {};
  for (const q of queries) {
    process.stderr.write(`\n# ${q}\n`);
    const rows = await verifyQuery(q);
    out[q] = rows;
    for (const r of rows) {
      process.stderr.write(
        `  ${r.official ? 'OFFICIAL ' : '         '} ${r.id}  [${r.channel}]  ${r.title}\n`,
      );
    }
  }
  process.stdout.write(JSON.stringify(out, null, 2));
}

import { pathToFileURL } from 'node:url';

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
