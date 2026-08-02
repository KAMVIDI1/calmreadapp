# Settings Screen

App preferences and account management.

## Structure
```
Scaffold
  AppBar ("Settings")
  SafeArea
    Padding (20px)
      Column
        Section: Appearance
          Text ("Appearance", w700, 18px)
          SizedBox (12px)
          SegmentedButton / RadioGroup
            Light / Dark / System
          SizedBox (12px)
          Text ("Font size", w600)
          Slider (min 12, max 24, divisions 6)
          Row (spaceBetween)
            Text ("A" small)
            Text ("A" large)
        
        SizedBox (24px)
        Section: Downloads
          Text ("Downloads", w700, 18px)
          SizedBox (12px)
          DropdownButtonFormField ("High" / "Medium" / "Low")
          LinearProgressIndicator (storage used / total)
          Text ("2.4 GB of 5 GB used")
          OutlinedButton ("Clear Cache")
        
        SizedBox (24px)
        Section: About
          Text ("About", w700, 18px)
          SizedBox (12px)
          ListTile ("CalmReader Mobile", "Version 1.0.0")
          ListTile ("Terms of Service")
          ListTile ("Privacy Policy")
        
        SizedBox (24px)
        FilledButton ("Logout", full width, error color)
```

## Interactions
- Theme changes apply immediately
- Font size slider updates reader/studio font
- Clear cache shows confirmation dialog
- Logout returns to WelcomeScreen
