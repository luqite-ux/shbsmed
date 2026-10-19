"use client"
import Link from '@/components/localized-link'
import {useState} from 'react'
import {ArrowUpRight} from 'lucide-react'
import {Reveal} from '@/components/reveal'
type Item={slug:string;name:string;image:string;description?:string;variants?:unknown[]}
export function MedicalCards({items,base='/products',portrait=false}:{items:Item[];base?:string;portrait?:boolean}){
 return <div className="medical-grid">{items.map((p,i)=><Reveal key={p.slug} delay={(i%3)*70}><Link className={`medical-card ${portrait?'portrait':''} ${base==='/contract-manufacturing'?'component-photo':''}`} href={`${base}/${p.slug}`}><div className="medical-card-image"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="medical-card-text"><h3>{p.name}</h3><ArrowUpRight size={21}/></div>{p.description&&<p className="medical-card-description">{p.description}</p>}</Link></Reveal>)}</div>
}
export function ProductSeries({items}:{items:Item[]}){
 const [selected,setSelected]=useState('all')
 return <><div className="series-tabs" aria-label="RF product series">{[{slug:'all',name:'All RF Products'},{slug:'cannulas',name:'RF Cannulas'},{slug:'rf-electrodes',name:'RF Electrodes'}].map(x=><button key={x.slug} aria-pressed={selected===x.slug} onClick={()=>setSelected(x.slug)}>{x.name}</button>)}</div><MedicalCards items={items.filter(x=>selected==='all'||(selected==='cannulas'?x.slug!=='rf-electrodes':x.slug===selected))}/></>
}
