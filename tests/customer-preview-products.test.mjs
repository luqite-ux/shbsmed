import test from 'node:test'
import assert from 'node:assert/strict'
import products from '../lib/customer-preview-products.json' with {type:'json'}
test('customer product attachments have six ordered products and their full specification tables',()=>{
 assert.deepEqual(products.map(p=>p.id),['4.1','4.2','5.1','5.2','5.3','5.4'])
 assert.deepEqual(products.map(p=>p.rows.length),[40,3,16,16,4,4])
 assert.deepEqual(products[1].rows.map(r=>r[0]),['RE2750-BM','RE27100-BM','RE27150-BM'])
})
test('customer corrections and explicitly pending part numbers are retained',()=>{
 assert.equal(products[0].rows.filter(r=>r[0]==='待确认').length,3)
 assert.ok(products[2].rows.every(r=>r[0].startsWith('RS')&&r[0].endsWith('-BM')))
 assert.equal(products[5].rows.at(-1)[0],'RL1815010-BM')
 assert.equal(products[0].rows.find(r=>r[0]==='RE27150-C2215010-BM')[5],'150')
 assert.ok(products[0].rows.every(r=>r[0]==='待确认'||r[0].endsWith('-BM')))
})
