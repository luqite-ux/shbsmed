import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
function load(file){
 const mod={exports:{}},code=ts.transpileModule(readFileSync(new URL('../'+file,import.meta.url),'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText
 const children=({children})=>children
 const aliases={
 '@/lib/site-content/metadata':{pageMetadata:()=>({})},
 '@/components/site-copy':{SiteText:({value})=>value,SiteImage:p=>React.createElement('img',p),SiteContentVersion:children},
 '@/components/localized-link':{__esModule:true,default:({children,...p})=>React.createElement('a',p,children)},
 '@/components/reveal':{Reveal:({as='section',children,...p})=>React.createElement(as,p,children)},
 '@/components/hero-carousel':{HeroCarousel:()=>React.createElement('div',null,'Banner')},
 '@/components/medical-media':{ZoomImage:p=>React.createElement('img',p)},
 '@/components/site-header':{SiteHeader:()=>null},'@/components/site-footer':{SiteFooter:()=>null},
 '@/lib/site-seed.json':seed,
 '@/lib/framework-home-media.json':JSON.parse(readFileSync(new URL('../lib/framework-home-media.json',import.meta.url))),
 '@/lib/medical-products':{getMedicalProducts:async()=>seed.products,getOdmProducts:async()=>seed.odm},
 }
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:n=>aliases[n]||(n.startsWith('@/components/')?load(n.replace('@/','')+'.tsx'):require(n))})
 return mod.exports
}
// Catch replacement of series entrances by the full product catalog, or loss of pending labels.
test('home renders document series entrances and explicit pending placeholders',async()=>{
 const html=renderToStaticMarkup(await load('app/page.tsx').default())
 for(const name of ['RF Cannulas','RF Electrodes','Anesthesia Series','Biopsy Components','Interventional Components','Anesthesia Components'])assert.ok(html.includes(name),name)
 assert.ok(html.includes('Public version and scope pending confirmation'))
 assert.ok(html.includes('Historical image'))
 assert.ok(!html.includes('From your requirements to production'))
 assert.ok(!html.includes('Practical answers for your project'))
 const headings=[...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m=>m[1].replace(/<[^>]+>/g,'').replaceAll('&amp;','&'))
 assert.deepEqual(headings,['About Brightstone & Company Qualifications','Branded Products','ODM Products','Contract Manufacturing Components','Manufacturing Technology & Equipment','Quality Inspection','Tell us your product or manufacturing requirements'])
 for(const name of ['Processing equipment','Production environment','Inspection instruments','Inspection environment'])assert.ok(html.includes(`alt="${name}"`),name)
})
