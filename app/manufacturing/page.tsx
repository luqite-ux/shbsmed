import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText} from '@/components/site-copy'
import {PageFrame} from '@/components/page-frame'
import {Reveal} from '@/components/reveal'
import {ProcessVideo} from '@/components/medical-media'
import {PhotoGroup} from '@/components/medical-sections'
import seed from '@/lib/site-seed.json'
import {PendingPanel} from '@/components/framework-pending'
export async function generateMetadata(){return pageMetadata("/manufacturing",{title:'Manufacturing & Quality',description:'Explore Brightstone Medical company, production processes, cleanroom assembly, inspection resources and component manufacturing.',alternates:{canonical:'https://shbsmed.com/manufacturing'}})}
export default function Manufacturing(){const companyPhotos=[seed.photos.find(p=>p.title==='Company entrance')!,seed.photos.find(p=>p.group==='exhibitions')!],manufacturingPhotos=[seed.photos.find(p=>p.group==='equipment')!,seed.photos.find(p=>p.group==='production')!,seed.photos.find(p=>p.title==='Semi-finished needle tubes')!];return <PageFrame eyebrow="Manufacturing & Quality" title="Company, Production & Inspection" description="Brightstone Medical in Shanghai."><Reveal as="section" className="medical-shell medical-section"><div id="company"><PhotoGroup items={companyPhotos}/><h2 className="mt-8"><SiteText value="Shanghai Brightstone Medical Technology Limited"/></h2><p className="medical-intro"><SiteText value="Founded in December 2015, Brightstone Medical provides medical needles, RF electrodes and related component manufacturing. Our work focuses on product development, quality standards and manufacturing technology, including branded products, ODM, OEM and component manufacturing."/></p><div className="mt-8"><PendingPanel title="Company & Product Qualifications">Public certificate versions, corresponding entities and applicable product scope pending confirmation.</PendingPanel></div></div></Reveal>
 <Reveal as="section" className="medical-shell medical-section"><div id="processes"><h2><SiteText value="Manufacturing Technology & Equipment"/></h2><PhotoGroup items={manufacturingPhotos}/><p className="medical-intro"><SiteText value="Equipment supports selected machining processes. Assembly is mainly manual."/></p></div></Reveal>
 <Reveal as="section" className="medical-shell medical-section"><div id="quality"><h2><SiteText value="Quality Inspection"/></h2><PhotoGroup items={seed.photos.filter(p=>p.group==='quality')}/></div></Reveal>
 <Reveal as="section" className="medical-shell medical-section"><h2><SiteText value="Manufacturing Videos"/></h2><div className="grid gap-8 md:grid-cols-2 mt-9">{seed.videos.map(v=><Reveal key={v.src}><ProcessVideo {...v}/></Reveal>)}</div></Reveal>
 </PageFrame>}
