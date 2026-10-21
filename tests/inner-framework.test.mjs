import test from 'node:test'
import assert from 'node:assert/strict'
import {render} from './meeting-20261021.test.mjs'
test('anesthesia details do not invent missing specifications',async()=>{
 const html=await render('app/products/[slug]/page.tsx',{params:Promise.resolve({slug:'epidural-anesthesia-needle'})})
 assert.match(html,/pending confirmation/);assert.doesNotMatch(html,/<table/)
 assert.match(html,/products\?series=epidural/)
})
test('retired reusable electrode is not available as a product detail',async()=>{
 await assert.rejects(()=>render('app/products/[slug]/page.tsx',{params:Promise.resolve({slug:'reusable-rf-electrode'})}),/not found/)
})
for(const [route,target] of [['odm-oem/[slug]','/odm-oem'],['contract-manufacturing/[slug]','/contract-manufacturing'],['manufacturing','/about']])test('legacy '+route+' redirects to current gallery or About',async()=>{
 await assert.rejects(()=>render('app/'+route+'/page.tsx'),new RegExp('redirect:'+target))
})
