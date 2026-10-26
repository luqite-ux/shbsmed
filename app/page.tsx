import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText,SiteContentVersion,SiteImage} from '@/components/site-copy'
import Link from '@/components/localized-link'
import {HeroCarousel} from '@/components/hero-carousel'
import {SiteHeader} from '@/components/site-header'
import {SiteFooter} from '@/components/site-footer'
import {Reveal} from '@/components/reveal'
import {AboutContent,OemContent,ComponentContent} from '@/components/meeting-sections'
import {getMedicalProducts,getOdmProducts,getContractComponents} from '@/lib/medical-products'
import {HomeProductSeries} from '@/components/medical-catalog'
import {getPublishedArticles} from '@/lib/articles-db'
import {NewsList} from '@/components/news-list'
export const revalidate=60
export async function generateMetadata(){return pageMetadata('/',{title:'Medical Needles, OEM & Needle Components',description:'Branded medical needles, OEM finished products and needle-component manufacturing from Brightstone Medical.'})}
export default async function Home(){
 const [products,oem,parts,articles]=await Promise.all([getMedicalProducts(),getOdmProducts(),getContractComponents(),getPublishedArticles()])
 return <SiteContentVersion><SiteHeader/><main className="framework-home"><HeroCarousel/>
 <section className="medical-shell framework-section" data-business="about"><Reveal><h2><SiteText value="About Us"/></h2></Reveal><AboutContent includeManufacturing={false}/></section>
 <section className="medical-shell framework-section" data-business="branded"><Reveal><h2><SiteText value="Branded Products"/></h2></Reveal><HomeProductSeries items={products}/></section>
 <section className="medical-shell framework-section" data-business="oem"><Reveal><h2><SiteText value="OEM Manufacturing"/></h2></Reveal><OemContent items={oem}/></section>
 <section className="medical-shell framework-section" data-business="components"><Reveal><h2><SiteText value="Core Component Manufacturing"/></h2></Reveal><ComponentContent items={parts} showProductionPhoto={false}/></section>
 <section className="medical-shell framework-section" data-business="news"><Reveal><h2><SiteText value="Information"/></h2></Reveal><NewsList articles={articles} compact/><Link className="medical-button mt-6" href="/news"><SiteText value="View Information →"/></Link></section>
 </main><SiteFooter/></SiteContentVersion>
}
