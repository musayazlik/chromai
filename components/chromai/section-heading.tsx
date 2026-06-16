import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[600px] text-center", className)}>
      <span className="inline-flex items-center gap-2 rounded-full border border-(--glass-bar-line) bg-(--glass-bar) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-dim backdrop-blur">
        <span className="size-1.5 rounded-full bg-[var(--grad)]" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-[clamp(24px,3.4vw,34px)] font-bold tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-[480px] text-[15px] leading-relaxed text-text-dim">
          {subtitle}
        </p>
      )}
    </div>
  );
}
