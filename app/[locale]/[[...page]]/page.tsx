import type {Metadata} from 'next'
import {notFound,permanentRedirect} from 'next/navigation'
import Home,{generateMetadata as homeMetadata} from '@/app/page'
import Products,{generateMetadata as productsMetadata} from '@/app/products/page'
import Product,{generateMetadata as productMetadata} from '@/app/products/[slug]/page'
import Odm,{generateMetadata as odmMetadata} from '@/app/odm-oem/page'
import About,{generateMetadata as aboutMetadata} from '@/app/about/page'
import Contract,{generateMetadata as contractMetadata} from '@/app/contract-manufacturing/page'
import News,{generateMetadata as newsMetadata} from '@/app/news/page'
import Article,{generateMetadata as articleMetadata} from '@/app/news/[slug]/page'
import Contact,{generateMetadata as contactMetadata} from '@/app/contact/page'
import {siteLanguages} from '@/lib/locale'
import {pageMetadata} from '@/lib/site-content/metadata'
export const dynamicParams=true
export const revalidate=60
type Props={params:Promise<{locale:string;page?:string[]}>;searchParams:Promise<{product?:string;type?:string;series?:string;category?:string}>}
async function route(props:Props){
 const {locale,page=[]}=await props.params,config=await siteLanguages()
 if(!config.locales.includes(locale))notFound()
 if(page[0]==='manufacturing')permanentRedirect(`/${locale}/about`)
 if(page.length===2&&['odm-oem','contract-manufacturing'].includes(page[0]))permanentRedirect(`/${locale}/${page[0]}`)
 const path='/'+page.join('/')
 if(locale===config.defaultLocale){const query=new URLSearchParams(Object.entries(await props.searchParams||{}).filter((entry):entry is [string,string]=>typeof entry[1]==='string')).toString();permanentRedirect(path+(query?'?'+query:''))}
 if(page.length>2)notFound()
 return{locale,page,path,slug:Promise.resolve({slug:page[1]||''})}
}
export async function generateMetadata(props:Props):Promise<Metadata>{
 const r=await route(props);let metadata:Metadata={}
 if(r.page.length===0)metadata=await homeMetadata()
 else if(r.page.length===1){const generators:Record<string,()=>Promise<Metadata>>={products:productsMetadata,'odm-oem':odmMetadata,'contract-manufacturing':contractMetadata,about:aboutMetadata,news:newsMetadata,contact:contactMetadata};if(!generators[r.page[0]])notFound();metadata=await generators[r.page[0]]()}
 else{const generators:Record<string,({params}:{params:Promise<{slug:string}>})=>Promise<Metadata>>={products:productMetadata,news:articleMetadata};if(!generators[r.page[0]])notFound();metadata=await generators[r.page[0]]({params:r.slug})}
 return pageMetadata(r.path,metadata,r.locale)
}
export default async function LocalizedPage(props:Props){
 const r=await route(props)
 if(!r.page.length)return <Home/>
 if(r.page.length===1){switch(r.page[0]){case'products':return <Products searchParams={props.searchParams}/>;case'odm-oem':return <Odm/>;case'contract-manufacturing':return <Contract/>;case'about':return <About/>;case'news':return <News searchParams={props.searchParams}/>;case'contact':return <Contact searchParams={props.searchParams}/>;default:notFound()}}
 switch(r.page[0]){case'products':return <Product params={r.slug}/>;case'news':return <Article params={r.slug}/>;default:notFound()}
}
