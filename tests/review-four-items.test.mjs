import test from 'node:test'
import assert from 'node:assert/strict'
import {load,render} from './meeting-fixture.mjs'
test('review menus have three About entries, three information categories and product level three',async()=>{
 const nav=load('components/site-header.tsx').navigation
 const about=nav.find(x=>x.href==='/about'),news=nav.find(x=>x.href==='/news'),products=nav.find(x=>x.href==='/products')
 assert.equal(about.children.length,3)
 assert.equal(news.label,'Information')
 assert.equal(news.children.map(x=>x.label).join('|'),'Industry Information|Corporate Information|Product Information')
 assert.deepEqual(Array.from(products.children.map(x=>x.label)),['RF Electrode Sets','RF Probes','RF Cannulas']);assert.ok(products.children.every(x=>!x.children))
 assert.equal(about.children.map(x=>x.href).join('|'),'/about/company-introduction|/about/qualifications|/about/manufacturing-inspection')
 for(const item of about.children){const html=await render('app'+item.href+'/page.tsx');assert.ok(html.includes('<main>'))}
 const home=await render('app/page.tsx')
 assert.equal((home.match(/id="manufacturing-inspection"/g)||[]).length,0)
})
test('independent About pages do not repeat other sections or invent certificate images',async()=>{
 const intro=(await render('app/about/company-introduction/page.tsx')).split('<main>')[1].split('</main>')[0]
 assert.match(intro,/nearly 20/);assert.match(intro,/10 software copyrights/)
 assert.doesNotMatch(intro,/market-access certificates|<video/)
 const qualifications=(await render('app/about/qualifications/page.tsx')).split('<main>')[1].split('</main>')[0]
 assert.match(qualifications,/Company & Product Qualifications/);assert.doesNotMatch(qualifications,/market-access certificates/)
 assert.doesNotMatch(qualifications,/<img|<video|pending confirmation/)
})
