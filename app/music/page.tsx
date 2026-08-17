import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MusicArchive } from "@/components/music/MusicArchive";

export const metadata: Metadata = {
  title: "Music Archive",
  description: "Explore VannDa's albums, singles, and collaborations — verified, sourced, and linked to official releases.",
};

export default function MusicPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading kicker="Discography" title="Music Archive" align="center" description="Every release here is verified against official sources and linked back to them." className="mx-auto" />
      <div className="mt-14">
        <MusicArchive />
      </div>
    </div>
  );
}
