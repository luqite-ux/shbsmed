import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {load} from './meeting-fixture.mjs'
const assets=JSON.parse(readFileSync(new URL('../lib/customer-attachments.json',import.meta.url),'utf8'))
test('REQ15-17 all 24 supplied assets retain their numbered order and tenant ownership',()=>{
 for(const [key,count] of [['certificates',12],['manufacturing',5],['inspection',7]]){
  assert.equal(assets[key].length,count)
  assert.deepEqual(assets[key].map(i=>i.order),Array.from({length:count},(_,i)=>i+1))
  for(const item of assets[key])assert.match(item.image,/^https:\/\/[^/]+\/tenants\/fd8a0387-ffb2-4cf1-87d3-be3a3a15810b\/attachments-20261028\/[a-f0-9]+\.webp$/)
 }
 assert.equal(assets.certificates.reduce((n,c)=>n+c.pages,0),30)
 for(const item of assets.certificates)assert.match(item.document,/\.(pdf|jpg)$/)
})
test('REQ15 certificate gallery exposes every original document including CE and continuation letter',()=>{
 const {QualificationGallery}=load('components/attachment-galleries.tsx')
 const html=renderToStaticMarkup(React.createElement(QualificationGallery))
 assert.equal((html.match(/class="attachment-document"/g)||[]).length,12)
 assert.match(html,/EC Certificate/);assert.match(html,/MDD Certificate Continuation Letter/)
 for(const item of assets.certificates)assert.ok(html.includes(item.document))
})
test('REQ16-17 photos have accessible descriptions without visible filenames or captions',()=>{
 const {AttachmentPhotoGallery}=load('components/attachment-galleries.tsx')
 for(const group of ['manufacturing','inspection']){
  const html=renderToStaticMarkup(React.createElement(AttachmentPhotoGallery,{group}))
  assert.equal((html.match(/<img /g)||[]).length,assets[group].length)
  assert.doesNotMatch(html,/<figcaption|<p[ >]/)
  for(const item of assets[group])assert.ok(html.includes('alt="'+item.title+'"'))
 }
})
