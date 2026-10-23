"use client"
import {SiteText} from '@/components/site-copy'
import Link from '@/components/localized-link'
import {useEffect,useState,useRef,useCallback,useId} from 'react'
import {usePathname} from 'next/navigation'
import {Menu,X} from 'lucide-react'
import {BrandLogo} from '@/components/brand-logo'
type Entry={label:string;href:string;children?:Entry[]}
export const navigation:Entry[]=[
 {label:'Home',href:'/'},
 {label:'About Us',href:'/about',children:[
  {label:'Company Introduction',href:'/about#company-introduction'},
  {label:'Qualifications',href:'/about#qualifications'},
  {label:'Manufacturing Equipment & Inspection Instruments',href:'/about#manufacturing-inspection'},
 ]},
 {label:'Branded Products',href:'/products',children:[
  {label:'Pain Management Series',href:'/products?series=pain',children:[
   {label:'Single-use RF Electrodes',href:'/products?series=pain#electrodes'},
   {label:'Single-use RF Cannulas',href:'/products?series=pain#cannulas'},
  ]},
  {label:'Spinal Anesthesia Series',href:'/products?series=spinal',children:[
   {label:'Spinal Anesthesia Needle',href:'/products/spinal-anesthesia-needle'},
  ]},
  {label:'Epidural Anesthesia Series',href:'/products?series=epidural',children:[
   {label:'Epidural Anesthesia Needle',href:'/products/epidural-anesthesia-needle'},
  ]},
 ]},
 {label:'OEM',href:'/odm-oem'},
 {label:'Component Manufacturing',href:'/contract-manufacturing'},
 {label:'Information',href:'/news',children:[
  {label:'Industry Information',href:'/news?category=industry'},
  {label:'Corporate Information',href:'/news?category=company'},
  {label:'Product Information',href:'/news?category=product'},
 ]},
 {label:'Contact Us',href:'/contact'},
]
export function closeSiblingMenus(menu:HTMLDetailsElement){
 for(const sibling of Array.from(menu.parentElement?.children||[])){
  if(sibling!==menu&&sibling.tagName==='DETAILS')(sibling as HTMLDetailsElement).open=false
 }
}
function Entries({items,onNavigate,level=0}:{items:Entry[];onNavigate:()=>void;level?:number}){
 const group=useId()
 return <>{items.map(item=>item.children?<details key={item.href} name={group} className={level===0?'review-nav-menu':'review-nav-submenu'}>
  <summary onClick={event=>closeSiblingMenus(event.currentTarget.parentElement as HTMLDetailsElement)}><SiteText value={item.label}/></summary>
  <div className="review-nav-panel"><Link href={item.href} onClick={onNavigate}><SiteText value={item.label}/></Link><Entries items={item.children} onNavigate={onNavigate} level={level+1}/></div>
 </details>:<Link key={item.href} href={item.href} onClick={onNavigate}><SiteText value={item.label}/></Link>)}</>
}
export function SiteHeader(){
 const [open,setOpen]=useState(false),path=usePathname()
 const headerRef=useRef<HTMLElement>(null),toggleRef=useRef<HTMLButtonElement>(null)
 const close=useCallback(()=>{setOpen(false);headerRef.current?.querySelectorAll('details[open]').forEach(item=>item.removeAttribute('open'))},[])
 useEffect(()=>close(),[path,close])
 useEffect(()=>{
  const outside=(event:PointerEvent)=>{if(!headerRef.current?.contains(event.target as Node))close()}
  const escape=(event:KeyboardEvent)=>{
   if(event.key!=='Escape')return
   const menu=headerRef.current?.querySelector<HTMLDetailsElement>('details[open]')
   if(menu)menu.querySelector('summary')?.focus()
   else if(open)toggleRef.current?.focus()
   close()
  }
  document.addEventListener('pointerdown',outside)
  document.addEventListener('keydown',escape)
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)}
 },[close,open])
 useEffect(()=>{document.body.style.overflow=open?'hidden':'';return()=>{document.body.style.overflow=''}},[open])
 return <header ref={headerRef} className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
 <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
 <BrandLogo/><nav aria-label="Primary" className="review-navigation hidden xl:flex"><Entries items={navigation} onNavigate={close}/></nav>
 <button ref={toggleRef} type="button" className="p-3 xl:hidden" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>open?close():setOpen(true)}>{open?<X/>:<Menu/>}</button>
 </div>
 {open&&<nav id="mobile-nav" aria-label="Mobile" className="review-navigation review-mobile xl:hidden"><Entries items={navigation} onNavigate={close}/><Link href="/contact" className="medical-button" onClick={close}><SiteText value="Request a Quote"/></Link></nav>}
 </header>
}
