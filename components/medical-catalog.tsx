import Link from '@/components/localized-link'
import {ArrowUpRight} from 'lucide-react'
import {Reveal} from '@/components/reveal'
import {SiteText} from '@/components/site-copy'
import {brandedSeries} from '@/lib/site-navigation'
type Item={slug:string;name:string;image:string;description?:string;variants?:unknown[];pending?:string}
export const productSeries=brandedSeries
export function MedicalCards({items,base='/products',portrait=false}:{items:Item[];base?:string;portrait?:boolean}){return <div className="medical-grid feedback-product-grid">{items.map((p,i)=><Reveal key={p.slug} delay={(i%3)*70}><Link className={`medical-card ${portrait?'portrait':''}`} href={`${base}/${p.slug}`}><div className="medical-card-image"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="medical-card-text"><h3>{p.name}</h3><ArrowUpRight size={21}/></div></Link></Reveal>)}</div>}
export function itemsInSeries(items:Item[],series:string){return items.filter(item=>series==='cannulas'?item.slug.includes('cannula'):series==='probes'?item.slug.includes('probe'):item.slug==='rf-electrodes'||item.slug.includes('electrode-set'))}
function SeriesItems({items,series}:{items:Item[];series:string}){const shown=itemsInSeries(items,series);return shown.length?<MedicalCards items={shown}/>:<p className="medical-intro"><SiteText value="Please contact us to discuss your requirements."/></p>}
export function HomeProductSeries({items}:{items:Item[]}){return <div>{productSeries.map(series=><section className="feedback-series-section" key={series.slug} data-product-series={series.slug}><h3 className="mb-6 text-2xl font-semibold"><Link href={`/products?series=${series.slug}`}><SiteText value={series.name}/></Link></h3><SeriesItems items={items} series={series.slug}/></section>)}</div>}
export function ProductSeries({items,selected='electrode-sets'}:{items:Item[];selected?:string}){const series=productSeries.find(s=>s.slug===selected)||productSeries[0];return <><nav className="series-tabs" aria-label="Product series">{productSeries.map(s=><Link key={s.slug} href={`/products?series=${s.slug}`} aria-current={s.slug===series.slug?'page':undefined}><SiteText value={s.name}/></Link>)}</nav><h2 className="mb-8"><SiteText value={series.name}/></h2><SeriesItems items={items} series={series.slug}/></>}
