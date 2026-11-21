import {getFeedbackArticles} from '@/lib/feedback-20261109'
import { getSupabaseClient } from "@/lib/supabase"
import sanitizeHtml from 'sanitize-html'
import {localized as localizeValue} from '@/lib/catalog-model.mjs'
import {currentLocale,siteLanguages} from '@/lib/locale'
export type Article={slug:string;title:string;excerpt:string;content:string;publishedAt:string;updatedAt:string;image?:string;category?:string}
const articleCategoryAliases:Record<string,string>= {industry:'industry',product:'product',company:'company','Industry News':'industry','Product News':'product','Company News':'company','Industry Updates':'industry','Product Updates':'product','Company Updates':'company','行业资讯':'industry','产品资讯':'product','企业资讯':'company','行业新闻':'industry','产品新闻':'product','企业新闻':'company'}
function articleCategory(article:any):string|undefined{
 const legacy=articleCategoryAliases[article.category_slug||article.category]
 if(legacy)return legacy
 const keys=Array.isArray(article.placement_keys)?article.placement_keys.map((key:unknown)=>String(key).toLowerCase()):[]
 for(const key of keys){
  const scoped=key.startsWith('news:')||key.startsWith('news/')?key.slice(5):key
  if(scoped==='company'||scoped==='corporate')return 'company'
  if(scoped==='industry'||scoped==='product')return scoped
 }
 return 'industry'
}
function sortByNewest(articles:Article[]):Article[]{
 return articles.slice().sort((left,right)=>{
  const leftTime=Date.parse(left.publishedAt)
  const rightTime=Date.parse(right.publishedAt)
  if(Number.isNaN(leftTime)&&Number.isNaN(rightTime))return 0
  if(Number.isNaN(leftTime))return 1
  if(Number.isNaN(rightTime))return -1
  return rightTime-leftTime
 })
}
export async function getPublishedArticles(language?:string):Promise<Article[]>{
 const locale=language||await currentLocale()
 const {defaultLocale}=await siteLanguages()
 const localized=(value:unknown,requested:string)=>localizeValue(value,requested,defaultLocale)
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 if(!db||!tenant)return[]
 const {data,error}=await db.from('articles').select('*').eq('tenant_id',tenant).eq('is_published',true).order('sort_order').order('published_at',{ascending:false,nullsFirst:false}).order('id')
 if(error)throw new Error('Updates service is unavailable')
 const existing=(data||[]).map((a:any)=>({slug:a.slug,category:articleCategory(a),title:localized(a.title_i18n,locale)||a.title_en||a.title||'',excerpt:localized(a.excerpt_i18n,locale)||a.excerpt_en||a.excerpt||'',content:sanitizeHtml(localized(a.content_i18n,locale)||a.content_en||a.content||'',{allowedTags:sanitizeHtml.defaults.allowedTags.concat(['img']),allowedAttributes:{...sanitizeHtml.defaults.allowedAttributes,img:['src','alt','width','height','loading']},allowedSchemes:['https','mailto','tel'],allowProtocolRelative:false}),publishedAt:a.published_at||a.created_at,updatedAt:a.updated_at||a.published_at||a.created_at,image:a.featured_image||undefined}))
 const feedbackArticles=getFeedbackArticles(locale)
 const merged=(['preview','production'].includes(process.env.VERCEL_ENV ?? ''))?[...feedbackArticles,...existing.filter((a:Article)=>!feedbackArticles.some(p=>p.slug===a.slug))]:existing
 return sortByNewest(merged)
}
export async function getArticleBySlug(slug:string,language?:string){return (await getPublishedArticles(language)).find(a=>a.slug===slug)}
