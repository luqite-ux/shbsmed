import { getSupabaseClient } from "@/lib/supabase"
import sanitizeHtml from 'sanitize-html'
import {localized as localizeValue} from '@/lib/catalog-model.mjs'
import {currentLocale,siteLanguages} from '@/lib/locale'
export type Article={slug:string;title:string;excerpt:string;content:string;publishedAt:string;updatedAt:string;image?:string;category?:string}
export async function getPublishedArticles(language?:string):Promise<Article[]>{
 const locale=language||await currentLocale()
 const {defaultLocale}=await siteLanguages()
 const localized=(value:unknown,requested:string)=>localizeValue(value,requested,defaultLocale)
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 if(!db||!tenant)return[]
 const {data,error}=await db.from('articles').select('*').eq('tenant_id',tenant).eq('is_published',true).order('sort_order').order('published_at',{ascending:false,nullsFirst:false}).order('id')
 if(error)throw new Error('News service is unavailable')
 return (data||[]).map((a:any)=>({slug:a.slug,category:({industry:'industry',product:'product',company:'company','Industry News':'industry','Product News':'product','Company News':'company','行业新闻':'industry','产品新闻':'product','企业新闻':'company'} as Record<string,string>)[a.category_slug||a.category]||undefined,title:localized(a.title_i18n,locale)||a.title_en||a.title||'',excerpt:localized(a.excerpt_i18n,locale)||a.excerpt_en||a.excerpt||'',content:sanitizeHtml(localized(a.content_i18n,locale)||a.content_en||a.content||'',{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img']),allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,img:['src','alt','width','height','loading']},allowedSchemes:['https','mailto','tel'],allowProtocolRelative:false}),publishedAt:a.published_at||a.created_at,updatedAt:a.updated_at||a.published_at||a.created_at,image:a.featured_image||undefined}))
}
export async function getArticleBySlug(slug:string,language?:string){return (await getPublishedArticles(language)).find(a=>a.slug===slug)}
