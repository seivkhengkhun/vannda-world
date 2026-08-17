"use client";

import { Sparkles, Shuffle, RefreshCw } from "lucide-react";
import { usePlayer } from "./PlayerProvider";
import { MIX_MODES } from "@/lib/smart-mix";
import { cn } from "@/lib/utils";

const DURATIONS = [3, 5, 8, 10] as const;

export function SmartMixPanel() {
  const player = usePlayer();

  return (
    <div className="mt-8 rounded-xl border border-hairline-strong bg-surface/60 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={player.toggleSmartMix}
          aria-pressed={player.smartMixEnabled}
          className={cn(
            "flex items-center gap-2 rounded-full border px-4 py-2 font-display text-xs uppercase tracking-[0.2em] transition-colors",
            player.smartMixEnabled ? "border-gold bg-gold/10 text-gold" : "border-hairline-strong text-ink-dim hover:text-ink",
          )}
        >
          <Sparkles size={14} className={player.smartMixEnabled ? "fill-gold" : ""} />
          Smart Mix
          <span className={cn("ml-1 rounded-full px-1.5 py-0.5 text-[9px]", player.smartMixEnabled ? "bg-gold text-void" : "bg-raised-2 text-ink-faint")}>
            {player.smartMixEnabled ? "ON" : "OFF"}
          </span>
        </button>

        {player.smartMixEnabled && (
          <div className="flex items-center gap-1">
            <button
              onClick={player.shuffleSmartQueue}
              aria-label="Shuffle queue"
              className="rounded-full p-2 text-ink-faint transition-colors hover:text-gold"
            >
              <Shuffle size={15} />
            </button>
            <button
              onClick={player.regenerateSmartQueue}
              aria-label="Regenerate mix"
              className="rounded-full p-2 text-ink-faint transition-colors hover:text-gold"
            >
              <RefreshCw size={15} />
            </button>
          </div>
        )}
      </div>

      {player.smartMixEnabled && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="mb-2 font-display text-[10px] uppercase tracking-[0.2em] text-ink-faint">Mix Style</p>
            <div className="flex flex-wrap gap-2">
              {MIX_MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => player.setMixMode(m.key)}
                  title={m.description}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-display text-[10px] uppercase tracking-[0.15em] transition-colors",
                    player.mixMode === m.key ? "bg-gold text-void" : "bg-raised-2 text-ink-dim hover:text-ink",
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => player.setCrossfadeEnabled(!player.crossfadeEnabled)}
              className="flex items-center gap-2 font-display text-[11px] uppercase tracking-[0.15em] text-ink-dim"
            >
              <span
                className={cn(
                  "flex h-5 w-9 items-center rounded-full p-0.5 transition-colors",
                  player.crossfadeEnabled ? "justify-end bg-gold" : "justify-start bg-raised-2",
                )}
              >
                <span className="h-4 w-4 rounded-full bg-void" />
              </span>
              Crossfade
            </button>

            {player.crossfadeEnabled && (
              <div className="flex items-center gap-1.5">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => player.setCrossfadeDuration(d)}
                    className={cn(
                      "rounded-full px-2.5 py-1 font-display text-[10px] tracking-wide transition-colors",
                      player.crossfadeDuration === d ? "bg-gold text-void" : "bg-raised-2 text-ink-faint hover:text-ink-dim",
                    )}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
