# Bottom Navigation Bar

Persistent navigation across the main app shell.

## Tabs
1. Home — `home_rounded` icon
2. Library — `library_books_rounded` icon
3. Marketplace — `shopping_bag_rounded` icon
4. Profile — `person_rounded` icon

## Structure
```
NavigationBar
  selectedIndex: int
  onDestinationSelected: (int) → void
  backgroundColor: surface
  indicatorColor: primaryContainer / primary (dark)
  labelBehavior: onlyShowSelected
  destinations: 4x NavigationDestination
```

## Behavior
- Active tab gets soft primary indicator
- Tap scale on destinations
- No labels when not selected
- Safe area padding handled automatically
