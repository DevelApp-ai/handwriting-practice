# Implementation Plan: Comprehensive Handwriting Learning Enhancement

> Companion to `Comprehensive Handwriting Learning Enhancement Plan.md`.
> This document turns the *vision* in that plan into a concrete, codebase-grounded
> implementation strategy: what already exists, what the gaps are, **how** each
> capability can be built, and the order in which to ship it.

---

## 0. Codebase Baseline (what exists today)

Before planning new work, this is the relevant state of `src/`:

| Area | Current state | Plan gap |
| :-- | :-- | :-- |
| **Pointer input** (`DrawingCanvas.tsx`) | `pointerdown/move/up`, `setPointerCapture`, raw `clientX/Y`. No pressure, tilt, twist, palm rejection, coalesced events, or `OffscreenCanvas`. | Plan §5.1 entirely missing. |
| **Evaluation** (`DrawingCanvas.tsx`) | `getDistanceFromCharacter()` measures distance to the **rendered bounding box** of the glyph only. Color thresholds (blue/yellow/orange/red) keyed off that distance. | Plan §3 (DTW, Fréchet, stroke order/direction/slant, heatmap) entirely missing. |
| **Scoring** (`PracticeScreen.tsx:44`) | `const stars = Math.floor(Math.random() * 2) + 2` — stars are **random**, never derived from accuracy. | No accuracy model at all. |
| **Stroke-order data** (`strokeOrder.ts`) | Hand-authored normalized polyline templates for Latin (incl. accented German/French/Spanish/Danish), numbers, punctuation, Arabic, Japanese Hiragana/Katakana, Devanagari. ~1090 lines. | Good **template source** for vector matching, but currently only used for the `StrokeOrderDemo` animation. |
| **Scaffolding** (`DrawingCanvas.tsx`) | Single `showGuide` boolean (ghost on/off). | Plan §2.1 four-tier fading (animation → ghost → landmark → blind) missing. |
| **Grids** (`DrawingCanvas.tsx`) | One 4-line Latin guide (ascender/midline/baseline/descender). | Plan §4 Tianzige/Mizige/Jiugongge, slant overlay, Shirorekha baseline missing. |
| **Haptics** (`haptics.ts`) | `navigator.vibrate` only, throttled. | Matches plan §5.2 partly; no Web Audio pencil-friction synth. |
| **Gamification** (`gamification.ts`, `types.ts`) | XP, levels, badges, achievements, daily/weekly challenges, learning paths. | Plan §6.1 motor-adapted SRS missing; star scoring is random so XP/achievements are detached from skill. |
| **Printable** (`PrintableSheet.tsx`) | Exists. | Plan §7 QR + scanner re-upload not present. |
| **Tests** | `src/lib/__tests__/*` import `vitest`, but `vitest` is **not** in `devDependencies` and there is no `test` script — tests cannot run. | Blocks safe refactors. |
| **Build** | `tsc -b --noCheck && vite build` currently **fails**: `SelectionScreen.tsx` lines 131/137 contain literal `\u{1F4C5}` / `\u{1F525}` text in JSX (invalid). | Pre-existing break to fix before any new work. |

**Two foundation repairs are prerequisites** (see Phase 0): fix the broken build and make the test suite runnable. Everything below assumes those are done first.

---

## 1. Guiding Principles for the Implementation

1. **Algorithm first, UI second.** The evaluation engine (§3) is the load-bearing wall. The heatmap, star rating, SRS scheduling, and "letter reversal" detection all *consume* its output. Build the pure functions, unit-test them headlessly, then wire UI on top.
2. **Keep it client-side.** The plan's latency targets (60–120 FPS, <50ms input lag) require no server round-trips. All matching runs in the browser.
3. **Reuse the stroke database.** `strokeOrder.ts` already holds normalized `[0,1]`-space polylines per glyph. These become the canonical templates for DTW/Fréchet with near-zero new data work.
4. **Small, additive, behind the flag.** Each capability lands as a new module + a setting toggle so existing behavior stays the default while a capability is rolled out.
5. **No new heavy dependencies unless justified.** DTW, Fréchet, Procrustes, and the $-recognizer are all <100 LOC each in plain TS; do not pull in a gesture library. Web Audio and `OffscreenCanvas` are platform APIs.

---

## 2. Phase 0 — Foundation repairs (must-do first)

**Scope:** make the project buildable and testable again. These are *not* feature work.

1. **Fix `SelectionScreen.tsx` JSX escapes.** The literal `\u{1F4C5}` / `\u{1F525}` / `\u2728` sequences are invalid in JSX text. Replace with actual emoji characters (or `{'\u{1F4C5}'}` string expressions). Verify with `npm run build`.
2. **Restore the test runner.** Add `vitest` to `devDependencies`, add a `"test": "vitest run"` script, add a minimal `vitest.config.ts` (jsdom environment so canvas-touching utils can be mocked). Confirm `npm test` passes the existing 4 spec files.
3. **Ground star scoring in reality (tiny).** While the random stars (`Math.random()*2+2`) are a correctness bug for every downstream feature, a full accuracy model arrives in Phase 2. As a stopgap in Phase 0, replace the random value with a deterministic function of the existing per-stroke color buckets already computed in `DrawingCanvas` (e.g. ratio of "perfect/blue" points). This makes Phase 2 wiring trivial and stops feeding random data into XP/achievements.

---

## 3. Phase 1 — High-precision canvas & stylus refactor
*Plan §5.1, §4.1 (4-line grid already exists), §4.3 grids.*

### 3.1 Capture full PointerEvent Level 3 data
- Extend the `Point` type in `lib/types.ts` to `TimedPoint = { x, y, t, pressure?, tiltX?, tiltY?, twist?, pointerType }`. Record `e.timeStamp`, `e.pressure`, `e.tiltX/Y`, `e.twist`, `e.pointerType` on every move.
- Render stroke **width** from pressure when `pointerType === 'pen'` and pressure > 0 (fall back to constant width for touch/mouse), satisfying the "dynamic line width" goal.
- Visualize `tiltX/tiltY` as an optional pen-angle indicator (toggleable) — a small arrow on the cursor. Low-cost, high "wow" for the plan's "virtual pen angle" goal.

### 3.2 Palm rejection
- Add a `palmRejection` setting (default on for pen sessions). When a `pointerdown` with `pointerType === 'pen'` is active, ignore subsequent `pointerType !== 'pen'` events on the canvas. Track an `activePointerType` ref. This is ~15 lines in `DrawingCanvas`.

### 3.3 Low-latency rendering
- Use `event.getCoalescedEvents()` in `handlePointerMove` to feed all intermediate points into the stroke buffer per frame, then draw once per `requestAnimationFrame` instead of per move event. This is the single biggest input-lag win and directly targets the plan's <50ms goal.
- Evaluate `OffscreenCanvas` only if rAF-coalesced rendering still shows jank on low-end tablets; it adds worker-message complexity, so prefer the simpler rAF path first.

### 3.4 Script-specific grids
- Extract grid drawing into `lib/grid.ts` with renderers for: `four-line` (existing Latin), `tianzige` (4-quadrant), `mizige` (8-segment star), `jiugongge` (9-square), and a `slant-guide` overlay (parallel 60° lines). Each is a pure `(ctx, w, h, opts) => void`.
- Select the grid by script: CJK → tianzige (default) with optional mizige/jiugongge; Devanagari → headline-baseline (Shirorekha top-hang, drawn *above* the glyph) instead of a bottom baseline; Arabic → keep 4-line but flip direction marker. The `getWritingDirection`/`isComplexScript` helpers in `languages.ts` already give the right branch points.

### 3.5 Bernstein / zoom modes
- Add a `canvasScale` setting (1×, 1.5×, 2×). Scale the glyph + grid together so beginners practice on enlarged glyphs (wrist/forearm) before standard size (finger). This is a one-line transform applied to the guide + stroke rendering; the matching engine works in normalized `[0,1]` space so it is unaffected.

---

## 4. Phase 2 — Algorithmic stroke order & trajectory evaluation
*Plan §3. This is the core of the project.*

### 4.1 New module `lib/strokeEval.ts` (pure, headless, heavily unit-tested)
Implement these pure functions, each in normalized `[0,1]` space:

- **`resample(points, n)`** — equidistant spatial resampling (the standard $-recognizer pre-step). Handles the "Temporal Resampling & Filtering" box.
- **`dtw(a, b)`** — DTW cost on 2D point sequences with the standard accumulated-cost DP matrix. Returns normalized cost in `[0,1]`. Handles §3.1 #1.
- **`frechet(a, b)`** — discrete Fréchet distance via the standard DP. Returns max-min paired distance. Handles §3.1 #2; great for loop-direction checks (b/d/p/q).
- **`procrustes(a, b)`** — translation/scale alignment so DTW/Fréchet are invariant to where on the canvas the user drew.
- **`dollarRecognize(candidate, templates)`** — the $-recognizer (cheap, 60–120 FPS) for the "low-latency client-side" path; templates come from `strokeOrder.ts`.

### 4.2 Orthographic & calligraphic sub-scores (Plan §3.2 table)
Produce a per-attempt `StrokeReport`:

```ts
interface StrokeReport {
  trajectory: number      // DTW vs template (0..1)
  direction: number      // signed area / stroke-heading; flags bottom-to-top stems
  strokeOrder: number    // sequence match count vs template stroke indices
  slant: number          // Δθ from reference (e.g. 0° print, ~52° cursive italic)
  xHeightRatio: number   // measured ascent/x-height vs canonical
  smoothness: number     // 1 - normalized curvature jitter
  overall: number        // weighted composite 0..100
  perStroke: StrokeFault[] // feeds the heatmap
}
```
- **Direction** is the cheapest high-value win: compute each stroke's net heading vector; a near-vertical stem with positive `dy` (bottom-to-top) is a fault. This directly enables the plan's "drawing vertical stems from bottom-to-top" alert with almost no new infra.
- **Stroke order**: the candidate strokes are already segmented by pen-down/pen-up in `DrawingCanvas`; match each to the nearest template stroke by Fréchet; a perfectly-correct drawing yields a 1:1 order mapping. Mismatches produce the "wrong sequence" fault.
- **Slant**: fit a dominant angle to resampled points; compare to a per-script reference (store on the language config in `languages.ts`).
- **x-height / curvature**: derivable from the same resampled points.

### 4.3 Diagnostic heatmap (Plan §3.3)
- After `pointerup` on the final stroke, run `evaluate()` and render a third canvas layer (`heatmapRef`) that recolors each user stroke segment:
  - green = within ε of template trajectory/order/velocity,
  - amber = recognizable but bad slant/curvature/proportion,
  - red + animated direction arrow = reversed direction, wrong order, or extra strokes.
- This layer reuses the existing overlay-canvas pattern in `DrawingCanvas`; no new rendering primitive needed.

### 4.4 Wire scoring to the report
- Replace the Phase-0 stopgap with `overall` from `StrokeReport`: ≥85 → 3★, ≥60 → 2★, else 1★. Now XP, achievements, badges, and SRS all react to *actual* skill instead of `Math.random()`.

### 4.5 Letter-reversal detection (Plan §4.1)
- Use `frechet` + signed-area: for the {b,d,p,q} set the mirrored pairs share bounding geometry but differ in stroke **start point** and **direction**. The `direction` sub-score already distinguishes them; add a dedicated "reversal" fault type that surfaces a friendly "Oops, that looks like a 'd' — try starting on the left!" prompt. Reuses everything from 4.2.

---

## 5. Phase 3 — 4-tier scaffolding, cursive canvas & motor-adapted SRS
*Plan §2.1, §4.2, §6.1.*

### 5.1 Scaffolding modes
Add a `practiceMode` enum: `observe | trace | landmark | blind` (Plan Tier 1–4).
- **observe**: drive `StrokeOrderDemo`'s animation with realistic velocity (ease into corners/terminals) — extend the existing animator's timing curve.
- **trace**: today's `showGuide` behavior (ghost template).
- **landmark**: hide the ghost, render only numbered start dots + chevron pivots from `strokeOrder.ts` (start point = first point of each stroke; pivots = high-curvature points, computed once per template).
- **blind**: no guide; after completion, overlay the user stroke against the canonical glyph as the §4.3 heatmap. This is *already* the heatmap render, just gated to this mode.
Selection of dots/pivots is a pure function over a template — unit-testable.

### 5.2 Continuous cursive canvas (Plan §4.2)
- A new `CursiveCanvas` that lays out a word horizontally, computes ligature junctions between adjacent glyphs (entry/exit stroke = last→first point of consecutive template strokes), and runs the same `evaluate()` but per-glyph plus a **ligature sub-score** (Fréchet across the junction segment). The matching engine is shared; only layout + the junction metric are new.
- Add a 60° translucent slant-guide overlay (a `lib/grid.ts` renderer from Phase 1).

### 5.3 Motor-adapted SRS (Plan §6.1)
- New `lib/srs.ts` implementing the motor-adapted SM-2: easiness factor adjusted by `StrokeReport.overall`, with explicit penalties for mid-stroke pause count (from the `t` field captured in Phase 1) and stroke-order mistakes.
- Store a per-character SRS record inside the existing `UserProgress.progress[id]` (already has `attempts`, `lastPracticed`); add `nextReview`, `easeFactor`, `pausePenalty`. SRS is a pure scheduler over these fields → unit-testable.
- Surface "Due for review" as a badge/filter on `SelectionScreen` driven by `nextReview <= now`.

---

## 6. Phase 4 — Multisensory immersion & worksheet export
*Plan §5.2, §7, §4.3 radical explorer.*

### 6.1 Web Audio pencil-friction synth (Plan §5.2)
- A single `AudioContext` with a white-noise `BufferSource` → `BiquadFilter` (bandpass) → gain, where the bandpass center frequency and gain are modulated by **pen velocity** (derivative of captured `(x,y,t)`) and **pressure** (Phase 1). Start/stop on pointer down/up. ~60 LOC in a `lib/audio.ts`. Throttle/filter to avoid harshness; respect the existing `soundEffects` setting.

### 6.2 Printable worksheet exporter (Plan §7)
- `PrintableSheet.tsx` already exists; extend it to:
  - emit dotted-line tracing glyphs (render the `strokeOrder.ts` polylines as dashed paths, not the filled font),
  - draw directional start arrows + numbered dots (reuse the landmark-mode renderer),
  - embed 4 corner ArUco-style fiducials + a QR code (encode `{userId, sheetId, charList}`).
- QR via a tiny dependency-free generator or an existing one already in the tree (`qrcode` is *not* present — generate client-side from the character list string; keep it optional/behind a setting to avoid a hard dep).
- **Scanner re-upload (future)**: scope as a separate follow-up; it needs OpenCV.js (heavy, ~8MB) and is explicitly "Future Expansion" in the plan. Do **not** bundle it in this phase.

### 6.3 Radical decomposition explorer (Plan §4.3)
- A read-only data table mapping common Hanzi/Kanji to radicals (water 氵, tree 木, mouth 口, …) and a browse UI that groups characters by radical. Start with a small curated set (the plan's examples) rather than a full decomposition database; expand later. Teaches "component reuse before complex composition."

---

## 7. Things in the plan to treat carefully (recommendations)

These are honest engineering calls, not rejections:

- **$-recognizer "at 60–120 FPS"**: real per-event matching at that rate is wasteful. Run the cheap $-recognizer **in-flight** only for the in-progress stroke (for the amber "you're drifting" prompt), and run the full DTW+Fréchet report **once on completion**. Two tiers, not one hot loop.
- **OffscreenCanvas + workers**: defer unless rAF-coalescing proves insufficient; the message-passing overhead often negates gains for a single canvas.
- **OpenCV.js scanner**: keep it firmly as a later milestone. Its bundle size and perspective-correction complexity dwarf everything else here.
- **Accent glyphs in `strokeOrder.ts`**: several accented letters currently reuse the base glyph's strokes and just append a dot stroke (e.g. `Ä`, `Á`). The DTW composite will still pass because the base matches, but the dot is geometrically wrong for some. A small data-cleanup pass (Phase 2 dependency) improves accuracy cheaply.
- **Devanagari Shirorekha "drawn last"**: the plan's stroke-order rule (body first, top line last) must be encoded in the template stroke *order* in `strokeOrder.ts`; the current Devanagari entries don't all follow it. Flag for the same data cleanup.

---

## 8. Suggested file/module map

```
src/lib/
  types.ts            extend Point -> TimedPoint; add StrokeReport, SRS fields
  strokeEval.ts       NEW: resample, dtw, frechet, procrustes, dollar, evaluate
  srs.ts              NEW: motor-adapted SM-2 scheduler
  grid.ts             NEW: renderers for 4-line, tianzige, mizige, jiugongge, slant
  audio.ts            NEW: Web Audio friction synth
  haptics.ts          (existing) unchanged
  strokeOrder.ts      (existing) templates -> canonical matching source; data cleanup
  languages.ts        (existing) add per-script slant reference + grid choice
  __tests__/
    strokeEval.test.ts   NEW
    srs.test.ts          NEW
    grid.test.ts         NEW (render shape assertions via mocked ctx)

src/components/
  DrawingCanvas.tsx   pressure/tilt/coalesced/palm-reject; heatmap layer; modes
  StrokeOrderDemo.tsx  velocity-aware observe mode
  CursiveCanvas.tsx    NEW: horizontal ligature canvas
  SelectionScreen.tsx  FIX: emoji escapes; add "Due for review" filter
  PracticeScreen.tsx   wire stars from StrokeReport
```

---

## 9. Verification strategy per phase

- **Phase 0**: `npm run build` green; `npm test` green on existing specs.
- **Phase 1**: unit test that coalesced-point handling produces ≥ raw-event point count; manual stylus pressure-width check on a tablet.
- **Phase 2**: `strokeEval.test.ts` asserts known-good polylines score ≥0.9 and mirrored b/d score below threshold for the *wrong* letter; `PracticeScreen` stars track the report.
- **Phase 3**: `srs.test.ts` asserts a low-overall attempt schedules a 4–24h review; landmark mode renders exactly N dots for an N-stroke glyph.
- **Phase 4**: exported PDF opens with dotted glyphs + QR; Web Audio gain tracks a synthetic velocity ramp in a headless `AudioContext` mock.

---

## 10. Sequencing summary

1. **Phase 0** — fix build, restore vitest, stop random stars. (unblocks everything)
2. **Phase 1** — precision canvas + stylus + script grids. (delivers the input substrate)
3. **Phase 2** — `strokeEval.ts` + heatmap + real scoring. (the pedagogical core)
4. **Phase 3** — scaffolding tiers + cursive + motor SRS. (retention)
5. **Phase 4** — audio synth + worksheet export + radical explorer. (immersion + bridge)

Phases 1 and 2 are the highest-leverage; 3 and 4 build on their outputs and can be parallelized once 2 lands.
