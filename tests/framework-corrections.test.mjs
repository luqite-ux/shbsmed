import test from 'node:test'
import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'
import {loadAlias} from './tsx-fixture-loader.mjs'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
function load(file){
 const filename=new URL(`../${file}`,import.meta.url)
 const js=ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
 const loadedModule={exports:{}}
 const aliases={
  '@/components/localized-link':{default:({children,...props})=>React.createElement('a',props,children)},
  '@/components/reveal':{Reveal:({children})=>React.createElement('div',null,children)},
  '@/components/site-copy':{SiteText:({value})=>value},
 }
 vm.runInNewContext(js,{module:loadedModule,exports:loadedModule.exports,require:name=>name==='@/components/medical-catalog'?load('components/medical-catalog.tsx'):aliases[name]||loadAlias(name,aliases)})
 return loadedModule.exports
}
// Replacing application categories with manufacturing-process categories must fail.
test('component navigation retains all five application categories without assigning unverified products',()=>{
 const {ComponentSeries}=load('components/component-series.tsx')
 const html=renderToStaticMarkup(React.createElement(ComponentSeries,{parts:[
  {slug:'bone-marrow-biopsy-components',name:'Bone marrow',group:'Biopsy',image:'https://example.com/biopsy.jpg'},
  {slug:'pencil-point',name:'Pencil point',group:'Tip structures',image:'https://example.com/tip.jpg'},
 ]}))
 for(const label of ['Biopsy','Interventional','Anesthesia','Infusion','Other']) assert.ok(html.includes(`>${label}</button>`),`${label}: ${html.slice(0,700)}`)
 assert.ok(!html.includes('>Tip structures</button>'))
 assert.ok(html.includes('Bone marrow'))
 assert.ok(!html.includes('Pencil point'))
})
// Dropping inquiry type at the server normalization boundary must fail.
test('inquiry type is validated and retained in the saved subject',async()=>{
 const file=new URL('../lib/inquiry-business.mjs',import.meta.url)
 const {buildInquirySubject}=await import(file.href)
 assert.equal(buildInquirySubject({inquiryType:'OEM',subject:'RF electrode'}),'OEM — RF electrode')
 assert.equal(buildInquirySubject({inquiryType:'Product purchase',subject:'Needles'}),'Product purchase — Needles')
 assert.equal(buildInquirySubject({inquiryType:'Contract manufacturing',subject:''}),'Contract manufacturing — Website RFQ')
 assert.throws(()=>buildInquirySubject({inquiryType:'Injected type',subject:'Needles'}))
})
