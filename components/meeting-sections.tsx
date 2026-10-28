import {SiteText,SiteImage} from '@/components/site-copy'
import {Reveal} from '@/components/reveal'
import {ZoomImage,ProcessVideo} from '@/components/medical-media'
import {QualificationGallery,AttachmentPhotoGallery} from '@/components/attachment-galleries'
import seed from '@/lib/site-seed.json'
import {processVideoIntro} from '@/lib/meeting-business-copy'
import {companyIntroduction} from '@/lib/feedback-company-copy'
import {oemSeries,componentSeries} from '@/lib/site-navigation'
import Link from '@/components/localized-link'

export function AboutContent({includeManufacturing=true,section}:{includeManufacturing?:boolean;section?:'company'|'qualifications'}){return <div className="meeting-about">
 {section!=='qualifications'&&<>
 <div id="company-introduction" className="scroll-mt-32"><Reveal className="meeting-company feedback-company"><SiteImage src={seed.photos.find(p=>p.title==='Cleanroom production area')!.image} alt="Brightstone Medical cleanroom production area" width={890} height={461}/><div className="meeting-company-copy">{companyIntroduction.map(text=><p key={text}><SiteText value={text}/></p>)}</div></Reveal></div>
 </>}
 {section!=='company'&&<div id="qualifications" className="scroll-mt-32"><Reveal className="meeting-about-block"><h3><SiteText value="Company & Product Qualifications"/></h3><QualificationGallery/></Reveal></div>}
 {includeManufacturing&&!section&&<ManufacturingContent/>}
 </div>}
export function ManufacturingContent(){return <div id="manufacturing-inspection" className="meeting-about scroll-mt-32">
 <Reveal className="meeting-about-block equipment-showcase feedback-equipment"><h3><SiteText value="Manufacturing Technology & Equipment"/></h3><AttachmentPhotoGallery group="manufacturing"/></Reveal>
 <Reveal className="meeting-about-block equipment-showcase feedback-equipment"><h3><SiteText value="Quality Inspection Instruments"/></h3><AttachmentPhotoGallery group="inspection"/></Reveal>
 <Reveal className="meeting-about-block manufacturing-showcase"><div className="manufacturing-section-copy"><h3><SiteText value="Manufacturing Videos"/></h3><p><SiteText value={processVideoIntro}/></p></div><div className="manufacturing-video-pair">{seed.videos.map((v,i)=><Reveal key={v.src} delay={i*90}><ProcessVideo {...v}/></Reveal>)}</div></Reveal>
 </div>}

export function NamedGallery({items,portrait=false}:{items:{slug:string;name:string;image:string}[];portrait?:boolean}){return <div className={`meeting-gallery ${portrait?'meeting-gallery-portrait':''}`}>{items.map(item=><Reveal as="figure" key={item.slug} id={item.slug}><ZoomImage src={item.image} alt={item.name}/><figcaption><SiteText value={item.name}/></figcaption></Reveal>)}</div>}

type GalleryItem={slug:string;name:string;image:string;application?:string;group?:string}
function SeriesGallery({items,series,base,selected,classify}:{items:GalleryItem[];series:{slug:string;name:string}[];base:string;selected?:string;classify:(item:GalleryItem)=>string|undefined}){
 const chosen=series.find(s=>s.slug===selected)
 return <><nav className="series-tabs" aria-label={base==='/odm-oem'?'OEM series':'Component series'}>{series.map(s=><Link key={s.slug} href={`${base}?series=${s.slug}`} aria-current={chosen?.slug===s.slug?'page':undefined}><SiteText value={s.name}/></Link>)}</nav>{(chosen?[chosen]:series).map(s=>{const group=items.filter(item=>classify(item)===s.slug);return <section key={s.slug} id={s.slug} className="feedback-series-section"><h2><SiteText value={s.name}/></h2>{group.length?<NamedGallery items={group} portrait={base==='/odm-oem'}/>:<p className="medical-intro"><SiteText value="Please contact us to discuss your requirements."/></p>}</section>})}</>
}
export function OemContent({items,selected}:{items:GalleryItem[];selected?:string}){return <><p className="oem-invitation"><SiteText value="We welcome custom manufacturing inquiries from partners worldwide. Send us your drawings or samples."/></p><SeriesGallery items={items} series={oemSeries} base="/odm-oem" selected={selected} classify={item=>item.application||(/epidural|spinal|anesthesia/.test(item.slug)?'anesthesia':'interventional')}/></>}
export function ComponentContent({items,selected}:{items:GalleryItem[];selected?:string;showProductionPhoto?:boolean}){return <SeriesGallery items={items} series={componentSeries} base="/contract-manufacturing" selected={selected} classify={item=>item.application||(/bone-marrow/.test(item.slug)?'bone-marrow':/biopsy/.test(item.slug)?'visceral':/echogenic/.test(item.slug)?'ultrasound':/end/.test(item.slug)?'end':/tip|pencil-point/.test(item.slug)?'tip':undefined)}/>}
