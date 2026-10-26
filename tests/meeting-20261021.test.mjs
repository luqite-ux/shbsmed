import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {load,render} from './meeting-fixture.mjs'
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
const parts=JSON.parse(readFileSync(new URL('../lib/contract-seed.json',import.meta.url)))
test('home ends with information under the October 23 review',async()=>{
 const html=await render('app/page.tsx')
 const sections=[...html.matchAll(/data-business="([^"]+)"/g)].map(m=>m[1])
 assert.deepEqual(sections,['banner','about','branded','oem','components','news'])
 for(const p of seed.odm)assert.ok(html.includes(p.image))
 for(const p of seed.products)assert.ok(html.includes(`href="/products/${p.slug}"`),'Home must show '+p.slug)
 assert.ok(!html.includes('href="/products/spinal-anesthesia-needle"'))
 assert.ok(!html.includes('href="/products/epidural-anesthesia-needle"'))
 assert.equal((html.match(/<video/g)||[]).length,0)
 assert.doesNotMatch(html,/Reusable RF Electrode|ODM Products/)
})

test('structural descriptions retain source facts without efficacy or clinical instructions',()=>{
 const {productDescriptions,productStructures}=load('lib/meeting-product-copy.ts')
 assert.match(productDescriptions['side-port-rf-cannulas'],/side port/)
 assert.match(productStructures['side-port-rf-cannulas'].join(' '),/Y-shaped/)
 assert.match(productStructures['rf-electrodes'].join(' '),/black insulated/)
 assert.doesNotMatch(JSON.stringify(productStructures),/thermocoagulation|ablat|effective treatment|nerve modulation/i)
})
test('latest branded series keep electrode sets and cannulas separate',async()=>{
 const selected=async series=>(await render('app/products/page.tsx',{searchParams:Promise.resolve({series})})).split('<main')[1].split('</main>')[0]
 const sets=await selected('electrode-sets');assert.match(sets,/href="\/products\/rf-electrodes"/);assert.doesNotMatch(sets,/href="\/products\/[^"]*cannulas"/)
 const cannulas=await selected('cannulas');assert.equal((cannulas.match(/href="\/products\/[^"]*cannulas"/g)||[]).length,4);assert.doesNotMatch(cannulas,/href="\/products\/rf-electrodes"/)
 const probes=await selected('probes');assert.doesNotMatch(probes,/href="\/products\/rf-electrodes"|href="\/products\/[^"]*cannulas"/)
})

test('OEM shows all supplied finished products without premature detail links or repeated category questions',async()=>{
 const html=await render('app/odm-oem/page.tsx');for(const p of seed.odm)assert.ok(html.includes(p.image))
 assert.doesNotMatch(html,/href="\/odm-oem\/|Category assignment pending|ODM Products/)
})
test('components retain supplied images and expose the nine requested series',async()=>{
 const html=await render('app/contract-manufacturing/page.tsx');for(const p of parts)assert.ok(html.includes(p.image))
 assert.match(html,/aria-label="Component series"/);assert.match(html,/Aesthetic Series/)
})
test('manufacturing page preserves equipment inspection and both source videos',async()=>{
 const html=await render('app/about/manufacturing-inspection/page.tsx')
 assert.ok(html.indexOf('Manufacturing Technology & Equipment')<html.indexOf('Quality Inspection Instruments'))
 assert.equal((html.match(/<video/g)||[]).length,2)
})
