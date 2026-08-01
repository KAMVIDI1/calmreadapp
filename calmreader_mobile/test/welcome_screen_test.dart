import 'package:calmreader_mobile/screens/welcome_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  testWidgets('welcome screen shows key navigation options', (tester) async {
    await tester.pumpWidget(
      MaterialApp(home: WelcomeScreen()),
    );

    expect(find.text('CalmReader Mobile'), findsOneWidget);
    expect(find.text('Library'), findsOneWidget);
    expect(find.text('Studio'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);
  });
}
