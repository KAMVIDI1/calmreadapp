import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../components/bottom_nav.dart';
import '../components/continue_reading.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const MainNavigationScreen(initialIndex: 0);
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key, required this.initialIndex});

  final int initialIndex;

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  late int _selectedIndex;

  @override
  void initState() {
    super.initState();
    _selectedIndex = widget.initialIndex;
  }

  @override
  Widget build(BuildContext context) {
    final List<Widget> pages = [
      const _HomeContent(),
      const _LibraryContent(),
      const _StudioContent(),
      const _ProfileContent(),
    ];

    return Scaffold(
      body: pages[_selectedIndex],
      bottomNavigationBar: CalmBottomNav(
        currentIndex: _selectedIndex,
        onTap: (value) => setState(() => _selectedIndex = value),
      ),
    );
  }
}

class _HomeContent extends StatelessWidget {
  const _HomeContent();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Good evening', style: GoogleFonts.inter(fontSize: 14, color: theme.colorScheme.onSurfaceVariant)),
            const SizedBox(height: 4),
            Text('Your calm reading space', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(24),
                gradient: const LinearGradient(colors: [Color(0xFF2E7D32), Color(0xFF4CAF50)]),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Today’s focus', style: GoogleFonts.inter(fontSize: 13, color: Colors.white70)),
                  const SizedBox(height: 8),
                  Text('A slower, brighter reading habit', style: GoogleFonts.inter(fontSize: 20, fontWeight: FontWeight.w700, color: Colors.white)),
                  const SizedBox(height: 12),
                  Text('34 min read • 2 new notes • 3 books in progress', style: GoogleFonts.inter(fontSize: 13, color: Colors.white70)),
                ],
              ),
            ),
            const SizedBox(height: 18),
            ContinueReadingCard(onPressed: () => Navigator.pushNamed(context, '/reader')),
            const SizedBox(height: 18),
            Text('Recently opened', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            SizedBox(
              height: 130,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: const [
                  _RecentBookCard(title: 'The Burden She Carried', subtitle: 'Chapter 4'),
                  _RecentBookCard(title: 'A Gentle Mind', subtitle: 'Essay 2'),
                  _RecentBookCard(title: 'Quiet Seasons', subtitle: '12 min left'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LibraryContent extends StatelessWidget {
  const _LibraryContent();

  @override
  Widget build(BuildContext context) {
    final books = [
      _BookCardModel(title: 'The Quiet Room', subtitle: 'Downloaded'),
      _BookCardModel(title: 'Hearthlight', subtitle: 'New note'),
      _BookCardModel(title: 'Winter Orchard', subtitle: 'In progress'),
      _BookCardModel(title: 'Calm Horizons', subtitle: 'Read again'),
    ];

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Library', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text('Your downloaded books, neatly organized.', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
            const SizedBox(height: 18),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 14, crossAxisSpacing: 14, childAspectRatio: 0.95),
              itemCount: books.length,
              itemBuilder: (_, index) => _LibraryBookTile(book: books[index]),
            ),
          ],
        ),
      ),
    );
  }
}

class _StudioContent extends StatelessWidget {
  const _StudioContent();

  @override
  Widget build(BuildContext context) {
    final tiles = [
      (_StudioTileModel(title: 'Create a note', subtitle: 'Capture reflections', icon: Icons.edit_note_rounded), '/reader'),
      (_StudioTileModel(title: 'Audiobook', subtitle: 'Listen and relax', icon: Icons.headphones_rounded), '/audiobook'),
      (_StudioTileModel(title: 'Video', subtitle: 'Watch a lesson', icon: Icons.play_circle_fill_rounded), '/video'),
    ];

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Studio', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text('Create, edit, and explore your calm media.', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
            const SizedBox(height: 18),
            ...tiles.map((entry) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: _StudioTile(tile: entry.$1, routeName: entry.$2),
            )).toList(),
          ],
        ),
      ),
    );
  }
}

class _ProfileContent extends StatelessWidget {
  const _ProfileContent();

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 18, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Profile', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w700)),
            const SizedBox(height: 18),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(color: theme.colorScheme.surface, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE7DED5))),
              child: Row(
                children: [
                  const CircleAvatar(radius: 32, backgroundColor: Color(0xFFDDEDD8), child: Icon(Icons.person_rounded, color: Color(0xFF2E7D32), size: 28)),
                  const SizedBox(width: 14),
                  Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('Mina', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)), Text('12 books read • 18h listened', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant))]))
                ],
              ),
            ),
            const SizedBox(height: 16),
            _StatRow(),
          ],
        ),
      ),
    );
  }
}

class _RecentBookCard extends StatelessWidget {
  const _RecentBookCard({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE7DED5))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.menu_book_rounded, color: Color(0xFF2E7D32)),
          const Spacer(),
          Text(title, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(subtitle, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
        ],
      ),
    );
  }
}

class _LibraryBookTile extends StatelessWidget {
  const _LibraryBookTile({required this.book});

  final _BookCardModel book;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE7DED5))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.menu_book_rounded, color: Color(0xFF2E7D32), size: 26),
          const SizedBox(height: 12),
          Text(book.title, style: Theme.of(context).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(book.subtitle, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
        ],
      ),
    );
  }
}

class _StudioTile extends StatelessWidget {
  const _StudioTile({required this.tile, required this.routeName});

  final _StudioTileModel tile;
  final String routeName;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, routeName),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface, borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFE7DED5))),
        child: Row(
          children: [
            Container(width: 42, height: 42, decoration: BoxDecoration(color: const Color(0xFFF4E8DA), borderRadius: BorderRadius.circular(14)), child: Icon(tile.icon, color: const Color(0xFFD4A373))),
            const SizedBox(width: 12),
            Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(tile.title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)), Text(tile.subtitle, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant))])),
            const Icon(Icons.arrow_forward_ios_rounded, size: 16),
          ],
        ),
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final stats = [
      _StatItem(label: 'Reading time', value: '4.2h'),
      _StatItem(label: 'Books read', value: '12'),
      _StatItem(label: 'Notes', value: '28'),
    ];
    return Row(
      children: stats.map((stat) => Expanded(child: Container(margin: const EdgeInsets.only(right: 8), padding: const EdgeInsets.all(14), decoration: BoxDecoration(color: Theme.of(context).colorScheme.surface, borderRadius: BorderRadius.circular(18), border: Border.all(color: const Color(0xFFE7DED5))), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(stat.value, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)), Text(stat.label, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant))])))).toList(),
    );
  }
}

class _StatItem {
  const _StatItem({required this.label, required this.value});

  final String label;
  final String value;
}

class _BookCardModel {
  const _BookCardModel({required this.title, required this.subtitle});

  final String title;
  final String subtitle;
}

class _StudioTileModel {
  const _StudioTileModel({required this.title, required this.subtitle, required this.icon});

  final String title;
  final String subtitle;
  final IconData icon;
}
