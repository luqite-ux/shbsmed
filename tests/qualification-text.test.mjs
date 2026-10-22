import test from 'node:test'
import assert from 'node:assert/strict'
import {render} from './meeting-20261021.test.mjs'

test('home and About retain qualifications without a missing-certificate prompt',async()=>{
 for(const page of ['app/page.tsx','app/about/page.tsx']){
  const html=await render(page)
  assert.match(html,/Our single-use RF electrodes and RF cannulas have market-access certificates for China, the United States and Europe\./)
  assert.doesNotMatch(html,/Certificate images|Current certificate images for public display are pending confirmation/)
 }
})
