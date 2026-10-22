import test from 'node:test'
import assert from 'node:assert/strict'
import {load,render} from './meeting-20261021.test.mjs'
test('review menus have three About entries, three information categories and product level three',async()=>{
 const nav=load('components/site-header.tsx').navigation
 const about=nav.find(x=>x.href==='/about'),news=nav.find(x=>x.href==='/news'),products=nav.find(x=>x.href==='/products')
 assert.equal(about.children.length,3)
 assert.equal(news.label,'Information')
 assert.equal(news.children.map(x=>x.label).join('|'),'Industry Information|Corporate Information|Product Information')
 assert.equal(products.children.map(x=>x.children.length).join(','),'2,1,1')
 const html=await render('app/about/page.tsx')
 for(const item of about.children)assert.ok(html.includes('id="'+item.href.split('#')[1]+'"'))
 const home=await render('app/page.tsx')
 assert.ok(home.indexOf('data-business="news"')<home.indexOf('data-business="manufacturing"'))
 assert.equal((home.match(/id="manufacturing-inspection"/g)||[]).length,1)
})
