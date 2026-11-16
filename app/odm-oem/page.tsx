import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {OemContent} from '@/components/meeting-sections'
import {getOdmProducts} from '@/lib/medical-products'
import {oemSeries} from '@/lib/site-navigation'
export async function generateMetadata(){return pageMetadata('/odm-oem',{title:'OEM Manufacturing',description:'Finished medical needle products for private-label manufacturing.'})}
export default async function Oem({searchParams}:{searchParams?:Promise<{series?:string}>}={}){const [products,query]=await Promise.all([getOdmProducts(),searchParams||Promise.resolve({series:undefined})]);const selected=oemSeries.find(series=>series.slug===query.series);return <PageFrame eyebrow="OEM" title={selected?.name||"OEM Manufacturing"} description=""><section className="medical-shell medical-section"><OemContent items={products} selected={query.series}/></section></PageFrame>}
