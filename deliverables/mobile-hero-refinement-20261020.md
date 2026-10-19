# Mobile Hero refinement — 2026-10-20

Scope: homepage below 768 px only. Original Banner assets, product pixels, text, links, desktop layout and business functionality are unchanged.

## Verified changes

- Removed the separate white carousel-control tray and mobile-only repeated brand eyebrow.
- Matched the surrounding light/dark surfaces more closely to the supplied imagery; copy remains transparent.
- Increased all six carousel controls from 32 px high to 44 × 44 px. The pre-change browser measurement failed all six controls; the rebuilt page passed all six.
- Added a real-page browser regression in `tests/hero-touch-targets.browser.js`.
- Production build succeeded. All 21 MJS tests and 10 TypeScript tests passed. TypeScript tests emit the existing Node module-type warning; no test failures occurred.

## Evidence and limits

The three fresh 390 px screenshots are in `.codex-delivery/hero-mobile-refinement/`. They were captured from the local Production build based on a35c2de with the uncommitted mobile CSS patch; they must not be relabeled as the unchanged a35 deployment.

All three were visually inspected. Product subjects remain complete; controls and copy are legible. The image still sits above the copy, so this is a bounded improvement, not a final closure of `VIS-MOBILE-HERO-CONTINUITY` or an overall visual PASS. Do not overwrite the earlier successful a35 evidence or mark Production complete.

The separate Banner multi-region checker dependency remains unresolved. The existing Chrome connection failed its second permitted inventory attempt; no new Chrome profile was opened. Actual document-hidden video behavior remains NOT_VERIFIED, not a failure of video playback itself.
