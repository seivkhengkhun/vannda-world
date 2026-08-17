"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { eraQuizQuestions, eraResults } from "@/content/faves";
import { songs } from "@/content/songs";
import { ytThumbnail } from "@/lib/youtube";
import { Button } from "@/components/ui/Button";

export function EraQuiz() {
  const [answers, setAnswers] = useState<string[]>([]);
  const step = answers.length;
  const finished = step >= eraQuizQuestions.length;

  function choose(eraSlug: string) {
    setAnswers((prev) => [...prev, eraSlug]);
  }

  function reset() {
    setAnswers([]);
  }

  if (finished) {
    const counts = new Map<string, number>();
    answers.forEach((era) => counts.set(era, (counts.get(era) ?? 0) + 1));
    let bestEra = answers[0];
    let bestCount = 0;
    for (const [era, count] of counts) {
      if (count > bestCount) {
        bestEra = era;
        bestCount = count;
      }
    }
    const result = eraResults.find((r) => r.eraSlug === bestEra) ?? eraResults[0];
    const repSong = songs.find((s) => s.slug === result.representativeSongSlug);

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-md text-center"
        >
          {repSong?.youtubeId && (
            <div className="relative mx-auto aspect-square w-40 overflow-hidden rounded-full border-2 border-gold">
              <Image src={ytThumbnail(repSong.youtubeId, "hq")} alt={result.title} fill unoptimized className="object-cover" />
            </div>
          )}
          <p className="mt-6 font-display text-xs uppercase tracking-[0.3em] text-gold">Your Era</p>
          <h3 className="mt-2 font-display text-3xl text-ink">{result.title}</h3>
          <p className="mt-3 text-ink-dim">{result.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {repSong && <Button href={`/songs/${repSong.slug}`}>Listen Now</Button>}
            <Button variant="outline" onClick={reset}>
              Retake Quiz
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  const question = eraQuizQuestions[step];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -16 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-xl text-center"
      >
        <p className="font-display text-xs uppercase tracking-[0.2em] text-ink-faint">
          Question {step + 1} / {eraQuizQuestions.length}
        </p>
        <h3 className="mt-3 font-display text-2xl text-ink sm:text-3xl">{question.prompt}</h3>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {question.options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => choose(opt.eraSlug)}
              className="border border-hairline px-5 py-4 text-sm text-ink-dim transition-colors hover:border-gold hover:text-ink"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
