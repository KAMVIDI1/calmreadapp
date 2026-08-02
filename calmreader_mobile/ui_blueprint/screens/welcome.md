# Welcome Screen

Entry point of the app. Fade-in animation on load.

## Structure
```
Scaffold
  Container (gradient background)
    SafeArea
      Padding (24px)
        AnimatedOpacity (fade in)
          Column
            Text ("CalmReader Mobile", Playfair Display, 30px, w700)
            Text ("Your CalmReader Library, Anywhere.", Inter, 15px, secondary)
            SizedBox (24px)
            Container (24px radius, shadow, surface bg)
              Row
                CircleAvatar (spa_rounded, accent bg, primary icon)
                SizedBox (14px)
                Expanded
                  Column
                    Text ("Welcome back", w700)
                    Text ("Continue reading where you left off.", secondary)
            SizedBox (20px)
            Row (2 columns)
              _ActionTile ("Library", "Your books", library_books_rounded) → /library
              _ActionTile ("Studio", "Create & edit", auto_stories_rounded) → /studio
            SizedBox (12px)
            _ActionTile ("Settings", "Preferences", settings_rounded, wide: true) → /settings
            SizedBox (20px)
            Spacer
            ContinueReadingCard → /reader
```

## Interactions
- Buttons navigate to respective screens via routes
- Continue reading card opens last read book
- Scale animation on tiles (0.96, 120ms)
