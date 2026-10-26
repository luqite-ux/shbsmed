import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {OemContent} from '@/components/meeting-sections'
import {getOdmProducts} from '@/lib/medical-products'
export async function generateMetadata(){return pageMetadata('/odm-oem',{title:'OEM Manufacturing',description:'Finished medical needle products for private-label manufacturing.'})}
export default async function Oem({searchParams}:{searchParams?:Promise<{series?:string}>}={}){const [products,query]=await Promise.all([getOdmProducts(),searchParams||Promise.resolve({series:undefined})]);return <PageFrame eyebrow="OEM" title="OEM Manufacturing" description=""><section className="medical-shell medical-section"><OemContent items={products} selected={query.series}/></section></PageFrame>}
