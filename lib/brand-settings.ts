import 'server-only'
import {unstable_cache} from 'next/cache'
import {getSupabaseClient} from '@/lib/supabase'
import {localized as localizeValue} from '@/lib/catalog-model.mjs'
import {company} from '@/lib/data/company'
export const getBrandSettings=unstable_cache(async(locale='en')=>{
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 const {data}=db&&tenant?await db.from('tenants').select('default_language,logo_url,favicon_url,contact_email,contact_phone,contact_address_i18n,site_description_i18n,seo_title_i18n,seo_description_i18n,extra_settings').eq('id',tenant).single():{data:null}
 const localized=(value:unknown,requested:string)=>localizeValue(value,requested,data?.default_language||'en')
 return{
  brandName:company.brandName,legalNameEn:String(data?.extra_settings?.legal_name_en||company.legalNameEn).replace(/[.。;；:：!！?？\s]+$/u,''),
  logo:data?.logo_url||'/images/brand/logo.png',favicon:data?.favicon_url||'/favicon.svg',
  email:data?.contact_email||company.email,address:localized(data?.contact_address_i18n,locale)||company.address,
  phone:data?.contact_phone||undefined,mobile:data?.extra_settings?.contact_mobile||undefined,wechatQr:data?.extra_settings?.wechat_qr_url||undefined,
  description:localized(data?.site_description_i18n,locale)||'Medical needles, RF products and precision needle components from Shanghai Brightstone Medical.',
  seoTitle:localized(data?.seo_title_i18n,locale)||'Brightstone Medical',seoDescription:localized(data?.seo_description_i18n,locale)||'Medical needle development and manufacturing in Shanghai.'
 }
},['brightstone-brand-settings'],{revalidate:60})
