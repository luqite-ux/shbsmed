import {pageMetadata} from '@/lib/site-content/metadata'
import {SiteText} from '@/components/site-copy'
import {PageFrame} from '@/components/page-frame'
import {ComponentSeries} from '@/components/component-series'
import {Reveal} from '@/components/reveal'
import {PhotoGroup,InquiryBand} from '@/components/medical-sections'
import seed from '@/lib/site-seed.json'
import {getContractComponents} from '@/lib/medical-products'
import {MedicalCards} from '@/components/medical-catalog'
export async function generateMetadata(){return pageMetadata("/contract-manufacturing",{title:'Needle Tube & Stylet Contract Manufacturing',description:'Explore needle tubes, stylets, biopsy components, tip structures, tube-end processing and echogenic surfaces.',alternates:{canonical:'https://shbsmed.com/contract-manufacturing'}})}
export default async function Contract(){const parts=await getContractComponents();return <PageFrame eyebrow="Contract manufacturing" title="Needle tubes, stylets and related components" description="Select a component series. Finished ODM products are shown separately under ODM / OEM."><Reveal as="section" className="medical-shell medical-section"><ComponentSeries parts={parts}/><div className="medical-copy-panel"><h2><SiteText value={"Custom needle-component manufacturing"}/></h2><p><SiteText value={"We support component manufacturing from drawings or samples. Please specify the material, dimensions, tip structure, surface requirements and quantity."}/></p></div><PhotoGroup items={seed.photos.filter(p=>['Semi-finished needle tubes','Semi-finished needle assemblies'].includes(p.title))}/></Reveal><InquiryBand/></PageFrame>}
