import {jsonLd} from '@/lib/json-ld'
import {SiteText} from '@/components/site-copy'
import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import Link from '@/components/localized-link'
import {PageFrame} from '@/components/page-frame'
import {ZoomImage} from '@/components/medical-media'
import {Reveal} from '@/components/reveal'
import {getMedicalProducts} from '@/lib/medical-products'
import {pageMetadata} from '@/lib/site-content/metadata'
import {historicalProducts} from '@/lib/framework-pending-products'
import {PendingPanel} from '@/components/framework-pending'
import {productSummaries,productStructures} from '@/lib/meeting-product-copy'
import seed from '@/lib/site-seed.json'
export const dynamicParams=true
export const revalidate=60
async function find(slug:string){const p=(await getMedicalProducts()).find(p=>p.slug===slug||p.variants.some(v=>v.model.toLowerCase()===slug));return p?{...p,description:productSummaries[p.slug]||''}:undefined}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const slug=(await params).slug,historical=historicalProducts.find(p=>p.slug===slug)
 if(historical)return pageMetadata(`/products/${slug}`,{title:historical.name,description:'Historical product image. Current models and specifications pending confirmation.',robots:{index:false,follow:true}})
 const p=await find(slug);if(!p)return{}
 return pageMetadata(`/products/${p.slug}`,{title:p.name,description:p.description,openGraph:{title:p.name,description:p.description,images:[p.image]}})
}
const compatibilityNote='The electrode source lists L-suffix cannulas, while the supplied side-port table lists Y-suffix models. Compatibility between these model numbers remains to be confirmed.'
export default async function Detail({params}:{params:Promise<{slug:string}>}){
 const slug=(await params).slug,historical=historicalProducts.find(p=>p.slug===slug)
 if(historical)return <PageFrame eyebrow="Products" title={historical.name} description="Historical image — current models, specifications and compatibility pending confirmation.">
  <Reveal as="section" className="medical-shell product-detail-grid"><ZoomImage src={historical.image} alt={historical.name}/><div><PendingPanel title="Current product information">Historical image — current models, specifications, matching products and product details pending confirmation.</PendingPanel><Link className="medical-button mt-8" href={`/contact?product=${historical.slug}`}><SiteText value="Inquire About This Product →"/></Link><p className="mt-6"><Link href={`/products?series=${historical.series}`}><SiteText value="Back to product series →"/></Link></p></div></Reveal>
 </PageFrame>
 const p=await find(slug);if(!p)notFound()
 const electrode=p.slug==='rf-electrodes',structureImage=electrode?seed.electrodeStructure:p.tipImage
 return <PageFrame eyebrow="Products / Pain Management" title={p.name} description={p.description}>
  <Reveal as="section" className="medical-shell product-detail-grid">
   <div className="product-stage"><ZoomImage src={p.image} alt={p.name}/></div>
   <div><p className="eyebrow"><SiteText value="Product overview"/></p><h2 className="text-3xl font-semibold"><SiteText value={electrode?'RF electrode configurations':'Tip structure and dimensions'}/></h2>
    <p className="medical-intro"><SiteText value={p.description}/></p>
    <Link className="medical-button" href={`/contact?product=${p.slug}`}><SiteText value="Inquire About This Product →"/></Link>
   </div>
  </Reveal>
  <Reveal as="section" className="medical-shell medical-section product-structure-section">
   <h2><SiteText value="Structure & Configuration"/></h2>
   <div className="product-structure-grid">
    {structureImage&&<figure className="product-structure-photo"><ZoomImage src={structureImage} alt={electrode?'RF electrode working end and connection end':`${p.name} tip structure`}/><figcaption><SiteText value={electrode?'Working end and connection end':'Tip structure'}/></figcaption></figure>}
    <div><ul className="list-disc space-y-3 pl-5 leading-relaxed">{(productStructures[p.slug]||[]).map(text=><li key={text}><SiteText value={text}/></li>)}</ul>
     {p.slug==='side-port-rf-cannulas'&&<PendingPanel title="Compatibility confirmation">{compatibilityNote}</PendingPanel>}
    </div>
   </div>
  </Reveal>
  <section className="medical-light"><Reveal as="section" className="medical-shell medical-section">
   <p className="eyebrow"><SiteText value="Models & dimensions"/></p><h2><SiteText value="Product specifications"/></h2>
   <div className="spec-scroll" tabIndex={0} aria-label="Product specification table"><table className="medical-specs"><thead><tr><th><SiteText value="Model"/></th><th><SiteText value="Gauge"/></th><th><SiteText value="Effective length"/></th>{!electrode&&<th><SiteText value="Active tip length"/></th>}<th><SiteText value={electrode?'Length color code':'Gauge color code'}/></th><th><SiteText value="MOQ"/></th></tr></thead>
    <tbody>{p.variants.map(v=><tr key={v.model} id={v.model.toLowerCase()}><td>{v.model}</td><td>{v.gauge}</td><td>{v.length}</td>{!electrode&&<td>{v.activeTip}</td>}<td>{v.color}</td><td>{v.moq}</td></tr>)}</tbody>
   </table></div>
   {electrode&&<div className="medical-copy-panel"><h3><SiteText value="Electrode and cannula compatibility"/></h3><p><SiteText value="RE2750-BM, RE27100-BM and RE27150-BM are used with RF cannulas of the same effective length."/></p><p><SiteText value="RE27100B-BM: RC201010L-BM or RC181010L-BM only."/><br/><SiteText value="RE27150B-BM: RC201510L-BM or RC181510L-BM only."/></p><PendingPanel title="Compatibility confirmation">{compatibilityNote}</PendingPanel></div>}
   <p className="mt-8"><Link href="/products?series=pain"><SiteText value="Back to product series →"/></Link></p>
  </Reveal></section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd({'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description,image:p.image,url:`https://shbsmed.com/products/${p.slug}`,manufacturer:{'@id':'https://shbsmed.com/#organization'}})}}/>
 </PageFrame>
}
