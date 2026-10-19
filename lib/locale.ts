import 'server-only'
import {cache} from 'react'
import {headers} from 'next/headers'
import {unstable_cache} from 'next/cache'
import {getSupabaseClient} from './supabase'
export const siteLanguages=unstable_cache(async()=>{
 const db=getSupabaseClient(),tenant=process.env.NEXT_PUBLIC_TENANT_ID
 if(!db||!tenant)return{defaultLocale:'en',locales:['en']}
 const {data}=await db.from('tenants').select('default_language,supported_languages').eq('id',tenant).single()
 const defaultLocale=data?.default_language||'en'
 return{defaultLocale,locales:Array.isArray(data?.supported_languages)&&data.supported_languages.length?data.supported_languages:[defaultLocale]}
},['brightstone-language-config'],{revalidate:60})
export const currentLocale=cache(async()=>{
 const config=await siteLanguages(),path=(await headers()).get('x-brightstone-path')||'/'
 const candidate=path.split('/')[1]
 return config.locales.includes(candidate)?candidate:config.defaultLocale
})
export async function localizedPath(path:string,locale?:string){const config=await siteLanguages(),language=locale||await currentLocale();return language===config.defaultLocale?path:`/${language}${path==='/'?'':path}`}
