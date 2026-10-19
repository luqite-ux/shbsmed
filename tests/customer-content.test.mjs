import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const seed=JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url),'utf8'));
test('all 49 source models appear exactly once in the correct five product groups',()=>{
 assert.deepEqual(seed.products.map(p=>p.variants.length),[5,18,18,4,4]);
 const models=seed.products.flatMap(p=>p.variants.map(v=>v.model));assert.equal(models.length,49);assert.equal(new Set(models).size,49);
 for(const p of seed.products){for(const v of p.variants){assert.match(v.gauge,/^\d+G$/);assert.match(v.length,/^\d+ mm$/);if(p.slug!=='rf-electrodes')assert.match(v.activeTip,/^(5|10) mm$/);}}
 assert.equal(seed.products.find(p=>p.slug==='side-port-rf-cannulas').variants.find(v=>v.model==='RC181510Y-BM').gauge,'18G');
 assert.equal(seed.products.find(p=>p.slug==='curved-blunt-rf-cannulas').variants.find(v=>v.model==='RC201005B-BM').activeTip,'5 mm');
});
test('new treatment needle is not mislabeled as an anesthesia needle',()=>{
 const p=seed.odm.find(p=>p.slug==='epidural-treatment-needle');assert.equal(p.name,'Epidural Treatment Needle');assert.doesNotMatch(p.name,/anesthesia/i);
 assert.equal(seed.odm.find(p=>p.slug==='huber-needle').name,'Huber Needle');assert.equal(seed.odm.length,5);
});
test('new Banner set includes three reachable, separate image assets',()=>{
 assert.equal(seed.slides.length,3);assert.equal(new Set(seed.slides.map(s=>s.image)).size,3);for(const s of seed.slides)assert.match(s.image,/^https:\/\/pub-[a-z0-9]+\.r2\.dev\/tenants\/fd8a0387-/);
});
