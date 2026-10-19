import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"
const seed = JSON.parse(readFileSync(new URL('../lib/site-seed.json',import.meta.url),'utf8'))

const suppliedBanners = [
  "bea9d37c5733de3499f699152fd8918d4381e8337272a38a338fb91f3050b65e",
  "9ebd111f6f654157ad6053cd35b54549525d7bbf33f1ae379ddbf4e609cff8e9",
  "fabb53b8e227e2cec026291c0289c0912f6b067e4afc2590255b6693be5a718b",
] as const

test("the three home slides use the three customer-supplied Banner files in order", () => {
  assert.equal(seed.slides.length, suppliedBanners.length)
  seed.slides.forEach((slide:any, index:number) => {
    assert.equal(new URL(slide.image).pathname.split('/').pop(),`${suppliedBanners[index]}.png`)
  })
})

test("home Banner copy does not claim automated product assembly", () => {
  const copy = seed.slides.map((s:any) => `${s.heading} ${s.description}`).join(" ")
  assert.doesNotMatch(copy, /automated assembly|automated (?:product )?assembly line/i)
  assert.match(copy,/RF/i)
  assert.match(copy,/OEM|ODM/)
})
