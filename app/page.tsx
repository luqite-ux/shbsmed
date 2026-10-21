import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText,SiteContentVersion,SiteImage} from '@/components/site-copy'
import Link from '@/components/localized-link'
import {HeroCarousel} from '@/components/hero-carousel'
import {SiteHeader} from '@/components/site-header'
import {SiteFooter} from '@/components/site-footer'
import {Reveal} from '@/components/reveal'
import {AboutContent,OemContent,ComponentContent} from '@/components/meeting-sections'
import {getMedicalProducts,getOdmProducts,getContractComponents} from '@/lib/medical-products'
import {historicalProducts} from '@/lib/framework-pending-products'
import {getPublishedArticles} from '@/lib/articles-db'
import {NewsList} from '@/components/news-list'
export const revalidate=60
export async function generateMetadata(){return pageMetadata('/',{title:'Medical Needles, OEM & Needle Components',description:'Branded medical needles, OEM finished products and needle-component manufacturing from Brightstone Medical.'})}
export default async function Home(){
 const [products,oem,parts,articles]=await Promise.all([getMedicalProducts(),getOdmProducts(),getContractComponents(),getPublishedArticles()])
 const groups=[{slug:'pain',name:'Pain Management Series',image:products.find(p=>p.slug==='rf-electrodes')?.image||''},...historicalProducts.map(p=>({slug:p.series,name:p.series==='spinal'?'Spinal Anesthesia Series':'Epidural Anesthesia Series',image:p.image}))]
 return <SiteContentVersion><SiteHeader/><main className="framework-home"><HeroCarousel/>
 <section className="medical-shell framework-section" data-business="about"><Reveal><h2><SiteText value="About Us"/></h2></Reveal><AboutContent/></section>
 <section className="medical-shell framework-section" data-business="branded"><Reveal><h2><SiteText value="Branded Products"/></h2><p className="medical-intro"><SiteText value="Explore our pain management, spinal anesthesia and epidural anesthesia product series."/></p></Reveal><div className="framework-series-grid">{groups.map(g=><Reveal as="figure" className="framework-series-card" key={g.slug}><Link href={`/products?series=${g.slug}`}><div className="framework-series-image"><SiteImage src={g.image} alt={g.name}/></div><h3><SiteText value={g.name}/></h3></Link></Reveal>)}</div></section>
 <section className="medical-shell framework-section" data-business="oem"><Reveal><h2><SiteText value="OEM"/></h2></Reveal><OemContent items={oem}/></section>
 <section className="medical-shell framework-section" data-business="components"><Reveal><h2><SiteText value="Component Manufacturing"/></h2></Reveal><ComponentContent items={parts}/></section>
 <section className="medical-shell framework-section" data-business="news"><Reveal><h2><SiteText value="News"/></h2></Reveal><NewsList articles={articles} compact/><Link className="medical-button mt-6" href="/news"><SiteText value="View News →"/></Link></section>
 </main><SiteFooter/></SiteContentVersion>
}
