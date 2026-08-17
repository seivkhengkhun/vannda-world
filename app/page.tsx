import { EnterGate } from "@/components/home/EnterGate";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedMusic } from "@/components/home/FeaturedMusic";
import { JourneyPreview } from "@/components/home/JourneyPreview";
import { FeaturedVideo } from "@/components/home/FeaturedVideo";
import { FanQuoteTeaser } from "@/components/home/FanQuoteTeaser";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "VannDa",
  genre: "Hip-Hop",
  url: "https://baramey.com/vannda",
  sameAs: [
    "https://www.youtube.com/@VannDaOfficial19000",
    "https://www.instagram.com/therealvannda",
    "https://www.facebook.com/vanndaofficialpage",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EnterGate />
      <HeroSection />
      <FeaturedMusic />
      <JourneyPreview />
      <FeaturedVideo />
      <FanQuoteTeaser />
    </>
  );
}
