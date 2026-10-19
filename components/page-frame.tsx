import {Reveal} from '@/components/reveal'
import type { ReactNode } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {SiteText,SiteContentVersion} from '@/components/site-copy'
export function PageFrame({eyebrow,title,description,children}:{eyebrow:string,title:string,description:string,children:ReactNode}){return <SiteContentVersion><SiteHeader/><main><section className="bg-brand-blue-deep text-white"><Reveal className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><p className="text-sm font-semibold uppercase tracking-widest text-brand-teal"><SiteText value={eyebrow}/></p><h1 className="mt-3 max-w-4xl text-4xl font-semibold"><SiteText value={title}/></h1><p className="mt-5 max-w-3xl text-lg text-white/75"><SiteText value={description}/></p></Reveal></section>{children}</main><SiteFooter/></SiteContentVersion>}
