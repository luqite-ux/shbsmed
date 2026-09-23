// Shared content interfaces. Text fields are typed as `LocalizedText` so a
// later locale switch only needs to populate additional keys here -- no
// component or route needs to change shape.

export type Locale = "en"

export type LocalizedText = Record<Locale, string>

export interface ProductFamily {
  slug: string
  name: LocalizedText
  shortDescription: LocalizedText
  image: string
  productCount: number
}

export interface ProductSpec {
  label: LocalizedText
  value: LocalizedText
}

export interface Product {
  slug: string
  familySlug: string
  sku: string
  name: LocalizedText
  summary: LocalizedText
  description: LocalizedText
  image: string
  gallery: string[]
  specs: ProductSpec[]
  applications: LocalizedText[]
  moq?: string
  rawSpecifications?: string
}

export interface NewsArticle {
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  body: LocalizedText[]
  date: string
  category: LocalizedText
  image?: string
}

export interface FaqItem {
  question: LocalizedText
  answer: LocalizedText
}

export interface CapacityFact {
  label: LocalizedText
  value: LocalizedText
  helper: LocalizedText
}
