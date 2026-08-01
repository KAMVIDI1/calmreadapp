import 'package:flutter/material.dart';

class CalmBottomNav extends StatelessWidget {
  const CalmBottomNav({super.key, required this.currentIndex, required this.onTap});

  final int currentIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: onTap,
      backgroundColor: colorScheme.surface,
      indicatorColor: const Color(0xFFDDEDD8),
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.library_books_rounded), label: 'Library'),
        NavigationDestination(icon: Icon(Icons.auto_stories_rounded), label: 'Studio'),
        NavigationDestination(icon: Icon(Icons.person_rounded), label: 'Profile'),
      ],
      labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
    );
  }
}
