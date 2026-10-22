import Link from '@/components/localized-link'
import {Reveal} from '@/components/reveal'
import {SiteText} from '@/components/site-copy'
import type {Article} from '@/lib/articles-db'
export const newsCategories=[{slug:'industry',name:'Industry Information'},{slug:'company',name:'Corporate Information'},{slug:'product',name:'Product Information'}]
export function NewsList({articles,compact=false,category}:{articles:Article[];compact?:boolean;category?:string}){
 const selected=new Set(newsCategories.map(c=>c.slug)).has(category||'')?category:undefined
 const shown=(selected?articles.filter(a=>a.category===selected):articles).slice(0,compact?3:undefined)
 return <><nav className="series-tabs" aria-label="Update categories">{!compact&&<Link href="/news" aria-current={!selected?'page':undefined}><SiteText value="All Information"/></Link>}{newsCategories.map(c=><Link key={c.slug} href={`/news?category=${c.slug}`} aria-current={selected===c.slug?'page':undefined}><SiteText value={c.name}/></Link>)}</nav>{shown.length?<div className="grid auto-rows-fr gap-6 md:grid-cols-3">{shown.map(a=><Reveal key={a.slug} className="h-full"><Link href={`/news/${a.slug}`} className="flex h-full flex-col overflow-hidden rounded-xl border">{a.image&&<img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover" loading="lazy"/>}<div className="flex flex-1 flex-col p-6"><time>{new Date(a.publishedAt).toLocaleDateString('en-US')}</time><h3 className="mt-3 text-xl font-semibold line-clamp-2">{a.title}</h3><p className="mt-3 line-clamp-3 flex-1">{a.excerpt}</p><span className="mt-auto pt-6">Read article →</span></div></Link></Reveal>)}</div>:<Reveal><p className="medical-intro"><SiteText value="No articles have been published in this category yet."/></p></Reveal>}</>
}
