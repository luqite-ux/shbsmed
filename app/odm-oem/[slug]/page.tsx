import {ProductSchema} from '@/components/product-schema'
import {SiteText} from '@/components/site-copy'
import {notFound} from 'next/navigation'
import Link from '@/components/localized-link'
import {PageFrame} from '@/components/page-frame'
import {ZoomImage} from '@/components/medical-media'
import {Reveal} from '@/components/reveal'
import {getOdmProducts} from '@/lib/medical-products'
import {pageMetadata} from '@/lib/site-content/metadata'
export const revalidate=60
export const dynamicParams=true
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=(await getOdmProducts()).find(p=>p.slug===slug);return p?pageMetadata(`/odm-oem/${p.slug}`,{title:p.name,description:`Discuss ${p.name.toLowerCase()} development with Brightstone Medical.`,openGraph:{images:[p.image]}}):{}}
export default async function OdmDetail({params}:{params:Promise<{slug:string}>}){const{slug}=await params,p=(await getOdmProducts()).find(p=>p.slug===slug);if(!p)notFound();return <PageFrame eyebrow="ODM products" title={p.name} description="Discuss your product and development requirements with our team."><Reveal as="section" className="medical-shell product-detail-grid"><ZoomImage src={p.image} alt={p.name}/><div><p className="eyebrow"><SiteText value={"Product development"}/></p><h2 className="text-3xl font-semibold">{p.name}</h2><p className="medical-intro"><SiteText value={"Tell us the intended product, required configuration and quantity."}/></p><Link className="medical-button" href={`/contact?product=${p.slug}&type=ODM`}><SiteText value={"Discuss This Product →"}/></Link><p className="mt-6"><Link href="/odm-oem" className="underline underline-offset-4"><SiteText value={"Back to ODM / OEM"}/></Link></p></div></Reveal><ProductSchema name={p.name} image={p.image} path={`/odm-oem/${p.slug}`}/></PageFrame>}
