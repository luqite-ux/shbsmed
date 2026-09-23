import Image from "next/image"
import Link from "next/link"
import { company } from "@/lib/data/company"

export function BrandLogo({ className, size = "default" }: { className?: string; size?: "default" | "footer" }) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={`${company.brandName} — go to homepage`}
    >
      <Image
        src="/images/brand/logo.png"
        alt={`${company.brandName} logo`}
        width={size === "footer" ? 50 : 36}
        height={size === "footer" ? 50 : 36}
        className={size === "footer" ? "h-[50px] w-[50px] shrink-0 object-contain" : "h-9 w-9 shrink-0 object-contain"}
      />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-brand-ink">{company.brandName}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Medical Technology</span>
      </span>
    </Link>
  )
}
