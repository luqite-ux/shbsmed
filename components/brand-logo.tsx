"use client"
import Image from "next/image"
import Link from '@/components/localized-link'
import {useSiteBrand} from '@/components/site-copy'

export function BrandLogo({ className, size = "default" }: { className?: string; size?: "default" | "footer" }) {
  const brand=useSiteBrand()
  return (
    <Link
      href="/"
      className={`brand-lockup flex items-center gap-2.5 ${className ?? ""}`}
      aria-label={`${brand.brandName} — go to homepage`}
    >
      <Image
        src={brand.logo}
        alt={`${brand.brandName} logo`}
        width={72}
        height={72}
        className="brand-symbol shrink-0 object-contain"
      />
      <span className="brand-name font-semibold leading-tight">{brand.brandName}</span>
    </Link>
  )
}
