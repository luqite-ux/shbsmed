import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText} from '@/components/site-copy'
import {PageFrame} from '@/components/page-frame'
import {MedicalCards} from '@/components/medical-catalog'
import {Reveal} from '@/components/reveal'
import {PendingNote} from '@/components/framework-pending'
import {getOdmProducts} from '@/lib/medical-products'
export async function generateMetadata(){return pageMetadata("/odm-oem",{title:'ODM / OEM Medical Needle Manufacturing',description:'Explore medical needle designs for ODM development and learn about private-label OEM production with Brightstone Medical.',alternates:{canonical:'https://shbsmed.com/odm-oem'}})}
export default async function Odm(){const products=await getOdmProducts();return <PageFrame eyebrow="ODM / OEM" title="Finished needle products & private-label manufacturing" description="Product images and names are available for review. Detailed information will be added when confirmed."><Reveal as="section" className="medical-shell medical-section"><h2><SiteText value="ODM Products"/></h2><PendingNote>ODM category assignments for the products below are pending confirmation.</PendingNote><MedicalCards items={products.map(p=>({...p,pending:'Category assignment pending confirmation'}))} base="/odm-oem" portrait/><div className="medical-copy-panel" id="oem"><h2><SiteText value={"OEM private-label manufacturing"}/></h2><p><SiteText value={"We accept private-label manufacturing for customers who hold the required market-access certificates for their country or region. Products shown in our product catalogue or ODM range can be discussed for OEM cooperation."}/></p><p><SiteText value="Specific requirements are confirmed for each project."/></p></div></Reveal></PageFrame>}
