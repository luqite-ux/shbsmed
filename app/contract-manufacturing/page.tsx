import {pageMetadata} from '@/lib/site-content/metadata'
import {PageFrame} from '@/components/page-frame'
import {ComponentContent} from '@/components/meeting-sections'
import {getContractComponents} from '@/lib/medical-products'
export async function generateMetadata(){return pageMetadata('/contract-manufacturing',{title:'Needle Component Manufacturing',description:'Needle tubes, stylets, tip structures and processing examples.'})}
export default async function Contract(){const parts=await getContractComponents();return <PageFrame eyebrow="Component Manufacturing" title="Needle Component Manufacturing" description="Needle tubes, stylets and related components."><section className="medical-shell medical-section"><ComponentContent items={parts}/></section></PageFrame>}
