"use client"
import Image from "next/image"
import Link from '@/components/localized-link'
import {useSiteBrand} from '@/components/site-copy'

export function BrandLogo({ className, size = "default" }: { className?: string; size?: "default" | "footer" }) {
  const brand=useSiteBrand()
  return (
    <Link
      href="/"
      className={`flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={`${brand.brandName} — go to homepage`}
    >
      <Image
        src={brand.logo}
        alt={`${brand.brandName} logo`}
        width={size === "footer" ? 64 : 52}
        height={size === "footer" ? 64 : 52}
        className={size === "footer" ? "h-16 w-16 shrink-0 object-contain" : "h-11 w-11 shrink-0 object-contain sm:h-[52px] sm:w-[52px]"}
      />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold text-brand-ink sm:text-lg">{brand.brandName}</span>
        <span className="text-[11px] uppercase tracking-wide text-muted-foreground">Medical Technology</span>
      </span>
    </Link>
  )
}
