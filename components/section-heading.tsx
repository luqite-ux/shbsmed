import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-teal">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-base leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  )
}
