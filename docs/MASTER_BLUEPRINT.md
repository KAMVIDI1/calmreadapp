# Master Blueprint

Single source of truth for building, maintaining, debugging, and releasing
**CalmReader** (the `calmreadapp` repository). The repo contains **two** apps that
share branding but not tooling:

| App | Location | Stack |
|-----|----------|-------|
| Mobile | `calmreadapp/calmreader_mobile/` | Flutter 3.44.8 / Dart 3.12.2, Android (APK) |
| Web | `calmreadapp/` (root) | Vite 6 + React 19 + Express 4, Node 24 (SSR bundle) |

## Build toolchain (mobile)

- Flutter 3.44.8 (stable) / Dart 3.12.2 (bundled)
- OpenJDK **17** (`JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64`) — JDK 21/25
  breaks AGP 8.9.1/Kotlin 1.9.24.
- Gradle wrapper **8.11.1** (`android/gradle/wrapper/gradle-wrapper.properties`)
- Android Gradle Plugin **8.9.1**, Kotlin **1.9.24** (in `android/settings.gradle`)
- Android SDK: `platforms;android-36` (compileSdk 36), `build-tools;35.0.0`
- Android params: `compileSdk 36`, `targetSdk 34`, `minSdk 24`

## Build toolchain (web)

- Node.js 24.x, npm 11.x
- Vite 6 (client), esbuild 0.25 (server bundle), TypeScript 5.8, React 19

## Outputs

- Mobile APK: `calmreadapp/calmreader_mobile/build/app/outputs/flutter-apk/app-release.apk`
- Mobile AAB: `calmreadapp/calmreader_mobile/build/app/outputs/bundle/release/app-release.aab`
- Web: `calmreadapp/dist/` (`index.html`, `assets/`, `server.cjs`)
- Pre-built APK drop: `calmreadapp/build-artifacts/app-release.apk` (git-ignored convenience copy)

## Signing (release)

A release APK is **unsigned by default** and is rejected as "App appears to be
invalid". The release key must be configured:

1. `keytool -genkeypair` → `android/app/calmreader-release-key.jks` (alias
   `calmreader`, JKS, distinct store/key passwords).
2. `android/key.properties` provides `storeFile`, `storePassword`, `keyAlias`,
   `keyPassword`.
3. `android/app/build.gradle` reads `key.properties`, resolves the keystore
   relative to `rootProject` (`android/`), and applies `signingConfigs.release`
   to the `release` build type. When the keystore is absent it falls back to
   the default debug signing.
4. **Never commit** the `.jks` or `key.properties` (`.gitignore`).

Full step-by-step: see `docs/BUILD.md`. Verification recipe:
`zipalign -c -v 4` + `apksigner verify -v` (expect "Verifies" and
"v2 scheme: true") + compare signer SHA-256 against the keystore.

## Where to start

1. Follow `docs/SETUP.md` to install the toolchain (mobile + web).
2. Mobile: `cd calmreadapp/calmreader_mobile && flutter pub get && flutter build apk --release --android-skip-build-dependency-validation`.
3. Web: `cd calmreadapp && npm ci && npm run build`.
4. Verify artifacts per `docs/BUILD.md`.
5. Address errors following `docs/TROUBLESHOOTING.md`.

## Components

### Mobile — Flutter (`calmreader_mobile/lib/`)

- `main.dart` — app entry point.
- `components/bottom_nav.dart`, `components/continue_reading.dart` — shared
  navigation UI and the "continue reading" tile.
- `screens/` — one file per screen:
  `welcome_screen`, `home_screen`, `library_screen`, `reader_screen`,
  `audiobook_screen`, `video_screen`, `marketplace_screen`, `studio_screen`,
  `settings_screen`, `profile_screen`.
- `services/marketplace_service.dart` — marketplace data/service layer.

### Web — React (`src/`)

- `App.tsx` / `main.tsx` / `index.css` — React root and styles.
- `context/` — `AppContext.tsx` (global state), `AuthContext.tsx` (Supabase auth).
- `pages/StudioScreen.tsx` — top-level studio route.
- `components/` — UI by area:
  - `Header.tsx`, `Navigation.tsx`, `SplashScreen.tsx`, `OnboardingModal.tsx`,
    `WelcomeLandingPage.tsx`, `MarketplaceModal.tsx`, `MiniPlayer.tsx`.
  - `auth/AuthModal.tsx`.
  - `downloads/DownloadManagerScreen.tsx`.
  - `health/LibraryHealthScreen.tsx`.
  - `home/ContinueReadingCard.tsx`, `home/StorageSummaryCard.tsx`.
  - `library/` — `LibraryScreen`, `LibraryGrid`, `LibraryList`, `ItemDetailModal`.
  - `players/AudiobookPlayer.tsx`, `players/VideoPlayer.tsx`.
  - `profile/ProfileScreen.tsx`.
  - `reader/ArticleReader.tsx`, `reader/EpubPdfReader.tsx`.
  - `settings/SettingsScreen.tsx`, `settings/DeveloperDiagnosticsScreen.tsx`.
  - `storage/StorageManagerScreen.tsx`.
  - `studio/StudioScreen.tsx`.
- `services/` — `dictionaryService.ts`, `healthDiagnostics.ts`,
  `storageService.ts`, `supabaseAuth.ts`.
- `data/mockLibrary.ts` — mocked library data.
- `types/library.ts` — shared types.

## CI

`.github/workflows/flutter-ci.yml` runs on `main`/`PR`: JDK 17 → Flutter 3.44.8
→ `flutter pub get` → `flutter analyze` → `flutter test` →
`flutter build apk --release --android-skip-build-dependency-validation` → upload
`app-release.apk`. Release signing credentials are injected from CI secrets
(never from VCS).

## Maintenance and upgrades

- Pin and test upgrades in branches; run CI; keep a rollback strategy.
- Pin tool versions in `docs/SETUP.md` and `docs/DEPENDENCIES.md`.
- Clean regenerable caches (`~/.gradle/caches`, `build/`, `dist/`,
  `~/.pub-cache`, `npm cache`) to reclaim disk.
