import { cn } from "@/lib/utils";

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  className,
}: {
  kicker?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {kicker && (
        <p className="mb-3 font-display text-xs uppercase tracking-[0.3em] text-gold">{kicker}</p>
      )}
      <h2 className="font-display text-3xl tracking-wide text-ink sm:text-4xl md:text-5xl">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base text-ink-dim sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
