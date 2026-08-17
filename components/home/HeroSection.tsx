"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { ytThumbnail } from "@/lib/youtube";

export function HeroSection() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex h-[92vh] min-h-140 items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={ytThumbnail("jFVfxBQjMFU")}
          alt=""
          fill
          priority
          unoptimized
          className="object-cover opacity-45"
        />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-b from-void/40 via-void/60 to-void" />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,9,8,0.6) 100%)",
        }}
      />

      <motion.div style={{ opacity }} className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-7xl tracking-[0.04em] text-ink sm:text-8xl md:text-[9rem] md:leading-none"
        >
          {t.hero.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-lg text-sm uppercase tracking-[0.3em] text-ink-dim sm:text-base"
        >
          {t.hero.subtitle}
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          href="#featured-music"
          className="mt-10 border border-hairline-strong px-8 py-3.5 font-display text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:border-gold hover:text-gold"
        >
          {t.hero.cta}
        </motion.a>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 z-10 text-ink-faint"
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}
