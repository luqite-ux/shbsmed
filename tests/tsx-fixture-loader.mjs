import {readFileSync,existsSync} from 'node:fs'
import {createRequire} from 'node:module'
import vm from 'node:vm'
const require=createRequire(import.meta.url),ts=require('typescript')
export function loadAlias(name,aliases={}){
 if(name in aliases)return aliases[name]
 if(!name.startsWith('@/'))return require(name)
 const base=new URL('../'+name.slice(2),import.meta.url)
 if(name.endsWith('.json'))return JSON.parse(readFileSync(base))
 const file=['.tsx','.ts'].map(ext=>new URL(base.href+ext)).find(existsSync)
 if(!file)throw Error(`No source for ${name}`)
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText
 const mod={exports:{}}
 vm.runInNewContext(code,{module:mod,exports:mod.exports,require:n=>loadAlias(n,aliases)})
 return mod.exports
}
