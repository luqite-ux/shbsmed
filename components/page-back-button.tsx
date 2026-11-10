'use client'

import {usePathname,useRouter} from 'next/navigation'
import {useEffect,useRef} from 'react'
import {useSiteLanguage} from '@/components/site-copy'

export function PageBackButton(){
 const pathname=usePathname(),router=useRouter(),{locale}=useSiteLanguage()
 const previous=useRef(pathname),canGoBack=useRef(false)
 useEffect(()=>{if(previous.current!==pathname){canGoBack.current=true;previous.current=pathname}},[pathname])
 if(pathname==='/'||pathname.startsWith('/admin'))return null
 const anesthesia=['quincke-spinal-needle','sprotte-spinal-needle','epidural-needle','combined-spinal-epidural-needle'].some(slug=>pathname.endsWith('/'+slug))
 const fallback=anesthesia?'/products?series=neuraxial-anesthesia':pathname.startsWith('/products/')?'/products?series=radiofrequency':pathname.startsWith('/news/')?'/news':pathname.startsWith('/odm-oem/')?'/odm-oem':pathname.startsWith('/contract-manufacturing/')?'/contract-manufacturing':'/'
 function back(){
  if(document.querySelector('[role="dialog"]'))return
  if(canGoBack.current)router.back()
  else router.push(fallback)
 }
 return <button type="button" className="page-back-button" onClick={back}><span aria-hidden="true">←</span> {locale.startsWith('zh')?'返回':'Back'}</button>
}
