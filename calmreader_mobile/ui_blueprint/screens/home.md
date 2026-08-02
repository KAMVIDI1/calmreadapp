# Home Screen

Primary dashboard when user opens the app.

## Structure
```
Scaffold
  SafeArea
    SingleChildScrollView (padding 20px)
      Column
        Text ("Good evening", secondary, 14px)
        Text ("Your calm reading space", Playfair Display, 24px, w700)
        SizedBox (18px)
        Container (gradient primary, rounded 24px)
          Column
            Text ("Today's focus", white70, 13px)
            Text ("A slower, brighter reading habit", white, 20px, w700)
            Text ("34 min read • 2 new notes • 3 books in progress", white70, 13px)
        SizedBox (18px)
        ContinueReadingCard → /reader
        SizedBox (18px)
        Row (spaceBetween)
          Text ("Recently opened", w700)
          TextButton ("See all")
        SizedBox (10px)
        SizedBox (height: 130)
          ListView (horizontal)
            _RecentBookCard × N
        SizedBox (18px)
        Row (spaceBetween)
          Text ("Reading stats", w700)
        SizedBox (10px)
        Row (3 columns)
          _StatCard ("4.2h", "Reading time")
          _StatCard ("12", "Books read")
          _StatCard ("28", "Notes")
        SizedBox (18px)
        FilledButton ("Browse Marketplace", full width) → /marketplace
```

## Interactions
- Recently opened scrolls horizontally
- "Browse Marketplace" pushes Marketplace route
- Stats are static placeholders (to be connected to local data)
