import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText} from '@/components/site-copy'
import {PageFrame} from '@/components/page-frame'
import {MedicalCards} from '@/components/medical-catalog'
import {Reveal} from '@/components/reveal'
import {Cooperation,InquiryBand} from '@/components/medical-sections'
import {getOdmProducts} from '@/lib/medical-products'
export async function generateMetadata(){return pageMetadata("/odm-oem",{title:'ODM / OEM Medical Needle Manufacturing',description:'Explore medical needle designs for ODM development and learn about private-label OEM production with Brightstone Medical.',alternates:{canonical:'https://shbsmed.com/odm-oem'}})}
export default async function Odm(){const products=await getOdmProducts();return <PageFrame eyebrow="ODM / OEM" title="Medical needle development and private-label production" description="Explore finished needle designs for your development program. Contact our team to discuss your product requirements."><Reveal as="section" className="medical-shell medical-section"><p className="eyebrow"><SiteText value={"ODM products"}/></p><h2><SiteText value={"Explore medical needle designs"}/></h2><MedicalCards items={products} base="/odm-oem" portrait/><div className="medical-copy-panel" id="oem"><h2><SiteText value={"OEM private-label manufacturing"}/></h2><p><SiteText value={"We accept private-label manufacturing for customers who hold the required market-access certificates for their country or region. Products shown in our product catalogue or ODM range can be discussed for OEM cooperation."}/></p><p><SiteText value={"Contact us with the intended product and market requirements."}/></p></div></Reveal><section className="medical-light"><Cooperation/></section><InquiryBand/></PageFrame>}
