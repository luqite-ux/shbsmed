'use client'
import {createContext,useContext,type ReactNode,type ImgHTMLAttributes} from 'react'
import {copyKey} from '@/lib/site-copy-key.mjs'
import {meetingCopyZh} from '@/lib/meeting-product-copy'
import {businessCopyZh} from '@/lib/meeting-business-copy'
export type BrandSettings={brandName:string;legalNameEn:string;logo:string;favicon:string;email:string;address:string;description:string;seoTitle:string;seoDescription:string}
export type SiteCopyData={version:string|null;locale:string;defaultLocale:string;brand?:BrandSettings;videos?:Record<string,{src:string;poster:string;title:string}>;text:Record<string,string>;images:Record<string,{url:string;alt:string}>}
const Context=createContext<SiteCopyData>({version:null,locale:'en',defaultLocale:'en',text:{},images:{}})
export function useSiteLanguage(){const {locale,defaultLocale}=useContext(Context);return{locale,defaultLocale}}
export function useSiteBrand(){const brand=useContext(Context).brand;if(!brand)throw new Error('Site brand settings are unavailable');return brand}
export function useSiteVideo(src:string){return useContext(Context).videos?.[copyKey(src)]}
export function SiteCopyProvider({value,children}:{value:SiteCopyData;children:ReactNode}){return <Context.Provider value={value}>{children}</Context.Provider>}
export function SiteText({value,paragraphs=false}:{value:string;paragraphs?:boolean}){const copy=useContext(Context);const text=(copy.locale.startsWith('zh')?meetingCopyZh[value]??businessCopyZh[value]:undefined)??copy.text[copyKey(value)]??value;if(!paragraphs)return <>{text}</>;const boundary=text.search(/(?<=[.!?。！？])\s+|(?<=[。！？])(?=\S)/u);return boundary<0?<p>{text}</p>:<><p>{text.slice(0,boundary).trim()}</p><p>{text.slice(boundary).trim()}</p></>}
export function SiteImage({src,alt,...props}:ImgHTMLAttributes<HTMLImageElement>){const copy=useContext(Context);const image=typeof src==='string'?copy.images[copyKey(src)]:null;return <img {...props} src={image?.url||src} alt={image?.alt||alt||''}/>}
export function SiteContentVersion({children}:{children:ReactNode}){const copy=useContext(Context);return <div data-hq-content-version={copy.version||undefined}>{children}</div>}
