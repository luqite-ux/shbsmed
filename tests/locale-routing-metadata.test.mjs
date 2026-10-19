import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'

async function moduleAt(path,dependencies){
 const source=await readFile(new URL(path,import.meta.url),'utf8')
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText
 const exports={}
 vm.runInNewContext(code,{exports,URL,process:{env:{NEXT_PUBLIC_TENANT_ID:'fixture-only'}},require:id=>{assert.ok(id in dependencies,`Unexpected import ${id}`);return dependencies[id]}})
 return exports
}
async function localeApi(config,path){
 const query={select(){return this},eq(){return this},async single(){return{data:config}}}
 return moduleAt('../lib/locale.ts',{'server-only':{},react:{cache:fn=>fn},'next/cache':{unstable_cache:fn=>fn},'next/headers':{headers:async()=>({get:()=>path})},'./supabase':{getSupabaseClient:()=>({from:()=>query})}})
}
test('single-language routes stay unprefixed and disabled locales are not selected',async()=>{
 const api=await localeApi({default_language:'en',supported_languages:['en']},'/fr/products')
 assert.equal(await api.currentLocale(),'en')
 assert.equal(await api.localizedPath('/products'),'/products')
})
test('enabling a locale changes path selection without changing the schema or code',async()=>{
 const api=await localeApi({default_language:'en',supported_languages:['en','fr']},'/fr/products')
 assert.equal(await api.currentLocale(),'fr')
 assert.equal(await api.localizedPath('/products'),'/fr/products')
 assert.equal(await api.localizedPath('/','fr'),'/fr')
 assert.equal(await api.localizedPath('/products','en'),'/products')
})
test('localized metadata keeps canonical, hreflang and sharing URL aligned',async()=>{
 const locale=await localeApi({default_language:'en',supported_languages:['en','fr']},'/fr/products')
 const api=await moduleAt('../lib/site-content/metadata.ts',{
  './site-content':{siteContentMetadata:async(path,language)=>({title:`${language} title`,description:`${language} description`})},
  '@/lib/locale':locale,'next/headers':{cookies:async()=>({has:()=>false})},
  '@/lib/brand-settings':{getBrandSettings:async()=>({logo:'/logo.png',seoTitle:'Fallback',seoDescription:'Fallback'})},
 })
 const metadata=await api.pageMetadata('/products',{})
 assert.equal(metadata.alternates.canonical,'https://shbsmed.com/fr/products')
 assert.equal(metadata.alternates.languages.fr,metadata.alternates.canonical)
 assert.equal(metadata.alternates.languages.en,'https://shbsmed.com/products')
 assert.equal(metadata.alternates.languages['x-default'],metadata.alternates.languages.en)
 assert.equal(metadata.openGraph.url,metadata.alternates.canonical)
 assert.equal(metadata.openGraph.title,'fr title')
 assert.equal(metadata.twitter.description,'fr description')
})
