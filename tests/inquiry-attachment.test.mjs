import test from 'node:test'
import assert from 'node:assert/strict'
import {inspectAttachment} from '../lib/inquiry-attachment-validation.mjs'
test('accepts a bounded PDF with a matching signature',()=>{
 const bytes=Buffer.from('%PDF-1.7 test')
 assert.equal(inspectAttachment({name:'drawing.pdf',size:bytes.length,bytes}).contentType,'application/pdf')
})
test('rejects mismatched extensions, oversized files and incorrect byte counts',()=>{
 for(const input of [{name:'payload.pdf',size:3,bytes:Buffer.from('exe')},{name:'large.pdf',size:11*1024*1024,bytes:Buffer.from('%PDF-')},{name:'a.pdf',size:9,bytes:Buffer.from('%PDF-')}])assert.throws(()=>inspectAttachment(input))
})
