import test from 'node:test'
import assert from 'node:assert/strict'
import {render,load} from './meeting-20261021.test.mjs'
import {createRequire} from 'node:module'
const require=createRequire(import.meta.url),React=require('react'),{renderToStaticMarkup}=require('react-dom/server')
test('both pages show the large cleanroom once and a company heading with two factual paragraphs',async()=>{
 for(const page of ['app/page.tsx','app/about/page.tsx']){
  const html=await render(page),intro=html.match(/class="meeting-company"[\s\S]*?<\/section>/)?.[0]
  assert.ok(intro)
  assert.match(intro,/<h3>Shanghai Brightstone Medical Technology Limited<\/h3>/)
  assert.equal((intro.match(/<p>/g)||[]).length,2)
  assert.doesNotMatch(intro,/Company Introduction|company entrance/)
  assert.equal((html.match(/src="[^"]*47149137cb3053e55321.png"/g)||[]).length,1)
  assert.match(html,/Assembly workstations/)
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
