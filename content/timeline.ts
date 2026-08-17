import type { TimelineEvent } from "./types";

const WIKI = { label: "Wikipedia — Vannda", url: "https://en.wikipedia.org/wiki/Vannda" };
const BARAMEY = { label: "Baramey Production — VannDa", url: "https://baramey.com/vannda" };
const NME = {
  label: "NME",
  url: "https://www.nme.com/news/music/vannda-leaked-skull-2-tracks-release-3349875",
};
const BANDWAGON = {
  label: "Bandwagon Asia",
  url: "https://www.bandwagon.asia/articles/vannda-takes-no-disrespect-drops-2nd-installment-of-treyvisai-mini-album-trilogy-burn-like-the-sun",
};

export const timeline: TimelineEvent[] = [
  {
    id: "born",
    year: 1997,
    dateLabel: "January 22, 1997",
    title: "Born in Sihanoukville",
    description:
      "Mann Vannda is born in Sihanoukville, Preah Sihanouk Province, Cambodia, to a working-class family running a coconut-shaving business at Psar Leur market.",
    sources: [WIKI],
  },
  {
    id: "independent-start",
    year: 2014,
    dateLabel: "2014–2018",
    title: "Independent beginnings",
    description:
      "VannDa releases self-produced work independently, starting with \"Y.O.U\" in 2014, before moving from pop ballads toward hip-hop, self-teaching production and lyricism along the way.",
    sources: [WIKI],
  },
  {
    id: "joins-baramey",
    year: 2019,
    dateLabel: "2019",
    title: "Joins Baramey Production",
    description:
      "VannDa signs with Baramey Production, the Phnom Penh label founded by singer-songwriter Laura Mam to champion original Khmer music.",
    sources: [WIKI, BARAMEY],
  },
  {
    id: "skull-album",
    year: 2020,
    dateLabel: "2020",
    title: "Debut album: $kull the Album",
    description: "VannDa releases his debut full-length album, establishing him as a rising star of Cambodian hip-hop.",
    relatedSongSlug: "mama",
    sources: [WIKI],
  },
  {
    id: "time-to-rise",
    year: 2021,
    dateLabel: "2021",
    title: "\"Time To Rise\" — the breakthrough",
    description:
      "Originally created for a Cellcard marketing campaign, \"Time To Rise\" pairs VannDa with chrieng chapei master Kong Nay, filmed at the National Museum of Cambodia. It becomes a watershed moment for Cambodian hip-hop.",
    relatedSongSlug: "time-to-rise",
    youtubeId: "rvje5oblrLw",
    sources: [WIKI],
  },
  {
    id: "100-million-views",
    year: 2022,
    dateLabel: "October 2022",
    title: "First Cambodian MV to reach 100 million views",
    description:
      "The \"Time To Rise\" music video surpasses 100 million YouTube views — a first for any Cambodian artist.",
    relatedSongSlug: "time-to-rise",
    sources: [WIKI],
  },
  {
    id: "skull-2",
    year: 2022,
    dateLabel: "July 2022",
    title: "SKULL 2 (Season 1)",
    description:
      "VannDa releases his sophomore full-length album, including \"C.O.D.A\" and his first collaboration with OG Bobby, \"Young Man.\"",
    relatedSongSlug: "coda",
    sources: [NME],
  },
  {
    id: "kong-nay-fundraiser",
    year: 2022,
    dateLabel: "October 2022",
    title: "Fundraiser for Master Kong Nay",
    description:
      "VannDa launches a fundraising campaign to support Master Kong Nay's health challenges — a gesture of the cultural commitment behind \"Time To Rise\" extending beyond commercial success.",
    sources: [WIKI],
  },
  {
    id: "baramey-crew-era",
    year: 2023,
    dateLabel: "2023",
    title: "Baramey Crew collaborations",
    description:
      "VannDa releases a run of singles and crew collaborations — including \"Legacy\" with Baramey Crew and \"Khmer Gentlemen\" with labelmate Vanthan — deepening ties across the Baramey Production roster.",
    relatedSongSlug: "legacy",
    youtubeId: "StNAenr4rVY",
    sources: [WIKI],
  },
  {
    id: "6-years-awich",
    year: 2024,
    dateLabel: "2024",
    title: "\"6 Years In The Game\" with Awich",
    description: "VannDa collaborates with Japanese rapper Awich, marking his growing run of international collaborations.",
    relatedSongSlug: "6-years-in-the-game",
    sources: [WIKI],
  },
  {
    id: "paris-olympics",
    year: 2024,
    dateLabel: "August 2024",
    title: "Paris Olympics closing ceremony",
    description:
      "VannDa performs at the Paris Summer Olympics closing ceremony alongside Phoenix, Angèle, Ezra Koenig, and Kavinsky — a historic milestone as one of the first Southeast Asian artists to perform at an Olympic closing ceremony.",
    sources: [WIKI, BARAMEY],
  },
  {
    id: "treyvisai-trilogy",
    year: 2025,
    dateLabel: "March 2025",
    title: "TREYVISAI trilogy begins",
    description:
      "VannDa launches his three-part TREYVISAI mini-album trilogy: \"I: The Search for Light\" on March 14, followed by \"II: Burn Like the Sun\" a week later, with a third installment planned to complete the project.",
    relatedSongSlug: "out-of-my-mind",
    sources: [BANDWAGON],
  },
  {
    id: "asian-state-of-mind",
    year: 2025,
    dateLabel: "2025",
    title: "\"Asian State Of Mind\" — a pan-Asian cypher",
    description:
      "VannDa joins Awich, Jay Park, KR$NA, and Masiwei on \"Asian State Of Mind,\" produced by Diego Ave — placing Cambodia alongside Japan, Korea, India, and China on one track.",
    relatedSongSlug: "asian-state-of-mind",
    youtubeId: "QRnO04UwnM0",
    sources: [WIKI],
  },
  {
    id: "treyvisai-trilogy-completes",
    year: 2025,
    dateLabel: "May 15, 2025",
    title: "TREYVISAI trilogy completes",
    description:
      "VannDa closes out the three-part TREYVISAI project with \"III: Return to Sovannaphum,\" centered on the cinematic pairing of \"Golden Land\" and \"Varman Blood.\"",
    relatedSongSlug: "golden-land",
    youtubeId: "jFVfxBQjMFU",
    sources: [
      {
        label: "Apple Music — TREYVISAI III",
        url: "https://music.apple.com/us/album/treyvisai-iii-return-to-sovannaphum/1811895318",
      },
    ],
  },
  {
    id: "2026-era",
    year: 2026,
    dateLabel: "2026",
    title: "A new run of singles",
    description:
      "VannDa opens 2026 with \"Neon Light\" on his birthday, followed by \"New Cut,\" a collaboration with Norith on \"Decade of Love,\" \"Back Home,\" and — most recently — \"Do You,\" \"Hero 2 Villain,\" and \"Blue Story.\"",
    relatedSongSlug: "neon-light",
    youtubeId: "uv4JKlL1o84",
    sources: [
      { label: "Apple Music — Neon Light", url: "https://music.apple.com/gb/song/neon-light/1870831008" },
    ],
  },
];
