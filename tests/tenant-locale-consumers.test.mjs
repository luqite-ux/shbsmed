import test from 'node:test'
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'
import sanitizeHtml from 'sanitize-html'
import * as catalog from '../lib/catalog-model.mjs'

// Exercise the actual server data adapters, replacing only Next request/cache
// context and remote database I/O. Omitting the tenant default must fail here.
const text={en:'English',fr:'Français'}
const categories=[{id:'rf',slug:'rf',name_i18n:text},{id:'parts',slug:'contract-components',name_i18n:text}]
const products=[{slug:'rf-item',category_slug:'rf',name_i18n:text,description_i18n:text,overview_i18n:text},{slug:'odm-item',category_slug:'odm-products',name_i18n:text,description_i18n:text},{slug:'part-item',category_slug:'contract-components',name_i18n:text,description_i18n:text}]
const tables={product_categories:categories,products,articles:[{slug:'article',title_i18n:text,excerpt_i18n:text,content_i18n:text}],tenants:[{default_language:'fr',contact_address_i18n:text,site_description_i18n:text,seo_title_i18n:text,seo_description_i18n:text}]}
function query(table){
 let rows=tables[table]
 return {select(){return this},eq(key,value){if(key==='category_slug')rows=rows.filter(r=>r[key]===value);return this},order(){return this},single(){return Promise.resolve({data:rows[0],error:null})},then(resolve){return Promise.resolve({data:rows,error:null}).then(resolve)}}
}
async function load(file){
 const source=await readFile(new URL(`../lib/${file}`,import.meta.url),'utf8')
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
 const exports={}
 const dependencies={'server-only':{},react:{cache:fn=>fn},'next/cache':{unstable_cache:fn=>fn},'@/lib/supabase':{getSupabaseClient:()=>({from:query})},'@/lib/catalog-model.mjs':catalog,'@/lib/locale':{currentLocale:async()=>'ru',siteLanguages:async()=>({defaultLocale:'fr',locales:['fr','en','ru']})},'@/lib/data/company':{company:{legalNameEn:'Example',brandName:'Example'}},'sanitize-html':sanitizeHtml}
 vm.runInNewContext(code,{exports,process:{env:{NEXT_PUBLIC_TENANT_ID:'fixture-tenant'}},require:id=>{if(!(id in dependencies))throw Error(`Unexpected dependency ${id}`);return dependencies[id]}})
 return exports
}
test('medical adapters use tenant default when requested translation is absent',async()=>{
 const api=await load('medical-products.ts')
 const rf=await api.getMedicalProducts('ru'),odm=await api.getOdmProducts('ru'),parts=await api.getContractComponents('ru')
 assert.equal(rf[0].name,'Français');assert.equal(rf[0].overview,'Français')
 assert.equal(odm[0].description,'Français');assert.equal(parts[0].group,'Français')
 assert.equal((await api.getOdmProducts('en'))[0].name,'English')
})
test('news adapter uses tenant default for title excerpt and body',async()=>{
 const api=await load('articles-db.ts'),[article]=await api.getPublishedArticles('ru')
 assert.equal(article.title,'Français');assert.equal(article.excerpt,'Français');assert.equal(article.content,'Français')
})
test('brand settings use tenant default for contact and SEO',async()=>{
 const api=await load('brand-settings.ts'),brand=await api.getBrandSettings('ru')
 assert.equal(brand.address,'Français');assert.equal(brand.description,'Français');assert.equal(brand.seoTitle,'Français');assert.equal(brand.seoDescription,'Français')
})
