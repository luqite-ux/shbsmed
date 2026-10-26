'use client'
import {useSiteBrand,SiteText,SiteImage} from '@/components/site-copy'
export function ContactDetails({showAddress=true}:{showAddress?:boolean}){
 const brand=useSiteBrand()
 return <address className="contact-details not-italic">{showAddress&&<p>{brand.address}</p>}<p><span><SiteText value="Email"/>: </span><a href={`mailto:${brand.email}`}>{brand.email}</a></p>{brand.phone&&<p><span><SiteText value="Telephone"/>: </span><a href={`tel:${brand.phone.replace(/[^+\d]/g,'')}`}>{brand.phone}</a></p>}{brand.mobile&&<p><span><SiteText value="Mobile"/>: </span><a href={`tel:${brand.mobile.replace(/[^+\d]/g,'')}`}>{brand.mobile}</a></p>}{brand.wechatQr&&<figure><SiteImage src={brand.wechatQr} alt="WeChat QR code" className="wechat-qr"/><figcaption><SiteText value="WeChat"/></figcaption></figure>}</address>
}
