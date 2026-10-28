import {Reveal} from '@/components/reveal'
import {ZoomImage} from '@/components/medical-media'
import {SiteText} from '@/components/site-copy'
import assets from '@/lib/customer-attachments.json'

export function QualificationGallery(){return <div className="attachment-certificates">{assets.certificates.map(item=><Reveal as="figure" key={item.order}>
 <ZoomImage src={item.image} alt={item.title}/>
 <figcaption><SiteText value={item.title}/></figcaption>
 <a href={item.document} target="_blank" rel="noopener noreferrer" className="attachment-document"><SiteText value="View original document"/></a>
 </Reveal>)}</div>}

export function AttachmentPhotoGallery({group}:{group:'manufacturing'|'inspection'}){return <div className={`attachment-photos attachment-${group}`}>{assets[group].map(item=><Reveal as="figure" key={item.order} delay={(item.order%3)*60}>
 <ZoomImage src={item.image} alt={item.title}/>
 </Reveal>)}</div>}
