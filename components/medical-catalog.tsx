import Link from '@/components/localized-link'
import {ArrowUpRight} from 'lucide-react'
import {Reveal} from '@/components/reveal'
import {SiteText} from '@/components/site-copy'
import {PendingNote} from '@/components/framework-pending'
import {historicalProducts} from '@/lib/framework-pending-products'
import {productDescriptions} from '@/lib/meeting-product-copy'
type Item={slug:string;name:string;image:string;description?:string;variants?:unknown[];pending?:string}
export const productSeries=[{slug:'pain',name:'Pain Management Series'},{slug:'spinal',name:'Spinal Anesthesia Series'},{slug:'epidural',name:'Epidural Anesthesia Series'}]
export function MedicalCards({items,base='/products',portrait=false}:{items:Item[];base?:string;portrait?:boolean}){return <div className="medical-grid">{items.map((p,i)=><Reveal key={p.slug} delay={(i%3)*70}><Link className={`medical-card ${portrait?'portrait':''} ${base==='/contract-manufacturing'?'component-photo':''}`} href={`${base}/${p.slug}`}><div className="medical-card-image"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="medical-card-text"><h3>{p.name}</h3><ArrowUpRight size={21}/></div>{p.variants&&<p className="medical-card-description">{p.variants.length} <SiteText value="models"/></p>}{p.description&&<p className="medical-card-description">{p.description}</p>}{p.pending&&<PendingNote>{p.pending}</PendingNote>}</Link></Reveal>)}</div>}
export function ProductSeries({items,selected='pain'}:{items:Item[];selected?:string}){
 const series=productSeries.some(s=>s.slug===selected)?selected:selected==='anesthesia'?'spinal':'pain'
 const order=['rf-electrodes','straight-sharp-rf-cannulas','curved-sharp-rf-cannulas','curved-blunt-rf-cannulas','side-port-rf-cannulas']
 const shown=series==='pain'?items.filter(p=>order.includes(p.slug)).map(p=>({...p,description:productDescriptions[p.slug]?.split('. ')[0]+'.'})).sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug)):historicalProducts.filter(p=>p.series===series).map(p=>({...p,pending:'Current specifications and structure details pending confirmation.'}))
 return <><nav className="series-tabs" aria-label="Product series">{productSeries.map(s=><Link key={s.slug} href={`/products?series=${s.slug}`} aria-current={s.slug===series?'page':undefined}><SiteText value={s.name}/></Link>)}</nav><h2 className="mb-8"><SiteText value={productSeries.find(s=>s.slug===series)!.name}/></h2>{series==='pain'&&<p className="medical-intro"><SiteText value="Single-use RF electrodes and RF cannulas. Market-access documentation for China, the United States and Europe applies to the corresponding products; certificate versions and scope are being confirmed for display."/></p>}<MedicalCards items={shown}/></>
}
