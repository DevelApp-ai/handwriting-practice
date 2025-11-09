# Planning Guide

A gamified handwriting practice application that helps children learn to write letters (including EU accented characters, Arabic, Urdu, Japanese kana, and Nepali Devanagari), numbers, words, and complete sentences with punctuation using the standard 4-line writing guide (baseline, midline, ascender, descender) commonly used in schools, with visual direction indicators for different writing systems, optimized for tablet pen input.

**Experience Qualities**: 
1. **Encouraging** - Celebrates progress with positive feedback and rewards to build confidence in young learners
2. **Playful** - Uses bright colors, friendly animations, and game-like elements to make practice feel like play
3. **Clear** - Provides crisp visual guides and intuitive controls that children can understand without adult help

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple practice modes (letters, numbers, words), progress tracking, achievement system, and character selection with persistent state for tracking learning progress

## Essential Features

### Drawing Canvas with 4-Line Guide & Precision Feedback
- **Functionality**: Interactive canvas with properly-spaced 4-line guide system (ascender line at 25%, midline at 42%, baseline at 58%, descender line at 75%) where children can draw with touch/pen input. Lines are clearly labeled and color-coded for easy recognition. Directional arrows appear for right-to-left scripts (Arabic, Urdu) and complex left-to-right scripts (Japanese, Nepali) to indicate writing direction. Real-time visual feedback shows stroke quality: blue for perfect (within guide lines), yellow for slightly outside, orange for getting far, and red for too far outside. Precision requirements increase progressively with each character level (every 3 attempts increases the level up to level 5), making acceptable boundaries tighter for advanced learners.
- **Purpose**: Provides the familiar ruled-paper environment children use in school with appropriately-spaced guide lines that actually guide letter height, helping them develop proper letter formation and sizing with clear visual references. Direction indicators help students learn proper writing direction for different scripts. Color-coded feedback teaches spatial awareness and precision, with adaptive difficulty that grows with the child's skill level.
- **Trigger**: Automatically displayed when a practice item is selected; educational overlay shown on first use explaining the line system; precision indicators always visible during drawing
- **Progression**: Child selects practice mode → 4-line guide displays with tighter, more accurate spacing → Character/word/sentence appears as light tracing guide with appropriate font (Noto Sans Arabic, Noto Sans JP, Noto Sans Devanagari, or Quicksand) → Current level and precision requirements shown if level > 1 → Directional arrow shows writing direction for non-Latin scripts → Child traces with pen/finger → Real-time color feedback indicates stroke quality (blue/yellow/orange/red) → Stroke detection tracks progress → Visual feedback shows completion
- **Success criteria**: Bold, clearly visible lines with proper spacing for actual letter guidance; baseline (black, 3px), midline (blue dashed, 2px), ascender/descender (gray, 2px); line spacing allows letters to properly fit within guides; line labels visible when guide is on; smooth drawing with minimal lag (<50ms); accurate touch/pen input capture; educational popup explaining line system on first use; directional arrows for RTL (red) and complex LTR scripts (green); real-time stroke color changes based on distance from guide boundaries; progressive precision tightening (starts at ±40px moderate/±80px far at level 1, tightens to ±20px/±40px at level 5); level indicator displayed when level > 1; color legend always visible showing: Perfect (blue), Slightly off (yellow), Getting far (orange), Too far (red)

### Character Selection & Categorization
- **Functionality**: Browse and select from uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), EU accented characters (À-ž including diacritics used in European languages), Arabic alphabet, Urdu alphabet (with unique characters like پ، ٹ، ڈ، ڑ، ژ، گ، ں، ے، ھ), Japanese Hiragana and Katakana, Nepali consonants and vowels (Devanagari script), punctuation marks (.,!?;:'"-), common words, and complete sentences with proper punctuation
- **Purpose**: Allows children to practice specific characters they're learning across multiple writing systems and languages, progressing from individual letters to full sentences
- **Trigger**: Main menu or navigation tabs
- **Progression**: Child opens category → Scrolls through available characters/words/sentences → Taps character card → Practice canvas loads with selected item and appropriate font
- **Success criteria**: All basic Latin characters, 100+ EU accented characters, 28 Arabic letters, 38 Urdu letters, 46 Hiragana, 46 Katakana, 36 Nepali consonants, 13 Nepali vowels, 11 punctuation marks, multilingual words, 20+ practice sentences available; clear visual previews with culturally-appropriate fonts

### Tracing Guides & Stroke Order
- **Functionality**: Light blue/gray reference character shown on canvas that adapts to content size (large for single characters, medium for words, small for sentences) and script type (Arabic/Urdu use Noto Sans Arabic, Japanese uses Noto Sans JP, Nepali uses Noto Sans Devanagari). Toggle button allows showing/hiding the guide. Info button provides access to 4-line system explanation. Directional arrows automatically appear for RTL scripts and complex scripts.
- **Purpose**: Teaches proper letter formation technique and writing direction for different scripts, providing visual reference without being distracting
- **Trigger**: Displayed when practice session begins, can be toggled on/off; info button always available; direction arrows appear automatically for applicable scripts
- **Progression**: Reference appears at appropriate size with correct font → Directional arrow shows writing direction if applicable → Child follows the guide → Guide can be hidden to test independent writing → Info button provides line system reminder
- **Success criteria**: Adaptive text sizing (40% height for letters, 25% for words, 12% for sentences); clear visual hierarchy (guide visible but not overwhelming); multi-line text wrapping for long sentences; educational overlay accessible at any time; appropriate font rendering for all supported scripts; clear directional indicators (red arrow pointing left for RTL, green arrow pointing right for complex LTR scripts)

### Progress Tracking & Stars
- **Functionality**: Award 1-3 stars based on tracing accuracy and completion, track which characters have been practiced and at what level (levels 1-5 based on number of attempts, increasing every 3 attempts)
- **Purpose**: Provides immediate feedback and motivation through visible progress and achievement, while tracking skill development per character
- **Trigger**: Awarded at end of each practice attempt; level increases automatically with practice count
- **Progression**: Child completes tracing → System analyzes coverage of guide → Star rating appears with animation → Total stars added to profile → Character marked as practiced → Attempt count increments → Level may increase, triggering higher precision requirements
- **Success criteria**: Fair but achievable star thresholds (1 star for attempt, 2 for good trace, 3 for excellent), persistent star counts across sessions, level progression tracking per character, visual level indicator during practice

### Encouraging Feedback System
- **Functionality**: Positive audio-visual feedback including celebratory animations, encouraging phrases, and unlockable stickers/badges
- **Purpose**: Maintains motivation and creates positive association with handwriting practice
- **Trigger**: After completing each character, reaching star milestones, or practicing consecutive days
- **Progression**: Achievement unlocked → Celebration animation plays → Encouraging message displays → Reward added to collection
- **Success criteria**: Variety of 10+ encouraging phrases, 5+ celebration animations, collectible rewards visible in profile area

## Edge Case Handling

- **Accidental touches**: Implement small "Clear" button to restart current character without penalty
- **Off-canvas drawing**: Constrain drawing area with visual boundaries, ignore strokes outside practice zone
- **Incomplete attempts**: Allow saving progress and "Try Again" option without losing stars already earned for other characters
- **No pen pressure support**: Ensure app works equally well with finger, basic stylus, or pressure-sensitive pen
- **Small screens**: Automatically scale 4-line guide system to fit available space while maintaining readability
- **First-time users**: Include friendly animated tutorial on first launch showing how to trace

## Design Direction

The design should feel playful and encouraging like a friendly classroom helper, evoking warmth and accomplishment rather than pressure or testing. A minimal but joyful interface ensures the focus stays on the handwriting practice while celebratory moments create emotional engagement.

## Color Selection

**Triadic** color scheme using primary colors that feel familiar and educational (like classroom materials), creating an energetic but organized learning environment.

- **Primary Color**: Bright Sky Blue (oklch(0.65 0.15 240)) - Main brand color representing calm focus and trust, used for primary buttons and active states, communicates reliability
- **Secondary Colors**: 
  - Sunshine Yellow (oklch(0.85 0.15 90)) - Warm and cheerful, used for star ratings and achievements
  - Grass Green (oklch(0.65 0.15 150)) - Success and growth, used for completion feedback and progress indicators
- **Accent Color**: Coral Red (oklch(0.65 0.15 30)) - Energy and excitement for celebration moments, special achievements, and call-to-action elements
- **Foreground/Background Pairings**: 
  - Background (Soft Cream oklch(0.97 0.01 85)): Dark Text (oklch(0.25 0.02 270)) - Ratio 11.2:1 ✓
  - Card (White oklch(1 0 0)): Dark Text (oklch(0.25 0.02 270)) - Ratio 13.5:1 ✓
  - Primary (Sky Blue oklch(0.65 0.15 240)): White text (oklch(1 0 0)) - Ratio 5.1:1 ✓
  - Secondary (Sunshine Yellow oklch(0.85 0.15 90)): Dark text (oklch(0.25 0.02 270)) - Ratio 9.8:1 ✓
  - Accent (Coral Red oklch(0.65 0.15 30)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓
  - Muted (Light Gray oklch(0.92 0.005 270)): Medium Gray text (oklch(0.45 0.02 270)) - Ratio 7.2:1 ✓

## Font Selection

Typefaces should be clear, rounded, and approachable like the print letters children learn in early education, while maintaining excellent legibility at all sizes for young readers.

- **Primary Font**: Quicksand - Rounded geometric sans-serif that feels friendly and matches handwriting guides (for Latin scripts)
- **Display Font**: Fredoka - Playful rounded font for headings and celebration messages
- **Script-Specific Fonts**:
  - Noto Sans Arabic - Professional, clear Arabic/Urdu script support with proper connection handling
  - Noto Sans JP - Clean Japanese Hiragana and Katakana rendering
  - Noto Sans Devanagari - Authentic Nepali/Devanagari script display

- **Typographic Hierarchy**: 
  - H1 (Page Title): Fredoka Bold / 32px / tight letter-spacing (-0.02em) / line-height 1.2
  - H2 (Section Headers): Fredoka SemiBold / 24px / normal letter-spacing / line-height 1.3
  - H3 (Character Label): Quicksand Bold / 20px / normal letter-spacing / line-height 1.4
  - Body (Instructions): Quicksand Medium / 16px / normal letter-spacing / line-height 1.6
  - Button Text: Quicksand Bold / 16px / slight letter-spacing (0.01em) / line-height 1.5
  - Small (Helper Text): Quicksand Regular / 14px / normal letter-spacing / line-height 1.5

## Animations

Animations should be celebratory and rewarding, with joyful bounces and sparkles when achievements are unlocked, while keeping drawing interactions immediate and responsive to maintain the direct connection between stylus and screen.

- **Purposeful Meaning**: Bouncy, elastic animations for success moments communicate joy and achievement; smooth, immediate drawing feedback emphasizes the direct manipulation and control children have over their marks
- **Hierarchy of Movement**: 
  1. Star awards and achievement unlocks get prominent celebration animations (scale, bounce, particles)
  2. Character selection has gentle hover and tap feedback
  3. Navigation transitions are quick and spatial (slide in/out)
  4. Drawing strokes appear instantly with no animation delay

## Component Selection

- **Components**: 
  - **Card**: Character/word/sentence selection grid items showing preview and star progress; sentences use wider horizontal layout; multi-script support with appropriate fonts
  - **Tabs**: Category navigation (Uppercase, Lowercase, Numbers, EU Uppercase, EU Lowercase, Punctuation, Words, Sentences, Arabic, Urdu, Hiragana, Katakana, Nepali, Nepali Vowels)
  - **Button**: Primary actions (Clear, Next, Try Again, Show/Hide Guide, Line Info) with rounded, large touch targets
  - **Progress**: Visual progress bars for tracking overall completion in each category
  - **Dialog**: Achievement unlock celebrations, first-time tutorial, and 4-line guide explanation
  - **Badge**: Star counts, achievement indicators, completion status, and level indicators
  - **Scroll Area**: Vertical scrolling character lists within each category
  - Custom Canvas Component: HTML5 Canvas for drawing with touch/pen input handling, adaptive 4-line guide, directional arrows, and real-time color-coded precision feedback
  - Custom Line Guide Helper: Modal overlay explaining the 4-line system with visual examples and updated spacing
  - Custom Precision Feedback System: Real-time stroke coloring based on distance from guide boundaries with progressive difficulty

- **Customizations**: 
  - Custom 4-line guide overlay component with properly-spaced, color-coded lines and labels (25%, 42%, 58%, 75%)
  - Custom drawing canvas with stroke recording, playback, adaptive text sizing, multi-script font support, and real-time precision feedback
  - Directional arrow indicators for RTL (Arabic, Urdu) and complex LTR scripts (Japanese, Nepali)
  - Custom star rating display with animated unlock
  - Custom character preview cards with completion status, adaptive layout for sentences, and proper font rendering
  - Custom celebration particle effect component
  - Custom line guide helper modal with interactive explanation of the improved 4-line system spacing
  - Progressive precision system with level-based thresholds and color-coded visual feedback (blue/yellow/orange/red)
  - Level indicator overlay showing current difficulty level for characters with multiple attempts
  - Precision legend overlay showing meaning of stroke colors

- **States**: 
  - Buttons: Large with rounded corners, subtle shadow in default state, scale down slightly on press, bright color fill for primary actions
  - Character Cards: Subtle border in default, lift up with shadow on hover, fill with primary color when selected, checkmark badge when completed
  - Canvas: Light guide lines always visible, real-time stroke color changes from blue (perfect) to yellow (slightly off) to orange (getting far) to red (too far) based on distance from guide boundaries, stroke fades slightly when complete
  - Stars: Gray outline when locked, animated fill with bounce when earned
  - Level Indicator: Appears when character level > 1, shows progressive difficulty
  - Precision Legend: Always visible in corner showing color meanings

- **Icon Selection**: 
  - Star (filled/outline) for ratings
  - ArrowLeft for back navigation
  - Sparkle for achievement moments
  - Check for completed characters
  - X or Trash for clear/reset
  - Play for stroke order demonstrations
  - House for home navigation
  - Trophy for achievements page
  - Eye/EyeSlash for showing/hiding guides
  - Info for accessing 4-line system explanation

- **Spacing**: 
  - Container padding: space-6 (24px) on mobile, space-8 (32px) on tablet
  - Card gap in grid: gap-4 (16px)
  - Button padding: px-6 py-3 (24px horizontal, 12px vertical)
  - Section margins: space-8 between major sections
  - Canvas margins: space-4 around drawing area

- **Mobile**: 
  - Canvas fills most of viewport with minimal chrome above/below
  - Category tabs stack vertically on very small screens or use horizontal scroll
  - Character grid: 3 columns on mobile (portrait), 4-5 on tablet (landscape)
  - Bottom action bar with large touch-friendly buttons
  - Hide stroke order numbers on small screens if space constrained, show on tablet
