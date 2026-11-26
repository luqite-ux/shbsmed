'use client'
import {useSiteBrand,useSiteLanguage,SiteText,SiteImage} from '@/components/site-copy'
export function ContactDetails({showAddress=true,showWeb=true}:{showAddress?:boolean;showWeb?:boolean}){
 const brand=useSiteBrand(),{locale}=useSiteLanguage(),zh=locale.startsWith('zh')
 const mobile=zh?'13482187255':brand.mobile
 return <address className="contact-details not-italic">{showAddress&&<p><SiteText value={brand.address}/></p>}{mobile&&<p><span>Mobile: </span><a href={`tel:${mobile.replace(/[^+\d]/g,'')}`}>{mobile}</a></p>}<p><span>Email: </span><a href={`mailto:${brand.email}`}>{brand.email}</a></p>{zh&&showWeb&&<p><span>Web: </span><a href="https://www.shbsmed.com">www.shbsmed.com</a></p>}{brand.phone&&<p><span><SiteText value="Telephone"/>: </span><a href={`tel:${brand.phone.replace(/[^+\d]/g,'')}`}>{brand.phone}</a></p>}{brand.wechatQr&&<figure><SiteImage src={brand.wechatQr} alt="WeChat QR code" className="wechat-qr"/><figcaption><SiteText value="WeChat"/></figcaption></figure>}</address>
}
