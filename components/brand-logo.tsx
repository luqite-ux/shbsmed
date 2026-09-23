import Image from "next/image"
import Link from "next/link"
import { company } from "@/lib/data/company"

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={`${company.brandName} — go to homepage`}
    >
      <Image
        src="/images/brand/logo.png"
        alt={`${company.brandName} logo`}
        width={36}
        height={36}
        className="h-9 w-9 shrink-0"
      />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-brand-ink">{company.brandName}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Medical Technology</span>
      </span>
    </Link>
  )
}
