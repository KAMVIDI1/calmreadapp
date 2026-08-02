# Setup

This document describes how to install and configure a development machine or Codespace to work on the project.

Prerequisites

- OS: Linux (Ubuntu recommended), macOS or Windows (WSL2)
- Disk: 10+ GB free for SDKs and build caches

Required software

- Git
- Flutter 3.44.8 (stable)
- Dart 3.12.2 (bundled with Flutter)
- OpenJDK 17 (JDK 17 required by AGP 8.9.1; JDK 21/25 is incompatible)
- Android SDK: `platforms;android-36`, `build-tools;35.0.0`, NDK 28.x
- Node.js 24.x + npm 11.x (for the web app)
- Android command-line tools
- Gradle (project uses wrapper)

Install Flutter (example Linux)

```bash
git clone https://github.com/flutter/flutter.git -b stable ~/flutter
export PATH="$PATH:~/flutter/bin:~/flutter/bin/cache/dart-sdk/bin"
flutter doctor
```

Install Java 17 (Ubuntu)

```bash
sudo apt update && sudo apt install -y openjdk-17-jdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

Android SDK (command-line)

1. Download Android command-line tools and unpack to `$ANDROID_SDK_ROOT/cmdline-tools/latest`.
2. Install SDK packages:

```bash
export ANDROID_SDK_ROOT=$HOME/android-sdk
sdkmanager --sdk_root="$ANDROID_SDK_ROOT" "platform-tools" "platforms;android-36" "build-tools;35.0.0" "cmdline-tools;latest" "ndk;28.0.12433569"
```

Codespaces setup

- Ensure `devcontainer.json` installs JDK 17, Android SDK, and Flutter. Expose `ANDROID_SDK_ROOT` and `JAVA_HOME`.

Project clone and initial steps

```bash
git clone <repo> calmreadapp
cd calmreadapp/calmreader_mobile
flutter pub get
```

Running locally

- Launch Android emulator or attach a device
- `flutter run` for debug
- `flutter build apk --release` for release

Running in Codespaces

- Start Codespace and make sure devcontainer installs dependencies
- Open terminal in Codespace and run same `flutter` commands

Release build

- Ensure signing keys are configured (see `docs/BUILD.md`)
- `flutter build appbundle --release`

Web app setup

The web app lives at the repository root (`calmreadapp/`) and is separate from the
Flutter mobile app.

```bash
cd calmreadapp
npm ci                 # or: npm install
cp .env.example .env   # fill in Supabase / CalmReader URLs
npm run dev            # Vite dev server + tsx server (http://localhost:5173)
npm run build          # production bundle -> dist/ (see docs/BUILD.md)
```

Node 24.x is required; the web app does not need the Android/Flutter toolchain.
