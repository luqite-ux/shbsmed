import {ProductSchema} from '@/components/product-schema'
import {SiteText} from '@/components/site-copy'
import {notFound} from 'next/navigation'
import Link from '@/components/localized-link'
import {PageFrame} from '@/components/page-frame'
import {ZoomImage} from '@/components/medical-media'
import {Reveal} from '@/components/reveal'
import {getContractComponents} from '@/lib/medical-products'
import {pageMetadata} from '@/lib/site-content/metadata'
export const revalidate=60
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const p=(await getContractComponents()).find(p=>p.slug===slug);return p?pageMetadata(`/contract-manufacturing/${p.slug}`,{title:p.name,description:`Discuss ${p.name.toLowerCase()} manufacturing with Brightstone Medical.`,openGraph:{images:[p.image]}}):{}}
export default async function Part({params}:{params:Promise<{slug:string}>}){const{slug}=await params,p=(await getContractComponents()).find(p=>p.slug===slug);if(!p)notFound();return <PageFrame eyebrow={`Contract Manufacturing / ${p.group}`} title={p.name} description="Discuss your component structure, dimensions and processing requirements."><Reveal as="section" className="medical-shell product-detail-grid"><ZoomImage src={p.image} alt={p.name}/><div><h2 className="text-3xl font-semibold"><SiteText value={"Needle-component manufacturing"}/></h2><p className="medical-intro"><SiteText value={"Send a drawing or sample reference. Include the material, tube diameter, length, tip or end structure, and required quantity."}/></p><Link className="medical-button" href={`/contact?product=${p.slug}&type=Contract`}><SiteText value={"Discuss This Component →"}/></Link></div></Reveal><ProductSchema name={p.name} image={p.image} path={`/contract-manufacturing/${p.slug}`}/></PageFrame>}
