'use client'
import NextLink from 'next/link'
import type {ComponentProps} from 'react'
import {useSiteLanguage} from './site-copy'
export default function LocalizedLink({href,...props}:ComponentProps<typeof NextLink>){
 const {locale,defaultLocale}=useSiteLanguage()
 const target=typeof href==='string'&&href.startsWith('/')&&!href.startsWith('//')&&!/^\/(admin|api)(\/|$)/.test(href)&&locale!==defaultLocale?`/${locale}${href==='/'?'':href}`:href
 return <NextLink {...props} href={target}/>
}
