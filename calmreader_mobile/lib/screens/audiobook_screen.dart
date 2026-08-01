import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AudiobookScreen extends StatelessWidget {
  const AudiobookScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Audiobook')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('Audiobook', style: GoogleFonts.playfairDisplay(fontSize: 24, fontWeight: FontWeight.w700)),
              const SizedBox(height: 8),
              const Text('Relax with your next audio session.'),
            ],
          ),
        ),
      ),
    );
  }
}
