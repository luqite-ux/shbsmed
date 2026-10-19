import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react')
const {renderToStaticMarkup}=require('react-dom/server')
// Tests the rendered naming contract: removing the group role must fail.
function load(file){
 const source=readFileSync(new URL(`../components/${file}.tsx`,import.meta.url),'utf8')
 const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText
 const module={exports:{}}
 const aliases={
  '@/components/localized-link':{default:({children,...props})=>React.createElement('a',props,children)},
  '@/components/reveal':{Reveal:({children})=>React.createElement('div',null,children)},
 }
 vm.runInNewContext(js,{module,exports:module.exports,require:name=>name==='@/components/medical-catalog'?load('medical-catalog'):aliases[name]||require(name)})
 return module.exports
}
for(const [file,component,props,label] of [
 ['medical-catalog','ProductSeries',{items:[]},'RF product series'],
 ['component-series','ComponentSeries',{parts:[]},'Component series'],
])test(`${label} exposes its accessible name on a semantic group`,()=>{
 const html=renderToStaticMarkup(React.createElement(load(file)[component],props))
 const opening=html.match(/<div[^>]*class="series-tabs"[^>]*>/)?.[0]
 assert.ok(opening,'Expected real filter group markup')
 assert.match(opening,/role="group"/)
 assert.ok(opening.includes(`aria-label="${label}"`))
})
