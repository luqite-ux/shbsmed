import {PageFrame} from '@/components/page-frame'
import {ManufacturingContent} from '@/components/meeting-sections'
import {pageMetadata} from '@/lib/site-content/metadata'
export async function generateMetadata(){return pageMetadata('/about/manufacturing-inspection',{title:'Manufacturing Equipment & Inspection Instruments',description:'Brightstone Medical manufacturing equipment, quality inspection instruments and manufacturing videos.'})}
export default function ManufacturingInspection(){return <PageFrame eyebrow="About Us" title="Manufacturing Equipment & Inspection Instruments" description=""><section className="medical-shell medical-section"><ManufacturingContent/></section></PageFrame>}
