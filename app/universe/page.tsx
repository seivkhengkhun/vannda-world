import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { UniverseCanvas } from "@/components/universe/UniverseCanvas";

export const metadata: Metadata = {
  title: "Universe",
  description: "Explore VannDa's career as an interactive universe of songs, albums, eras, and collaborations.",
};

export default function UniversePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading kicker="Explore" title="VannDa Universe" align="center" description="Every song, album, era, and collaborator — connected. Click a node to step inside." className="mx-auto" />
      <div className="mt-14">
        <UniverseCanvas />
      </div>
    </div>
  );
}
