"use client"

import {SiteText,SiteImage,useSiteVideo} from '@/components/site-copy'
import {useEffect,useRef,useState} from 'react'
import {Dialog,DialogContent,DialogTitle,DialogTrigger} from '@/components/ui/dialog'
export function ZoomImage({src,alt,className='',quarterTurn=false}:{src:string;alt:string;className?:string;quarterTurn?:boolean}){
 return <Dialog><DialogTrigger asChild><button type="button" className={`zoom-image ${className} ${quarterTurn?'quarter-turn':''}`} aria-label={`Enlarge ${alt}`}><SiteImage src={src} alt={alt} loading="lazy" onLoad={event=>{const image=event.currentTarget;if(image.naturalHeight)image.closest('figure')?.style.setProperty('--photo-ratio',String(image.naturalWidth/image.naturalHeight))}}/></button></DialogTrigger><DialogContent className="max-w-[94vw] sm:max-w-5xl"><DialogTitle className="sr-only">{alt}</DialogTitle>{quarterTurn?<div className="quarter-turn-dialog"><SiteImage src={src} alt={alt}/></div>:<SiteImage className="max-h-[82vh] w-full object-contain" src={src} alt={alt}/>}</DialogContent></Dialog>
}
export function ProcessVideo({src,poster,title}:{src:string;poster:string;title:string}){
 const configured=useSiteVideo(src);src=configured?.src||src;poster=configured?.poster||poster;title=configured?.title||title
 const ref=useRef<HTMLVideoElement>(null);const [failed,setFailed]=useState(false)
 useEffect(()=>setFailed(false),[src])
 useEffect(()=>{const v=ref.current;if(!v)return;const q=matchMedia('(prefers-reduced-motion: reduce)');let inView=false;const sync=()=>{const saveData=(navigator as Navigator&{connection?:{saveData?:boolean}}).connection?.saveData;if(!inView||document.hidden||q.matches||saveData)v.pause();else v.play().catch(()=>{})};if(typeof IntersectionObserver==='undefined')return;const io=new IntersectionObserver(entries=>{for(const e of entries){inView=e.isIntersecting;sync()}},{threshold:.45});io.observe(v);document.addEventListener('visibilitychange',sync);q.addEventListener('change',sync);return()=>{io.disconnect();v.pause();document.removeEventListener('visibilitychange',sync);q.removeEventListener('change',sync)}},[src,failed])
 return <figure><div className="process-video">{failed?<SiteImage src={poster} alt={title}/>:<video ref={ref} src={src} poster={poster} controls muted playsInline loop preload="none" onError={()=>setFailed(true)} aria-label={title}/>}</div><figcaption className="mt-4 font-medium"><SiteText value={title}/></figcaption></figure>
}
