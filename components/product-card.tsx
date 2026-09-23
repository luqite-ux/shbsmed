import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { Product } from "@/lib/types"

export function ProductCard({ product }: { product: Product }) {
  const cardSpecs = product.specs.filter((spec) => spec.value.en.length <= 64).slice(0, 3)

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-blue/10 focus-visible:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-white p-2 sm:p-3">
        <Image
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name.en}
          width={400}
          height={400}
          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.025]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-teal">{product.sku}</p>
        <h3 className="text-base font-semibold text-brand-ink">{product.name.en}</h3>
        <dl className="mt-1 grid gap-1.5 border-t border-border/70 pt-3 text-sm">
          {cardSpecs.map((spec) => (
            <div className="flex items-baseline justify-between gap-4" key={spec.label.en}>
              <dt className="text-muted-foreground">{spec.label.en}</dt>
              <dd className="text-right font-medium text-brand-ink">{spec.value.en}</dd>
            </div>
          ))}
          {product.moq ? (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-muted-foreground">MOQ</dt>
              <dd className="text-right font-medium text-brand-ink">{product.moq}</dd>
            </div>
          ) : null}
        </dl>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-medium text-brand-blue-deep">
          View specification
          <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
