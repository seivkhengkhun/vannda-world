export function CulturalMotif() {
  return (
    <div className="my-16">
      <svg viewBox="0 0 800 60" className="h-10 w-full text-gold/40" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <path
            key={i}
            d={`M${i * 40 + 20} 50 L${i * 40 + 20} 30 Q${i * 40 + 20} 10 ${i * 40 + 20} 5 Q${i * 40 + 20} 10 ${i * 40 + 20} 30 Z M${i * 40} 50 Q${i * 40 + 20} 40 ${i * 40 + 40} 50`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        ))}
      </svg>
      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.3em] text-ink-faint">
        Original motif artwork — VANNDA WORLD, inspired by traditional Khmer spire pattern
      </p>
    </div>
  );
}
