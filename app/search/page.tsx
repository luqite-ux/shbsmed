import {PageFrame} from '@/components/page-frame'
import {getMedicalProducts,getOdmProducts,getContractComponents} from '@/lib/medical-products'
import {getPublishedArticles} from '@/lib/articles-db'
import {currentLocale,localizedPath} from '@/lib/locale'
import {pageMetadata} from '@/lib/site-content/metadata'
import {searchEntries} from '@/lib/site-search'
import Link from '@/components/localized-link'
import {SiteText,SiteImage} from '@/components/site-copy'
export async function generateMetadata(){return pageMetadata('/search',{title:'Search',robots:{index:false,follow:true}})}
export default async function Search({searchParams}:{searchParams?:Promise<{q?:string}>}={}){
 const q=(await searchParams)?.q?.trim().slice(0,200)||''
 const [products,oem,parts,articles]=q?await Promise.all([getMedicalProducts(),getOdmProducts(),getContractComponents(),getPublishedArticles()]):[[],[],[],[]]
 const results=searchEntries([...products.map(p=>({name:p.name,image:p.image,href:`/products/${p.slug}`,keywords:p.variants.map(v=>v.model).join(' ')})),...oem.map(p=>({name:p.name,image:p.image,href:`/odm-oem#${p.slug}`})),...parts.map(p=>({name:p.name,image:p.image,href:`/contract-manufacturing#${p.slug}`})),...articles.map(a=>({name:a.title,image:a.image,href:`/news/${a.slug}`,keywords:a.excerpt}))],q)
 const searchAction=await localizedPath('/search',await currentLocale())
 return <PageFrame eyebrow="Search" title="Search" description=""><section className="medical-shell medical-section"><form role="search" action={searchAction} className="site-search-form"><label htmlFor="site-search"><SiteText value="Search products, model numbers and information"/></label><div><input id="site-search" name="q" type="search" defaultValue={q} maxLength={200}/><button className="medical-button" type="submit"><SiteText value="Search"/></button></div></form>{q&&<><p className="my-6">{results.length} <SiteText value="results for"/> “{q}”</p>{results.length?<ul className="search-results">{results.map(result=><li key={result.href+result.name}><Link href={result.href}>{result.image&&<SiteImage src={result.image} alt=""/>}<span>{result.name}</span></Link></li>)}</ul>:<p><SiteText value="No matching results. Try a product name or model number."/></p>}</>}</section></PageFrame>
}
