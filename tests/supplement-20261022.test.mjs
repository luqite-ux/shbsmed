import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {render,load} from './meeting-fixture.mjs'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
test('banner actions lead to the three requested business pages',()=>{
 const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url)))
 assert.deepEqual(seed.slides.map(s=>s.href),['/products','/odm-oem','/contract-manufacturing'])
 assert.deepEqual(seed.slides.map(s=>s.heading),['Branded Products','OEM Manufacturing','Component Manufacturing'])
})
test('updates page keeps three categories and an honest empty state',async()=>{
 const html=await render('app/news/page.tsx',{searchParams:Promise.resolve({category:'industry'})})
 for(const label of ['Industry Information','Corporate Information','Product Information'])assert.ok(html.includes(label))
 assert.match(html,/No articles have been published in this category yet/)
 assert.doesNotMatch(html,/>News<|Industry News|Product News|Company News/)
 const {NewsList}=load('components/news-list.tsx')
 const articles=[{slug:'industry-test',category:'industry',title:'Industry item',publishedAt:'2026-10-22'},{slug:'company-test',category:'company',title:'Company item',publishedAt:'2026-10-22'}]
 const filtered=renderToStaticMarkup(React.createElement(NewsList,{articles,category:'company'}))
 assert.ok(filtered.includes('Company item'));assert.ok(!filtered.includes('Industry item'))
})
