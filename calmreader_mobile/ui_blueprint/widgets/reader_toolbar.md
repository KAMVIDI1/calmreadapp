# Reader Toolbar

Minimal toolbar for the reading/studio experience.

## Props
- `onBack` (VoidCallback)
- `onFontDecrease` (VoidCallback)
- `onFontIncrease` (VoidCallback)
- `onThemeToggle` (VoidCallback)
- `onBookmark` (VoidCallback)
- `currentFontSize` (int)
- `currentTheme` (String: 'light'|'dark'|'sepia')

## Structure
```
Container (border bottom, transparent bg)
  Row
    IconButton (arrow_back)
    Expanded
      Text (book title, center, ellipsized)
    Row
      IconButton (text_decrease)
      Text ("Aa")
      IconButton (text_increase)
      IconButton (bookmark / bookmark_border)
      IconButton (palette / brightness)
```

## Interactions
- Font size changes animate smoothly
- Theme toggle cycles light → dark → sepia
