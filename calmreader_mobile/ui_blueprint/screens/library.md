# Library Screen

Shows all downloaded books. Accessible via bottom nav tab 1.

## Structure
```
Scaffold
  SafeArea
    Padding (20px)
      Column
        Text ("Library", Playfair Display, 24px, w700)
        Text ("Your downloaded books, neatly organized.", secondary)
        SizedBox (18px)
        SearchBar (rounded, outline)
        SizedBox (12px)
        Wrap (category filter chips)
          FilterChip × N ("All", "Fiction", "Non-fiction", etc.)
        SizedBox (12px)
        Row (end)
          IconButton (grid / list view toggle)
        Expanded
          GridView (2 columns)
            _LibraryBookTile × N
          OR
          ListView
            _LibraryBookTile × N (horizontal layout)
```

## Data
- Local storage only
- Each book shows: cover icon, title, author, download status, progress

## Empty State
```
Center
  Icon (library_books_rounded, large, primary tint)
  Text ("No books downloaded yet", w700)
  Text ("Browse the Marketplace to discover new reads.")
  FilledButton ("Browse Marketplace")
```
