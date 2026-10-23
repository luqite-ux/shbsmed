import {PageFrame} from '@/components/page-frame'
import {AboutContent} from '@/components/meeting-sections'
import {pageMetadata} from '@/lib/site-content/metadata'
export async function generateMetadata(){return pageMetadata('/about/company-introduction',{title:'Company Introduction',description:'Brightstone Medical company introduction and cleanroom production area.'})}
export default function CompanyIntroduction(){return <PageFrame eyebrow="About Us" title="Company Introduction" description=""><section className="medical-shell medical-section"><AboutContent section="company" includeManufacturing={false}/></section></PageFrame>}
