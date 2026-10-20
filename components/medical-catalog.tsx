"use client"
import Link from '@/components/localized-link'
import {useState,useEffect} from 'react'
import {ArrowUpRight} from 'lucide-react'
import {Reveal} from '@/components/reveal'
import {SiteText} from '@/components/site-copy'
import {PendingNote,PendingPanel} from '@/components/framework-pending'
import {historicalProducts} from '@/lib/framework-pending-products'
import seed from '@/lib/site-seed.json'
type Item={slug:string;name:string;image:string;description?:string;variants?:unknown[];pending?:string}
export function MedicalCards({items,base='/products',portrait=false}:{items:Item[];base?:string;portrait?:boolean}){
 return <div className="medical-grid">{items.map((p,i)=><Reveal key={p.slug} delay={(i%3)*70}><Link className={`medical-card ${portrait?'portrait':''} ${base==='/contract-manufacturing'?'component-photo':''}`} href={`${base}/${p.slug}`}><div className="medical-card-image"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="medical-card-text"><h3>{p.name}</h3><ArrowUpRight size={21}/></div>{p.variants&&<p className="medical-card-description">{p.variants.length} <SiteText value="models"/></p>}{p.description&&<p className="medical-card-description">{p.description}</p>}{p.pending&&<PendingNote>{p.pending}</PendingNote>}</Link></Reveal>)}</div>
}
export function ProductSeries({items}:{items:Item[]}){
 const [selected,setSelected]=useState('all')
 useEffect(()=>{const series=new URLSearchParams(window.location.search).get('series');if(series&&['cannulas','rf-electrodes','anesthesia'].includes(series))setSelected(series)},[])
 const order=['straight-sharp-rf-cannulas','curved-sharp-rf-cannulas','curved-blunt-rf-cannulas','side-port-rf-cannulas','rf-electrodes']
 const pain=items.slice().sort((a,b)=>order.indexOf(a.slug)-order.indexOf(b.slug)).filter(x=>selected==='all'||(selected==='cannulas'?x.slug!=='rf-electrodes':x.slug===selected))
 const historical=historicalProducts.filter(p=>p.series===(selected==='anesthesia'?'anesthesia':'pain')).map(p=>({...p,pending:'Historical image — current models, specifications and compatibility pending confirmation'}))
 return <><div className="series-tabs" role="group" aria-label="Product series">{[{slug:'all',name:'Pain Management'},{slug:'anesthesia',name:'Anesthesia'}].map(x=><button key={x.slug} aria-pressed={x.slug==='all'?selected!=='anesthesia':selected===x.slug} onClick={()=>setSelected(x.slug)}><SiteText value={x.name}/></button>)}</div>
 {selected==='anesthesia'?<><MedicalCards items={historical}/><div className="grid gap-6 md:grid-cols-2 mt-8"><PendingPanel title="Combined Anesthesia Products">Combination image, component products and specifications pending confirmation.</PendingPanel><PendingPanel title="Needle-tip Structures">Quincke and Sprotte structures: product classification and corresponding images pending confirmation.</PendingPanel></div><PendingNote>The Epidural Treatment Needle shown under ODM is a separate product. It does not replace the historical Epidural Anesthesia Needle shown here.</PendingNote></>:<><h2 className="mb-8"><SiteText value="RF Products for Pain Management"/></h2><MedicalCards items={[...pain,...(selected==='cannulas'?[]:historical)]}/><div className="medical-split mt-10"><img src={seed.neuron} alt="Illustration of nerve cells" loading="lazy"/><p><SiteText value="View the product image and name, then open the detail page for the enlarged image, structure and specifications."/></p></div></>}</>
}
