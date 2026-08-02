# Book Card Widget

A horizontal card for marketplace and home shelves.

## Props
- `title` (String) — Book title
- `author` (String) — Author name
- `description` (String) — Short description (max 2 lines)
- `imageUrl` (String) — Cover image URL
- `category` (String) — Genre/category
- `badge` (String) — "New", "Trending", "Free", "Premium"
- `price` (String) — Price string
- `isFree` (bool) — Whether the book is free
- `onTap` (VoidCallback) — Opens external browser

## Structure
```
Container (rounded 20px, border, shadow)
  Row
    ClipRRect (rounded 16px)
      Image.network (80x100)
    SizedBox (12px)
    Expanded
      Column
        Text (title, w700, 16px)
        Text (author, w400, 13px, secondary)
        Text (description, 2 lines, 13px)
        Row
          Chip (badge, primary bg, white text)
          Spacer
          Text (price / Free, w700, primary)
```

## Interactions
- InkWell on entire card
- Scale to 0.96 on tap (120ms)
- No internal navigation
