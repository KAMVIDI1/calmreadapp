# CalmReader Mobile — UI Blueprint

This folder is the design source of truth for the CalmReader Mobile Flutter application.

## Structure

- `theme/` — Color palette, typography scale, and dark theme tokens
- `widgets/` — Reusable UI components: book cards, continue reading card, reader toolbar, bottom navigation bar
- `screens/` — Full-screen design specifications: welcome, home, library, studio, settings, marketplace, profile

## Design Principles

- **Calm & Elegant**: Soft rounded corners, generous spacing, muted earth tones
- **Premium Feel**: Subtle shadows, smooth micro-animations, consistent typography
- **Dark Mode Compatible**: Every color has a light and dark variant
- **Offline-First**: UI components work gracefully without network

## Color Palette

| Token | Light | Dark |
|-------|-------|------|
| Primary | `#2E7D32` | `#4CAF50` |
| Surface | `#F5F0EB` | `#121212` |
| Card | `#FFFFFF` | `#1E1E1E` |
| Border | `#E7DED5` | `#2A2A2A` |
| Text Primary | `#1E1E1E` | `#E8E4DF` |
| Text Secondary | `#5D574F` | `#9E9A94` |
| Accent Warm | `#D4A373` | `#D4A373` |
| Accent Light | `#DDEDD8` | `#2E7D32` |

## Typography

- **Display / Headings**: Playfair Display (serif)
- **Body / UI**: Inter (sans-serif)
- **Scale**: 12, 13, 14, 15, 16, 18, 20, 24, 30

## Spacing

- Base unit: 4px
- Standard padding: 16, 20, 24
- Card radius: 20–24px
- Button radius: 14–22px

## Components

### Book Card
- Rounded cover image (16px radius)
- Title (w700, 14-16px)
- Author (w400, 12-13px, secondary color)
- Badge chip (primary background, white text)
- Subtle border and shadow

### Continue Reading Card
- Full-width card with soft shadow
- Progress indicator (thin bar at bottom)
- Book icon in accent circle
- "Continue reading" label + chapter info

### Bottom Navigation
- 4 tabs: Home, Library, Marketplace, Profile
- Active indicator: soft primary tint
- Label behavior: show only selected
- Icons: rounded Material icons

## Screens

### Welcome
- Brand header with tagline
- 3 action tiles (Library, Studio, Settings)
- Continue Reading card at bottom
- Fade-in entrance animation

### Home
- Greeting header
- Continue Reading card (primary)
- "Recently opened" horizontal shelf
- Reading statistics row
- "Browse Marketplace" CTA

### Library
- Search bar with category filter chips
- Grid / List toggle
- Downloaded books only
- Empty state when no downloads

### Marketplace (Preview Window)
- NOT a WebView
- Horizontal shelves: New Releases, Trending, Recommended, Free Books, Premium Books
- Skeleton loading placeholders
- Offline message with Retry button
- Tap → external browser

### Profile
- Avatar + display name + email
- Account tier badge
- Books owned / downloaded counts
- Reading stats row
- Settings shortcut + Logout

### Settings
- Theme selector (Light / Dark / System)
- Font size slider
- Download quality dropdown
- Storage usage bar
- Clear cache button
- About + Logout

## Interactions

- Tap scale: 0.96 (120ms)
- Fade-in: 500-600ms
- Skeleton pulse: 1.2s loop
- Page transitions: none (replace)
