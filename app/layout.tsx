import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {SiteCopyProvider} from '@/components/site-copy'
import {getWebsiteCopy} from '@/lib/site-content/copy'
import {cookies} from 'next/headers'
import {currentLocale} from '@/lib/locale'
import {getBrandSettings} from '@/lib/brand-settings'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export async function generateMetadata():Promise<Metadata>{
 const brand=await getBrandSettings(await currentLocale())
 return {
  metadataBase: new URL('https://shbsmed.com'),
  title: { default: brand.seoTitle, template: `%s | ${brand.brandName}` },
  description: brand.seoDescription,
  icons: {
    icon: brand.favicon,
    shortcut: brand.favicon,
    apple: brand.logo,
  },
}}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const preview=(await cookies()).has('__Host-hq-site-preview')
  const locale=await currentLocale()
  let copy
  try{copy=await getWebsiteCopy(locale)}catch(error){
    if(!preview)throw error
    return <html lang="en"><body><main className="mx-auto max-w-xl px-6 py-20"><h1 className="text-3xl font-semibold">Preview is unavailable</h1><p className="my-6">This preview has expired or cannot be loaded. Exit preview to return to the public website.</p><form action="/api/site-content/exit-preview" method="post"><button type="submit">Exit preview</button></form></main></body></html>
  }
  const brand=copy.brand!
  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        {preview&&<aside className="bg-amber-100 px-6 py-3 text-amber-950"><span>Website preview — not published</span><form className="ml-4 inline" action="/api/site-content/exit-preview" method="post"><button className="underline" type="submit">Exit preview</button></form></aside>}
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://shbsmed.com/#organization",name:brand.legalNameEn,url:"https://shbsmed.com",email:brand.email,logo:new URL(brand.logo,'https://shbsmed.com').href,address:brand.address},{"@type":"WebSite","@id":"https://shbsmed.com/#website",url:"https://shbsmed.com",name:brand.brandName,publisher:{"@id":"https://shbsmed.com/#organization"}}]}).replace(/</g,'\\u003c')}} />
        <SiteCopyProvider value={copy}>{children}</SiteCopyProvider>
      </body>
    </html>
  )
}
