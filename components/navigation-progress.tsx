'use client'

import {useEffect,useRef,useState} from 'react'
import {usePathname} from 'next/navigation'

export function NavigationProgress(){
 const pathname=usePathname()
 const [active,setActive]=useState(false)
 const timerRef=useRef<ReturnType<typeof setTimeout>|null>(null)

 useEffect(()=>{
  setActive(false)
  if(timerRef.current){clearTimeout(timerRef.current);timerRef.current=null}
 },[pathname])

 useEffect(()=>{
  const start=()=>{
   setActive(true)
   if(timerRef.current)clearTimeout(timerRef.current)
   timerRef.current=setTimeout(()=>setActive(false),12000)
  }
  const onClick=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
   const anchor=(event.target as HTMLElement|null)?.closest('a[href]') as HTMLAnchorElement|null
   if(!anchor||anchor.target==='_blank'||anchor.hasAttribute('download'))return
   const href=anchor.getAttribute('href')||''
   if(!href||href.startsWith('#')||href.startsWith('mailto:')||href.startsWith('tel:'))return
   try{
    const next=new URL(anchor.href,window.location.href)
    if(next.origin!==window.location.origin)return
    if(next.pathname===window.location.pathname&&next.search===window.location.search)return
    start()
   }catch{}
  }
  const onCustomStart=()=>start()
  document.addEventListener('click',onClick,true)
  window.addEventListener('hq:nav-start',onCustomStart)
  return()=>{
   document.removeEventListener('click',onClick,true)
   window.removeEventListener('hq:nav-start',onCustomStart)
   if(timerRef.current)clearTimeout(timerRef.current)
  }
 },[])

 if(!active)return null
 return <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-sky-100/80"><div className="h-full w-2/3 animate-pulse bg-[#0f4c75]"/></div>
}
