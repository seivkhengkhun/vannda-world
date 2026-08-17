# Music Archive Audit

Last performed: 2026-08-17. This documents how every album/EP tracklist in
`content/albums.ts` was verified, and gives an honest accounting of what is
and isn't independently cross-verified across the rest of the catalogue.

## Methodology

For each of the 5 albums/EPs:
1. Found the release on at least two independent platforms (Spotify, Apple
   Music, or Deezer).
2. Fetched the full tracklist from each.
3. Compared track count and track order between sources.
4. Where a discrepancy existed, investigated further rather than guessing
   (see "Corrections" below).
5. Cross-referenced individual tracks against official YouTube uploads via
   `scripts/verify-youtube.mjs`, which checks candidate video IDs against an
   allow-list of official channels through YouTube's oEmbed endpoint.
6. Only added a track's YouTube embed if that check passed.

## Per-album verification

| Album | Expected tracks | Collected tracks | Count match | 2nd source verified | Official source | Status |
|---|---|---|---|---|---|---|
| $kull the Album (2020) | 18 | 18 | ✅ | Deezer + Apple Music/Amazon aggregation | Spotify, Apple Music, Deezer | **VERIFIED** |
| SKULL 2 (Season 1) (2022) | 15 | 15 | ✅ | Deezer + independent aggregator (matching order/durations) | Spotify, Apple Music, Deezer | **VERIFIED** |
| TREYVISAI I: The Search for Light (2025) | 8 | 8 | ✅ | Spotify (direct fetch) + Last.fm/Apple Music aggregation | Spotify, Apple Music | **VERIFIED** |
| TREYVISAI II: Burn Like the Sun (2025) | 7 | 7 | ✅ | Spotify (direct fetch) + Bandwagon Asia editorial | Spotify | **VERIFIED** |
| TREYVISAI III: Return to Sovannaphum (2025) | 10 | 10 | ✅ | Spotify (direct fetch) + Apple Music aggregation | Spotify, Apple Music | **VERIFIED** |

All 5 albums/EPs are structurally verified: `content/albums.ts` `trackSlugs`
length matches `totalTracks`, and every slug resolves to a real entry in
`content/songs.ts` (checked programmatically — see below).

## Corrections made during this pass

- **"Day Dreamer"**: originally dated 2023 in an earlier build of this site
  without strong sourcing. Two independent tracklist sources place it as
  track 6 on *SKULL 2 (Season 1)* (July 2022) — corrected.
- **"Blue Story"**: originally guessed as 2023. Evidence (a Baramey Official
  Facebook post bundling it with "Hero 2 Villain" and "Do You," the latter
  independently dated August 10, 2026) places it in a small batch of August
  2026 releases — corrected to "August 2026" with the exact day left
  unconfirmed rather than guessed.
- **Two YouTube IDs** (for "Smoke Up" and an early candidate ID for "Let Me
  Love You") were pulled from search-result text without going through the
  oEmbed/allow-list check first. Both were caught during a self-review pass:
  "Smoke Up"'s ID failed oEmbed entirely and was dropped (no embed for that
  track); "Let Me Love You"'s ID resolved to a reposting channel, not
  Vanthan's official channel, and was replaced with the correct one.

## What is *not* independently cross-verified

Being transparent about the difference between the album-level rigor above
and the rest of the catalogue:

- Standalone singles, collaborations, and featured appearances (45 entries)
  were each confirmed via at least one authoritative source (official
  YouTube upload passing the oEmbed/channel check, or a direct Apple
  Music/Spotify/Deezer fetch), but were not all cross-checked against a
  *second* independent tracklist-style source the way the 5 albums were —
  that level of rigor doesn't really apply to a single stand-alone track the
  same way it does to an album's track count/order.
- A handful of exact release *days* (vs. months/years) are approximate where
  sources only agreed on a month — these are labeled at month precision
  rather than a guessed day (e.g. "Hero 2 Villain," "Blue Story": "August
  2026").
- All 79 external URLs referenced across `content/*.ts` were batch-checked
  with a live HTTP request on 2026-08-17. 76 returned 200. One dead Apple
  Music link for *$kull the Album* (a stale catalogue ID, 404) was found and
  replaced with the album's current ID, confirmed 200. The two official
  Facebook links (`facebook.com/vanndaofficialpage`, and the Baramey Official
  post cited for the August 2026 singles) return HTTP 400 to automated
  requests regardless of user-agent — consistent with Facebook's routine
  bot-blocking of non-browser clients, not necessarily evidence the pages
  are actually broken for real visitors. Both were originally sourced
  directly (the handle from baramey.com's own listing), so they're kept, but
  are flagged here as unverifiable by automated fetch rather than silently
  presented as confirmed.

## Structural integrity (checked programmatically)

- Total song/catalogue entries: **93**
- Duplicate song slugs: **0**
- Every `trackSlugs` entry in every album resolves to a real song: **yes, all 5 albums**
- `trackSlugs.length` matches declared `totalTracks` for every album: **yes, all 5 albums**

## Catalogue breakdown

- Full albums: **2** ($kull the Album, SKULL 2 (Season 1))
- Mini-albums / projects: **3** (TREYVISAI I, II, III)
- Album tracks (across all 5 releases): **58**
- Standalone singles: **20** (includes 6 pre-Baramey independent-era singles, 2014–2018)
- Collaborations (joint billing): **7**
- Featured appearances (VannDa as guest on another artist's release): **8**
- **Total catalogue entries: 93**

## Duplicate handling

Recordings that appear in more than one context are represented once, not
duplicated. Examples: "A Song For You" (TREYVISAI II track 7) is the same
recording referenced by Wikipedia's "ចម្រៀងជូនex" series entry — not a
separate song. "Back In The Day" (2018 independent single) and "Back in the
Day (Remake)" ($kull the Album track 8) are kept as two distinct entries
because they are, per official listings, two different recordings (an
original and a later remake with a featured artist) — not an accidental
duplicate.
