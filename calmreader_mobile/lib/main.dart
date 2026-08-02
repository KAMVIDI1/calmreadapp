import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/audiobook_screen.dart';
import 'screens/home_screen.dart';
import 'screens/library_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/reader_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/studio_screen.dart';
import 'screens/video_screen.dart';
import 'screens/welcome_screen.dart';

void main() {
  runApp(const CalmReaderApp());
}

class CalmReaderApp extends StatelessWidget {
  const CalmReaderApp({super.key});

  @override
  Widget build(BuildContext context) {
    final lightTheme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF2E7D32),
        brightness: Brightness.light,
      ),
      scaffoldBackgroundColor: const Color(0xFFF5F0EB),
      cardColor: Colors.white,
      textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme),
      appBarTheme: const AppBarTheme(backgroundColor: Colors.transparent, elevation: 0),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: const Color(0xFFFFFFFF),
        indicatorColor: const Color(0xFFDDEDD8),
        labelTextStyle: WidgetStateProperty.resolveWith((states) => GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600)),
      ),
    );

    final darkTheme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF2E7D32),
        brightness: Brightness.dark,
      ),
      scaffoldBackgroundColor: const Color(0xFF121212),
      cardColor: const Color(0xFF1E1E1E),
      textTheme: GoogleFonts.interTextTheme(ThemeData.dark().textTheme),
      appBarTheme: const AppBarTheme(backgroundColor: Colors.transparent, elevation: 0),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: const Color(0xFF1E1E1E),
        indicatorColor: const Color(0xFF2E7D32),
        labelTextStyle: WidgetStateProperty.resolveWith((states) => GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600)),
      ),
    );

    return MaterialApp(
      title: 'CalmReader Mobile',
      debugShowCheckedModeBanner: false,
      theme: lightTheme,
      darkTheme: darkTheme,
      themeMode: ThemeMode.system,
      home: const WelcomeScreen(),
      routes: {
        '/home': (context) => const HomeScreen(),
        '/library': (context) => const LibraryScreen(),
        '/studio': (context) => const StudioScreen(),
        '/settings': (context) => const SettingsScreen(),
        '/reader': (context) => const ReaderScreen(),
        '/audiobook': (context) => const AudiobookScreen(),
        '/video': (context) => const VideoScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/marketplace': (context) => MarketplaceScreen(),
      },
    );
  }
}
