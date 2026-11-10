'use client'

import {usePathname} from 'next/navigation'
import {ArrowUpToLine} from 'lucide-react'
import {useSiteLanguage} from '@/components/site-copy'

export function PageBackButton(){
 const pathname=usePathname(),{locale,defaultLocale}=useSiteLanguage()
 const bare=locale===defaultLocale?pathname:pathname.replace(new RegExp(`^/${locale}(?=/|$)`),'')||'/'
 if(bare.startsWith('/admin'))return null
 const label=locale.startsWith('zh')?'回顶部':'Back to top'
 function toTop(){
  if(document.querySelector('[role="dialog"]'))return
  window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})
 }
 return <button type="button" className="page-back-button" aria-label={label} title={label} onClick={toTop}><ArrowUpToLine size={20} aria-hidden="true"/><span>{locale.startsWith('zh')?'回顶部':'Top'}</span></button>
}
