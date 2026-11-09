import {Reveal} from '@/components/reveal'
import {ZoomImage} from '@/components/medical-media'
import {SiteText} from '@/components/site-copy'
import assets from '@/lib/customer-attachments.json'

export function QualificationGallery(){return <div className="attachment-certificates">{assets.certificates.map(item=><Reveal as="figure" key={item.order}>
 <ZoomImage src={item.order===5?'/images/feedback-20261109/patent-certificates.webp':item.order===6?'/images/feedback-20261109/software-certificates.webp':item.image} alt={item.title} quarterTurn={item.order===2}/>
 <figcaption><SiteText value={item.title}/></figcaption>
 </Reveal>)}</div>}

export function AttachmentPhotoGallery({group}:{group:'manufacturing'|'inspection'}){return <div className={`attachment-photos attachment-${group}`}>{assets[group].map(item=><Reveal as="figure" key={item.order} delay={(item.order%3)*60}>
 <ZoomImage src={item.image} alt={item.title}/>
 </Reveal>)}</div>}
