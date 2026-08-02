# Marketplace Screen

Content preview window — NOT a WebView. Fetches metadata from API.

## Online State
```
Scaffold
  AppBar ("Marketplace", Playfair Display)
    actions: RefreshButton
  CustomScrollView
    SliverToBoxAdapter
      _SectionTitle ("New Releases") → horizontal shelf
      _SectionTitle ("Trending") → horizontal shelf
      _SectionTitle ("Recommended") → horizontal shelf
      _SectionTitle ("Free Books") → horizontal shelf
      _SectionTitle ("Premium Books") → horizontal shelf
```

## Shelf Structure
```
Column
  Text (section title, w700)
  SizedBox (10px)
  SizedBox (height: 180)
    ListView (horizontal)
      _MarketplaceCard × N
```

## Card Structure
```
Container (rounded 20px, border, shadow)
  InkWell (onTap → url_launcher)
    Row
      ClipRRect (rounded 16px)
        Image.network (80x100)
      SizedBox (12px)
      Expanded
        Column
          Text (title, w700, 16px)
          Text (author, 13px, secondary)
          Text (description, 2 lines, 13px)
          Row
            Chip (badge)
            Spacer
            Text (price / Free, w700, primary)
```

## Offline State
```
Center
  Padding (24px)
    Icon (wifi_off_rounded, 48px, primary)
    Text ("No internet connection", w700)
    Text ("Connect to the internet to explore new books.")
    FilledButton ("Retry")
```

## Loading State
```
ListView (padding 16px)
  Container (height: 120, rounded 20px, surface bg) × 3
```

## Interactions
- Tap card → `url_launcher` opens `https://calmreader.com/book/{slug}`
- Pull to refresh or tap refresh icon
- No reading, downloading, or purchasing inside app
