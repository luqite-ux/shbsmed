import type {MetadataRoute} from 'next'
import {getSupabaseClient} from '@/lib/supabase'
import {siteLanguages,localizedPath} from '@/lib/locale'

export const revalidate=60
export default async function sitemap():Promise<MetadataRoute.Sitemap>{
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 if(!db||!tenant)throw new Error('Sitemap data service is not configured')
 const [{data:categories,error:ce},{data:products,error:pe},{data:articles,error:ae},config]=await Promise.all([
  db.from('product_categories').select('slug,parent_id,id,is_active').eq('tenant_id',tenant).eq('is_active',true),
  db.from('products').select('slug,category_slug,updated_at').eq('tenant_id',tenant).eq('is_active',true),
  db.from('articles').select('slug,updated_at,published_at').eq('tenant_id',tenant).eq('is_published',true),siteLanguages()
 ])
 if(ce||pe||ae)throw new Error('Sitemap data service is unavailable')
 const {rfCategories,inCategoryBranch}=await import('@/lib/catalog-model.mjs')
 const cats=categories||[],items=products||[]
 const routes=new Map<string,string|undefined>(['','/products','/odm-oem','/contract-manufacturing','/manufacturing','/news','/contact'].map(path=>[path,undefined]))
 for(const c of rfCategories(cats))if(items.some(p=>p.category_slug===c.slug))routes.set(`/products/${c.slug}`,items.filter(p=>p.category_slug===c.slug).map(p=>p.updated_at).filter(Boolean).sort().at(-1))
 for(const p of items){const c=cats.find(c=>c.slug===p.category_slug);if(p.category_slug==='odm-products')routes.set(`/odm-oem/${p.slug}`,p.updated_at);else if(c&&inCategoryBranch(c,cats,'contract-components'))routes.set(`/contract-manufacturing/${p.slug}`,p.updated_at)}
 for(const a of articles||[])routes.set(`/news/${a.slug}`,a.updated_at||a.published_at)
 const result:MetadataRoute.Sitemap=[]
 for(const[path,modified]of routes){
  const languages=Object.fromEntries(await Promise.all(config.locales.map(async(locale:string)=>[locale,`https://shbsmed.com${await localizedPath(path||'/',locale)}`])))
  for(const locale of config.locales)result.push({url:languages[locale],...(modified?{lastModified:modified}:{}),alternates:{languages:{...languages,'x-default':`https://shbsmed.com${path||'/'}`}}})
 }
 return result
}
