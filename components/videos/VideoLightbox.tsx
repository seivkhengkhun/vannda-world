"use client";

import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export function VideoLightbox({
  youtubeId,
  title,
  onClose,
}: {
  youtubeId: string | null;
  title: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {youtubeId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-70 flex items-center justify-center bg-void/95 p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="truncate pr-4 text-sm text-ink-dim">{title}</p>
              <button onClick={onClose} aria-label="Close" className="shrink-0 text-ink-dim hover:text-gold">
                <X size={20} />
              </button>
            </div>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-hairline">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
