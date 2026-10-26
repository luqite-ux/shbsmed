import test from 'node:test'
import assert from 'node:assert/strict'
import {load} from './meeting-fixture.mjs'

test('opening a menu closes only its siblings, preserving the parent menu',()=>{
 const {closeSiblingMenus}=load('components/site-header.tsx')
 assert.equal(typeof closeSiblingMenus,'function','menu needs exclusive sibling handling')
 const first={tagName:'DETAILS',open:true},second={tagName:'DETAILS',open:false},link={tagName:'A'}
 const parent={open:true,children:[first,second,link]}
 second.parentElement=parent
 closeSiblingMenus(second)
 assert.equal(first.open,false)
 assert.equal(second.open,false,'native summary click will open the clicked menu')
 assert.equal(parent.open,true,'third-level menus must keep their ancestor open')
})
