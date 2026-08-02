# Project Structure

This document explains each top-level folder and important files.

- `calmreader_mobile/` — Flutter mobile app
  - `android/` — Android native project and build config
    - `app/build.gradle` — Android app build file (signing, compile/target SDKs)
    - `gradle/wrapper/gradle-wrapper.properties` — Gradle wrapper version
  - `pubspec.yaml` — Flutter/Dart dependencies and assets
  - `lib/` — Flutter Dart source files (app implementation)
  - `build/` — generated build artifacts
- `src/` — (web/desktop) TypeScript React app source (separate web app)
  - `App.tsx` — React app root
  - `components/` — React components used by web app

Important files

- `calmreadapp/calmreader_mobile/android/app/build.gradle` — controls Android packaging; conditionally defines `signingConfigs.release` from `android/key.properties` only when the release keystore file is present, and applies it to the `release` build type. When the keystore is absent it falls back to the default (debug) signing so CI builds still succeed.
- `calmreadapp/calmreader_mobile/android/settings.gradle` — plugin versions (AGP, Kotlin)
- `calmreadapp/calmreader_mobile/android/gradle/wrapper/gradle-wrapper.properties` — Gradle distribution URL
