import test from 'node:test'
import assert from 'node:assert/strict'
import {issueCaptchaChallenge,verifyCaptchaSubmission,type CaptchaChallengeStore,type CaptchaChallengeIssueRecord} from '../lib/inquiry-captcha.ts'
Object.assign(process.env,{NODE_ENV:'test'})
const context={secret:'unit-test-only-not-a-deployment-secret-123456',tenantId:'fd8a0387-ffb2-4cf1-87d3-be3a3a15810b',siteScope:'unit-test-site',scope:'unit_test_form_scope_01'}
function memoryStore():CaptchaChallengeStore{
 const rows=new Map<string,CaptchaChallengeIssueRecord>()
 return{issue(r){rows.set(r.formScopeHash,r)},consume(r){const current=rows.get(r.formScopeHash);if(!current||current.challengeHash!==r.challengeHash||current.tokenHash!==r.tokenHash)return false;rows.delete(r.formScopeHash);return true}}
}
test('a wrong answer consumes the current challenge; replay is rejected',async()=>{
 const store=memoryStore(),challenge=await issueCaptchaChallenge({...context,store})
 const wrong=await verifyCaptchaSubmission({...context,store,token:challenge.token,answer:'0000'})
 const replay=await verifyCaptchaSubmission({...context,store,token:challenge.token,answer:challenge.testAnswer!})
 assert.equal(wrong.ok,false);assert.equal(replay.ok,false)
})
test('only one concurrent submission consumes a challenge',async()=>{
 const store=memoryStore(),challenge=await issueCaptchaChallenge({...context,store})
 const result=await Promise.all([1,2].map(()=>verifyCaptchaSubmission({...context,store,token:challenge.token,answer:challenge.testAnswer!})))
 assert.equal(result.filter(r=>r.ok).length,1)
})
test('refreshing one form does not invalidate another form',async()=>{
 const store=memoryStore(),a=await issueCaptchaChallenge({...context,store}),other={...context,scope:'unit_test_form_scope_02'},b=await issueCaptchaChallenge({...other,store})
 await issueCaptchaChallenge({...context,store})
 assert.equal((await verifyCaptchaSubmission({...context,store,token:a.token,answer:a.testAnswer!})).ok,false)
 assert.equal((await verifyCaptchaSubmission({...other,store,token:b.token,answer:b.testAnswer!})).ok,true)
})
