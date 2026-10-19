import test from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {rfCategories} from '../lib/catalog-model.mjs'
test('public RF adapter is tenant-scoped and reads family presentation plus SKU specifications',()=>{
 const code=readFileSync(new URL('../lib/medical-products.ts',import.meta.url),'utf8')
 assert.match(code,/eq\('tenant_id',tenant\)/)
 assert.match(code,/rfCategories\(categories\|\|\[\]\)/)
 assert.match(code,/specs\?\.\['Effective length'\]/)
 assert.doesNotMatch(code,/site-seed/)
})
test('a new RF category is included without custom flags, while ODM and component branches stay separate',()=>{
 const rows=[{id:'a',slug:'rf-electrodes'},{id:'b',slug:'new-rf-series'},{id:'c',slug:'odm-products'},{id:'d',slug:'contract-components'},{id:'e',slug:'contract-biopsy',parent_id:'d'}]
 assert.deepEqual(rfCategories(rows).map(r=>r.slug),['rf-electrodes','new-rf-series'])
})
