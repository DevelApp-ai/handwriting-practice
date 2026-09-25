# Handwriting Practice

A gamified handwriting practice application that helps children learn to write
letters, numbers, words, and sentences using the standard 4-line writing guide
(baseline, midline, ascender, descender). It supports multiple scripts and
writing systems with visual direction indicators, stroke-order demonstrations,
and multi-sensory feedback, optimized for tablet pen input.

Built with React, Vite, TypeScript, Tailwind CSS, Radix UI, and Phosphor icons.

[![GitHub Pages Deployment](https://github.com/DevelApp-ai/handwriting-practice/actions/workflows/pages.yml/badge.svg)](https://github.com/DevelApp-ai/handwriting-practice/actions/workflows/pages.yml)

**Live Demo:** https://DevelApp-ai.github.io/handwriting-practice/

## Features

- 9 languages: English, Danish, German, French, Spanish, Arabic, Urdu, Japanese kana, Nepali Devanagari
- Language-appropriate fonts (Quicksand for Latin, Noto Sans Arabic/JP/Devanagari)
- Standard 4-line writing guide with visual direction indicators per script
- Stroke-order demonstrations with animated playback (single characters)
- Practice modes: letters, numbers, words, and sentences with punctuation
- Stroke evaluation with real star scoring and motor-adapted spaced repetition (SRS)
- 4-tier scaffolding and cursive canvas
- Gamification: XP, levels, achievements, badges, and streaks
- Web Audio friction synth and haptic feedback
- Worksheet export and printable sheets
- Radical explorer (for logographic scripts)
- Persistent progress and settings (browser localStorage)

## Development

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run build    # build for production
npm test         # run the test suite
```

The app builds as a static site and is deployed to GitHub Pages from the `main`
branch via the included workflow.

## Accessibility

Handwriting practice is a visual and motor activity built around pointer-based
canvas drawing, which is inherently difficult to make fully screen-reader
accessible. The app includes the following mitigations:

- The canvas practice region is exposed as a labelled ARIA region, and the
  drawing canvas carries a descriptive label and instructions for assistive
  technology.
- The stroke-order demo ("Strokes") is a keyboard-reachable, watch-only
  alternative: you can review how a character is written without drawing.
- All practice controls (Back, mode switch, guide toggle, Clear, Done) are
  real buttons with accessible names and remain keyboard-operable.
- A polite live region announces which character is being practiced and which
  actions are available.

Known limitation: drawing itself still requires a pointing device; there is
currently no keyboard-based stroke input. Feedback on further mitigations is
welcome.

See [PRD.md](docs/PRD.md) for the full product specification.

## License

MIT
