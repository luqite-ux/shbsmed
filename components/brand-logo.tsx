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
        width={size === "footer" ? 50 : 52}
        height={size === "footer" ? 50 : 52}
        className={size === "footer" ? "h-[50px] w-[50px] shrink-0 object-contain" : "h-11 w-11 shrink-0 object-contain sm:h-[52px] sm:w-[52px]"}
      />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-brand-ink sm:text-lg">{company.brandName}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Medical Technology</span>
      </span>
    </Link>
  )
}
