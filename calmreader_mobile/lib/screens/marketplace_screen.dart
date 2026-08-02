import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import '../services/marketplace_service.dart';

class MarketplaceScreen extends StatefulWidget {
  const MarketplaceScreen({super.key});

  @override
  State<MarketplaceScreen> createState() => _MarketplaceScreenState();
}

class _MarketplaceScreenState extends State<MarketplaceScreen> {
  bool _isLoading = true;
  List<MarketplaceBook> _books = [];
  bool _isOffline = false;

  @override
  void initState() {
    super.initState();
    _loadBooks();
  }

  Future<void> _loadBooks() async {
    final connectivity = Connectivity();
    final result = await connectivity.checkConnectivity();
    final hasConnection = result != ConnectivityResult.none;

    if (!hasConnection) {
      setState(() {
        _isOffline = true;
        _isLoading = false;
      });
      return;
    }

    try {
      final payload = await MarketplaceService.fetchMarketplaceBooks();
      setState(() {
        _books = payload.books;
        _isOffline = payload.isOffline;
        _isLoading = false;
      });
    } catch (_) {
      setState(() {
        _isOffline = true;
        _isLoading = false;
      });
    }
  }

  Future<void> _reload() async {
    setState(() {
      _isLoading = true;
      _isOffline = false;
    });
    await _loadBooks();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Marketplace', style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(onPressed: _reload, icon: const Icon(Icons.refresh_rounded)),
        ],
      ),
      body: _buildBody(theme),
    );
  }

  Widget _buildBody(ThemeData theme) {
    if (_isLoading) {
      return _buildLoading(theme);
    }

    if (_isOffline || _books.isEmpty) {
      return _buildOffline(theme);
    }

    return RefreshIndicator(
      onRefresh: _reload,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
        children: [
          _SectionTitle(title: 'New Releases', books: _books.where((b) => b.badge == 'New' || b.badge == 'New Release').toList()),
          const SizedBox(height: 16),
          _SectionTitle(title: 'Trending', books: _books.where((b) => b.badge == 'Trending').toList()),
          const SizedBox(height: 16),
          _SectionTitle(title: 'Recommended', books: _books.where((b) => b.badge == 'Recommended').toList()),
          const SizedBox(height: 16),
          _SectionTitle(title: 'Free Books', books: _books.where((b) => b.isFree).toList()),
          const SizedBox(height: 16),
          _SectionTitle(title: 'Premium Books', books: _books.where((b) => !b.isFree).toList()),
        ],
      ),
    );
  }

  Widget _buildLoading(ThemeData theme) {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      itemCount: 3,
      itemBuilder: (_, index) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Container(
          height: 120,
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: const _ShimmerLoader(),
        ),
      ),
    );
  }

  Widget _buildOffline(ThemeData theme) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.wifi_off_rounded, size: 48, color: Color(0xFF2E7D32)),
            const SizedBox(height: 12),
            Text('No internet connection', style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text('Connect to the internet to explore new books.', textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton.icon(onPressed: _reload, icon: const Icon(Icons.refresh_rounded), label: const Text('Retry')),
          ],
        ),
      ),
    );
  }
}

class _ShimmerLoader extends StatefulWidget {
  const _ShimmerLoader();

  @override
  State<_ShimmerLoader> createState() => _ShimmerLoaderState();
}

class _ShimmerLoaderState extends State<_ShimmerLoader> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(duration: const Duration(milliseconds: 1200), vsync: this)..repeat();
    _animation = Tween(begin: 0.3, end: 0.8).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOutSine));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
          ),
          child: ShaderMask(
            shaderCallback: (bounds) => LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                Colors.white.withOpacity(_animation.value),
                Colors.white.withOpacity(_animation.value * 0.5),
              ],
            ).createShader(bounds),
            child: Container(
              height: 120,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title, required this.books});

  final String title;
  final List<MarketplaceBook> books;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700)),
        const SizedBox(height: 10),
        if (books.isEmpty)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE7DED5)),
            ),
            child: Text('No books in this category yet.', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.onSurfaceVariant)),
          )
        else
          SizedBox(
            height: 180,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: books.length,
              itemBuilder: (context, index) => Padding(
                padding: const EdgeInsets.only(right: 12),
                child: _MarketplaceCard(book: books[index]),
              ),
            ),
          ),
      ],
    );
  }
}

class _MarketplaceCard extends StatelessWidget {
  const _MarketplaceCard({required this.book});

  final MarketplaceBook book;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return GestureDetector(
      onTap: () => openBookInBrowser(book.slug),
      child: AnimatedScale(
        scale: 1,
        duration: const Duration(milliseconds: 120),
        child: Container(
          width: 140,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: const Color(0xFFE7DED5)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  book.imageUrl,
                  width: 116,
                  height: 140,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => Container(
                    width: 116,
                    height: 140,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF4E8DA),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.menu_book_rounded, color: Color(0xFF2E7D32), size: 36),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(book.title, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700), maxLines: 1, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 2),
              Text(book.author, style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant), maxLines: 1, overflow: TextOverflow.ellipsis),
              const SizedBox(height: 6),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDDEDD8),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(book.badge, style: const TextStyle(color: Color(0xFF2E7D32), fontSize: 10, fontWeight: FontWeight.w700)),
                  ),
                  const Spacer(),
                  Text(book.isFree ? 'Free' : book.price, style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700, color: const Color(0xFF2E7D32))),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
