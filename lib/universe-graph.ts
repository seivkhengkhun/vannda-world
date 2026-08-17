import type { SimulationNodeDatum } from "d3-force";
import { songs } from "@/content/songs";
import { albums } from "@/content/albums";
import type { Era } from "@/content/types";

export type UniverseNodeKind = "core" | "era" | "album" | "song" | "collaborator";

export interface UniverseNode extends SimulationNodeDatum {
  id: string;
  kind: UniverseNodeKind;
  label: string;
  ref?: string;
}

export interface UniverseEdge {
  source: string;
  target: string;
}

const ERA_LABELS: Record<Era, string> = {
  independent: "Independent",
  skull: "$kull",
  breakthrough: "Breakthrough",
  skull2: "SKULL 2",
  "baramey-crew": "Baramey Crew",
  treyvisai: "TREYVISAI",
  global: "Global",
};

export function buildUniverseGraph(): { nodes: UniverseNode[]; edges: UniverseEdge[] } {
  const nodes: UniverseNode[] = [];
  const edges: UniverseEdge[] = [];
  const seen = new Set<string>();

  const addNode = (node: UniverseNode) => {
    if (seen.has(node.id)) return;
    seen.add(node.id);
    nodes.push(node);
  };

  addNode({ id: "core:vannda", kind: "core", label: "VANNDA" });

  const erasUsed = new Set<Era>(songs.map((s) => s.era));
  for (const era of erasUsed) {
    addNode({ id: `era:${era}`, kind: "era", label: ERA_LABELS[era], ref: era });
    edges.push({ source: "core:vannda", target: `era:${era}` });
  }

  for (const album of albums) {
    const id = `album:${album.slug}`;
    addNode({ id, kind: "album", label: album.title, ref: album.slug });
    edges.push({ source: `era:${album.era}`, target: id });
  }

  for (const song of songs) {
    const id = `song:${song.slug}`;
    addNode({ id, kind: "song", label: song.title, ref: song.slug });
    if (song.albumSlug) {
      edges.push({ source: `album:${song.albumSlug}`, target: id });
    } else {
      edges.push({ source: `era:${song.era}`, target: id });
    }

    for (const collaborator of song.featuring) {
      const collabId = `collab:${collaborator}`;
      addNode({ id: collabId, kind: "collaborator", label: collaborator, ref: collaborator });
      edges.push({ source: id, target: collabId });
    }
  }

  return { nodes, edges };
}
