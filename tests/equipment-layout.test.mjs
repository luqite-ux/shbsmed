import test from 'node:test'
import assert from 'node:assert/strict'
import {render} from './meeting-20261021.test.mjs'
import {readFileSync} from 'node:fs'

test('processing photograph appears only on the component page, replacing both old snapshots',async()=>{
 const home=await render('app/page.tsx')
 const page=await render('app/contract-manufacturing/page.tsx')
 assert.ok(!home.includes('component-processing-photo'))
 assert.equal((page.match(/class="component-processing-photo"/g)||[]).length,1)
 assert.ok(page.includes('Needle tubes during processing'))
 for(const html of [home,page])for(const old of ['Semi-finished needle tubes','Semi-finished needle assemblies'])assert.ok(!html.includes(old))
})

test('home and About use the same two uncropped photo pairs and portrait video layout',async()=>{
 for(const route of ['app/page.tsx','app/about/page.tsx']){
  const html=await render(route)
  assert.equal((html.match(/class="meeting-about-block equipment-showcase"/g)||[]).length,2)
  assert.match(html,/class="manufacturing-video-pair"/)
  for(const caption of ['Assembly workstations','Automated printing equipment','Inspection instruments','Dimensional inspection area'])assert.ok(html.includes(caption))
  assert.equal((html.match(/<video/g)||[]).length,2)
 }
})

test('equipment-only styling prevents cropping and keeps full original photos',()=>{
 const css=readFileSync(new URL('../app/globals.css',import.meta.url),'utf8')
 assert.match(css,/\.equipment-showcase \.photo-grid img\s*\{[^}]*object-fit:\s*contain/)
 assert.match(css,/\.manufacturing-video-pair \.process-video\s*\{[^}]*aspect-ratio:\s*9\s*\/\s*16/)
 assert.match(css,/\.equipment-showcase \.zoom-label\s*\{[^}]*position:\s*absolute/)
})
