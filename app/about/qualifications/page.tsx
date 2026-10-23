import {PageFrame} from '@/components/page-frame'
import {AboutContent} from '@/components/meeting-sections'
import {pageMetadata} from '@/lib/site-content/metadata'
export async function generateMetadata(){return pageMetadata('/about/qualifications',{title:'Qualifications',description:'Market-access qualifications for Brightstone Medical single-use RF electrodes and RF cannulas.'})}
export default function Qualifications(){return <PageFrame eyebrow="About Us" title="Qualifications" description=""><section className="medical-shell medical-section"><AboutContent section="qualifications" includeManufacturing={false}/></section></PageFrame>}
