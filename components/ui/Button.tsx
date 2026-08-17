import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 font-display text-xs uppercase tracking-[0.2em] transition-all duration-300";

const variants = {
  solid: "bg-gold px-7 py-3.5 text-void hover:bg-gold-bright",
  outline: "border border-hairline-strong px-7 py-3.5 text-ink hover:border-gold hover:text-gold",
  ghost: "text-ink-dim hover:text-gold",
};

export function Button({
  href,
  onClick,
  children,
  variant = "solid",
  className,
  type = "button",
}: {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit";
}) {
  const cls = cn(base, variants[variant], className);
  if (href) {
    if (href.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
