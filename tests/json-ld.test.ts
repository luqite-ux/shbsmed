import test from 'node:test'
import assert from 'node:assert/strict'
import {jsonLd} from '../lib/json-ld.ts'
test('database text cannot close an inline JSON-LD script',()=>{
 const result=jsonLd({name:'</script><script>alert(1)</script>'})
 assert.equal(result.includes('<'),false)
 assert.equal(JSON.parse(result).name,'</script><script>alert(1)</script>')
})
