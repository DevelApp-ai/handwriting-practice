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

See [PRD.md](./PRD.md) for the full product specification.

## License

MIT
