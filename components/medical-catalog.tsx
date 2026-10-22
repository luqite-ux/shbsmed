import Link from '@/components/localized-link'
import {ArrowUpRight} from 'lucide-react'
import {Reveal} from '@/components/reveal'
import {SiteText} from '@/components/site-copy'
import {PendingNote} from '@/components/framework-pending'
import {historicalProducts} from '@/lib/framework-pending-products'
import {productSummaries} from '@/lib/meeting-product-copy'
type Item={slug:string;name:string;image:string;description?:string;variants?:unknown[];pending?:string}
export const productSeries=[{slug:'pain',name:'Pain Management Series'},{slug:'spinal',name:'Spinal Anesthesia Series'},{slug:'epidural',name:'Epidural Anesthesia Series'}]
export function MedicalCards({items,base='/products',portrait=false}:{items:Item[];base?:string;portrait?:boolean}){return <div className="medical-grid">{items.map((p,i)=><Reveal key={p.slug} delay={(i%3)*70}><Link className={`medical-card ${portrait?'portrait':''} ${base==='/contract-manufacturing'?'component-photo':''}`} href={`${base}/${p.slug}`}><div className="medical-card-image"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="medical-card-text"><h3>{p.name}</h3><ArrowUpRight size={21}/></div>{p.variants&&<p className="medical-card-description">{p.variants.length} <SiteText value="models"/></p>}{p.description&&<p className="medical-card-description"><SiteText value={p.description}/></p>}{p.pending&&<PendingNote>{p.pending}</PendingNote>}</Link></Reveal>)}</div>}
export const rfMarketAccess='Single-use RF electrodes and RF cannulas with market-access certificates for China, the United States and Europe.'
function PainProducts({items}:{items:Item[]}){
 const order=Object.keys(productSummaries)
 const shown=items.filter(p=>order.includes(p.slug)).sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug)).map(p=>({...p,description:productSummaries[p.slug]}))
 return <div className="pain-product-groups">
  <p className="medical-intro"><SiteText value={rfMarketAccess}/></p>
  <div className="pain-electrode-group" data-pain-group="electrodes">
   <h4><SiteText value="Single-use RF Electrodes"/></h4>
   <MedicalCards items={shown.filter(p=>p.slug==='rf-electrodes')}/>
  </div>
  <div className="pain-cannula-group" data-pain-group="cannulas">
   <h4><SiteText value="Single-use RF Cannulas — Four Tip Structures"/></h4>
   <MedicalCards items={shown.filter(p=>p.slug!=='rf-electrodes')}/>
  </div>
 </div>
}
function AnesthesiaProducts({series}:{series:string}){return <MedicalCards items={historicalProducts.filter(p=>p.series===series).map(p=>({...p,pending:'Current specifications and structure details pending confirmation.'}))}/>}
export function HomeProductSeries({items}:{items:Item[]}){return <div>{productSeries.map(series=><section className="meeting-about-block" key={series.slug} data-product-series={series.slug}><h3 className="mb-6 text-2xl font-semibold"><Link href={`/products?series=${series.slug}`}><SiteText value={series.name}/></Link></h3>{series.slug==='pain'?<PainProducts items={items}/>:<AnesthesiaProducts series={series.slug}/>}</section>)}</div>}
export function ProductSeries({items,selected='pain'}:{items:Item[];selected?:string}){
 const series=productSeries.some(s=>s.slug===selected)?selected:selected==='anesthesia'?'spinal':'pain'
 return <><nav className="series-tabs" aria-label="Product series">{productSeries.map(s=><Link key={s.slug} href={`/products?series=${s.slug}`} aria-current={s.slug===series?'page':undefined}><SiteText value={s.name}/></Link>)}</nav><h2 className="mb-8"><SiteText value={productSeries.find(s=>s.slug===series)!.name}/></h2>{series==='pain'?<PainProducts items={items}/>:<AnesthesiaProducts series={series}/>}</>
}
