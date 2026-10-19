import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText,SiteImage} from '@/components/site-copy'
import {PageFrame} from '@/components/page-frame'
import {ProductSeries} from '@/components/medical-catalog'
import {Reveal} from '@/components/reveal'
import {InquiryBand} from '@/components/medical-sections'
import seed from '@/lib/site-seed.json'
import {ElectrodeOverview} from '@/components/electrode-overview'
import {getMedicalProducts} from '@/lib/medical-products'
export const revalidate=60
export async function generateMetadata(){return pageMetadata("/products",{title:'RF Products for Pain Management',description:'Compare RF cannulas by tip structure and RF electrodes by configuration. View product images and complete specification tables.',alternates:{canonical:'https://shbsmed.com/products'}})}
export default async function Products(){const products=await getMedicalProducts();return <PageFrame eyebrow="Products" title="RF products for pain management" description="Choose a product series. View the product, then compare the available model specifications."><Reveal as="section" className="medical-shell medical-section"><ProductSeries items={products}/></Reveal><section className="medical-light"><Reveal as="section" className="medical-shell medical-split"><SiteImage src={seed.neuron} alt="Illustration of nerve cells"/><div><p className="eyebrow"><SiteText value={"Application"}/></p><h2 className="text-3xl font-semibold"><SiteText value={"Designed for RF pain-management procedures"}/></h2><p className="medical-intro"><SiteText value={"RF cannulas and electrodes are used together with an RF generator for procedures involving thermocoagulation, neuromodulation or intervertebral disc tissue ablation. Product configuration and connection requirements must be reviewed for the intended use."}/></p></div></Reveal></section><ElectrodeOverview/><InquiryBand/></PageFrame>}
