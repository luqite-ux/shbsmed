import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { ProductFamily } from "@/lib/types"

export function FamilyCard({ family }: { family: ProductFamily }) {
  return (
    <Link
      href={`/products?family=${family.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/10 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-b from-brand-blue-light to-white p-8">
        <Image
          src={family.image || "/placeholder.svg?height=400&width=400"}
          alt={family.name.en}
          width={320}
          height={320}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="text-base font-semibold text-brand-ink">{family.name.en}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{family.shortDescription.en}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue-deep">
          Browse family
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
