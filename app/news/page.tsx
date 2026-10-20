import {pageMetadata} from '@/lib/site-content/metadata'
import {Reveal} from '@/components/reveal'
import seed from '@/lib/site-seed.json'
import {PendingPanel} from '@/components/framework-pending'
import Link from '@/components/localized-link';import { PageFrame } from "@/components/page-frame";import { getPublishedArticles } from "@/lib/articles-db";export const revalidate=60;export async function generateMetadata(){return pageMetadata("/news",{title:"News",description:"Technical and company updates published by Brightstone Medical.",alternates:{canonical:"https://shbsmed.com/news"}})}
export default async function News(){
 const articles=await getPublishedArticles()
 return <PageFrame eyebrow="News" title="Technical updates from Brightstone Medical" description="Product, manufacturing and company updates from Brightstone Medical.">
  <Reveal as="section" className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
   {articles.length?<div className="grid auto-rows-fr gap-6 md:grid-cols-2">
    {articles.map(a=><Reveal className="h-full" key={a.slug}>
     <Link href={`/news/${a.slug}`} className="flex h-full flex-col overflow-hidden rounded-xl border">
      {a.image&&<img src={a.image} alt={a.title} className="aspect-[16/9] w-full object-cover"/>}
      <div className="flex flex-1 flex-col p-6">
       <time className="text-sm text-muted-foreground">{new Date(a.publishedAt).toLocaleDateString('en-US')}</time>
       <h2 className="mt-3 line-clamp-2 text-xl font-semibold">{a.title}</h2>
       <p className="mt-3 line-clamp-3 flex-1 text-muted-foreground">{a.excerpt}</p>
       <span className="mt-auto pt-6 text-brand-blue">Read article</span>
      </div>
     </Link>
    </Reveal>)}
   </div>:<div className="grid gap-8 md:grid-cols-2">
    <img src={seed.photos.find(p=>p.group==='exhibitions')?.image} alt="Customer-provided exhibition reference" className="w-full object-contain"/>
    <PendingPanel title="Exhibition Update">Exhibition image provided. Article title, event details, publication date and text pending confirmation. No article has been published.</PendingPanel>
   </div>}
  </Reveal>
 </PageFrame>
}
