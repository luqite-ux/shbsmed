'use client'

import {usePathname} from 'next/navigation'
import {ArrowLeft,ArrowUpToLine} from 'lucide-react'
import {useSiteLanguage} from '@/components/site-copy'
import Link from '@/components/localized-link'

export function PageBackButton(){
 const pathname=usePathname(),{locale,defaultLocale}=useSiteLanguage()
 const bare=locale===defaultLocale?pathname:pathname.replace(new RegExp(`^/${locale}(?=/|$)`),'')||'/'
 if(bare.startsWith('/admin'))return null
 const detail=/^\/products\/([^/]+)\/?$/.exec(bare)
 if(detail){
  const series=/spinal|epidural/.test(detail[1])?'neuraxial-anesthesia':'rf-pain-therapy'
  const back=locale.startsWith('zh')?'返回系列':'Back to series'
  return <Link href={`/products?series=${series}`} className="page-back-button" aria-label={back} title={back}><ArrowLeft size={20} aria-hidden="true"/><span>{locale.startsWith('zh')?'返回':'Back'}</span></Link>
 }
 const label=locale.startsWith('zh')?'回顶部':'Back to top'
 function toTop(){
  if(document.querySelector('[role="dialog"]'))return
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
 }
 return <button type="button" className="page-back-button" aria-label={label} title={label} onClick={toTop}><ArrowUpToLine size={20} aria-hidden="true"/><span>{locale.startsWith('zh')?'回顶部':'Top'}</span></button>
}
