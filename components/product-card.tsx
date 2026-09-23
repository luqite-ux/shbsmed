import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/types"

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/10 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-brand-blue-light p-6">
        <Image
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name.en}
          width={400}
          height={400}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-teal">{product.sku}</p>
        <h3 className="text-base font-semibold text-brand-ink">{product.name.en}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{product.summary.en}</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue-deep">
          View specification
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
