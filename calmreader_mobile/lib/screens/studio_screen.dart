import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StudioScreen extends StatefulWidget {
  const StudioScreen({super.key});

  @override
  State<StudioScreen> createState() => _StudioScreenState();
}

class _StudioScreenState extends State<StudioScreen> {
  double _fontSize = 16.0;
  String _themeMode = 'light';
  bool _isBookmarked = false;
  double _progress = 0.35;

  @override
  void initState() {
    super.initState();
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _fontSize = prefs.getDouble('studioFontSize') ?? 16.0;
      _themeMode = prefs.getString('studioTheme') ?? 'light';
    });
  }

  Future<void> _saveSettings() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('studioFontSize', _fontSize);
    await prefs.setString('studioTheme', _themeMode);
  }

  Color _getBackgroundColor() {
    switch (_themeMode) {
      case 'dark':
        return const Color(0xFF121212);
      case 'sepia':
        return const Color(0xFFF4E8DA);
      default:
        return const Color(0xFFF5F0EB);
    }
  }

  Color _getTextColor() {
    switch (_themeMode) {
      case 'dark':
        return const Color(0xFFE8E4DF);
      case 'sepia':
        return const Color(0xFF5D574F);
      default:
        return const Color(0xFF1E1E1E);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = _getBackgroundColor();
    final textColor = _getTextColor();

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: bgColor,
        elevation: 0,
        title: Text('Studio', style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.w700, color: textColor)),
        actions: [
          IconButton(
            icon: Icon(_isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded, color: textColor),
            onPressed: () => setState(() => _isBookmarked = !_isBookmarked),
          ),
          IconButton(
            icon: Icon(_themeMode == 'light' ? Icons.light_mode_rounded : _themeMode == 'dark' ? Icons.dark_mode_rounded : Icons.brightness_auto_rounded, color: textColor),
            onPressed: () {
              setState(() {
                _themeMode = _themeMode == 'light' ? 'dark' : _themeMode == 'dark' ? 'sepia' : 'light';
              });
              _saveSettings();
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Chapter 4: The Quiet Room',
                    style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.w700, color: textColor),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    'She opened the door slowly, as if afraid the room might disappear if she moved too quickly. The morning light filtered through the curtains in soft, golden bands, illuminating dust motes that danced like tiny spirits in the air.',
                    style: GoogleFonts.inter(fontSize: _fontSize, height: 1.8, color: textColor),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'The room was exactly as she remembered it: the wooden desk by the window, the shelf of worn books, the faded rug that had been there since she was a child. Everything smelled of old paper and lavender.',
                    style: GoogleFonts.inter(fontSize: _fontSize, height: 1.8, color: textColor),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'She sat down and began to write, the pen moving across the page with a rhythm that felt both foreign and familiar. Outside, the world continued its ordinary business, but in here, time moved differently.',
                    style: GoogleFonts.inter(fontSize: _fontSize, height: 1.8, color: textColor),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'This was her place of calm. Her studio of thought. And for the first time in months, she felt the tightness in her chest begin to loosen, just a little.',
                    style: GoogleFonts.inter(fontSize: _fontSize, height: 1.8, color: textColor),
                  ),
                ],
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 24),
            decoration: BoxDecoration(
              color: bgColor,
              border: Border(top: BorderSide(color: textColor.withOpacity(0.1))),
            ),
            child: Column(
              children: [
                LinearProgressIndicator(value: _progress, minHeight: 4, borderRadius: BorderRadius.circular(2)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.text_decrease_rounded, color: textColor),
                      onPressed: () {
                        if (_fontSize > 12) {
                          setState(() => _fontSize--);
                          _saveSettings();
                        }
                      },
                    ),
                    Text('Aa', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: textColor)),
                    IconButton(
                      icon: Icon(Icons.text_increase_rounded, color: textColor),
                      onPressed: () {
                        if (_fontSize < 24) {
                          setState(() => _fontSize++);
                          _saveSettings();
                        }
                      },
                    ),
                    const Spacer(),
                    TextButton.icon(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close_rounded),
                      label: const Text('Close'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
