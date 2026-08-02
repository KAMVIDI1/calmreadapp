import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile', style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w700)),
      ),
      body: SafeArea(
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
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Mina', style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700)),
                          const SizedBox(height: 4),
                          Text('mina@calmreader.com', style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant)),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFDDEDD8),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text('Premium', style: TextStyle(color: const Color(0xFF2E7D32), fontSize: 12, fontWeight: FontWeight.w700)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(color: theme.colorScheme.surface, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE7DED5))),
                child: Column(
                  children: [
                    _ProfileRow(label: 'Books owned', value: '24', icon: Icons.menu_book_rounded),
                    const Divider(height: 24),
                    _ProfileRow(label: 'Books downloaded', value: '12', icon: Icons.download_rounded),
                    const Divider(height: 24),
                    _ProfileRow(label: 'Reading time', value: '4.2h', icon: Icons.timer_rounded),
                    const Divider(height: 24),
                    _ProfileRow(label: 'Books completed', value: '8', icon: Icons.check_circle_rounded),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(color: theme.colorScheme.surface, borderRadius: BorderRadius.circular(24), border: Border.all(color: const Color(0xFFE7DED5))),
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.settings_rounded),
                      title: const Text('Settings'),
                      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                      onTap: () => Navigator.pushNamed(context, '/settings'),
                    ),
                    const Divider(),
                    ListTile(
                      leading: const Icon(Icons.help_outline_rounded),
                      title: const Text('Help & Support'),
                      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 16),
                      onTap: () {},
                    ),
                    const Divider(),
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
            ],
          ),
        ),
      ),
    );
  }
}

class _ProfileRow extends StatelessWidget {
  const _ProfileRow({required this.label, required this.value, required this.icon});

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Row(
      children: [
        Icon(icon, size: 20, color: theme.colorScheme.primary),
        const SizedBox(width: 12),
        Expanded(child: Text(label, style: theme.textTheme.bodyMedium)),
        Text(value, style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
      ],
    );
  }
}
