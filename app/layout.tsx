import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://shbsmed.com'),
  title: { default: 'Brightstone Medical | RF Electrodes & Cannulas', template: '%s | Brightstone Medical' },
  description: 'Shanghai manufacturer of disposable RF electrodes and multi-configuration RF cannulas for international B2B sourcing.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/images/brand/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://shbsmed.com/#organization",name:"Shanghai Brightstone Medical Technology Limited",url:"https://shbsmed.com",email:"info@shbsmed.com"},{"@type":"WebSite","@id":"https://shbsmed.com/#website",url:"https://shbsmed.com",name:"Brightstone Medical",publisher:{"@id":"https://shbsmed.com/#organization"}}]})}} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
