import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoGrid } from "@/components/videos/VideoGrid";

export const metadata: Metadata = {
  title: "Video Archive",
  description: "Official music videos, performances, and collaborations from VannDa — every embed sourced from a verified official channel.",
};

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading kicker="Watch" title="Video Archive" align="center" description="Every video here was checked against an official channel before being listed." className="mx-auto" />
      <div className="mt-14">
        <VideoGrid />
      </div>
    </div>
  );
}
