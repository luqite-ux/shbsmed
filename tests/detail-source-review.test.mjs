import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {render} from './meeting-fixture.mjs'
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
test('electrode detail excludes the other configuration photo and preserves compatibility source numbers',async()=>{
 const html=await render('app/products/[slug]/page.tsx',{params:Promise.resolve({slug:'rf-electrodes'})})
 assert.ok(!html.includes(seed.electrodeStructure),'Latest REQ24 permits only the current product and its own close-up')
 assert.match(html,/RC201010L-BM/)
 assert.match(html,/L-suffix.*Y-suffix/)
})
test('each cannula detail has its own uncropped integrated tip and exact model rows',async()=>{
 for(const p of seed.products.filter(p=>p.tipImage)){
  const html=await render('app/products/[slug]/page.tsx',{params:Promise.resolve({slug:p.slug})})
  assert.ok(html.includes(p.image));assert.ok(html.includes(p.tipImage))
  assert.match(html,/class="product-detail-inset"/)
  assert.doesNotMatch(html,/class="tip-inset/)
  for(const v of p.variants)assert.ok(html.includes(`<td>${v.model}</td><td>${v.gauge}</td><td>${v.length}</td><td>${v.activeTip}</td><td>${v.color}</td><td>${v.moq}</td>`))
 }
})
