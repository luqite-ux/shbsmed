import type {Metadata} from 'next'
import {siteContentMetadata} from './site-content'
import {currentLocale,localizedPath,siteLanguages} from '@/lib/locale'
import {cookies} from 'next/headers'
import {getBrandSettings} from '@/lib/brand-settings'
export async function pageMetadata(path:string,fallback:Metadata,language?:string):Promise<Metadata>{
 const locale=language||await currentLocale(),config=await siteLanguages()
 let content:Awaited<ReturnType<typeof siteContentMetadata>>={}
 try{content=await siteContentMetadata(path,locale)}catch(error){
  if(!(await cookies()).has('__Host-hq-site-preview'))throw error
  content={robots:{index:false,follow:false}}
 }
 const url=`https://shbsmed.com${await localizedPath(path,locale)}`
 // October 21 preview keeps the existing route, but the public business is OEM.
 if(path==='/odm-oem'){
  if(typeof content.title==='string')content.title=content.title.replace(/ODM\s*\/\s*OEM|OEM\s*\/\s*ODM|ODM/gi,'OEM')
  if(typeof content.description==='string')content.description=content.description.replace(/ODM\s*\/\s*OEM|OEM\s*\/\s*ODM|ODM/gi,'OEM')
 }
 if(path==='/products'&&typeof content.title==='string'&&content.title.includes('RF Products for Pain Management')){
  content.title='Branded Medical Needle Products'
  content.description='Pain management, spinal anesthesia and epidural anesthesia product series.'
 }
 const languages=Object.fromEntries(await Promise.all(config.locales.map(async(l:string)=>[l,`https://shbsmed.com${await localizedPath(path,l)}`])))
 const brand=await getBrandSettings(locale)
 const title=content.title||(typeof fallback.title==='string'?fallback.title:brand.seoTitle)
 const description=content.description||fallback.description||brand.seoDescription
 return{...fallback,...content,alternates:{canonical:url,languages:{...languages,'x-default':`https://shbsmed.com${path}`}},openGraph:{type:'website',images:[new URL(brand.logo,'https://shbsmed.com').href],...fallback.openGraph,url,title,description},twitter:{card:'summary_large_image',title,description,images:[new URL(brand.logo,'https://shbsmed.com').href]}}
}
