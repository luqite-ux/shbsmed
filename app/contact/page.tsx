import {getBrandSettings} from '@/lib/brand-settings'
import {currentLocale} from '@/lib/locale'
import {pageMetadata} from '@/lib/site-content/metadata'
import {Reveal} from '@/components/reveal'
import {SiteText} from '@/components/site-copy'
import { PageFrame } from "@/components/page-frame";import { company } from "@/lib/data/company";import { EnquiryForm } from "@/components/enquiry-form";import {getMedicalProducts,getOdmProducts,getContractComponents} from '@/lib/medical-products'
export const revalidate=60
export async function generateMetadata(){return pageMetadata("/contact",{title:"Contact & RFQ",description:"Send an RF electrode or RF cannula sourcing inquiry to Brightstone Medical.",alternates:{canonical:"https://shbsmed.com/contact"}})}
export default async function Contact({searchParams}:{searchParams:Promise<{product?:string}>}){const products=[...await getMedicalProducts(),...await getOdmProducts(),...await getContractComponents()],query=await searchParams,brand=await getBrandSettings(await currentLocale());return <PageFrame eyebrow="Contact & RFQ" title="Tell us what you need to source" description="Share the product family, specification, estimated volume and target schedule. Our team will review feasibility and respond by email."><Reveal as="section" className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8"><div><h2 className="text-2xl font-semibold"><SiteText value={"Direct contact"}/></h2><a className="mt-4 block text-brand-blue" href={`mailto:${brand.email}`}>{brand.email}</a><p className="mt-4 text-muted-foreground">{brand.address}</p></div><EnquiryForm defaultProduct={query.product} products={products.map(p=>({slug:p.slug,name:p.name}))}/></Reveal></PageFrame>}
