"use client"
import {useEffect,useState} from 'react'
import {ChevronLeft,ChevronRight,Pause,Play} from 'lucide-react'
import {SiteText} from '@/components/site-copy'
import banners from '@/lib/feedback-banners.json'
export const BANNER_INTERVAL_MS=14000
export function HeroCarousel({slides=banners}:{slides?:typeof banners}){
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(false),[reduced,setReduced]=useState(true),[hovered,setHovered]=useState(false),[focused,setFocused]=useState(false)
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');setReduced(q.matches);const f=()=>setReduced(q.matches);q.addEventListener('change',f);return()=>q.removeEventListener('change',f)},[])
 useEffect(()=>{if(paused||reduced||hovered||focused||slides.length<2)return;const t=setInterval(()=>{if(!document.hidden)setIndex(i=>(i+1)%slides.length)},BANNER_INTERVAL_MS);return()=>clearInterval(t)},[paused,reduced,hovered,focused,slides.length])
 const move=(step:number)=>{setIndex(i=>(i+step+slides.length)%slides.length);setPaused(true)}
 return <section aria-label="Brightstone Medical highlights" aria-roledescription="carousel" className="feedback-hero" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocus={()=>setFocused(true)} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setFocused(false)}}><div className="feedback-hero-stage">{slides.map((slide,i)=><div key={slide.id} className={`feedback-slide feedback-slide-${slide.id} ${i===index?'active':''}`} aria-hidden={i!==index} data-banner={i+1}><img className="banner-with-copy" src={slide.id==='brand'?slide.mobileImage:slide.image} alt={slide.id==='brand'?'':slide.heading} fetchPriority={i===0?'high':'auto'}/><img className="banner-mobile-art" src={slide.mobileImage} alt=""/><div className="banner-mobile-copy">{i===0?<h1><SiteText value={slide.heading}/></h1>:<p><SiteText value={slide.heading}/></p>}</div></div>)}</div><button className="banner-side banner-previous" type="button" aria-label="Previous Banner" onClick={()=>move(-1)}><ChevronLeft/></button><button className="banner-side banner-next" type="button" aria-label="Next Banner" onClick={()=>move(1)}><ChevronRight/></button><div className="banner-bottom"><span aria-live="polite">{index+1} / {slides.length}</span><button type="button" aria-label={paused?'Play Banners':'Pause Banners'} onClick={()=>setPaused(p=>!p)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button></div></section>
}
