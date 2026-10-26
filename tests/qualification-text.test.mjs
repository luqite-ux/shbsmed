import test from 'node:test'
import assert from 'node:assert/strict'
import {render} from './meeting-fixture.mjs'

test('home and About retain qualifications without a missing-certificate prompt',async()=>{
 for(const page of ['app/page.tsx','app/about/qualifications/page.tsx']){
  const html=await render(page)
  assert.doesNotMatch(html,/Our single-use RF electrodes and RF cannulas have market-access certificates/);if(page.includes("qualifications"))assert.match(html,/Company & Product Qualifications/)
  assert.doesNotMatch(html,/Certificate images|Current certificate images for public display are pending confirmation/)
 }
})
