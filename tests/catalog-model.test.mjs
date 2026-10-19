import test from 'node:test';
import assert from 'node:assert/strict';
import * as catalog from '../lib/catalog-model.mjs';

test('five RF groups retain every model without one card per SKU',()=>{
 const rows=[{slug:'a',category_slug:'rf-electrodes',extra_data:{product_id:'RE2750-BM'}},{slug:'b',category_slug:'rf-electrodes',extra_data:{product_id:'RE27100-BM'}}];
 assert.equal(typeof catalog.groupSeries,'function');
 const groups=catalog.groupSeries(rows);
 assert.equal(groups.length,1);assert.equal(groups[0].variants.length,2);
});
test('locale fallback keeps requested language, then default, then nonempty',()=>{
 assert.equal(typeof catalog.localized,'function');
 assert.equal(catalog.localized({en:'Needle',zh:'针'},'zh','en'),'针');
 assert.equal(catalog.localized({en:'Needle'},'ru','en'),'Needle');
 assert.equal(catalog.localized({en:'',zh:'针'},'ru','en'),'针');
});
