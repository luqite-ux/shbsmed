import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {ComponentContent} from '@/components/meeting-sections'
import {getContractComponents} from '@/lib/medical-products'
export async function generateMetadata(){return pageMetadata('/contract-manufacturing',{title:'Core Component Manufacturing',description:'Needle tubes, stylets, tip structures and processing examples.'})}
export default async function Contract({searchParams}:{searchParams?:Promise<{series?:string}>}={}){const [parts,query]=await Promise.all([getContractComponents(),searchParams||Promise.resolve({series:undefined})]);return <PageFrame eyebrow="Component Manufacturing" title="Core Component Manufacturing" description=""><section className="medical-shell medical-section"><ComponentContent items={parts} selected={query.series}/></section></PageFrame>}
