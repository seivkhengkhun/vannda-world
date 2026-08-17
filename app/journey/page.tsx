import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineFull } from "@/components/journey/TimelineFull";

export const metadata: Metadata = {
  title: "Journey",
  description: "VannDa's career journey — from independent beginnings in Sihanoukville to the Paris Olympics stage. Verified, sourced milestones.",
};

export default function JourneyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading kicker="The Story" title="His Journey" align="center" description="Every milestone is sourced. Nothing here is invented." className="mx-auto" />
      <div className="mt-20">
        <TimelineFull />
      </div>
    </div>
  );
}
