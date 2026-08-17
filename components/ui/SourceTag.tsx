import type { Source } from "@/content/types";

export function SourceTag({ sources, label }: { sources: Source[]; label: string }) {
  if (!sources.length) return null;
  return (
    <p className="mt-3 text-xs text-ink-faint">
      {label}:{" "}
      {sources.map((s, i) => (
        <span key={s.url}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-hairline-strong underline-offset-2 transition-colors hover:text-gold"
          >
            {s.label}
          </a>
          {i < sources.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}
