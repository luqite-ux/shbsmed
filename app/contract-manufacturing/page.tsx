import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {ComponentContent} from '@/components/meeting-sections'
import {getContractComponents} from '@/lib/medical-products'
import {componentSeries} from '@/lib/site-navigation'
export async function generateMetadata(){return pageMetadata('/contract-manufacturing',{title:'Custom Accessories',description:'Needle tubes, stylets, tip structures and processing examples.'})}
export default async function Contract({searchParams}:{searchParams?:Promise<{series?:string}>}={}){const [parts,query]=await Promise.all([getContractComponents(),searchParams||Promise.resolve({series:undefined})]);const selected=componentSeries.find(series=>series.slug===query.series);return <PageFrame eyebrow="Custom Accessories" title={selected?.name||"Custom Accessories"} description=""><section className="medical-shell medical-section"><ComponentContent items={parts} selected={query.series}/></section></PageFrame>}
