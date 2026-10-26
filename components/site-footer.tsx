"use client"
import {SiteText,useSiteBrand} from '@/components/site-copy'
import Link from '@/components/localized-link'
import {BrandLogo} from '@/components/brand-logo'
import {ContactDetails} from '@/components/contact-details'
import {navigation} from '@/lib/site-navigation'
export function SiteFooter(){const brand=useSiteBrand();return <footer className="feedback-footer border-t border-border bg-brand-blue-deep text-white"><div className="medical-shell py-12"><div className="feedback-footer-grid"><div><BrandLogo size="footer"/><p className="mt-6 max-w-sm leading-7 text-white/85">{brand.address}</p></div><nav aria-label="Footer"><h2 className="mb-5 font-semibold"><SiteText value="Navigation"/></h2><ul>{navigation.map(item=><li key={item.href}><Link href={item.href}><SiteText value={item.label}/></Link></li>)}</ul></nav><div><h2 className="mb-5 font-semibold"><SiteText value="Contact Us"/></h2><ContactDetails showAddress={false}/></div></div><p className="mt-10 border-t border-white/20 pt-6 text-sm text-white/80">&copy; {new Date().getFullYear()} {brand.legalNameEn}. All rights reserved.</p></div></footer>}
