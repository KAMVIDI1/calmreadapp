# Release Process

This document defines the steps taken to prepare and publish a release to Google Play.

Versioning

- Update `pubspec.yaml` version: `version: x.y.z+buildNumber`
- Ensure `android/app/build.gradle` picks up `versionCode`/`versionName` from `local.properties` or `pubspec` via Flutter.

Signing

- Generate or obtain a release keystore and store secure credentials in CI secrets.

Build

- Locally:
  - `flutter build appbundle --release`
  - Output: `build/app/outputs/bundle/release/app-release.aab`

- In CI:
  - Run `flutter pub get`
  - Run `flutter build appbundle --release`
  - Upload artifact to Play Store using a GitHub Action.

Verification & testing

- Verify app on real devices and internal test track.
- Run smoke tests and check Crashlytics or logs.

Checklist before publishing

- Bump version and build number
- Ensure signing is correct and keystore accessible to CI
- Run `flutter analyze` and tests
- Upload AAB to internal test track and validate
