import 'package:flutter/material.dart';

void main() {
  runApp(const CalmReaderApp());
}

class CalmReaderApp extends StatelessWidget {
  const CalmReaderApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CalmReader',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD97706),
          brightness: Brightness.dark,
        ),
        scaffoldBackgroundColor: const Color(0xFF1C1917),
        useMaterial3: true,
      ),
      home: const MainScreen(),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('CalmReader Mobile'),
        backgroundColor: const Color(0xFF292524),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.menu_book_rounded,
              size: 64,
              color: Color(0xFFD97706),
            ),
            const SizedBox(height: 16),
            const Text(
              'Welcome to CalmReader Mobile',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Distraction-free reading experience',
              style: TextStyle(
                fontSize: 14,
                color: Color(0xFFA8A29E),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        backgroundColor: const Color(0xFF292524),
        selectedItemColor: const Color(0xFFD97706),
        unselectedItemColor: const Color(0xFFA8A29E),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.library_books),
            label: 'Library',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.auto_stories),
            label: 'Studio',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
