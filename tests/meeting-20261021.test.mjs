import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
import {copyKey} from '../lib/site-copy-key.mjs'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
const parts=JSON.parse(readFileSync(new URL('../lib/contract-seed.json',import.meta.url)))
export function load(file){
 const mod={exports:{}},code=ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText
 const aliases={
 '@/lib/site-copy-key.mjs':{copyKey},
 '@/components/localized-link':{__esModule:true,default:({children,...p})=>React.createElement('a',p,children)},
 '@/components/site-copy':{SiteText:({value,paragraphs})=>paragraphs?value.split(/(?<=\.)\s+/).map((v,i)=>React.createElement('p',{key:i},v)):value,SiteImage:p=>React.createElement('img',p),SiteContentVersion:({children})=>children,useSiteLanguage:()=>({locale:'en',defaultLocale:'en'}),useSiteBrand:()=>({description:'Medical needles',legalNameEn:'Shanghai Brightstone Medical Technology Limited',address:'Shanghai'})},
 '@/components/brand-logo':{BrandLogo:()=>React.createElement('a',{href:'/'},'Brightstone')},
 '@/components/reveal':{Reveal:({as='section',children,delay,...p})=>React.createElement(as,p,children)},
 '@/components/medical-media':{ZoomImage:p=>React.createElement('img',p),ProcessVideo:p=>React.createElement('video',{src:p.src,controls:true})},
 '@/components/hero-carousel':{HeroCarousel:()=>React.createElement('section',{'data-business':'banner'},'Banner')},
 '@/lib/site-content/metadata':{pageMetadata:(_path,value)=>value},
 '@/lib/locale':{localizedPath:async path=>path},
 '@/lib/articles-db':{getPublishedArticles:async()=>[]},
 '@/lib/medical-products':{getMedicalProducts:async()=>seed.products,getOdmProducts:async()=>seed.odm,getContractComponents:async()=>parts},
 'next/navigation':{usePathname:()=>'/products',notFound(){throw Error('not found')},permanentRedirect(path){throw Error('redirect:'+path)}},
 }
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:n=>{if(n in aliases)return aliases[n];if(n.startsWith('@/')){const path=n.replace('@/','');if(path.endsWith('.json'))return JSON.parse(readFileSync(new URL('../'+path,import.meta.url)));for(const ext of ['.tsx','.ts','.mjs'])if(existsSync(new URL('../'+path+ext,import.meta.url)))return load(path+ext)}return require(n)}})
 return mod.exports
}
export const render=async(file,props)=>renderToStaticMarkup(await load(file).default(props)).replaceAll('&amp;','&')
test('home lets visitors read every business in meeting order without separate equipment tail',async()=>{
 const html=await render('app/page.tsx')
 const sections=[...html.matchAll(/data-business="([^"]+)"/g)].map(m=>m[1])
 assert.deepEqual(sections,['banner','about','branded','oem','components','news'])
 for(const p of seed.odm)assert.ok(html.includes(p.image))
 for(const p of seed.products)assert.ok(html.includes(`href="/products/${p.slug}"`),'Home must show '+p.slug)
 assert.ok(html.includes('href="/products/spinal-anesthesia-needle"'))
 assert.ok(html.includes('href="/products/epidural-anesthesia-needle"'))
 assert.equal((html.match(/<video/g)||[]).length,2)
 assert.doesNotMatch(html,/Reusable RF Electrode|ODM Products/)
})

test('structural descriptions retain source facts without efficacy or clinical instructions',()=>{
 const {productDescriptions,productStructures}=load('lib/meeting-product-copy.ts')
 assert.match(productDescriptions['side-port-rf-cannulas'],/side port/)
 assert.match(productStructures['side-port-rf-cannulas'].join(' '),/Y-shaped/)
 assert.match(productStructures['rf-electrodes'].join(' '),/black insulated/)
 assert.doesNotMatch(JSON.stringify(productStructures),/thermocoagulation|ablat|effective treatment|nerve modulation/i)
})
test('brand categories isolate five pain products and each anesthesia series server-side',async()=>{
 const renderSeries=series=>render('app/products/page.tsx',{searchParams:Promise.resolve({series})})
 const pain=await renderSeries('pain');assert.doesNotMatch(pain,/Reusable RF Electrode/)
 for(const p of seed.products)assert.ok(pain.includes(`href="/products/${p.slug}"`))
 const spinal=await renderSeries('spinal');assert.match(spinal,/href="\/products\/spinal-anesthesia-needle"/);assert.doesNotMatch(spinal,/href="\/products\/rf-electrodes"|href="\/products\/epidural-anesthesia-needle"/)
 const epidural=await renderSeries('epidural');assert.match(epidural,/href="\/products\/epidural-anesthesia-needle"/);assert.doesNotMatch(epidural,/href="\/products\/spinal-anesthesia-needle"/)
})
test('OEM shows all supplied finished products without premature detail links or repeated category questions',async()=>{
 const html=await render('app/odm-oem/page.tsx');for(const p of seed.odm)assert.ok(html.includes(p.image))
 assert.doesNotMatch(html,/href="\/odm-oem\/|Category assignment pending|ODM Products/)
})
test('components show actual supplied parts without empty application-category tabs',async()=>{
 const html=await render('app/contract-manufacturing/page.tsx');for(const p of parts)assert.ok(html.includes(p.image))
 assert.doesNotMatch(html,/Interventional component requirements|aria-label="Component series"/)
})
test('About has ordered introduction qualifications equipment and both source videos',async()=>{
 const html=await render('app/about/page.tsx');assert.ok(html.indexOf('Shanghai Brightstone Medical Technology Limited')<html.indexOf('Company & Product Qualifications'))
 assert.ok(html.indexOf('Company & Product Qualifications')<html.indexOf('Manufacturing Technology & Equipment'))
 assert.equal((html.match(/<video/g)||[]).length,2)
})
