import {SiteText,SiteImage} from '@/components/site-copy'
import {Reveal} from '@/components/reveal'
import {ZoomImage,ProcessVideo} from '@/components/medical-media'
import {PhotoGroup} from '@/components/medical-sections'
import {PendingPanel} from '@/components/framework-pending'
import seed from '@/lib/site-seed.json'

export function AboutContent(){return <div className="meeting-about">
 <Reveal className="meeting-company"><SiteImage src={seed.photos[0].image} alt="Brightstone Medical company entrance"/><div><h3><SiteText value="Company Introduction"/></h3><p><SiteText value="Shanghai Brightstone Medical Technology Limited"/></p><p><SiteText value="Founded in December 2015, Brightstone Medical focuses on medical needle product development and manufacturing. Our business includes branded products, OEM finished products and needle-component manufacturing."/></p></div></Reveal>
 <Reveal className="meeting-about-block"><h3><SiteText value="Company & Product Qualifications"/></h3><p className="medical-intro"><SiteText value="Our single-use RF electrodes and RF cannulas have market-access certificates for China, the United States and Europe."/></p><PendingPanel title="Certificate images">Current certificate images for public display are pending confirmation.</PendingPanel></Reveal>
 <Reveal className="meeting-about-block"><h3><SiteText value="Manufacturing Technology & Equipment"/></h3><PhotoGroup items={seed.photos.filter(p=>p.group==='equipment'||p.title==='Cleanroom production area')}/><p><SiteText value="Equipment supports selected machining processes. Assembly is mainly manual."/></p></Reveal>
 <Reveal className="meeting-about-block"><h3><SiteText value="Quality Inspection Instruments"/></h3><PhotoGroup items={seed.photos.filter(p=>p.group==='quality')}/></Reveal>
 <Reveal className="meeting-about-block"><h3><SiteText value="Manufacturing Videos"/></h3><div className="grid gap-8 md:grid-cols-2">{seed.videos.map(v=><ProcessVideo key={v.src} {...v}/>)}</div></Reveal>
 </div>}

export function NamedGallery({items,portrait=false}:{items:{slug:string;name:string;image:string}[];portrait?:boolean}){return <div className={`meeting-gallery ${portrait?'meeting-gallery-portrait':''}`}>{items.map(item=><Reveal as="figure" key={item.slug}><ZoomImage src={item.image} alt={item.name}/><figcaption><SiteText value={item.name}/></figcaption></Reveal>)}</div>}
export function OemContent({items}:{items:{slug:string;name:string;image:string}[]}){return <><p className="medical-intro"><SiteText value="Finished needle products available for private-label manufacturing."/></p><NamedGallery items={items} portrait/></>}
export function ComponentContent({items}:{items:{slug:string;name:string;image:string}[]}){return <><p className="medical-intro"><SiteText value="Needle tubes, stylets and processing examples for customers who manufacture and assemble needle products."/></p><NamedGallery items={items}/><div className="meeting-about-block"><PhotoGroup items={seed.photos.filter(p=>['Semi-finished needle tubes','Semi-finished needle assemblies'].includes(p.title))}/></div></>}
