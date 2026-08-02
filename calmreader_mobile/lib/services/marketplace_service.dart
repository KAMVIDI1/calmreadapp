import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:url_launcher/url_launcher.dart';

class MarketplaceBook {
  const MarketplaceBook({
    required this.id,
    required this.title,
    required this.author,
    required this.description,
    required this.category,
    required this.slug,
    required this.imageUrl,
    required this.price,
    required this.isFree,
    required this.badge,
  });

  final String id;
  final String title;
  final String author;
  final String description;
  final String category;
  final String slug;
  final String imageUrl;
  final String price;
  final bool isFree;
  final String badge;
}

class MarketplacePayload {
  const MarketplacePayload({required this.books, required this.isOffline});

  final List<MarketplaceBook> books;
  final bool isOffline;
}

class MarketplaceService {
  static Future<MarketplacePayload> fetchMarketplaceBooks() async {
    try {
      final response = await http.get(
        Uri.parse('https://calmreader.com/api/marketplace/books'),
        headers: {'Accept': 'application/json'},
      );

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body);
        if (decoded is List) {
          final books = decoded.map((item) => _bookFromJson(item)).toList();
          return MarketplacePayload(books: books, isOffline: false);
        }
        if (decoded is Map<String, dynamic> && decoded['books'] is List) {
          final books = (decoded['books'] as List).map((item) => _bookFromJson(item)).toList();
          return MarketplacePayload(books: books, isOffline: false);
        }
      }
    } catch (_) {
      // Fall back to the offline-friendly empty state below.
    }

    return const MarketplacePayload(books: [], isOffline: true);
  }

  static MarketplaceBook _bookFromJson(dynamic item) {
    final map = item as Map<String, dynamic>;
    return MarketplaceBook(
      id: map['id']?.toString() ?? '',
      title: map['title']?.toString() ?? 'Untitled',
      author: map['author']?.toString() ?? 'CalmReader',
      description: map['description']?.toString() ?? 'A calm and thoughtful story available on CalmReader.',
      category: map['category']?.toString() ?? 'Featured',
      slug: map['slug']?.toString() ?? 'book',
      imageUrl: map['imageUrl']?.toString() ?? 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
      price: map['price']?.toString() ?? 'Free',
      isFree: map['isFree'] == true || map['price']?.toString().toLowerCase() == 'free',
      badge: map['badge']?.toString() ?? 'New',
    );
  }
}

Future<void> openBookInBrowser(String slug) async {
  final url = Uri.parse('https://calmreader.com/book/$slug');
  if (await canLaunchUrl(url)) {
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }
}
