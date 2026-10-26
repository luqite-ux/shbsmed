"use client"
import {SiteText} from '@/components/site-copy'
import Link from '@/components/localized-link'
import {useEffect,useState,useRef,useCallback,useId} from 'react'
import {usePathname} from 'next/navigation'
import {Menu,X,ChevronDown,Search} from 'lucide-react'
import {BrandLogo} from '@/components/brand-logo'
import {useSiteLanguage} from '@/components/site-copy'
import {navigation,type NavigationEntry as Entry} from '@/lib/site-navigation'
export {navigation} from '@/lib/site-navigation'
export function closeSiblingMenus(menu:HTMLDetailsElement){
 for(const sibling of Array.from(menu.parentElement?.children||[])){
  if(sibling!==menu&&sibling.tagName==='DETAILS')(sibling as HTMLDetailsElement).open=false
 }
}
function Entries({items,onNavigate,level=0}:{items:Entry[];onNavigate:()=>void;level?:number}){
 const group=useId()
 return <>{items.map(item=>item.children?<details key={item.href} name={group} className={level===0?'review-nav-menu':'review-nav-submenu'}>
  <summary onClick={event=>closeSiblingMenus(event.currentTarget.parentElement as HTMLDetailsElement)}><SiteText value={item.label}/><ChevronDown className="nav-chevron" size={15} aria-hidden="true"/></summary>
  <div className="review-nav-panel"><Entries items={item.children} onNavigate={onNavigate} level={level+1}/></div>
 </details>:<Link key={item.href} href={item.href} onClick={onNavigate}><SiteText value={item.label}/></Link>)}</>
}
export function SiteHeader(){
 const [open,setOpen]=useState(false),path=usePathname()
 const {locale,defaultLocale,locales}=useSiteLanguage()
 const changeLanguage=(language:string)=>{const bare=locale===defaultLocale?path:path.replace(new RegExp(`^/${locale}(?=/|$)`),'')||'/';window.location.assign((language===defaultLocale?bare:`/${language}${bare==='/'?'':bare}`)+window.location.search+window.location.hash)}
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
 return <header ref={headerRef} className="feedback-header sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
 <div className="feedback-header-row">
 <BrandLogo/><nav aria-label="Primary" className="review-navigation desktop-navigation"><Entries items={navigation} onNavigate={close}/></nav>
 <div className="header-tools"><Link href="/search" aria-label="Search" className="header-tool"><Search size={21}/></Link><select aria-label="Language" value={locale} onChange={e=>changeLanguage(e.target.value)}>{(locales||[locale]).map(language=><option key={language} value={language}>{language.toUpperCase()}</option>)}</select>
 <button ref={toggleRef} type="button" className="header-tool mobile-menu-toggle" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={()=>open?close():setOpen(true)}>{open?<X/>:<Menu/>}</button></div>
 </div>
 {open&&<nav id="mobile-nav" aria-label="Mobile" className="review-navigation review-mobile"><Entries items={navigation} onNavigate={close}/></nav>}
 </header>
}
