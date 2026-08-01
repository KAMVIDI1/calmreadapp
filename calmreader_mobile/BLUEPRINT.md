# CalmReader Mobile Blueprint

## Replication checklist

1. Install Flutter SDK 3.47+ and ensure it is on PATH.
2. Make sure Java 17 is available; the project is validated with Java 17 for Android builds.
3. From the project root, run:
   - `flutter pub get`
   - `flutter test`
   - `flutter build apk --debug`
4. If Android SDK is not detected, set:
   - `ANDROID_SDK_ROOT=/path/to/sdk`
   - or `sdk.dir=/path/to/sdk` in `android/local.properties`
5. For a repeatable setup, run the bootstrap script:
   - `./scripts/bootstrap.sh`

## Notes

- The app uses Google Fonts and Material 3.
- Gradle is configured with parallel and caching enabled to reduce repeat setup issues.
- The welcome screen uses a timer for its fade-in animation; the timer is canceled on dispose to keep tests stable.
- The Android Gradle wrapper is pinned to 8.14.1 so Flutter 3.47+ can build without the earlier compatibility errors.
