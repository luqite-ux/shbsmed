import {PageFrame} from '@/components/page-frame'
import {AboutContent} from '@/components/meeting-sections'
import {pageMetadata} from '@/lib/site-content/metadata'
export async function generateMetadata(){return pageMetadata('/about',{title:'About Us',description:'Brightstone Medical company introduction, qualifications, manufacturing equipment and inspection instruments.'})}
export default function About(){return <PageFrame eyebrow="About Us" title="About Brightstone Medical" description="Company introduction, qualifications, manufacturing and inspection."><section className="medical-shell medical-section"><AboutContent/></section></PageFrame>}
