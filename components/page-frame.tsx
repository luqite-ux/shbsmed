import {Reveal} from '@/components/reveal'
import type {ReactNode} from 'react'
import {SiteHeader} from '@/components/site-header'
import {SiteFooter} from '@/components/site-footer'
import {SiteText,SiteContentVersion} from '@/components/site-copy'
import {MeetingBreadcrumb} from '@/components/meeting-breadcrumb'
export function PageFrame({eyebrow,title,description,children}:{eyebrow:string;title:string;description:string;children:ReactNode}){return <SiteContentVersion><SiteHeader/><main><section className="compact-page-heading bg-brand-blue-deep text-white"><Reveal className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"><MeetingBreadcrumb title={title}/><h1 className="mt-2 max-w-4xl text-3xl font-semibold"><SiteText value={title}/></h1>{description&&<p className="mt-3 max-w-3xl text-lg text-white/80"><SiteText value={description}/></p>}</Reveal></section>{children}</main><SiteFooter/></SiteContentVersion>}
