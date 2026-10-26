import test from 'node:test'
import assert from 'node:assert/strict'
import {render,load} from './meeting-fixture.mjs'
import {createRequire} from 'node:module'
const require=createRequire(import.meta.url),React=require('react'),{renderToStaticMarkup}=require('react-dom/server')
test('both pages show the large cleanroom once and three latest factual paragraphs without a repeated company heading',async()=>{
 for(const page of ['app/page.tsx','app/about/page.tsx']){
  const html=await render(page),intro=html.match(/class="meeting-company feedback-company"[\s\S]*?<\/section>/)?.[0]
  assert.ok(intro)
  assert.doesNotMatch(intro,/<h3/);assert.match(intro,/20/);assert.match(intro,/10/)
  assert.equal((intro.match(/<p>/g)||[]).length,3)
  assert.doesNotMatch(intro,/Company Introduction|company entrance/)
  assert.equal((html.match(/alt="Brightstone Medical cleanroom production area"/g)||[]).length,1)
  assert.doesNotMatch(html,/Assembly workstations/)
 }
})
test('paragraph formatting keeps the existing translated content key and all text',()=>{
 const {SiteText,SiteCopyProvider}=load('components/site-copy.tsx'),{copyKey}=load('lib/site-copy-key.mjs')
 const value='Founded in December 2015. Our business includes branded products.'
 for(const text of [value,'公司成立于2015年12月。业务包括品牌产品。']){
  const html=renderToStaticMarkup(React.createElement(SiteCopyProvider,{value:{text:{[copyKey(value)]:text},images:{},locale:'zh',defaultLocale:'en',version:null}},React.createElement(SiteText,{value,paragraphs:true})))
  assert.equal((html.match(/<p>/g)||[]).length,2)
  assert.equal(html.replace(/<\/?p>/g,''),text.replace(/\. /g,'.'))
 }
})
