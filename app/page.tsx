import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText,SiteImage,SiteContentVersion} from '@/components/site-copy'
import Link from '@/components/localized-link'
import {HeroCarousel} from '@/components/hero-carousel'
import {SiteHeader} from '@/components/site-header'
import {SiteFooter} from '@/components/site-footer'
import {Reveal} from '@/components/reveal'
import seed from '@/lib/site-seed.json'
import frameworkMedia from '@/lib/framework-home-media.json'
import {getMedicalProducts,getOdmProducts} from '@/lib/medical-products'
export const revalidate=60
export async function generateMetadata(){return pageMetadata("/",{title:'Medical Needles, RF Cannulas & Electrodes',description:'Brightstone Medical manufactures medical needles, RF cannulas, RF electrodes, needle tubes and stylets.',alternates:{canonical:'https://shbsmed.com/'}})}
function SeriesCard({name,image,href,note,portrait=false}:{name:string;image:string;href:string;note?:string;portrait?:boolean}){
 return <figure className={`framework-series-card ${portrait?'framework-portrait':''}`}><Link href={href}><div className="framework-series-image"><SiteImage src={image} alt={name}/></div><h3><SiteText value={name}/></h3></Link>{note&&<p className="framework-pending"><SiteText value={note}/></p>}</figure>
}
function Photo({image,label}:{image:string;label:string}){
 return <figure><SiteImage src={image} alt={label}/><figcaption><SiteText value={label}/></figcaption></figure>
}
export default async function Home(){
 const [products,odm]=await Promise.all([getMedicalProducts(),getOdmProducts()])
 const cannula=products.find(p=>p.slug==='straight-sharp-rf-cannulas')!
 const electrode=products.find(p=>p.slug==='rf-electrodes')!
 const featuredOdm=['brain-irrigation-needle','ultrasound-guided-puncture-needle','huber-needle'].flatMap(slug=>odm.filter(p=>p.slug===slug))
 return <SiteContentVersion><SiteHeader/><main className="framework-home"><HeroCarousel/>
 <Reveal as="section" className="medical-shell framework-section">
  <div className="framework-company">
   <SiteImage className="framework-company-photo" src={seed.photos[0].image} alt="Brightstone Medical company entrance"/>
   <div><h2><SiteText value="About Brightstone & Company Qualifications"/></h2><p><SiteText value="Shanghai Brightstone Medical Technology Limited"/></p><p><SiteText value="Medical needles, RF electrodes, needle tubes and stylets."/></p></div>
   <aside className="framework-pending-panel"><h3><SiteText value="Company Qualifications"/></h3><p><SiteText value="Public version and scope pending confirmation"/></p></aside>
  </div>
 </Reveal>
 <Reveal as="section" className="medical-shell framework-section">
  <h2><SiteText value="Branded Products"/></h2><div className="framework-series-grid">
   <SeriesCard name="RF Cannulas" image={cannula.image} href="/products?series=cannulas"/>
   <SeriesCard name="RF Electrodes" image={electrode.image} href="/products?series=rf-electrodes"/>
   <SeriesCard name="Anesthesia Series" image={frameworkMedia['anesthesia-historical']} href="/products?series=anesthesia" note="Historical image — current models pending confirmation"/>
  </div><div id="anesthesia-pending" className="framework-pending"><SiteText value="Anesthesia series: current models and specifications pending confirmation."/></div>
 </Reveal>
 <Reveal as="section" className="medical-shell framework-section">
  <h2><SiteText value="ODM Products"/></h2><div className="framework-series-grid">{featuredOdm.map(p=><SeriesCard key={p.slug} name={p.name} image={p.image} href={`/odm-oem/${p.slug}`} portrait note={p.slug==='huber-needle'?'Category assignment pending confirmation':undefined}/>)}</div>
 </Reveal>
 <Reveal as="section" className="medical-shell framework-section">
  <h2><SiteText value="Contract Manufacturing Components"/></h2><div className="framework-series-grid">
   <SeriesCard name="Biopsy Components" image={frameworkMedia.biopsy} href="/contract-manufacturing?series=Biopsy"/>
   <SeriesCard name="Interventional Components" image={frameworkMedia['interventional-reference']} href="/contract-manufacturing?series=Interventional" note="Framework reference image — category assignment pending confirmation"/>
   <SeriesCard name="Anesthesia Components" image={frameworkMedia['anesthesia-components']} href="/contract-manufacturing?series=Anesthesia" note="Historical image — current models pending confirmation"/>
  </div>
 </Reveal>
 <Reveal as="section" className="medical-shell framework-section">
  <h2><SiteText value="Manufacturing Technology & Equipment"/></h2><div className="framework-photo-pair">
   <Photo image={seed.photos.find(p=>p.group==='equipment')!.image} label="Processing equipment"/>
   <Photo image={seed.photos.find(p=>p.group==='production')!.image} label="Production environment"/>
  </div><p><SiteText value="Production is organized around needle structures and processing requirements. Equipment supports selected processes; assembly is mainly manual."/></p>
 </Reveal>
 <Reveal as="section" className="medical-shell framework-section">
  <h2><SiteText value="Quality Inspection"/></h2><div className="framework-photo-pair">
   <Photo image={seed.photos.filter(p=>p.group==='quality')[0].image} label="Inspection instruments"/>
   <Photo image={seed.photos.filter(p=>p.group==='quality')[1].image} label="Inspection environment"/>
  </div>
 </Reveal>
 <Reveal as="section" className="medical-shell framework-section"><div className="framework-inquiry"><h2><SiteText value="Tell us your product or manufacturing requirements"/></h2><p><SiteText value="Product purchase / ODM development / OEM private-label production / Component manufacturing"/></p><Link className="medical-button" href="/contact"><SiteText value="Contact & Orders →"/></Link></div></Reveal>
 </main><SiteFooter/></SiteContentVersion>
}
