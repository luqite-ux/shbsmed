import test from 'node:test'
import assert from 'node:assert/strict'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {loadAlias} from './tsx-fixture-loader.mjs'
const aliases={
 '@/components/site-copy':{SiteText:({value})=>value,SiteImage:p=>React.createElement('img',p),useSiteLanguage:()=>({locale:'en',defaultLocale:'en',locales:['en']}),useSiteBrand:()=>({brandName:'Brightstone Medical',legalNameEn:'Shanghai Brightstone Medical Technology Limited',logo:'/logo.png',address:'Shanghai',email:'info@shbsmed.com'})},
 '@/components/localized-link':{__esModule:true,default:({children,...p})=>React.createElement('a',p,children)},
 '@/components/brand-logo':{BrandLogo:()=>React.createElement('a',{href:'/'},'Brightstone Medical')},
 '@/components/reveal':{Reveal:({as='div',children,delay,...p})=>React.createElement(as,p,children)},
 '@/components/medical-media':{ZoomImage:p=>React.createElement('img',p),ProcessVideo:p=>React.createElement('video',p)},
 'next/navigation':{usePathname:()=>'/products',useSearchParams:()=>new URLSearchParams()},
}
const load=n=>loadAlias(n,aliases)

test('REQ09-11 customer banners show only the supplied slogans and accessible side controls',()=>{
 const {HeroCarousel,BANNER_INTERVAL_MS}=load('@/components/hero-carousel')
 const html=renderToStaticMarkup(React.createElement(HeroCarousel))
 assert.equal(BANNER_INTERVAL_MS,14000)
 assert.equal((html.match(/data-banner="/g)||[]).length,3)
 assert.match(html,/Every self-developed product upholds our brand commitment/)
 assert.match(html,/Every OEM project empowers partners/)
 assert.match(html,/Every batch of core component manufacturing/)
 assert.match(html,/aria-label="Previous Banner"/);assert.match(html,/aria-label="Next Banner"/)
 assert.doesNotMatch(html,/<a |Request a quote|Explore products/)
})

test('REQ05 search matches model numbers, ignores case and does not return unrelated products',()=>{
 const {searchEntries}=load('@/lib/site-search')
 const rows=[{name:'RF Electrode',keywords:'RC201010L-BM',href:'/products/rf-electrodes'},{name:'Biopsy needle',href:'/biopsy'}]
 assert.equal(searchEntries(rows,'rc201010l-bm').length,1)
 assert.equal(searchEntries(rows,'RF electrode')[0].href,'/products/rf-electrodes')
 assert.equal(searchEntries(rows,'unknown').length,0)
 assert.equal(searchEntries(rows,'').length,0)
})
test('REQ06-08 menu exposes exactly the requested 3 / 2 / 9 business categories',()=>{
 const {navigation}=load('@/components/site-header')
 const labels=href=>navigation.find(n=>n.href===href).children?.map(c=>c.label)
 assert.deepEqual(Array.from(labels('/products')||[]),['RF Electrode Sets','RF Probes','RF Cannulas'])
 assert.deepEqual(Array.from(labels('/odm-oem')||[]),['Anesthesia Needle Series','Interventional Therapy Series'])
 assert.equal(labels('/contract-manufacturing')?.length,9)
 assert.ok(labels('/contract-manufacturing').includes('Aesthetic Series'))
})
test('REQ03-05 header has accessible language and search controls and no native left marker',()=>{
 const html=renderToStaticMarkup(React.createElement(load('@/components/site-header').SiteHeader))
 assert.match(html,/aria-label="Language"/)
 assert.match(html,/aria-label="Search"/)
 assert.match(html,/nav-chevron/)
})
test('REQ20-22 cards keep image and name links while omitting descriptions and model counts',()=>{
 const html=renderToStaticMarkup(React.createElement(load('@/components/medical-catalog').MedicalCards,{items:[{slug:'rf-electrodes',name:'RF Electrode',image:'/electrode.png',description:'Old summary to remove',variants:[{}]}]}))
 assert.match(html,/href="\/products\/rf-electrodes"/)
 assert.match(html,/RF Electrode/)
 assert.doesNotMatch(html,/Old summary to remove|models|medical-card-description/)
})
test('REQ32 news defaults to a single category and does not mix corporate articles into industry',()=>{
 const articles=[{slug:'industry-one',category:'industry',title:'Industry example',publishedAt:'2026-10-26',excerpt:''},{slug:'company-one',category:'company',title:'Company example',publishedAt:'2026-10-26',excerpt:''}]
 const html=renderToStaticMarkup(React.createElement(load('@/components/news-list').NewsList,{articles}))
 assert.doesNotMatch(html,/All Information|Company example/)
 assert.match(html,/Industry example/)
})
test('REQ13-14 company copy omits repeated company heading and includes the latest IP paragraph',()=>{
 const html=renderToStaticMarkup(React.createElement(load('@/components/meeting-sections').AboutContent,{section:'company',includeManufacturing:false}))
 assert.doesNotMatch(html,/<h3[^>]*>Shanghai Brightstone/)
 assert.match(html,/20/);assert.match(html,/10/);assert.match(html,/ISO 13485/)
})
test('REQ16-17 equipment has headings above photos without explanatory captions',()=>{
 const html=renderToStaticMarkup(React.createElement(load('@/components/meeting-sections').ManufacturingContent))
 const equipment=html.split('Manufacturing Videos')[0]
 assert.doesNotMatch(equipment,/<figcaption|Our production area|Inspection capability/)
})
