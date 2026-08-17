import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { CulturalMotif } from "@/components/gallery/CulturalMotif";

export const metadata: Metadata = {
  title: "The Archive",
  description: "A visual archive of VannDa's work — official video stills, performances, and cultural moments, each attributed to its source.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading
        kicker="The Archive"
        title="Visual Archive"
        align="center"
        description="Built from officially published video stills, each attributed and linked to its source — never scraped or re-hosted photography."
        className="mx-auto"
      />
      <CulturalMotif />
      <GalleryGrid />
    </div>
  );
}
