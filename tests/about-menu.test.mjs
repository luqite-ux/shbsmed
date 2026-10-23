import test from 'node:test'
import assert from 'node:assert/strict'
import {render} from './meeting-20261021.test.mjs'
test('About dropdown contains only its three child pages, not a duplicate parent link',async()=>{
 const html=await render('app/page.tsx')
 const header=html.split('<header')[1].split('</header>')[0]
 assert.match(header,/<summary[^>]*>About Us<\/summary>/)
 assert.doesNotMatch(header,/href="\/about"/)
 for(const slug of ['company-introduction','qualifications','manufacturing-inspection'])assert.ok(header.includes(`href="/about/${slug}"`))
})
