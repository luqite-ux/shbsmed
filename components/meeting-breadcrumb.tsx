'use client'
import {usePathname} from 'next/navigation'
import Link from '@/components/localized-link'
import {SiteText,useSiteLanguage} from '@/components/site-copy'
export function MeetingBreadcrumb({title}:{title:string}){
 const raw=usePathname(),{locale,defaultLocale}=useSiteLanguage(),path=locale===defaultLocale?raw:raw.replace(new RegExp('^/'+locale+'(?=/|$)'),'')||'/'
 const root=path.split('/')[1],labels:Record<string,string>={products:'Branded Products','odm-oem':'OEM','contract-manufacturing':'Component Manufacturing',about:'About Us',news:'Updates',contact:'Contact Us'}
 return <nav className="meeting-breadcrumb" aria-label="Breadcrumb"><Link href="/"><SiteText value="Home"/></Link><span aria-hidden="true">/</span>{path.split('/').filter(Boolean).length>1&&labels[root]&&<><Link href={`/${root}`}><SiteText value={labels[root]}/></Link><span aria-hidden="true">/</span></>}<span aria-current="page"><SiteText value={title}/></span></nav>
}
