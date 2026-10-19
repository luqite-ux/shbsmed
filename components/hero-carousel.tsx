"use client"

import {SiteText,SiteImage} from '@/components/site-copy'
import Link from '@/components/localized-link'
import { useEffect, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import seed from "@/lib/site-seed.json"
export function HeroCarousel({slides=seed.slides}:{slides?:typeof seed.slides}) {
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[reduced,setReduced]=useState(true)
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');setReduced(q.matches);const f=()=>setReduced(q.matches);q.addEventListener('change',f);return()=>q.removeEventListener('change',f)},[])
 useEffect(()=>{if(paused||reduced)return;const t=setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%slides.length)},7000);return()=>clearInterval(t)},[paused,reduced,slides.length])
 const active=slides[index]
 return <section aria-label="Brightstone Medical highlights" aria-roledescription="carousel" className={`medical-hero ${active.theme==='dark'?'hero-dark':'hero-light'}`} onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocus={()=>setPaused(true)}>
  <div className="hero-stage">
   {slides.map((s,i)=><SiteImage key={s.id} src={s.image} alt="" aria-hidden={index!==i} fetchPriority={i===0?'high':'auto'} className={`hero-image ${index===i?'active':''}`} style={{objectPosition:s.focus}}/>) }
   <div key={active.id} className={`hero-copy hero-copy-${active.side} hero-copy-${active.id}`} data-slide-copy={active.id}>
    <p className="eyebrow"><SiteText value={"Brightstone Medical"}/></p><h1><SiteText value={active.heading}/></h1><p className="hero-description"><SiteText value={active.description}/></p>
    <Link className="medical-button" href={active.href}><SiteText value={active.cta}/><ArrowRight size={17}/></Link>
   </div>
  </div>
  <div className="hero-controls"><div className="flex items-center gap-2">{slides.map((s,i)=><button key={s.id} onClick={()=>{setIndex(i);setPaused(true)}} aria-label={`Show Banner ${i+1}`} aria-current={index===i?'true':undefined} className={`hero-dot ${index===i?'active':''}`}/>)}</div><div className="flex gap-1"><button aria-label="Previous Banner" onClick={()=>{setIndex(i=>(i+slides.length-1)%slides.length);setPaused(true)}}><ChevronLeft size={18}/></button><button aria-label={paused?'Play Banners':'Pause Banners'} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button aria-label="Next Banner" onClick={()=>{setIndex(i=>(i+1)%slides.length);setPaused(true)}}><ChevronRight size={18}/></button></div></div>
 </section>
}
