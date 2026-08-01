# Master Blueprint

This document is the single-source-of-truth for building, maintaining, debugging, and releasing CalmRead mobile.

Key points

- Build toolchain: Flutter 3.44.8, Dart 3.12.2, JDK 17, Gradle 8.10.1, Kotlin 1.9.24, AGP 8.6.0
- Android parameters: compileSdk=34, targetSdk=34, minSdk=24
- Outputs: APK in `build/app/outputs/apk/release/app-release.apk`, AAB in `build/app/outputs/bundle/release/app-release.aab`
- Signing: configure `android/key.properties` and `android/app/build.gradle` for release signing

Where to start

1. Follow `docs/SETUP.md` to install toolchain.
2. Run `flutter pub get` then `flutter build appbundle --release` as a smoke test.
3. Address errors following `docs/TROUBLESHOOTING.md`.

Maintenance and upgrades

- Pin and test upgrades in branches; run CI; keep a rollback strategy.
