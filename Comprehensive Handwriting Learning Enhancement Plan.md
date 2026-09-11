# **Comprehensive Enhancement & Pedagogical Architecture Plan for Handwriting Learning**

## **1\. Executive Summary & Vision**

The goal of this platform is to evolve from a basic digital trace canvas into a precision motor-skill learning environment. Handwriting is fundamentally a fine-motor neuromuscular skill supported by visual-spatial perception, working memory, and orthographic recall.  
To maximize learning efficiency across diverse scripts (Latin Print, Cursive, CJK Hanzi/Kanji, Devanagari, and Arabic), the platform must combine:

> 1. **Kinesthetic motor scaffolding** (graduated guidance from guided tracing to free-form memory recall).  
> 2. **Sub-millimeter, sub-degree algorithmic evaluation** (evaluating stroke trajectory, order, velocity, slant, and pressure).  
> 3. **Multisensory reinforcement** (spatial audio, synthetic pencil friction, and haptic feedback).  
> 4. **Cognitive retention systems** (spaced repetition adapted specifically for procedural and motor memory).

## **2\. Motor Learning Theory & Pedagogical Framework**

Effective penmanship acquisition relies on established cognitive and biomechanical principles:  
\[ Tier 1: Passive Observation \]  
         │  
         ▼  
\[ Tier 2: Guided Dynamic Tracing \] (Active guidance, vector bounds)  
         │  
         ▼  
\[ Tier 3: Scaffolded Landmark Recall \] (Key control points & directional pivots)  
         │  
         ▼  
\[ Tier 4: Pure Memory Retrieval \] (Blank canvas, post-stroke structural audit)

### **2.1 Gradual Release of Responsibility (Scaffolding Model)**

> * **Tier 1 — Dynamic Stroke Animation (Observation):** An animated virtual pen traces the glyph in real time. Velocity is accurately simulated (slowing into tight corners and terminal points), illustrating stroke rhythm rather than just static geometry.  
> * **Tier 2 — Guided Tracing (Assisted Motor Control):** The user traces over a translucent ghost template. If the user departs outside a script-calibrated tolerance corridor (![][image1]), the line turns amber and prompts real-time realignment.  
> * **Tier 3 — Landmark & Vector Point Mode (Fading Support):** The full ghost template disappears. Only starting points (numbered dots) and directional pivot chevrons are visible. The learner must independently bridge the nodes.  
> * **Tier 4 — Blind Retrieval / Memory Recall:** The user is provided only with a baseline or bounding grid and an audio prompt or phonetic cue. After completion, the platform overlays the user's stroke against the canonical vector glyph, rendering an interactive diagnostic heatmap.

### **2.2 Bernstein’s Principle of Motor Redundancy**

Beginners freeze non-essential joint degrees of freedom (resulting in stiff, jerky finger-only movements). The platform should encourage wrist and forearm fluidity by providing scalable canvas dimensions:

> * **Zoom / Scale Modes:** Beginners practice on enlarged grids (![][image2] to ![][image3] standard size) to train arm and wrist coordination before refining finger fine-motor control at standard font-equivalent sizes.

## **3\. Algorithmic Stroke Recognition & Evaluation Engine**

Rather than relying on basic pixel difference masks or simple bounding boxes, the app should use a multi-stage vector matching pipeline:  
Raw Pointer Points (x, y, t, p)  
         │  
         ▼  
  Temporal Resampling & Filtering (Equidistant spatial resampling)  
         │  
         ▼  
  Stroke Segmentation (Pen-down to Pen-up intervals)  
         │  
  ┌──────┴──────────────────────────────────────┐  
  ▼                                             ▼  
Geometric Alignment (DTW & Procrustes)     Geometric Feature Extraction  
  │                                             │  
  │ • Directional Vectors                       │ • Slant Angle ($\\theta$)  
  │ • Fréchet Distance                          │ • Aspect Ratio & $x$-Height  
  │ • Normalized Stroke Sequence Order          │ • Curvature & Inflection Points  
  └──────┬──────────────────────────────────────┘  
         ▼  
Composite Accuracy & Fluency Score (0 \- 100%)

### **3.1 Spatial Vector Matching Algorithms**

> 1. **Dynamic Time Warping (DTW) on 2D Curves:**  
>    Align the temporal sequence of points ![][image4] with canonical template ![][image5].  
>    Calculate the minimal path cost matrix:  
>    ![][image6]  
>    This accommodates variations in drawing speed while accurately penalizing deviations in stroke morphology.  
> 2. **Normalized Fréchet Distance:**  
>    Ensures the discrete geometric distance between curves does not violate strict bounds, ideal for loops and counter-clockwise directional checks (e.g., distinguishing 'b', 'd', 'p', 'q').  
> 3. **Modified ![][image7]\-Gesture Point-Cloud Matching:**  
>    A light, low-latency client-side algorithm running at 60–120 FPS that compares candidate strokes against pre-recorded polyline gestures without heavy server round-trips.

### **3.2 Orthographic & Calligraphic Metrics**

The engine calculates individual sub-scores for every character:

| Metric | Target Calculation | Evaluation Criteria |
| :---- | :---- | :---- |
| **Stroke Order** | **![][image8]** | Hard rejection or error alert if stroke order is violated. |
| **Stroke Direction** | **![][image9]** | Catches strokes drawn backwards (e.g., drawing vertical stems from bottom-to-top). |
| **Slant Angle** | **![][image10]** | Essential for cursive and italic scripts; flags variance ![][image11] from reference slant (e.g., standard ![][image12]). |
| ![][image13]**\-Height Ratio** | **![][image14]** | Validates correct lowercase-to-uppercase height balance (![][image15] or ![][image16] depending on font standard). |
| **Curvature Smoothness** | **![][image17]** | Penalizes tremor, hesitation jitter, and irregular polygon edges. |

### **3.3 Diagnostic Heatmap Feedback**

Upon completing a glyph, the user does not merely receive a generic "75% \- Good Job." The application renders a diagnostic stroke breakdown:

> * **Green Highlight:** Trajectory, order, and velocity aligned within ![][image18] of canonical template.  
> * **Amber / Orange:** Path structurally recognizable, but incorrect slant, excessive curvature, or proportion error.  
> * **Red with Animated Direction Arrow:** Stroke drawn in reverse direction, wrong sequence, or with extraneous strokes.

## **4\. Script-Specific Pedagogical Modules**

Different writing systems require distinct pedagogical tools and spatial scaffolds:

### **4.1 Latin Print & Ball-and-Stick Early Literacy**

> * **Four-Line Guide Matrix:**  
  * **Top / Ascender Line:** Regulates letters with ascenders (![][image19]).  
  * **Midline (Waistline / Dashed):** Caps normal lowercase letters (![][image20]).  
  * **Baseline (Solid Primary):** The seating line for all glyphs.  
  * **Descender / Bottom Line:** Regulates descenders (![][image21]).  
> * **Letter Reversal Detection:** Dedicated safeguards for frequently confused letters (e.g., ![][image22] vs ![][image23], ![][image24] vs ![][image25], ![][image26] vs ![][image27]).

### **4.2 Latin Cursive & Continuous Script**

> * **Continuous Multi-Character Canvas:** Moves beyond single disconnected characters to support connected words and full sentences.  
> * **Ligature & Junction Verification:** Explicit evaluation of entry strokes, connecting bridges (undercurve, overcurve, downcurve), and exit flourishes.  
> * **Slant Guide Overlay:** Translucent ![][image12] parallel diagonal guides across the canvas to encourage uniform pen slant.

### **4.3 CJK Scripts (Chinese Hanzi & Japanese Kanji/Kana)**

> * **Traditional Grid Overlays:**  
  * **Tianzige (田字格):** 4-quadrant field for balancing character weight and center of gravity.  
  * **Mizige (米字格):** 8-segment star grid for diagonal balance and radical alignment.  
  * **Jiugongge (九宫格):** 9-square grid for complex multi-radical glyphs.  
> * **The Eight Principles of Yong (永字八法):**  
  * Evaluate fundamental stroke primitives: *Ce* (Dot), *Le* (Horizontal), *Nu* (Vertical), *Ti* (Upward tick), *Ce* (Horizontal hook), *Lü* (Long falling curve), *Zhuo* (Short downward slash), *Zhe* (Sharp turn).  
> * **Radical-Based Learning Path:** Group characters by primary radical (e.g., 氵 water, 木 tree, 口 mouth), teaching component reuse before complex composition.  
> * **Terminal Stroke Dynamics (*Tome, Hane, Harai*):**  
  * *Tome* (止): Clean stop with pressure pause.  
  * *Hane* (跳): Sudden directional flick with rapid release.  
  * *Harai* (払): Gradual tapering of stroke width to a sharp point.

### **4.4 Indic Scripts (Devanagari / Hindi, Sanskrit, Marathi)**

> * **Top-Hanging Shirorekha (शिरोरेखा) Baseline:**  
  * Characters hang *from* the headline rather than resting on a bottom baseline.  
  * Special stroke-order rule: characters are drawn first, and the unifying top *Shirorekha* is drawn last from left to right.

### **4.5 Arabic & Semitic Scripts (Right-to-Left)**

> * **Directional RTL Canvas Engine:** Right-to-left canvas cursor tracking.  
> * **Contextual Glyphic Form Variations:** Practice a single letter across all four positional morphologies:  
>   ![][image28]  
> * **Calligraphic Proportions (Naskh / Ruq'ah Nuqta Units):** Measure height and loop widths using traditional "rhombic dot" (*Nuqta*) proportions.

## **5\. Sensory & Hardware Optimization**

### **5.1 Stylus & Pointer Events Level 3 Engine**

> * **Native Stylus Detection:** Inspect PointerEvent.pointerType \=== 'pen' to unlock:  
  * event.pressure: Modulates dynamic line width and detects proper terminal pauses.  
  * event.tiltX and event.tiltY: Visualizes virtual pen angle in real time.  
  * event.twist: Stylus barrel rotation tracking for chisel-tip calligraphy simulation.  
> * **Palm Rejection System:** When pointerType \=== 'pen' is detected, all single and multi-touch touch and mouse inputs are automatically ignored on the drawing surface, allowing natural hand resting.  
> * **Sub-Pixel Low Latency Rendering:** Utilize OffscreenCanvas along with requestAnimationFrame coalesced event handling (event.getCoalescedEvents()) to prevent jagged interpolation on fast strokes.

### **5.2 Multisensory Feedback (Haptics & Spatial Audio)**

> * **Tactile Haptic Cues:** On supported mobile/tablet devices (navigator.vibrate), emit subtle micro-vibrations (![][image29]) on reaching key landmark pivot points or when making a stroke order error.  
> * **Pencil-on-Paper Audio Synthesis:** Implement Web Audio API procedural white noise filtered with a dynamic bandpass modulated by pen velocity and pressure, replicating the tactile sound of graphite on textured paper.

## **6\. Retention, Gamification & Curriculum Structure**

### **6.1 Spaced Repetition (Motor-Adapted SM-2 Algorithm)**

Standard flashcard SRS algorithms test only binary cognitive recall. This motor-adapted system factors in physical execution metrics:  
![][image30]Where the Adjusted Easiness Factor (![][image31]) is computed as:

> * ![][image32]![][image33]: Geometric accuracy rating.  
> * ![][image34]: Penalty for excessive mid-stroke pauses (reflecting cognitive uncertainty).  
> * ![][image35]: Heavy penalty for stroke sequence mistakes.

Characters with high motor friction or frequent stroke-order errors are scheduled for review within 4 to 24 hours.

### **6.2 Themed Learning Journeys & Daily Micro-Habits**

> * **5-Minute Daily Handwriting Ritual:** 1 warmup drill (loops and spirals for finger agility), 3 review characters via SRS, and 1 new character or ligature challenge.  
> * **Orthographic Etymology Mode:** Display animated historical origins (e.g., how the Oracle Bone script ![][image36] Seal Script ![][image36] Modern Regular Hanzi, or Phoenician ![][image36] Greek ![][image36] Latin letterforms).  
> * **Speed vs. Precision Challenges:** Timed neatness tests where users write short sentences under time constraints, measuring real-world legibility degradation under pressure.

## **7\. Hybrid Physical-Digital Bridge: Printable Worksheet Exporter**

To ensure digital practice translates directly to physical paper:

> 1. **Dynamic SVG/PDF Generation:**  
   * Export custom practice sheets featuring dotted-line tracing fonts, directional start arrows, and grid guidelines (Tianzige or 4-line).  
   * Fully configurable by the user (target words, custom names, frequency lists, or SRS weak list).  
> 2. **Scanner / Camera Re-Upload Feature (Future Expansion):**  
   * Physical sheets contain 4 corner alignment fiducials (ArUco markers) and a unique QR code.  
   * Users photograph completed paper worksheets with their phone or tablet camera.  
   * Client-side OpenCV.js extracts and perspective-corrects individual character boxes, running the stroke evaluation model against ink-and-paper writing.

## **8\. Prioritized Implementation Roadmap**

┌─────────────────────────────────────────────────────────────┐  
│ Phase 1: High-Precision Canvas & Stylus Refactor            │  
│ • Pointer Events Level 3 (Pressure & Tilt)                  │  
│ • Palm Rejection Toggle                                     │  
│ • 4-Line Latin Grid & Tianzige Overlays                     │  
└──────────────────────────────┬──────────────────────────────┘  
                               │  
┌──────────────────────────────▼──────────────────────────────┐  
│ Phase 2: Algorithmic Stroke Order & Trajectory Evaluation   │  
│ • Discrete Fréchet & DTW Path Matcher                       │  
│ • Directional Arrow Guidance & In-Flight Error Prompts      │  
│ • Detailed Diagnostic Heatmap Overlay                       │  
└──────────────────────────────┬──────────────────────────────┘  
                               │  
┌──────────────────────────────▼──────────────────────────────┐  
│ Phase 3: 4-Tier Scaffolding & Multi-Character Cursive       │  
│ • Progressive Fading Modes (Ghost \-\> Anchor \-\> Blind)       │  
│ • Continuous Horizontal Cursive Canvas                      │  
│ • Motor-Adapted Spaced Repetition (SRS) Engine              │  
└──────────────────────────────┬──────────────────────────────┘  
                               │  
┌──────────────────────────────▼──────────────────────────────┐  
│ Phase 4: Multisensory Immersion & Worksheet Exporter        │  
│ • Web Audio Procedural Paper Friction Synthesizer           │  
│ • PDF Printable Worksheet Exporter with QR Code Tracking    │  
│ • Radical Decomposition Explorer for CJK Scripts            │  
└─────────────────────────────────────────────────────────────┘  


[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAbCAYAAABBTc6+AAAAZElEQVR4XmNgGAUUATcoRgFCQLwSiJ8B8QkoVoZJghifoQqwApDq/wwQU7ACvApAxoMkQVbA7AbhcJgCkGtBCrpgAujAlIGAAhCAGYsM4F4EAZDjYIpAJu2E0hgApAsjBEcAAACTbhcucCQZnAAAAABJRU5ErkJggg==>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAZCAYAAABHLbxYAAABH0lEQVR4Xu2VUQ3CMBBAqwELaMACFrCABSzgAAlIwAEOcIABBMC9LJfcmlvXlvXvXnIhdG3vtbu1KQVBMIy9xCVvLHCSOKdpHPDLf9o35yhxlXhIfCWe88dFGMcYGy+Jg+20FYiyi0zeI/pO0xiCeXazHoPoESVqWNtlyqZ6kSNF72mqXw8WQd6hotQ2wTjqs/QhebLNktArqkm0znMZi5XtkoRWUa+uGP/J2nKQZZFdktAq6sF45uE0WYKdZDEtZ/aMFlF2k2S8esuaqH3dXs1WURJFzB4xiNB/SdR7pV5NdsmWRNk9nqssyfjKbVIWQ5+baVM8SaVKVnfGCwtSyOq9DiSnXc9TbimSetDuSSoszs69OSRnN/QaDoIg+JMfcJ9ayzo/SOAAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAAA1klEQVR4Xu2UfQ0CMQxHqwELaMACFrCABSzgAAlIwAEOcICBEwB7GU16ze8+c/+xlzSX9Lp727qdWaMh2Je4lnj+nsf+6204WBWcrAoeJT4lzrFoC95WV5FzyFjpZvBBgpU5iMnlCcQaxc5GJnezul0UOUMitvOecg7jacHUZHp4n9ShULJVEoqR5I9FomyVhEEvG5c4LlssAbZsjgR8UoxZBIIo4fSoHkHcLtWzQTh5+YJeRA5UT2bJKOqsDo5BLq9ISZxJmV9YFRnulZI4yPiVNRr/whckzTqm1YkquwAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKwAAAAaCAYAAAAqorewAAADAklEQVR4Xu2ZgXHbMAxFNUNX6AxZoSt0hazQFbpBR+gI3aAbdIMskAFav4tx4aEgDUoQSbV4dzzHkk3gEyAIK9uWJEmSJElyOT7exqf7SK7Fh+09dvz9X/D1Nr7fX5NrQbEhbj+3gILz7TZ+GwMj8GTc+3K/NxIEHxabTCU0hiTiq75YwO6YWd1CxSZTCIuhVNEf+kbByza3/wgTm0wjLIYc8a2jnkT9pS8OJkxsMo2wGFJZSVgqrcXn7a3XnYkllj77+f6qsa4dYaStVYjWbMVwF/Surf6VZCVpZ6LFsrmkr8b3cgF5mhB5Ioy0tQpnaNYx3IWnf8U5b/+KQwjtGZ7dqsXyPXx63v4+Hei3WdQoRtpahTM06xju4gr9K2ix0qKw0VhAgeSv6eGaZ3NoemyxXrzns5YPV6FHsxcdw13gkN5BJSv0r2CJJTnwvfTPqghcoyJwXc/hxWuL9eSzstFXWLu9eDV7sWLYDaUfB2oQ6B4j5b/hvMPTblhircXD31o/fiRhvbbK6sNmb63t6ng1e7Fi2E0rYaXx7oHv4FjP2JuwXNO+v2zv/bi8Cq2EfbRxvLYIsswjAdc8ssWx+6iCjZjDq5kNShWW2NeKnBXDbqxdBJKsLUEjscTqBeU+77lOwPQPg1rCsuDc0wle0msLWD/dEnhsUcGsmAij5vBoZn5OErTKGvA5q9BZMdyFlHmpeIhYKVnBEot/suNJDIY8csF//QOrlrBydJfB0fTaIiGsJPbYYk79KKlE5tCbocQ7R8sPj2bZEMwj+YJ2ayNYMdwNhjHEqO3KmbTE4m8ZGN5bm62WsIJVFTQeW5xaDKjZ89gagcePR5rRWD5JIllFf0krhv8cEWJbCUsArKrQC8GUHo5hzRll6yhRfhAbqfbMSWXnVZ8AETG8DEfE8j15rFXb/bUfCr1I7yjDqmBRto4S5QcaaTGASky1JV76pD4Sw8txpliqgZXEZzDSVotIP3RLpN8LZ8ZwOVhcdrJVsZK1kSdODF11kyRJkiRJevgDp+QhcRGTHAcAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKoAAAAaCAYAAAAnvMf3AAADhElEQVR4Xu2aDbETMRSFVwMW0IAFLGABC1jAARKQgAMc4OAZQAD0G3pmLock3U3y9qfcbybTdneb3J+Tm6TTZUmSJEmSJDktb27t/b3xPrkOyttbv/GM4Oj3W/u8/CcOPxHk7Ov9tZuft/bL2oe/nvgjkHh/aMBOEOoR4yZzmJI/OkGA3/xGgHtf/OKOTHE0OYwp+ZNQqZwl3i31e3sxxdHkMKblD6H+8It3ECliPZJpjiaHMC1/2n86H5dJAwxScpTTP/b5JPp0vzcL9uy+b+ezj/sM4BMxjfHjmvu/lVL+uqCaItRoIO+5PjPpvbij2ESlJ4DxAIhIZx74OK3SJ3HQHp3EtbZKVwWB4i8trq46cI/g+etGJ3s6FBi8dSZJQFvamjHcUd5zjZ+qsBsxAeO/LHMOfnFM+oyHTd7XtkpXhLjJP/KOOIUm/0jB8vx1g3FRqLy2fgXYG3dUQlQQ42+rPCfhAvfi57VQYaieqqB8FjE+JJD++dwzzhnQkg+IFD1EonB78Px1QydxyaRanOmH9Zqj2OmVjSATeOxH0NyncvdCH15RSKpEiUC5p62SJtEV8a0UEMfRolXL32YIvITqFWkrGLWlrZkQJUd92RcuSr7n17bwsvybKCaD7I42KNFXxZd9QBtxNemhlL8u6IgAkxSvUFugqkjsa9ua03PJUdnMq0AoLtyWUBHbo/HjSgNxPwckUdVWE97BxtYeb40de/Shc4NfE8SXFYN+iDPveWVcYqTVzCnlrwtVJ1ppoKMpOaq9o4Sqg5wnoiVUnWhbPvNMHBuR1p5nHF/6SSRjeFWOPLJjrz64F2PFdzTxYxGimCnO9KmKK7E6pfx1w4Ae5LNQc1Q/pUiMpSS1hMp3vWI6JEFiJZG1ZZCElpKk7UCp0grsYIzaNkh9tPKzto+WHcSPPhgHX+J49EsjltrD6nnB86VY1vLXBYH2anQWWo4SvLj8Oy2hQqtvQVxayybilYBrtrRs2JM1duBDTfAIXXFAM7FCvyzlYrEmxk/BiKOPhEoVKAV3LXyX6oONtNLS6vvaoxi1A//iGYa+tDUgDgiVMbzyj+TvUvQ6yncInpZurxIEdyRx4H+VLE0KCfloRu0ghlGEcatBLLUN85WnN3+X47UcZbn2oM6G/mv72j2ZYYfHyie+3xevlb/TwWylUtUOTMl5Ud5GJ0mSJEmSJM/Pb1b/ERMfxh99AAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,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>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAA5ElEQVR4Xu3Tfw0CMQyG4WnAAhqwgAUsYAELOEACEnCAAxxgAAGwJ7cmd7lyP/6GN/lyYeu+dmsp5c8c26pD1b5pMYLvVbeqU9Wx/X5W7XpxKZeqV8kzMrSnspRr6QK+ZXHwXbq4EUq16TuFGEkGbNqiO87BgAac26L7z5EaPNpi9nB97IsbVZq6JqgwrXSpgcziRm1cYhBd8l4jDEjfWYkmL0o1F7qU9h8RwMjYEmKMJw8HTNxRsMwOMrTmDxWYmUm0yj0ZMOq/uLVvY57CSEW+8S6rUHp0iFZlD2T2FnNT+rN8ADjbRLJAXxP+AAAAAElFTkSuQmCC>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP4AAAAXCAYAAAAr3fIbAAADt0lEQVR4Xu2a3XHbMBCEWUNaSA1pIS3kMa9pwS2kg5SQEtJBOkgHbiAFxPrG2pmbNQBSoQXK8n4zGIng4Ycy9u4AellCCCGEEEII4eb5cCofvfKG+OQVIdwzn73iCiD638u6uJjLl/On4HoGjPnTK0M4gu+n8q9RqN9L7e/a/FrGAsYhPC7PwuPZfpzKn1N5OH+fhcYO4SZgMb6W4CsI7drC/7Y8R/seiP7v8tIxIHrmRvuZ4IBmZEEhrKLI/9rCV7/XBCGNxItT6KXYzG32uQAOZ+SoQpjGWxU+0Zz+2eO3oH70XDiN2eBojnA4IbygJXxERUpKYZEiItJlomtPaNhxXzY94WNH5ON+TcGp15gUHda16oAtyih6yjEg8JbQ1g4DrwXz4flDOJSW8BEVC5R6vpMuI1IO0tgzu5CwoZ4FjR32HKC58HEKSs8RMjZKxbVfpx+NC5oHn/VwDNu1wzK1pTAW9ox7JKPtRwjTaAkfEAj1iF200mcdlHkEdeHjLBC1ZxbY1H06joM6RUVE0trHI2qfs0P/mkctrf5mwfOMMhUhu61Fv4Veb15S/PAzvAPWhO+Lwm0RIOJyWFBV+ERbrj3ien+gDIL6XnRsteuhbQhOjHb0fRTMmd8mhENZE/6aULluLWQXvq71Pr0WROkoUvu2Qvg8KjqXaOGZyGwi/HATzBK+oq3314P2RObePt7nURnt5emXLOUotgq/HrBuKXWr5ffWSs+5hjtmr/Afz8Vx4RPVufatg94YVLSv1/mB3wcit89ZcM/nLZir2tEv85RzkSglIsZnHjUrYb7YU8en5k877KnrOSvAbovw6Ysxthb9Rnqjcknx85nwDuAP72KGrcLXYVy1Y/EhMOpryo0gKbWuLlpgwdczAzKF1psE6imODiBb9/S2wcevQpTToEjAEhPQr5wAnzqDwJZnRkStsQVj+W8dwjQkeC8SQq3TYnVbgQBY9Ip2LHztpdUnICCEIlvsdM/7l/h6Y+IgWplGjeKK7nomiu/9Xfh8Z1z9sw1zZCzayanonELPAlzLUYygfSuDCeHNIsEAkc+jtEBA2LoIL0HC9DS19qvTfETpdqInfKA993Fi1GtM3a/IwYxA8Ee+UQjhLiDibomyI1z4RHBlG0rpQYLFCdR6fd8ifGUKIYQdEIER6t7MATETjbU9wBF8PdcrYyDdBzIH7kvotMNJYEvb6hQqtNs71xDCGYQ2OkzbigTZ+3R625gW9IGz6G03Qgj/AeK/5QMz5hfRh8N5Am3nbPqYIvWVAAAAAElFTkSuQmCC>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKIAAAAWCAYAAABDqUd4AAADVUlEQVR4Xu2Ysa3UQBCGXQMhCQEpKQWQICGRI1EBDRAQktIBDSBRAAEJMR2QE7wGKAD86d2nNxp8fh5z79iD+aSV7fXaO575Z3bvpqlpmqZpmqZp6nyY24Pc2ZyE9m3i0dzeHmmf5vblZmhTpH1b4P7cniy0Z3P7PrfXN0ObIu3bE/B8bi9zZ3MSzuXbh7mjac7Nvbl9PLSn6d6wvDi03Pc49TV18OGr6VoYsS/7+66gKiLGr9PggsTIN3P7Nrf3hz4c9XO6Nr7ZDwK0KuFf+TFd+/ecIEjiS0yxayjIkHeH86u5fQ73OI/Oa2pQAfUnQkR8QuIjxFglKyCqvc/yHDEntsMIEkOoflbAaBgijcL8V+E7ScJK9SeYBHLNPy7JgAgRYyQKswJzIqS9z8uQgqRk5wzFODJ3DavpXhDBCPsW9msVIZq4W8TAuxkb94RUtDURH4OYYCdxui02W/A9JOIIcfhtWQYyeO3nf1x69oKQqw64i+zFhooQgWfW/CN5WQa+Yc934K8/TX4YshoCGRs/MIuMbCZzaIwjAAQOAUcxUSlwPH0crbBcM56Ppt9q65JVcS7VO8P8vId7Vh7sZ05s0p74LwDjnBtbqkLcCu/N7/ZaP2I3NmAzPqPRh20cuXYsreKvyLACFAQRPw6HxKDFHy0KYamKEFgFbPCFdyhC5+L5akXELoIWr0kI4dxKRYI5lnm1LS/FfFP+llNhQgj2RPtduhWay7ZC4agfTegqF/MXDh+rGKMThOAiJKshLAkRuK/z4n3O4z7JvugYnmWO2xo20vxLwspM41z7CbDvj/ZyNBlgb4C3QKLgW+y0akewKyY6VQu748piolXtvBgBRnAAxsYfLOKmluDjVMfqFMWpo7jOQl1yhn0uR1vBFit2FnxkBCEK8y/tKbOfGBPtjlTsxJ95O3LxxCUWR/BxMZMNanQgYokBPyZEqiT9+d4xeF/e612Fa5MAjgnRSiOVAJ+aLETIezjP/6adQ0CgcQIOMYBknMu1ex73iIxjCYr7QippFiP99DFma0WMlUzoY16OLn0cESL9zGk1Z07mMklMGO75HefC/aBLt5Bo2kczWfFn3s//VyiSJbHkvuoyWxkLS8ubrN1bwvFVG85F9Xsukl/lBgGMy0ULmQAAAABJRU5ErkJggg==>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIMAAAAhCAYAAAD6SRiDAAABgklEQVR4Xu3bjU3DMBBAYc/ACszACqzACqzACmzACIzABmzABl2AAcBP1UknE1CchiSq3ydZpQ5VkXw+/1KKJEnScne1PNZy0z7QWF5reSvnYPgsBsSwCIT39J6fn9J7DeKhlq9ablMdwZCDQ4M4lfPwkH0Ug2E4zA/ICrxm1BkMgyEj0PB5ssiKgrqXVKcB0OisHGKOQGHYmMoWGcGTPzOnMDfRQUUGYCWR0XDthFJX7r78zAD0eOraCaWuXAQDr4HAaOt+w+/0FDPNgU0FA0vKOVmBDPLcWRiWdGBMHiMY2HEkGNyGHhTDAgHAMpKJo4EwOMZyU7gkSZIkSYuwv7LFspqNvXwGpIPhtHbLBtr6+zQTZyVzzmDWxm6v9zoOhGGh918B1hpKGC56v1v/iN5JZpiL7fr23sclGC7aC0XaAQ3a2zPjEO/UPlgobph5v2NnNGhPryRoCIa1swPZqefv0MqiR/ZM4BhOogfTeFPZgXsgPItsEze7/sJn2lvpu/kGY6Zfy6jNU34AAAAASUVORK5CYII=>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAWCAYAAACCAs+RAAAAZElEQVR4XmNgGAWjYBSMglEwgEAIioc8MAXinUA8E4iV0eSGJHAD4hNAvJJhGHkI5BlQLIHYQx6AYgXkIVAsjXposAFkzwzJ/DPkY2PIe2DIF8FD3gMgAPJEF8MQ9sAoGAU0AgA3MxNdUKUF4gAAAABJRU5ErkJggg==>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAZCAYAAADNAiUZAAABIUlEQVR4Xu2UYRHCMAxGqwELaMACFrCABSzMARKQgAMc4AADCIA+1u8WQsau3Piz67vLjbYhX5qmTanRmJFNtkP5wirbrsxZGDPPOvj/ae6Yrcu2N/MfbLM9nN1TL2C5lDVr5zQkwfdUfgMJjAojighBMTJdv3n0sHYtX8R8QOJgFnYcgiOBpsDHB7VEO/u7KFAlhPEbq9gLHCgb56ESRhmq9DoGzDaRYI6YOusQHG5pyApnxrYpABGbDJ1LL0TCkyDiy0BwutNfB486eBYkGpXZoqtTDWdImSxelDvL2D8YP4vqMbBIVA+ExpEoSVcTdSGNZIPRbP7suBo2sSpoJF0HdqRr41seEXUwvlTHPwbVkDEBvz0AdDklRsx3fKOxcJ4az1X2ejRL2wAAAABJRU5ErkJggg==>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAYCAYAAADDLGwtAAAAkElEQVR4Xu2QUQ2AMAwFqwELaMACWrCABRwgAQk4QAkGEAC9bg1j44M/QsIlj7W8pmsn8vMqrapTVTFvstyCRdVHbapJNcQTzxgldHN2OU3i1Y3HhbR3agkmIwAnsxYwPIW3ZsosYZkCNuZqOgFFFDvMzvYWcBXFHpsRYSnmtg9dMPlJ5zS/zMr16fPk+Sc4AAxAJGS8MBK5AAAAAElFTkSuQmCC>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF0AAAAZCAYAAABTuCK5AAABMElEQVR4Xu2XAQ3CQBAEXwMW0IAFLGABC1jAARKQgAOU1AACoJN24XOhlJZvaJqd5FK4ljTZ+99fUjLGGGNMMbZ13T/Uta7982lTlHNqRGYIOce2fwp9U4CqrltstmjVm4KsUyPqJd6o2aTmXtdAzEjwbIQ9xBvpZS9cTUHk56zqHIZgwSdCfo64FN9lN1hPCTigSUJDqtS7Z0eXn8tWYpoxBZCfRwtRfndUnICufN41jLGsUvOOIcVvFkmV3mdwDSOKjhD02AEIo3OgDw5pPfttLVJ0+TmHVoReLjpXREZsrVoGphxvekAw0gpi5YWliF3b44Clr4NWsZIhaAAxapofYCcgeD4MwU5gMGZiGAJis7rZBfJcJ5wJwUbwcUSW7fB5sX9i5kKeKCy2Mcb8lwezk2LM6DBO1AAAAABJRU5ErkJggg==>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAWCAYAAABOm/V6AAAAeElEQVR4XmNgGAWjYIgAZSCuRBekB3AD4i4g3gnE/4H4BKo0fQDIESDfmzIMoCOQwZB1BCgEqQpIdcRKBoieDHQJSgCpjpjJANETji5BCSDVETQBo46AAVIdIcQAKWeoCkh1BKyUpbioB/kEZBA2TAjQJHeMgpENAEAlJZOEwFOPAAAAAElFTkSuQmCC>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAWCAYAAABOm/V6AAAAv0lEQVR4XmNgGAWjYJADZSDuAuITUNoNVZr2wJQBYnk4A8TynUD8H4gzkBXRGjxjgPgeXQzkEFAI0QWALANhUIjAAMhRIDF0x9EMzGSARIEQkhgpjkB2PFUBLF0QSqArGWiUfkA+AxkMsoAQAIUiSC0oUVMNgKLkOgNxDqAZAEXDgDoAZDmyA0DZk1CaoCoAxS164qrEIoYOQNFHFYeCLPrMACk1kTFIjJAFsFwEcjBFAFZYYcOEAE1yxygY2QAAuJkw+m7yfroAAAAASUVORK5CYII=>

[image17]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGcAAAAeCAYAAAAxbADwAAABOElEQVR4Xu3Z4Y3CIBjG8XcGV7gZXMEVboVb4VZwgxvBEdzADW4DF3AAr0+AhJC2PM3F4of/LyGmFAj4glgaAQAAAADAIJ9TOjR5x5k87EyBeU7plK8VlGvO0ycG+okUCPnK1wrQLVLg1nxHKucmgr3Rb04KioKDN6E9RavmHilAmt0KEnvNG2j3m49IgVJyqLzqbkkw1fvNXJ6Cp31lie6fN6S1ttAoP2U1bdol7xJpdWAArZB2Nms1PCKtICUMor/Mc7Ralu4BAAAA+Bc9Czn0HKXTAXHruOq2e17Zj124p9I6I2tPFpaoXDlXc+u4StuOtX644x7KnYUq5w7onj+31HGVth1r/XDHPZTbSfelmWZpOR5y67jqtnt6/XDHPZTbyd4b0kJfSnk35NZx1W339PrhjnsXf9hyT/phaE7dAAAAAElFTkSuQmCC>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAZCAYAAABdEVzWAAABsElEQVR4Xu3VYU0EQQyG4dWABTRgAQtYwAIWcIAEJOAABzjAAAJgn1y+o/R2mLuEH/zYN5nkttt2vrazc8uyszPlZl3X3diYvf9Trtb1uq6ndb2s6/7n6yOEvy8H/ymSSCbpqJrb5XvTh/YOj8tBWLB5BIq1+Hys6674bUL127qel0OgAAn9rkguIbsY/uJq1Z5tHBQhn8VuKYjYKZw+m01C4oLNieqj4VOFyFOf/a4FpgnTEXKQrLYfBLAnaX8O4moBXWgXlg5OEbQlLPZsYmwjYbXb/OqYal6xZ40Qvo4tYapiVyG6gBB7BGdUzhGRGf3ZI6xofx0HCKqCzxUGmxNUbUTWERJuGhozJN2Jk8SEskmIS4R15K8jlNOyn/hfuyhYqzlKErE5YxHQk8yE9RHm6OTZPlv34RCC6ob9OYw6GRRZY5Kn0s/3EYq9rLe9Vtdzlw5uCdORLcTk4wkXCUvVOWNpd79vCK13VO5AB73TRxj4VmGakXN8AgHZNDf+1mYEu/355UyOkvYRBkLzt4Z+AZ9AuZES1Kus5CrgO/rU2fsIK97nQ/vNb2dn59/wBVn2kEyXQ6dsAAAAAElFTkSuQmCC>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGYAAAAaCAYAAABFPynYAAAC40lEQVR4Xu2YbXEcMQyGjSEUiiEUQqEUSqEUwqAQCiEMwqAMSiAA2jzTvnMajb2WZF/aH35mdm7Xd5Jlfe5ca4fD4XA4fAyf3q9Hv7gBdKI7CzIVuR4Pbd/Z0IO+u/P8fv36e31z363w2m56P7vvrvjebnLYtsKXdtOFPSv8bDddu4I85anlHRhBQc9mmByKXatQdTuCDCTNm18Mwv7pxK86cAZZ+sMvBlDV7GBnkKmaF78YpNSRqg6cUTKm/XHAausRu4KsyvvqvwhQ7khyIL2TjatDFzkyFAOqxtjWwz32ZHVYfJClM3tGVV5mvvBb/KDkkF9CyIEcAGcgTB/NOoPAUnXIqRdX2qMcgDPRg33orVSQny/oRidXtiVV5gsy2I0cF/fhfTVfMFqgkEBFIShsbIOAfKU9KrusPbIxi50v3HORxQp8hv9ivmBA1BGqOL9xby0Ctnh70BO1x6IgE1gFmuThOdOS/ul8sZAdUUfo8PagMsZmfQScJkdaqtmKHJXMJ3ZmgmGpzBdReuPtRVPZEXWEeqhFxmQHLHYgZwekWk82yHa+4BTO49ttlMp8Eb2ONEWBsY6gXP0a96MD9QYzz2Qp2ADjrKus67UsrbE/gVM74dna6LHzBZQs+ovI2jXTZSvWn3X2lxN7qiOxj5fvotahiuGZzLCtTYEaVRDZZDNCDmHdG6I3tVFwRkHWGjbICdyjS4Hy+CDbFwi9fYqZLlUee3MuoWoeVZPvSHrLDIEjcQgb8+mNU3uxh7TgfORwBBvzyaUss4bwOx2yR885VpdtZ3K8D6Rg3SYTTlXScVlmupR8fG+rQzqRHTkcOezw9oeYlTKMjBa+pLnvlTj7jAIzqiSv2zKyi9/79svzaA8Y6QLkvD7Bea78dzUKltDw3AHZeeWcDHbmrLKi6yqgdyXVGy8gILsCrPm1IxNXdNGeRh3grmBsujcOQE/l8D1IlF2Vt6KrWmWHw+FwOHw4vwG9WAGHNtAGYgAAAABJRU5ErkJggg==>

[image20]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAAAaCAYAAACzfzksAAAFZUlEQVR4Xu2Ya5HuRBBAowELaMACFrBwLWABB1cCEnCAAxxcAwiAPbX3FF3NJNOTzFe7P/pUpTav6Xf35NvjaJqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmaZqmecjPb8cvb8cP+cENkPXr2/FTflDkx+Pdli/Huj36IchCTryHTK7v+numg/tP0G/kcL4CfmCD65S1KkeMUZRZRVtG+V+VBcjJtcC9mIMK5inbgNwom9q9WxfRzpHdK+BfjOHdei2Dsr/ejt+Od2V/fr8mIKvg+LfjP1mcryQMR38/3vUjS3nVAKCL9fjwx9vx9fs1SUIm95HJM/7y7O+jLh8qOu6AnOg3dvG3CnrJ2T/Huyxs43rVP6AmiDv6zWN10KHLOGNLzL/3VuwxT9aF4BeyquCTMWJtHAj4h3wwhtRwFX1mrfKRhwxrZQXk4St2cCCTOJLTl0FAMDw6PkpiBQvYSaacalANQEw4EMhqIRp0EoDu2EzYwT2TDsjlXlU+VHSsgqw89JRVaRxyRcGQT9ZYNBZU3glnsM68kU8LsoIbgbbEdfpZBd/1xcEtNm0lPkDeeNe6tE6znbzjhlaF4RtrCHnWCecrPgO2oB+Zbj7kpOrrLQh0DuhKEYoBJShCsJFVlaNehxDrCEoeDleon+DnaWzzRnvQxb2VYXClg2fIW+Fs+BqPim3I8JM0Fjoys9wKFjO6zUM1j8bHZs07sM1dQZ/A3TYSh8MM7UJ/bM4cMyD2DocK0a48XPg7+rlUhbgjvxr/W+RdRCiClQYEG+2J0ySI5KKfA5lx162SkyGj5s27TZUrHTmeM/Q742CpDAO560+GOKGbY/XniuSvvLOYVXBox8GGvNVY01DIcTDAKGY8v1vLo+FyF2S8fBAARTZKDoGJwapg8TyB9blZ72AyYhNZBPnTb7TbVBjp8HN6tXHO/KaRcpHOuDOMRvg5baOs2jFq/CdNMmpY5K3GepS3UcxG+aiCrGzrHfwfx8sHAYw+kR0QPPMzPz47MwyjzwLoZyJrr3a5s6ZgXdR7ZQf4lRIZFUHcbZAXC+KODgYoRaCfNkLF7zykbKZ4n3tXjTRqwBFXvvEMH3IT5+Ke2WIdRb9jQxOral3AqL7yNVz5BqP/6eQ441feDK/8RV/8isXHXEtRfsXf0SAY2bUNiyf+Rmc34h7PUKzRFAf38wQVnM0Fk4PE2qti5d388wQ7CIqJmNkB347/Px81bywMzo3DXR3Y6T3+Wuwzv3Ohm4f8xUJ8kXNWlA68s+cw8808xmLl3a/hGma25GGAT6zRz+jvLD7AO3EN7+b3Z76B79hk2hn9i7mTK3+VQb48j82P3VHezF/eRR81gF3k1byM9G8DRShFGUbTECjFsRhUd1GOEe6syEAW6zmPRYVjrI9JjSDDhkIGf3NiZnbAKNCxUUVZ2BUb764O5BBL9BDXeP/KbxJs8+O3+cg4qEfPYDSQMzPfiLVFaE1wnpnZAsRBXzgnXu6a2CGz+AAxYq25Gtk08w2ssVjz2oXMnDu58tfmVR7r43Vu4Jm/rtFW3kVejNnLGH225Gs5c0AIzOxTbSaDQJzplysZOfiAXSObrj7/VnWASRxxJQ8qfvN8VJCA3ryjnfFqWyTHl+szG2c2ATrP1ktFjnUq9sBZ7uDK39xD+XrEmZ3Zv5mcD8Hd/wlMNybxE3bYMWO3jh1+A7vK2SCqssu3HbbIrvjs8m3EZ/T3w/A30V387LmavhWe2lFhp45dflOIOwp9h2+7bIFd8YEdvo34rP5+CBj+Jd9chCQ9naw77JixW8cOvwGbnhbQLt922CK74rPLtxGf0d+maZqmaZqmaZqmaZqX8i8l8+0MNttILwAAAABJRU5ErkJggg==>

[image21]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAaCAYAAAAzBZtTAAAChUlEQVR4Xu2X7U0dMRBFXUNaoIa0kBZogRZoIR2khJRAB3RABzRAAWSPVlca3Yy94wdI/JgjWWL9dq49n+8xRtM0TdM0N3N/rAffbD6P92O9+mbzeVC9d77ZNF/Gj3HOTdZH+Dlur95f4zyfuwBaj+M2LcAOPXT0vKMlX3QfwbPvLcGJl3GK/T7W8zhn6JbIwZ9x2rPexp49gfh7rKdxns/f6HAnZrmCVAVbfJLurk+cy12wRSfCfdgvoWDEzCLI3g44gpb+xhkqsgoBwHmShG0MKJ+xqmQJJigeqBnY6TwCyX0EceKZorxEL3s2uAzZ24HAyCEFaQdsgCB4MFV9FeST9ES2N0OjAUhUjA/7XgBTFIg4d7cyNCELUgUSxNnqBIGT1Z98qrgYADrJ/aygTox26Je7O5tLWxlKUJCq1RLJRgv3yLpsBj55AEiY+1nBxwNsdXfWelmGuFh1nmZZF2isnMxGi/bid8RKJ+senr0DKj757N/ubl6MmVX1eoZ4rgorIB4AneXaEYITbalekq15CFc6/q0vn7wDKj55gOXbVndjRHYRUkv4oRL2ysjIKghU2V6hQqMFexZtzb1icKGigz13jj/PXKfikxLMu7zH397dWyjbswytLgOzL6nITCPO32r7rsAHWlrzd/YPxkpHNroTCfdOmMIFaJPYyjz7rBIEwCsb2NehVwnirFlrq6IqrHQcArjrE6jyxZVv/yEBZUkC2ZcTDvG+z1XARj/qrzLMZ1llsoctrZ197sx0IvjFOxoD/v7KJ4i/f7H174JLCCRVoIXYrI04YJY5Kk8aqwvgSPY5ujga18xpmOk4mptaXvErn4D4yI7YrN5tmqZpvhH/AK/p4rAPTVOlAAAAAElFTkSuQmCC>

[image22]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAZCAYAAADjRwSLAAAAkElEQVR4XmNgGPxAGYhN0QVhoAuI/0PxTDQ5FODGAFEUji6BDGCmCaFLIIMTQHwdXRAdwNwDcnglA8QTKADmnmcMEGtB7voMpeEA5p4MJLGVDBBNcIDNPTsZIBrBAJvXQe4BiYEUggFMEYiGAZDDUcRA4YJsEogPcjRGyIMcDHITyAMgGmQSVgAyAdnKUYAAAJ7fIx1Ay/xnAAAAAElFTkSuQmCC>

[image23]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAZCAYAAADnstS2AAAAo0lEQVR4Xu2SUQ2AMAwFqwELaMACFrCABSzgAAlIwAEOcIABBMCOUTKa7odPwkuaQNu9Xhki31QRorZJKxr2KxZTy4rmwSY9qXtjC556ic1wu8KtC1GGmCXDW4VYJboxlmeXF5dNYqOqlQwv4yyby6sbw5mK3Ghy5xgK6S2pASjscuPBm7Ixli9AjhoLPq4bBxpwgJ+DLAzGlPTd8n4Y+/7rnQ5Q/ye8X08LfAAAAABJRU5ErkJggg==>

[image24]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAAoElEQVR4Xu2QUQ2EQAxEqwELaMACFs4CFrCAAyQg4Rzg4ORAX3anKZf94O9yCS9pgHbozK7Zw0/ovCav4ev7FYrKXgeH1+L1tiLiuUk0eq1WtiBkmGf0eIYlG6JZkRCX+0KBPc3MXHssCz5WDpUhL8JeDR0kW6gXpwblw14gwIUfAuVjwDuWxLiIIOfjBiJTppWvCQKEXEVzk8BShfhvOQH7xi3bL5CdEAAAAABJRU5ErkJggg==>

[image25]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAAoUlEQVR4Xu2RURHCQAxEo6EW0FALWMACFmoBB5WAhDrAAQ4wUAElby57k0CHX/jgzezHbZPLNmf25+scXSfXkM6F0XV3XawVPuI85yK61ygSZ9dmralzDVPjgKbiHcJYZAQ3a6M7hKVwymZ4JR8ZMPPfqZmcHY1WaDIxEo9vBTq1GrKxGrQLN2k8t7GJj+zme4Ui7ZTCt4zAE5Ivq7zKr/MExrUnpzqv8dYAAAAASUVORK5CYII=>

[image26]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAZCAYAAAAIcL+IAAAAdklEQVR4XmNgGAUDDkyBuBKI3dAlkMFKIN7JAFE0E4hPoEpDQDgQ/0figzR8RuLDQRcDRGEGECszQDTitB7kPpCG6wwQTSC3ogBs1jxjwKIQpBukGAZAJoM0gpyAAkDWgXwIokG+BVkNUowVCDFAHI9hyiggCAD5TBbJeMX2TwAAAABJRU5ErkJggg==>

[image27]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAbCAYAAABFuB6DAAAAgElEQVR4XmNgGAUDCoSAOByIlZHEMpDYYGAKxJ+B+D+UBmmoBOIuZEUgsJIBotsNSp+AiuEFINNnogtiA0QpBLmNoCKQ2wi6C5sikK9BNsABiAMKFpBPQcEB0gSy/hkDJGzBABS4IAUgAZAnQJIgTdehfDgAKYDrgrJRFIwCggAAA1MXRgXBMyAAAAAASUVORK5CYII=>

[image28]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAvCAYAAABexpbOAAAFDklEQVR4Xu3cjY0kNRAG0ImBFIiBFEiBFEiBFMiAEAiBDMiADC4BAoD7tPtJVuGe7fnZ1XH3ntSC6bG77XKjqnPPcbkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8O364fPx3Tz5ZD/OE9+AxPVrkGfj3rnc2+//4Pt5AgCO/Pb5+GeevMFPl5f+711QPTLGe90SmxQWabu2//n1/Crf/zrO7TSuH+2vy/F9P13uW+v0+/P13xuns9rvo6S4nONLYZW41D0xmHb3AYBDKR4eSRxJXM9IYG95ZIz3ujU2v1xeCq364/LfuOSaZ3YjG9ePlvGlwNpJ8XTPWqffWnglTmd9dMEWu7ivu2G3jP+a3X0AYOvWomS6pWA70+bII2NcnSmW6tHY/H25f87PLNiyU3hW5pxjjju7hc8q2G5xb7/pljE/K+5v+aj7APAVmEVJXv1kl2gWDL+/nsuxJtFZsKU4aP9cqwVS+qSAmck7hUCOtM89KtdJ+1wr55+Z3M7ukOxik88ZT8ac77uj1vm1fYub9Ol80yfn+kp0fZ2ca66vT2f8H5HrZrfvjI4tc+naZXcp49sVbJ8uL/PKPLt+6Ze2Xdu0aQwap1X65po5vz4DsT4rj5qvp4+scZ+/M+tr8sagz0TiO5+J9G3Rnmduruf8DACHZlGyJvYmy7RZk2wSchP7LNjSv4kx59fiaCbfJrRK+yS9Jrc1wT4zuWUcZ5L3jE3kcwqQWuc028/ipucau5nE19g/s2CLs7tsHVvXIjLOxGsWbFm/tu9v09In81hjlPMzTqs+A+k75zyfmUfkWmd2WDOG9Zjmuubzet2Oef5ebxaju2sDwNYsMrpjkKNJfibcnkvSmgVbpG2vs/ab12gBkDH0aNKebc8mt/Q7c6RIyL2umbGJjrfWcc72My49t/bP94lVipy17y0F25zb0ZE5v1W4dWzd1UxR1qI711jnlM9pt1u/dY5zPWfBls+7GMTa70h2tOZcj47dmkxzDNO8xmy/jrl/YaH3v9YPAA7NIiOyM9DdnybgmThzLu1mwdbXW22z9pvX2CXomP167lkyp7nbsbOLTT4/q2BL8TTb1y0F2xlZq/l6b6dj6+5Qxth+s+DJ+s35xYzRXM/1uxY0+eduzvM5eETWvMXnNXMM01zX2b5j7ivv7r5l3tf6AcChWWSsr+WSeJLgWrRVknl/p7MWbPMVUBP1WqAkea2vj5Ks14SW6zbRNbn1f4Fw5nXWGWcKl5ixiVmMzEJkzr9xWs+1f3a8Mv/oHDvnXfFyr67hGev6t2ivWbDFbv2yzvNVd+cZa/xyj8ao8btW5H+Et+I+YzDbd8zzDyQ5n379fvYDgK0myB75nGTSImtN3kn42aHIsSbftX8kWfdIMk7i7nVSKOXa6+5Wkv2ny0v7NZHnfj3fxNcxPuJs0beLzfq5BdXuaDLPXDuHWK8RmWPik/OJyfqXMtruGQXLul5H5nxi/Y3hOqZ+Hxl35pg1Wtem69lXq7sj98x6NAaJR66TvrvxPGIWzkd2Y1ytcXjrmcgfYBKbxiHfZy0yz2fODYBvVJLoTFSRBHTmx/pNxDu7747uF90NO7sr9qU58yryre8f9d7Xn7um1bXerfmqr0Pf07X7v7cz/80AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAX6l+BDNOi4hjiSQAAAABJRU5ErkJggg==>

[image29]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAZCAYAAACis3k0AAACEklEQVR4Xu2WgU3EMAxFMwMrMAMrsAIr3AqswAaMwAhswAZscAswAOTp7iPXips0nNQi+UnWXdMkjn8cp6UkSZIkyQ7cV3v2jYbHaq/V3st6v1Huqr34xitP1U7lsibgl2faDwniEAzifFf7WL7+hSC+yqU/ArxV+7z+3wKC4I/xzIfPFvThnTX8PdhORwJhyC4WGAmJWASNmJZziTMqQkLiF19rQjI/fTDWuHXTdiMSEgF5R/AW+hLsLD0ht27SYYiE5BhGQkZCjLA2fkZIsp01YioB9sQJ/vs2oXsC39M1ORIyCljtXuBRonlBdRujH/WxFxSB04852XzG0qZ6y3hdlLRTrrg8BcLKjzYgWt8qRxRSdVE1HAF60I+SY2uqBLZrRUTrn2d8Wlp6dPmLkDqKa+YFj+YFjpi/XOhPFvVgTptpoKy2KFP9M2NZK/71+bWJnpCtwCTkiPlFrQnZYvQE0MfXV8b62LyQxKfMlfkNGSISUg59AFuF8ETjEZzMax2z1jo8s0IKXUbyd1q+7hMJSfFtBUBff1y2EAmJH9ojIf3J8MwK2So/xOfn6hIJCeeynJBgpnbLEAmpI2YFI0vpO3LUZoXUTW9hDNnZRbvfMgvpznHDORlKoDiewfuR2WzQpwj+MDay50/C+DlH2hgrsTGeW8LeBDKEDGSHWh+zt2YPf/pF7F4JSZIkSZLkX/ED9hjms1mB7ecAAAAASUVORK5CYII=>

[image30]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAAuCAYAAACVmkVrAAACOElEQVR4Xu3c0Y3TQBQF0NRAC9RAC7RAC7RAC9sBJVACHdABHdAABbC5Ik96OziZbLC9q+w50iiJnchjf11dT3w4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3Lcvx/Fn3AgAwOvx4zh+jhsBAG71/vC3Darx/enuzfRjZnx4uvvFjPPqIz4ubK/x6fSd38fx7vQeAGAVL3UL7zUGm8ynB7RIqP3WPieYjdcrQe7h9L5/FwBgFb8O/waQrX0+7HPMWwLhUmCLhLJ67furHcytUACATSR87B020kLtEdhyXmNomzVgY2DrQa1e+/66dl/bNgCAVSV8VBi5VkJPgsq5UbcHz9kzJKYBq9CWZm+mAlvml/ZxvDbjOra9zgMAeMP2aLpGOeYs1M1k7d21EqpmzVq5tWEDANhEGqdbglNaqwSXc2P2r881QuJzglLOszdtl4yBrVTgGwPb7FwBAP5LQki/5Zd/QOZz2qtLDVb2JeidG/WIiyVZxN/DVkJUfpPj5rUW+c9cG9h6s5bfzELbucBWwXYMbAAAm0grNK7DSlBKmOnPE1tbP2aFnmrrSgXFMQRm9DVo1wS2pTVrlxqxcX591DzH7QAAu6sG6to1X2vot2XXbtgAAO5KD05pupYaqi1UU5V2L4/HmN22zDzTAPb5AgC8CT0ozULTmvY8FgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMDdegTHgosoDY7WnQAAAABJRU5ErkJggg==>

[image31]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAZCAYAAABQDyyRAAABFUlEQVR4Xu2UDQ0CMQxGpwELaMACFrCAFhwgAQk4wAEOMIAA2Mtdk+aj242/hYR7SZO769Z+a3tL6c9YZVvox55csx30Yy/W2W7ZNuroxS7bRT8CDpS12Hbccwp8kZ3H9XBMQ64i+zRsihZRNvqnPhKwh/J6GDR6jc9g/9K9P2CV0CQGp9cBskqoAIOSI4bpZ22VkgArO4E0SCSAU9qvRlXxmYgqkQCC+aQtFWC/vSN+MrFhAkhCAIxnPbVHBViVSi2pYgLoG0EseIsAtbcE+BYw/V4ALfGT/JUKeAE6eL6/oAJA1zQTCVC4TGoVAP8XPMWUAIJymXgiAS9TE8CpuPX81QofEWCJW4wWQGn6I/EzMzO/zR0+mnvOSgNa4wAAAABJRU5ErkJggg==>

[image32]: <data:image/png;base64,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>

[image33]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEwAAAAaCAYAAAAdQLrBAAACUUlEQVR4Xu2XgVHDMAxFMwMrMAMrsAIrdAVWYANGYAQ2YAM26AIMAHnX/Dv1R47tkLZwl3ena+JW1resKO4w7Ozs7BR5GO1x+rw2t4y9mo/RXkY7+BdXgJjERsO/oSSWxbxN9mTftfI6nCpIcM2YU9LwJ8nEkqTP0e4n45qxXr4To6KcTMNFuRtOuxeNhbbgYvFlYdGfa8ZitbSAD/NjJLzk7xouBgII9j6cdi5aSZzjYlkYC3UY662ybJ4M11CFxdEnqBTd16DHEKi1kkq42OOQL1TV0kM2T0bzvLxO6Q9UBAlDLPdZY4zg1xykgs9TSox6UA/qWcynPqiiiGTxZuD4NZw3QaqGILW3EoG3Oru42K0TFp8WWgeJ86Rl8WaoV0RnkudjGQT1Ju9Wm0O42C0T5puKLuZ4tvEs3hl665DxiEq3BpXJb5esVqXCxaIr07AmYY4S5jH9fkYp04zV+hcQoLWCarhY7rPEZAtdgnXgE6tsdcLYfRzj863JDmGsBL/xZK/FxWqhjm+mzn4llPgsYV4UrmGGHkk9NgTnMWCs9ZhAkCXBrbjY7JCqDY7aaCfZUyLox/4dfZt24mt0DSlUiY4UOBwna4Uk4/fbN2YmFm0sjM94HVElZv5C/0VZo5KVaV2a44xY1gTvPUkD/vgRNJovsERJLFVAhTCPV0Sk5C9IkM6Zpb5bm2NGT//amm6xAZLgj90aujSoQpSwpd28BF1iA2oJparpoVmD/uJEaz0/bUWzWIONzvrRGtZquAk0bwT7q/4a3DL2zs7OOn4AqzLCmCseK6oAAAAASUVORK5CYII=>

[image34]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAaCAYAAAAUqxq7AAACDklEQVR4Xu2YgU0DMQxFMwMrMAMrsAIrsAIrsAEjMAIbsAEbsEAHgDylT7hRrrmq16oS/lJ0reM49o/tS1tKIpFI3BYe6nir47WOpzruDqf/N+7r+KjjsY7POn5KIyqxB8SQPSIzqAMZtNs/EwugtL56YeIPL6X1nlhqidJ6DQ2a8V0aSfSkRGnkUFa+sZ5LvsEO8F5a1giatGXGvQjy+H4uIBzytwJv2Yu3ArJnlC1RRqltQZAXUIHdU8q49xGyaQkXhcFHRyXN096KoB4EvJYge+TVMSKI1OU+5CVRHeQERUk6x9PM4KmctyEEW1aULVcIS4J59sBWzAxtIWc/4FraQCQVwpCL+DNJm3Hfkf9ToIijOgMwSACiJ5ENnMdJM40nc+hJBPZ1lmcMiM/xYOx9BKpfXlrRi2uVmdnoxfsbvugDetga+b8KOMTpYJCANSz6EvOELEWzwGZvoNjCEU9rRpBAhi62nJ8R1NuOc0v+nwwMjX5mLG0gEaMgmUOHU9XxPggJgkAGayDFjIwERoJiVukXhzMiCLtL/m+GYxtAgAEBPqMfZaQ3GBFEaaPP6OctC+Q8LSH3jn6xXywx7Pr9mP9nw79A2IDS01EGnylPgnJTA5Y4ZJSZstgLmGetTdNSR265m0XMs1570S/7CWtiuWNv5v/VEEszvuFmGOmMylyM9Hus0UkkEombxy/wurCnGOy0NAAAAABJRU5ErkJggg==>

[image35]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAaCAYAAAAue6XIAAABYElEQVR4Xu3VAU0EMRCF4WrAAhqwgAUsYAELOEACEnCAAxxg4ARAvywvGcothGNJesn+yeR6O7vT6cxr29rOzvlz1e2h2323m24Xn93zcNntqdt1t+dub21Jekokqaph+soePn7PAu1/GR/Oyl1btFrlMB20aXOx17YkTMPTIVGtz86/bROfBI9tqWawwbaQQoog1iYIeKyKx56dQuJvAl2O+swE5LAF/5qsy8B5Wy8EVWak4UqGzeio875xnvslrVzZNVnz8InDh7U4X5CQxPIhfOgICwLXKtMhXdcOZHLP6T8LrclKou4N47U4qySIF61s3Fhj5S0meuYbO8Af0jmIa550yThFGOP8iMDjVZuTYUw2Cxr1+F2y2l99lTHOyahAbQ0Z5P84ieRqq2uyvqk+hUgRxjgnQyZpvYpGAsYmUbHakchJi/nyDnzLl1hYi/MnfqMp78aOsVlSOzuz8g6Hn2sR0MQDVwAAAABJRU5ErkJggg==>

[image36]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAV0lEQVR4XmNgGAWjYPiCmegC1AArgVgZXZBSYArEO9EFqQFAQZCBLogMQLaeIAM/A+LPDFQMY1AQgAymWtgKAfF1KE01UMlAIDzJASBXUh1QLRxHwXADALG4FJ5+XBoHAAAAAElFTkSuQmCC>