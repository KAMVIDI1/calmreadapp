# Dependencies

This file lists the project's important dependencies and their role.

Flutter / Dart dependencies (high-level)

- Flutter SDK (3.44.8) — runtime and framework
- Pub dependencies: declared in `calmreadapp/calmreader_mobile/pubspec.yaml` — run `flutter pub deps` to get a full list.

Android / Gradle dependencies

- Kotlin `org.jetbrains.kotlin.android` 1.9.24 — language support for Android modules
- Android Gradle Plugin 8.6.0 — Android build tooling

Why they exist / alternatives

- Kotlin: required by AGP when modules include Kotlin sources. Removing it would break Kotlin-based build scripts.
- AGP: required to compile and package Android app. Alternative is to migrate to newer AGP versions when supported by Flutter.

To list actual Dart package versions:

```bash
cd calmreadapp/calmreader_mobile
flutter pub deps --style=compact
```
