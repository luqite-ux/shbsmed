import 'server-only'
import {getSiteContent} from './site-content'
import type {SiteCopyData} from '@/components/site-copy'
import {copyKey} from '@/lib/site-copy-key.mjs'
import {siteLanguages} from '@/lib/locale'
import imageSlots from '@/lib/site-image-slots.json'
import {getBrandSettings} from '@/lib/brand-settings'
import videoSlots from '@/lib/site-video-slots.json'
export async function getWebsiteCopy(locale='en'):Promise<SiteCopyData>{
 const snapshot=await getSiteContent(locale)
 const config=await siteLanguages()
 const result:SiteCopyData={version:snapshot?.version||null,locale,defaultLocale:config.defaultLocale,brand:await getBrandSettings(locale),text:{},images:{},videos:{}}
 if(!snapshot)return result
 // Fixed data consumers only. No module names are resolved into executable code.
 for(const page of snapshot.pages)for(const module of page.modules){
  if(module.type==='fixed-videos')for(const slot of videoSlots){const src=module.values[`${slot.key}-src`],title=module.values[`${slot.key}-title`],poster=module.values[`${slot.key}-poster`] as {url?:string};if(typeof src==='string'&&typeof title==='string'&&poster?.url)result.videos![slot.key]={src,title,poster:poster.url}}
  if(module.type==='fixed-copy')for(const[key,value]of Object.entries(module.values))if(typeof value==='string')result.text[key]=value
  if(module.type==='fixed-images')for(const[key,value]of Object.entries(module.values)){const image=value as {url?:string;alt?:string};if(image?.url){result.images[key]={url:image.url,alt:image.alt||''};const slot=imageSlots.find(s=>s.key===key);if(slot?.caption)result.text[copyKey(slot.caption)]=image.alt||slot.caption}}
  if(module.type==='company-introduction'&&typeof module.values.description==='string')result.text[copyKey('Shanghai Brightstone Medical Technology Limited was founded in December 2015. We manufacture medical needles, RF electrodes and precision needle components. Our work focuses on product development, manufacturing technology and quality control.')]=module.values.description
  if(module.type==='site-copy'&&Array.isArray(module.values.entries))for(const row of module.values.entries as Array<{id:string;text:string}>)if(typeof row.text==='string')result.text[row.id]=row.text
  if(module.type==='site-images'&&Array.isArray(module.values.entries))for(const row of module.values.entries as Array<{id:string;image:{url:string;alt:string}}>)if(row.image?.url)result.images[row.id]=row.image
 }
 return result
}
