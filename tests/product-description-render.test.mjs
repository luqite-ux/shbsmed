import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
const catalog=await import('../lib/catalog-model.mjs')
const shell=({children})=>React.createElement('div',null,children)
async function renderDetail(route,description){
 const source=readFileSync(new URL(`../app/${route}/[slug]/page.tsx`,import.meta.url),'utf8')
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
 const product={slug:'test-needle',name:'Needle',image:'https://example.com/needle.jpg',group:'Tips',description}
 const modules={
  '@/components/product-schema':{ProductSchema:()=>null},
  '@/components/site-copy':{SiteText:({value})=>value},
  'next/navigation':{notFound(){throw Error('not found')}},
  '@/components/localized-link':{default:({children,href})=>React.createElement('a',{href},children)},
  '@/components/page-frame':{PageFrame:shell},
  '@/components/medical-media':{ZoomImage:()=>null},
  '@/components/reveal':{Reveal:shell},
  '@/lib/medical-products':{getOdmProducts:async()=>[product],getContractComponents:async()=>[product]},
  '@/lib/site-content/metadata':{pageMetadata:()=>({})},
 }
 const module={exports:{}}
 vm.runInNewContext(js,{module,exports:module.exports,require:n=>n in modules?modules[n]:require(n)})
 return renderToStaticMarkup(await module.exports.default({params:Promise.resolve({slug:'test-needle'})}))
}
test('contract product adapter retains the requested-language description',async()=>{
 const source=readFileSync(new URL('../lib/medical-products.ts',import.meta.url),'utf8')
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText
 const rows={product_categories:[{id:'c1',slug:'contract-components',name:'Components'}],products:[{slug:'part',category_slug:'contract-components',name:'Part',description_i18n:{en:'English description',zh:'中文说明'}}]}
 const db={from(table){const q={select(){return q},eq(){return q},order(){return q},then(resolve){return Promise.resolve({data:rows[table],error:null}).then(resolve)}};return q}}
 const modules={'server-only':{},react:{cache:fn=>fn},'@/lib/supabase':{getSupabaseClient:()=>db},'@/lib/catalog-model.mjs':catalog,'@/lib/locale':{currentLocale:async()=>'en',siteLanguages:async()=>({defaultLocale:'en',locales:['en']})}}
 const module={exports:{}}
 vm.runInNewContext(js,{module,exports:module.exports,process:{env:{NEXT_PUBLIC_TENANT_ID:'test-tenant'}},require:n=>modules[n]})
 assert.equal((await module.exports.getContractComponents('zh'))[0].description,'中文说明')
})
for(const route of ['odm-oem','contract-manufacturing']){
 test(`${route} renders a backend description as escaped visible text`,async()=>{
  const html=await renderDetail(route,'Customer description <script>alert(1)</script>')
  assert.ok(html.includes('Customer description &lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(!html.includes('<script>alert(1)</script>'))
 })
 test(`${route} leaves an absent description empty without placeholder copy`,async()=>{
  const html=await renderDetail(route,'')
  assert.ok(!html.includes('undefined'))
  assert.ok(!html.includes('description pending'))
  assert.ok(html.includes('/contact?product=test-needle'))
 })
}
