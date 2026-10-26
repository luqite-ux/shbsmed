import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {test} from 'node:test'
const banners=JSON.parse(readFileSync(new URL('../lib/feedback-banners.json',import.meta.url),'utf8'))
test('three customer banners retain the exact approved slogans and tenant image ownership',()=>{
 assert.deepEqual(banners.map((b:any)=>b.heading),[
 'Every self-developed product upholds our brand commitment to compliance and quality',
 'Every OEM project empowers partners with proven technology and production lines',
 'Every batch of core component manufacturing brings your functional and quality vision to life'])
 for(const banner of banners)for(const src of [banner.image,banner.mobileImage])assert.match(src,/\/tenants\/fd8a0387-ffb2-4cf1-87d3-be3a3a15810b\/feedback-20261026\/[a-f0-9]+\.webp$/)
})
