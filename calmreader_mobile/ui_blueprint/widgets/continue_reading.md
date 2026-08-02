# Continue Reading Card

Primary action card on Home and Welcome screens.

## Props
- `title` (String) — "Continue reading"
- `subtitle` (String) — Book name + chapter
- `progress` (double) — 0.0 to 1.0
- `onPressed` (VoidCallback) — Opens reader

## Structure
```
Container (rounded 24px, border, shadow)
  InkWell
    Row
      Container (48x48, rounded 16px, accent bg)
        Icon (auto_stories_rounded, primary)
      SizedBox (14px)
      Expanded
        Column
          Text ("Continue reading", w700)
          Text (book + chapter, secondary)
      Icon (arrow_forward_ios_rounded, 16px)
  LinearProgressIndicator (thin, 3px, rounded, at bottom)
```

## Interactions
- Tap navigates to reader
- Fade-in on mount (500ms)
