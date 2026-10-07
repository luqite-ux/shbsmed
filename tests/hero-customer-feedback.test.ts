import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { test } from "node:test"
import { heroSlides } from "../lib/data/media.ts"

const suppliedBanners = [
  ["customer-rf-electrode-cannula-202610.jpg", "9ca7900fb5b9c2767d20fbe76785a1c77319958611dbffbd74f936d9836afa08"],
  ["customer-cleanroom-202610.jpg", "72195aba1543e82324a37c93ad2a191137450f0e49affb5defe88786cf2bee6d"],
  ["customer-curved-tip-cannula-202610.jpg", "4e0f4ed283c136a4c8bd3a0c6f1178582c4b87e5d5792b9ebee00cd82482e27d"],
] as const

test("the three home slides use the three customer-supplied Banner files in order", () => {
  assert.equal(heroSlides.length, suppliedBanners.length)
  heroSlides.forEach((slide, index) => {
    const [filename, expectedHash] = suppliedBanners[index]
    assert.equal(slide.image, `/images/banners/${filename}`)
    const bytes = readFileSync(new URL(`../public/images/banners/${filename}`, import.meta.url))
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expectedHash)
  })
})

test("home Banner copy does not claim automated product assembly", () => {
  const copy = heroSlides.map(({ eyebrow, heading, subheading }) => `${eyebrow} ${heading} ${subheading}`).join(" ")
  assert.doesNotMatch(copy, /automated assembly|automated (?:product )?assembly line/i)
  assert.match(heroSlides[0].eyebrow, /RF Electrode and RF Cannula/)
  assert.match(heroSlides[2].heading, /OEM\/ODM/)
})
