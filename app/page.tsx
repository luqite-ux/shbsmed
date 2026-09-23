import Link from "next/link"
import { HeroCarousel } from "@/components/hero-carousel"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FamilyCard } from "@/components/family-card"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import { fetchProductsData } from "@/lib/products-db"
import { capacityFacts, faqItems } from "@/lib/data/company"

export const revalidate=60
export default async function HomePage() {const{products,families:productFamilies}=await fetchProductsData()
  return <><SiteHeader/><main><HeroCarousel/>
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-widest text-brand-teal">Product solutions</p><h2 className="mt-3 text-3xl font-semibold text-brand-ink">RF components organized for specification-led sourcing</h2><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">{productFamilies.map(f=><FamilyCard key={f.slug} family={f}/>)}</div></Reveal>
    <Reveal as="section" className="bg-brand-blue-deep text-white"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p className="text-sm font-semibold uppercase tracking-widest text-brand-teal">Manufacturing evidence</p><h2 className="mt-3 text-3xl font-semibold">Precision processes, visible and verifiable</h2><p className="mt-5 text-white/75">Automated cutting, wire-cut forming, cleanroom production and dedicated inspection support standard and OEM/ODM programs.</p><Link className="mt-7 inline-flex rounded-md bg-white px-5 py-3 font-medium text-brand-blue-deep" href="/manufacturing">View Manufacturing</Link></div><div className="grid grid-cols-2 gap-4">{capacityFacts.map(x=><div key={x.label.en} className="rounded-xl border border-white/15 bg-white/5 p-5"><div className="text-2xl font-semibold">{x.value.en}</div><div className="mt-2 text-sm text-white/70">{x.label.en}</div></div>)}</div></div></Reveal>
    <Reveal as="section" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><h2 className="text-3xl font-semibold text-brand-ink">Representative products</h2><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.slice(0,4).map(p=><ProductCard key={p.slug} product={p}/>)}</div></Reveal>
    <Reveal as="section" className="bg-secondary"><div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8"><h2 className="text-3xl font-semibold text-brand-ink">Buyer questions, answered early</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{faqItems.slice(0,6).map(x=><details key={x.question.en} className="rounded-xl border bg-background p-5"><summary className="cursor-pointer font-semibold">{x.question.en}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{x.answer.en}</p></details>)}</div></div></Reveal>
    <section className="bg-brand-blue px-4 py-16 text-center text-white"><h2 className="text-3xl font-semibold">Share your target specification</h2><p className="mx-auto mt-3 max-w-2xl text-white/80">Tell us the product family, gauge, length, tip structure and expected volume.</p><Link className="mt-7 inline-flex rounded-md bg-white px-6 py-3 font-medium text-brand-blue-deep" href="/contact">Request a Quote</Link></section>
  </main><SiteFooter/></>
}
