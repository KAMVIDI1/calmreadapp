# Profile Screen

User account overview. Accessible via bottom nav tab 3.

## Structure
```
Scaffold
  SafeArea
    Padding (20px)
      Column
        Text ("Profile", Playfair Display, 24px, w700)
        SizedBox (18px)
        Container (24px radius, border, surface bg)
          Row
            CircleAvatar (64px, accent bg)
              Icon (person_rounded, primary)
            SizedBox (14px)
            Expanded
              Column
                Text ("Mina", w700, 20px)
                Text ("mina@example.com", secondary, 14px)
                Chip ("Premium" / "Free" / "Author")
        SizedBox (12px)
        Container (24px radius, border, surface bg)
          Column
            _ProfileRow ("Books owned", "24")
            Divider
            _ProfileRow ("Books downloaded", "12")
            Divider
            _ProfileRow ("Reading time", "4.2h")
            Divider
            _ProfileRow ("Books completed", "8")
        SizedBox (16px)
        ListTile (leading: settings_rounded, title: "Settings") → /settings
        ListTile (leading: logout, title: "Logout", color: error)
```

## Interactions
- Settings navigates to SettingsScreen
- Logout shows confirmation dialog (no actual auth in this build)
