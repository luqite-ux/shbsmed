# Motion Plan

## Selected combination

- `MOT-SHBS-01 Hero focus handoff`: 650ms cross-fade with a restrained 1.015→1 scale on the active banner, pause on hover/focus, manual keyboard/touch navigation, and no autoplay under reduced motion.
- `MOT-SHBS-02 Precision-path SVG`: a thin clinical-blue path traces from cannula tip to product specification nodes as the product-family section enters view; 700ms maximum and decorative for assistive technology.
- `MOT-SHBS-03 Process evidence reveal`: manufacturing videos and process labels reveal in ordered 70ms steps only when their section enters the viewport; video plays muted only while visible and pauses when it leaves.
- `MOT-SHBS-04 Bounded site-wide reveal`: every major public-page section receives a one-time viewport reveal, 520ms, desktop translate 18px, mobile 10px, cumulative stagger capped at 210ms. No fixed/global timeout may mark unseen content as completed.
- `MOT-SHBS-05 Interaction feedback`: navigation, product cards, FAQ, carousel controls and RFQ controls use 140–220ms hover/focus/press feedback with no large zoom that can crop product images.

## External candidates considered

- Motion-style in-view orchestration: adopted for bounded lifecycle control.
- GSAP deep parallax and pinned storytelling: rejected because it competes with medical-product legibility and mobile performance.
- Scroll-progress manufacturing timeline: partially adopted as static process hierarchy plus viewport reveal; continuous scroll binding rejected.

## Responsive and failure behavior

- Desktop and 390px share semantic order; mobile shortens distances and disables decorative path drawing when frame budget is poor.
- `prefers-reduced-motion` renders all content immediately, freezes the hero on slide 1, and uses video posters with user-controlled playback.
- IntersectionObserver failure restores visibility without consuming future animation state; there is no 15-second or other global completion timer.
- Videos have poster, controls fallback, `playsInline`, lazy loading, and pause outside viewport.

## Verification targets

- `motion_plan_scene_count = 5`
- `motion_external_candidates_count = 3`
- `motion_plan_desktop_result = PASS`
- `motion_plan_mobile_390_result = PASS`
- `motion_plan_reduced_motion_result = PASS`
