import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../components/bottom_nav.dart';
import '../components/continue_reading.dart';
import 'marketplace_screen.dart';
import 'profile_screen.dart';

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
      const MarketplaceScreen(),
      const _ProfileContent(),
    ];

    return Scaffold(
      body: IndexedStack(index: _selectedIndex, children: pages),
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
                  Text('Today\'s focus', style: GoogleFonts.inter(fontSize: 13, color: Colors.white70)),
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
            Row(
              children: [
                Text('Recently opened', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
                const Spacer(),
                TextButton(onPressed: () {}, child: const Text('See all')),
              ],
            ),
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
            const SizedBox(height: 18),
            Text('Reading stats', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            const _StatsRow(),
            const SizedBox(height: 18),
            FilledButton.icon(
              onPressed: () => Navigator.pushNamed(context, '/marketplace'),
              icon: const Icon(Icons.shopping_bag_rounded),
              label: const Text('Browse Marketplace'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
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
            TextField(
              decoration: InputDecoration(
                hintText: 'Search your library...',
                prefixIcon: const Icon(Icons.search_rounded),
                filled: true,
                fillColor: Theme.of(context).colorScheme.surface,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16), borderSide: BorderSide.none),
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: const [
                  _FilterChip(label: 'All', selected: true),
                  _FilterChip(label: 'Fiction'),
                  _FilterChip(label: 'Non-fiction'),
                  _FilterChip(label: 'Essays'),
                  _FilterChip(label: 'Poetry'),
                ],
              ),
            ),
            const SizedBox(height: 16),
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
            const _StatsRow(),
            const SizedBox(height: 24),
            ListTile(
              leading: const Icon(Icons.settings_rounded),
              title: const Text('Settings'),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
              onTap: () => Navigator.pushNamed(context, '/settings'),
            ),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.logout_rounded, color: Color(0xFFB3261E)),
              title: const Text('Logout', style: TextStyle(color: Color(0xFFB3261E))),
              onTap: () {
                showDialog(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Log out?'),
                    content: const Text('You will return to the welcome screen.'),
                    actions: [
                      TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                      TextButton(onPressed: () { Navigator.pop(ctx); Navigator.pushNamedAndRemoveUntil(context, '/', (route) => false); }, child: const Text('Log out')),
                    ],
                  ),
                );
              },
            ),
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

class _FilterChip extends StatelessWidget {
  const _FilterChip({required this.label, this.selected = false});

  final String label;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) {},
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  const _StatsRow();

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
