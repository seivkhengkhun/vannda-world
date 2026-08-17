import type { Album } from "./types";

const WIKI = { label: "Wikipedia — Vannda", url: "https://en.wikipedia.org/wiki/Vannda" };
const NME = {
  label: "NME",
  url: "https://www.nme.com/news/music/vannda-leaked-skull-2-tracks-release-3349875",
};
const BANDWAGON = {
  label: "Bandwagon Asia",
  url: "https://www.bandwagon.asia/articles/vannda-takes-no-disrespect-drops-2nd-installment-of-treyvisai-mini-album-trilogy-burn-like-the-sun",
};

export const albums: Album[] = [
  {
    slug: "skull-the-album",
    title: "$kull the Album",
    type: "album",
    era: "skull",
    releaseYear: 2020,
    releaseDateLabel: "2020",
    description:
      "VannDa's debut full-length album, the project that established him as a rising star of Cambodian hip-hop after several years of self-produced independent releases.",
    notableTrackSlugs: ["mama"],
    coverYoutubeId: "WNL3zDgWZc0",
    sources: [WIKI],
  },
  {
    slug: "skull-2-season-1",
    title: "SKULL 2 (Season 1)",
    type: "album",
    era: "skull2",
    releaseYear: 2022,
    releaseDateLabel: "July 2022",
    description:
      "VannDa's sophomore full-length album, released in the wake of the global breakthrough of \"Time To Rise.\" It includes his first collaboration with OG Bobby (\"Young Man\") and the track \"C.O.D.A.\"",
    notableTrackSlugs: ["coda", "young-man"],
    coverYoutubeId: "VYLM-vpdQ1A",
    sources: [NME],
  },
  {
    slug: "treyvisai-i",
    title: "TREYVISAI I: The Search for Light",
    type: "mini-album",
    era: "treyvisai",
    releaseYear: 2025,
    releaseDateLabel: "March 14, 2025",
    description:
      "The first installment of VannDa's three-part TREYVISAI mini-album trilogy, opening with high-energy flex tracks including \"Out of My Mind\" and \"Fishing.\"",
    notableTrackSlugs: ["out-of-my-mind", "fishing"],
    coverYoutubeId: "aSOuRMyxdNA",
    sources: [BANDWAGON],
  },
  {
    slug: "treyvisai-ii",
    title: "TREYVISAI II: Burn Like the Sun",
    type: "mini-album",
    era: "treyvisai",
    releaseYear: 2025,
    releaseDateLabel: "March 21, 2025",
    description:
      "The second installment of the TREYVISAI trilogy — its Khmer subtitle translates to \"the compass\" — led by the single \"No Disrespect.\" A third installment is planned to complete the trilogy.",
    notableTrackSlugs: ["no-disrespect"],
    coverYoutubeId: "7t0qrQ0o42M",
    sources: [BANDWAGON],
  },
];
