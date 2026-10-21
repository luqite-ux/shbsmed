# October 21 meeting preview implementation plan

> Execute inline with executing-plans. The user explicitly requested implementation without another approval round.

**Goal:** Match the October 21 recordings and Excel; publish only to preview.shbsmed.com.
**Architecture:** Reuse the existing visual components, tenant reads and verified media. Share the About, OEM gallery and component gallery between home and inner pages. No database writes, shared backend changes or new business features.
**Tech Stack:** Next.js 16, React 19, TypeScript, existing R2 and Supabase read adapters.
**Spec:** The two October 21 meeting transcripts in Downloads and 明石医疗网站规划10.21.xlsx supplied in this chat; full contents reviewed October 21.

## Global constraints
- Menu: Home, About Us, Branded Products, OEM, Component Manufacturing, News, Contact Us.
- Home: three business Banners, About, branded series, OEM gallery, component gallery, news, footer.
- Brand series: pain management (one electrode + four cannulas), spinal anesthesia, epidural anesthesia. Do not publish reusable electrode in this version.
- About order: company introduction, qualifications, equipment/inspection and supplied videos.
- OEM and components: existing pictures with separate names; no new deep classification or fabricated detail.
- No downloaded nerve/clinical reference imagery without established rights. No clinical efficacy or hospital treatment-technique claims.
- Keep existing model/specification facts. Unconfirmed certificate public versions, Banner final copy and missing specs remain identified, not fabricated.
- Preserve all code/materials. No main push, Production deploy, apex/www change, shared tenant writes.

## Review focus
- Old deep links and category query strings must not expose the retired reusable product or wrong series.
- Existing content adapter must not override the new business labels with old strings.
- OEM photos must not be used as branded epidural anesthesia photos.
- Mobile dropdown, product enlargement and videos remain usable.
- Preview deployment must preserve apex/www deployment IDs and public access.

## Tasks
- [ ] 1. Add render regression tests for menu, home section order, three series isolation, OEM/components galleries and About media; observe expected failures.
- [ ] 2. Modify home/header/footer/PageFrame, shared meeting sections, products routes, OEM routes, component routes, About and News; preserve validated detail specs and inquiry security.
- [ ] 3. Update obsolete October 19 tests to October 21 decisions; run all mjs tests, typecheck and production build. Audit affected pages desktop/mobile.
- [ ] 4. Company-authenticated push to review branch, deploy Preview only, verify custom preview and main/apex/www remain unchanged; record evidence, retain files.

## Execution ledger
- Workbench task: 95d90316-7432-4e38-803d-4440b51edc83, scope global, site 9c010306-59df-4d24-b7cb-c8a4baf61ab9.
- Existing review branch codex/mingshi-20261019 reused; dirty unrelated deliverables and untracked assets preserved.
- Ruling: newer explicit meeting instructions replace conflicting October 19 layout tests; all raw source materials retained.
- Ruling: keep original internal data category keys and route aliases for backward compatibility; change visible labels without production-shared DB edits.
- Ruling: user requests immediate execution and retention; skip redundant plan approval and automatic cleanup. No new creative design work.
- User update: Banner changes deferred until tomorrow's supplied material. Keep HeroCarousel and existing slide images/copy untouched in this change.
