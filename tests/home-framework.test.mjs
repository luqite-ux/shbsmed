import test from 'node:test'
import assert from 'node:assert/strict'
import {render} from './meeting-fixture.mjs'
// October 21 supersedes the October 19 section sequence; no extra workflow or FAQ.
test('meeting home has only the requested primary headings',async()=>{
 const html=await render('app/page.tsx')
 const headings=[...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map(m=>m[1].replace(/<[^>]+>/g,''))
 const primary=['About Us','Branded Products','OEM Manufacturing','Core Component Manufacturing','Information'];assert.deepEqual(headings.filter(h=>primary.includes(h)),primary)
 assert.ok(!html.includes('From your requirements to production'))
 assert.ok(!html.includes('Practical answers for your project'))
})
