'use client'

import {usePathname,useRouter} from 'next/navigation'
import {useEffect,useRef} from 'react'
import {useSiteLanguage} from '@/components/site-copy'

export function PageBackButton(){
 const pathname=usePathname(),router=useRouter(),{locale,defaultLocale}=useSiteLanguage()
 const trail=useRef<string[]>([])
 useEffect(()=>{
  const location=pathname+window.location.search
  const previous=trail.current.lastIndexOf(location)
  if(previous>=0)trail.current=trail.current.slice(0,previous+1)
  else trail.current.push(location)
 },[pathname])
 const bare=locale===defaultLocale?pathname:pathname.replace(new RegExp(`^/${locale}(?=/|$)`),'')||'/'
 if(bare==='/'||bare.startsWith('/admin'))return null
 const anesthesia=['quincke-spinal-needle','sprotte-spinal-needle','epidural-needle','combined-spinal-epidural-needle'].some(slug=>pathname.endsWith('/'+slug))
 const fallback=anesthesia?'/products?series=neuraxial-anesthesia':bare.startsWith('/products/')?'/products?series=rf-pain-therapy':bare.startsWith('/news/')?'/news':bare.startsWith('/odm-oem/')?'/odm-oem':bare.startsWith('/contract-manufacturing/')?'/contract-manufacturing':'/'
 function back(){
  if(document.querySelector('[role="dialog"]'))return
  if(trail.current.length>1)router.back()
  else {
   trail.current=[]
   router.replace(locale===defaultLocale?fallback:`/${locale}${fallback==='/'?'':fallback}`)
  }
 }
 return <button type="button" className="page-back-button" onClick={back}><span aria-hidden="true">←</span> {locale.startsWith('zh')?'返回':'Back'}</button>
}
