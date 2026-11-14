import {notFound,permanentRedirect} from 'next/navigation'
import {localizedPath} from '@/lib/locale'
import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {Reveal} from '@/components/reveal'
import {ZoomImage} from '@/components/medical-media'
import {SupplementText} from '@/components/customer-supplement-copy'
import Link from '@/components/localized-link'
import products from '@/lib/oem-preview-20261104.json'
import {oemCopy} from '@/lib/oem-preview-copy'
import {jsonLd} from '@/lib/json-ld'
type Props={params:Promise<{slug:string}>}
export const dynamicParams=true
export const revalidate=60
export async function generateMetadata({params}:Props){const {slug}=await params;const p=products.find(p=>p.slug===slug);return p? pageMetadata('/odm-oem/'+slug,{title:p.name,description:oemCopy[slug][0]}):{}}
export default async function OemDetail({params}:Props){
 if((!['preview','production'].includes(process.env.VERCEL_ENV ?? '')))permanentRedirect(await localizedPath('/odm-oem'))
 const {slug}=await params,p=products.find(p=>p.slug===slug);if(!p)notFound()
 return permanentRedirect(await localizedPath('/products/'+slug))
}
