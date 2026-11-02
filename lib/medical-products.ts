import 'server-only'
import {cache} from 'react'
import {getSupabaseClient} from '@/lib/supabase'
import {localized as localizeValue,rfCategories,inCategoryBranch} from '@/lib/catalog-model.mjs'
import {currentLocale,siteLanguages} from '@/lib/locale'
import previewProducts from '@/lib/customer-preview-products.json'

export type MedicalVariant={model:string;gauge:string;length:string;activeTip:string;color:string;moq:string}
export type MedicalProduct={slug:string;name:string;image:string;tipImage:string|null;description:string;overview:string;variants:MedicalVariant[]}
export const getMedicalProducts=cache(async(language?:string):Promise<MedicalProduct[]>=>{
 if(process.env.VERCEL_ENV==='preview')return previewProducts.map(p=>({slug:p.slug,name:p.name,image:`/images/client-products-20261102-unified/${p.id}.webp`,tipImage:p.detail,description:p.description.join(' '),overview:p.description.join(' '),variants:p.rows.map((r,i)=>({model:r[0]||`pending-${i}`,gauge:p.id==='4.1'?r[3]:p.id==='4.2'?r[3]:r[3],length:p.id==='4.1'?r[5]:p.id==='4.2'?r[4]:r[4],activeTip:p.id==='4.1'?r[6]:p.id==='4.2'?'':r[5],color:'',moq:''}))}))
 const locale=language||await currentLocale()
 const {defaultLocale}=await siteLanguages()
 const localized=(value:unknown,requested:string)=>localizeValue(value,requested,defaultLocale)
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 if(!db||!tenant)throw new Error('Product service is not configured')
 const [{data:categories,error:categoryError},{data:products,error:productError}]=await Promise.all([
  db.from('product_categories').select('*').eq('tenant_id',tenant).eq('is_active',true).order('sort_order'),
  db.from('products').select('*').eq('tenant_id',tenant).eq('is_active',true).order('sort_order')
 ])
 if(categoryError||productError)throw new Error('Product service is unavailable')
 return rfCategories(categories||[]).map((c:any)=>({
  slug:c.slug,name:localized(c.name_i18n,locale)||c.name_en||c.name,
  description:localized(c.description_i18n,locale)||c.description||'',image:c.icon||(products||[]).find(p=>p.category_slug===c.slug)?.image_url||'',tipImage:c.extra_data?.tip_image||null,
  overview:(()=>{const product=(products||[]).find(p=>p.category_slug===c.slug);return String(localized(product?.overview_i18n,locale)||localized(product?.description_i18n,locale)||product?.description_en||product?.description||'').replace(/\.Used/g,'. Used').replace(/via RF electrode It/g,'via the RF electrode. It')})(),
  variants:(products||[]).filter(p=>p.category_slug===c.slug).map(p=>({
   model:p.model||p.extra_data?.product_id||p.slug,gauge:String(p.specs?.Gauge||''),length:String(p.specs?.['Effective length']||''),
   activeTip:String(p.specs?.['Active tip length']||''),color:String(p.specs?.['Gauge color']||'').replace(/\bPIink\b/g,'Pink'),moq:String(p.extra_data?.moq||'')
  }))
 })).filter((p:MedicalProduct)=>p.variants.length>0)
})
export const getOdmProducts=cache(async(language?:string)=>{
 const locale=language||await currentLocale()
 const {defaultLocale}=await siteLanguages()
 const localized=(value:unknown,requested:string)=>localizeValue(value,requested,defaultLocale)
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 if(!db||!tenant)throw new Error('Product service is not configured')
 const {data,error}=await db.from('products').select('*').eq('tenant_id',tenant).eq('is_active',true).eq('category_slug','odm-products').order('sort_order')
 if(error)throw new Error('Product service is unavailable')
 return (data||[]).map(p=>({slug:p.slug,name:localized(p.name_i18n,locale)||p.name,image:p.image_url,description:localized(p.description_i18n,locale)||p.description||''}))
})
export const getContractComponents=cache(async(language?:string)=>{
 const locale=language||await currentLocale(),db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 const {defaultLocale}=await siteLanguages()
 const localized=(value:unknown,requested:string)=>localizeValue(value,requested,defaultLocale)
 if(!db||!tenant)throw new Error('Component service is not configured')
 const[{data:categories,error:categoryError},{data:products,error:productError}]=await Promise.all([
  db.from('product_categories').select('*').eq('tenant_id',tenant).eq('is_active',true).order('sort_order'),
  db.from('products').select('*').eq('tenant_id',tenant).eq('is_active',true).order('sort_order')
 ])
 if(categoryError||productError)throw new Error('Component service is unavailable')
 const groups=(categories||[]).filter(c=>inCategoryBranch(c,categories||[],'contract-components'))
 return (products||[]).filter(p=>groups.some(g=>g.slug===p.category_slug)).map(p=>{const group=groups.find(g=>g.slug===p.category_slug)!;return{slug:p.slug,name:localized(p.name_i18n,locale)||p.name,image:p.image_url,description:localized(p.description_i18n,locale)||p.description||'',group:localized(group.name_i18n,locale)||group.name,application:typeof p.extra_data?.application_category==='string'?p.extra_data.application_category:undefined}})
})
