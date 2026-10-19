import type {Metadata} from 'next'
import {notFound,permanentRedirect} from 'next/navigation'
import Home,{generateMetadata as homeMetadata} from '@/app/page'
import Products,{generateMetadata as productsMetadata} from '@/app/products/page'
import Product,{generateMetadata as productMetadata} from '@/app/products/[slug]/page'
import Odm,{generateMetadata as odmMetadata} from '@/app/odm-oem/page'
import OdmProduct,{generateMetadata as odmProductMetadata} from '@/app/odm-oem/[slug]/page'
import Contract,{generateMetadata as contractMetadata} from '@/app/contract-manufacturing/page'
import Part,{generateMetadata as partMetadata} from '@/app/contract-manufacturing/[slug]/page'
import Manufacturing,{generateMetadata as manufacturingMetadata} from '@/app/manufacturing/page'
import News,{generateMetadata as newsMetadata} from '@/app/news/page'
import Article,{generateMetadata as articleMetadata} from '@/app/news/[slug]/page'
import Contact,{generateMetadata as contactMetadata} from '@/app/contact/page'
import {siteLanguages} from '@/lib/locale'
import {pageMetadata} from '@/lib/site-content/metadata'
export const dynamicParams=true
export const revalidate=60
type Props={params:Promise<{locale:string;page?:string[]}>;searchParams:Promise<{product?:string}>}
async function route(props:Props){
 const {locale,page=[]}=await props.params,config=await siteLanguages()
 if(!config.locales.includes(locale))notFound()
 const path='/'+page.join('/')
 if(locale===config.defaultLocale)permanentRedirect(path)
 if(page.length>2)notFound()
 return{locale,page,path,slug:Promise.resolve({slug:page[1]||''})}
}
export async function generateMetadata(props:Props):Promise<Metadata>{
 const r=await route(props);let metadata:Metadata={}
 if(r.page.length===0)metadata=await homeMetadata()
 else if(r.page.length===1){const generators:Record<string,()=>Promise<Metadata>>={products:productsMetadata,'odm-oem':odmMetadata,'contract-manufacturing':contractMetadata,manufacturing:manufacturingMetadata,news:newsMetadata,contact:contactMetadata};if(!generators[r.page[0]])notFound();metadata=await generators[r.page[0]]()}
 else{const generators:Record<string,({params}:{params:Promise<{slug:string}>})=>Promise<Metadata>>={products:productMetadata,'odm-oem':odmProductMetadata,'contract-manufacturing':partMetadata,news:articleMetadata};if(!generators[r.page[0]])notFound();metadata=await generators[r.page[0]]({params:r.slug})}
 return pageMetadata(r.path,metadata,r.locale)
}
export default async function LocalizedPage(props:Props){
 const r=await route(props)
 if(!r.page.length)return <Home/>
 if(r.page.length===1){switch(r.page[0]){case'products':return <Products/>;case'odm-oem':return <Odm/>;case'contract-manufacturing':return <Contract/>;case'manufacturing':return <Manufacturing/>;case'news':return <News/>;case'contact':return <Contact searchParams={props.searchParams}/>;default:notFound()}}
 switch(r.page[0]){case'products':return <Product params={r.slug}/>;case'odm-oem':return <OdmProduct params={r.slug}/>;case'contract-manufacturing':return <Part params={r.slug}/>;case'news':return <Article params={r.slug}/>;default:notFound()}
}
