import {SiteText,SiteImage} from '@/components/site-copy'
import {Reveal} from '@/components/reveal'
import {ZoomImage,ProcessVideo} from '@/components/medical-media'
import {PhotoGroup} from '@/components/medical-sections'
import seed from '@/lib/site-seed.json'
import {oemIntro,componentIntro} from '@/lib/meeting-business-copy'

export function AboutContent(){return <div className="meeting-about">
 <Reveal className="meeting-company"><SiteImage src={seed.photos.find(p=>p.title==='Cleanroom production area')!.image} alt="Brightstone Medical cleanroom production area" width={890} height={461}/><div className="meeting-company-copy"><h3><SiteText value="Shanghai Brightstone Medical Technology Limited"/></h3><SiteText paragraphs value="Founded in December 2015, Brightstone Medical focuses on medical needle product development and manufacturing. Our business includes branded products, OEM finished products and needle-component manufacturing."/></div></Reveal>
 <Reveal className="meeting-about-block"><h3><SiteText value="Company & Product Qualifications"/></h3><p className="medical-intro"><SiteText value="Our single-use RF electrodes and RF cannulas have market-access certificates for China, the United States and Europe."/></p></Reveal>
 <Reveal className="meeting-about-block equipment-showcase"><h3><SiteText value="Manufacturing Technology & Equipment"/></h3><PhotoGroup layout="production" items={seed.photos.filter(p=>p.group==='equipment'||p.title==='Assembly workstations')}/><p><SiteText value="Equipment supports selected machining processes. Assembly is mainly manual."/></p></Reveal>
 <Reveal className="meeting-about-block equipment-showcase"><h3><SiteText value="Quality Inspection Instruments"/></h3><PhotoGroup layout="inspection" items={seed.photos.filter(p=>p.group==='quality')}/></Reveal>
 <Reveal className="meeting-about-block manufacturing-showcase"><h3><SiteText value="Manufacturing Videos"/></h3><div className="manufacturing-video-pair">{seed.videos.map((v,i)=><Reveal key={v.src} delay={i*90}><ProcessVideo {...v}/></Reveal>)}</div></Reveal>
 </div>}

export function NamedGallery({items,portrait=false}:{items:{slug:string;name:string;image:string}[];portrait?:boolean}){return <div className={`meeting-gallery ${portrait?'meeting-gallery-portrait':''}`}>{items.map(item=><Reveal as="figure" key={item.slug}><ZoomImage src={item.image} alt={item.name}/><figcaption><SiteText value={item.name}/></figcaption></Reveal>)}</div>}
export function OemContent({items}:{items:{slug:string;name:string;image:string}[]}){return <>{oemIntro.map(text=><p className="medical-intro" key={text}><SiteText value={text}/></p>)}<NamedGallery items={items} portrait/></>}
export function ComponentContent({items}:{items:{slug:string;name:string;image:string}[]}){return <>{componentIntro.map(text=><p className="medical-intro" key={text}><SiteText value={text}/></p>)}<NamedGallery items={items}/><div className="meeting-about-block component-production-photos"><PhotoGroup items={seed.photos.filter(p=>['Semi-finished needle tubes','Semi-finished needle assemblies'].includes(p.title))}/></div></>}
