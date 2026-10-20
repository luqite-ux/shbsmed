import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
const parts=JSON.parse(readFileSync(new URL('../lib/contract-seed.json',import.meta.url)))
function load(file){
 const mod={exports:{}},code=ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText
 const aliases={
  '@/components/localized-link':{__esModule:true,default:({children,...p})=>React.createElement('a',p,children)},
  '@/components/site-copy':{SiteText:({value})=>value,SiteImage:p=>React.createElement('img',p)},
  '@/components/reveal':{Reveal:({as='section',children,delay,...p})=>React.createElement(as,p,children)},
  '@/components/page-frame':{PageFrame:({children})=>React.createElement('main',null,children)},
  '@/components/medical-media':{ZoomImage:p=>React.createElement('img',p),ProcessVideo:()=>null},
  '@/components/product-schema':{ProductSchema:()=>null},
  '@/lib/site-content/metadata':{pageMetadata:()=>({})},
  '@/lib/medical-products':{getMedicalProducts:async()=>seed.products,getOdmProducts:async()=>seed.odm,getContractComponents:async()=>parts},
  'next/navigation':{notFound(){throw Error('not found')}},
 }
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:n=>{
  if(n in aliases)return aliases[n]
  if(n.startsWith('@/')){const path=n.replace('@/','');if(path.endsWith('.json'))return JSON.parse(readFileSync(new URL('../'+path,import.meta.url)));for(const ext of ['.tsx','.ts'])if(existsSync(new URL('../'+path+ext,import.meta.url)))return load(path+ext)}
  return require(n)
 }})
 return mod.exports
}
const render=async(file,props)=>renderToStaticMarkup(await load(file).default(props)).replaceAll('&amp;','&')
// Missing historical entries or mixing anesthesia into pain-management lists is a regression.
test('product catalog exposes anesthesia separately and labels reusable electrode history',async()=>{
 const html=await render('app/products/page.tsx')
 assert.match(html,/Anesthesia/)
 assert.match(html,/Reusable RF Electrode/)
 assert.match(html,/Historical image/)
})
test('historical anesthesia detail shows pending information, never invented specifications',async()=>{
 const html=await render('app/products/[slug]/page.tsx',{params:Promise.resolve({slug:'epidural-anesthesia-needle'})})
 assert.match(html,/Historical image/)
 assert.match(html,/pending confirmation/)
 assert.doesNotMatch(html,/<table/)
})
test('ODM listing labels every candidate and keeps OEM after its five images without workflow',async()=>{
 const html=await render('app/odm-oem/page.tsx')
 for(const p of seed.odm)assert.ok(html.includes(p.slug))
 assert.ok((html.match(/Category assignment pending confirmation/g)||[]).length>=5)
 assert.ok(html.indexOf('OEM private-label manufacturing')>html.indexOf('ptc-needle'))
 assert.ok(!html.includes('From your requirements to production'))
})
test('ODM detail preserves pending sections when no description or specs exist',async()=>{
 const html=await render('app/odm-oem/[slug]/page.tsx',{params:Promise.resolve({slug:'brain-irrigation-needle'})})
 for(const label of ['Category assignment pending confirmation','Product introduction','Models & specifications','Structure close-up','Product features','Specifications & customization scope'])assert.ok(html.includes(label),label)
})
test('biopsy detail includes nine independent structure examples, not an asserted single assembly',async()=>{
 const html=await render('app/contract-manufacturing/[slug]/page.tsx',{params:Promise.resolve({slug:'bone-marrow-biopsy-components'})})
 for(const p of parts.slice(3))assert.ok(html.includes(p.name),p.name)
 assert.match(html,/independent processing examples/)
 assert.match(html,/Diameter, length, material and processing range pending confirmation/)
})
test('manufacturing restores qualifications placeholder between company and equipment',async()=>{
 const html=await render('app/manufacturing/page.tsx')
 const cert=html.indexOf('Company & Product Qualifications'),equipment=html.indexOf('Manufacturing Technology & Equipment')
 assert.ok(cert>=0&&equipment>cert)
 assert.ok(html.indexOf(seed.photos.find(p=>p.group==='exhibitions').image)<cert)
})
