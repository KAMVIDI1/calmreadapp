# Build & Signing

Single source of truth for producing a **valid, installable** release APK for the
mobile app and a production bundle for the web app. Follow these steps to replicate
a working build from a clean checkout.

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Mobile: Android release signing](#mobile-android-release-signing)
3. [Mobile: build the APK](#mobile-build-the-apk)
4. [Mobile: verify the APK](#mobile-verify-the-apk)
5. [Mobile: CI/release notes](#mobile-ci-release-notes)
6. [Web: build the bundle](#web-build-the-bundle)
7. [Web: run](#web-run)

---

## Prerequisites

Mobile (see also `docs/SETUP.md`):

- Flutter 3.44.8 (stable) / Dart 3.12.2
- OpenJDK 17 (`JAVA_HOME` must point at JDK 17, **not** JDK 21/25)
- Android SDK: `platforms;android-36`, `build-tools;35.0.0`
- Gradle wrapper 8.11.1 (project pinned), AGP 8.9.1, Kotlin 1.9.24

Web:

- Node.js 24.x + npm 11.x (the web app is a separate Vite + React + Express project
  at the repository root `calmreadapp/`, independent of the Flutter app).

---

## Mobile: Android release signing

An unsigned release APK is rejected by Android as **"App appears to be invalid"**
(apksigner reports `DOES NOT VERIFY / Missing META-INF/MANIFEST.MF`). The release
build must be signed with a real keystore.

### 1. Generate a release keystore (do this once)

```bash
keytool -genkeypair -v \
  -storetype JKS \
  -keystore calmreadapp/calmreader_mobile/android/app/calmreader-release-key.jks \
  -alias calmreader \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass <STORE_PASSWORD> \
  -keypass <KEY_PASSWORD> \
  -dname "CN=CalmReader Mobile, OU=Development, O=CalmReader, L=NA, ST=NA, C=US"
```

> Use **distinct** store/key passwords. On JDK 21+ the default keystore type is
> PKCS12, which silently ignores `-keypass`; `-storetype JKS` keeps both passwords.
> Never commit the keystore (see `.gitignore`).

### 2. Configure `android/key.properties`

`key.properties` lives at `calmreadapp/calmreader_mobile/android/key.properties`
and is the single source of truth consumed by the Gradle build:

```properties
storeFile=app/calmreader-release-key.jks     # resolved relative to the android/ root
storePassword=<STORE_PASSWORD>
keyAlias=calmreader
keyPassword=<KEY_PASSWORD>
```

`storeFile` is resolved from the Gradle `rootProject` (which is `android/`), so
the value is `app/calmreader-release-key.jks` — **not** `android/app/...` (that
double-prefix bug caused the keystore to never be found).

### 3. Signing config in `android/app/build.gradle`

The release signing block reads `key.properties` and only enables the
`release` signing config when the keystore file physically exists:

```groovy
def keyPropertiesFile = rootProject.file('key.properties')
if (keyPropertiesFile.exists()) {
    def properties = new Properties()
    keyPropertiesFile.withReader('UTF-8') { reader -> properties.load(reader) }
    def keyFile = rootProject.file(properties['storeFile'] as String)   // android/app/...
    if (keyFile?.exists() == true) {
        signingConfigs {
            release {
                storeFile keyFile
                storePassword properties['storePassword']
                keyAlias properties['keyAlias']
                keyPassword properties['keyPassword']
            }
        }
    }
}
```

When the keystore is absent (e.g. a fresh CI checkout), no `release` signing
config is created and Flutter falls back to the default debug signing so the build
still succeeds.

---

## Mobile: build the APK

```bash
cd calmreadapp/calmreader_mobile
flutter clean        # only when switching toolchains; optional
flutter pub get
flutter build apk --release
```

Output: `build/app/outputs/flutter-apk/app-release.apk` (~52 MB).

For repeatable CI builds (avoids dependency-validation warnings on newer
Flutter/Gradle versions, the same as `.github/workflows/flutter-ci.yml`):

```bash
flutter build apk --release --android-skip-build-dependency-validation
```

---

## Mobile: verify the APK

A signed release APK must pass both checks:

```bash
BUILD_TOOLS=$ANDROID_SDK_ROOT/build-tools/35.0.0   # or 34.0.0
APK=build/app/outputs/flutter-apk/app-release.apk

$BUILD_TOOLS/zipalign -c -v 4 "$APK"               # -> "Verification successful"
$BUILD_TOOLS/apksigner verify -v "$APK"            # -> "Verifies" + "v2 scheme: true"
```

Confirm it is signed with the **release** key (not the debug key):

```bash
# APK signer cert SHA-256
$BUILD_TOOLS/apksigner verify --print-certs "$APK" | grep "SHA-256"

# Keystore cert SHA-256 (must match)
keytool -list -v -keystore android/app/calmreader-release-key.jks \
  -alias calmreader -storepass <STORE_PASSWORD> | grep SHA-256
```

The DNs must also differ from the debug key (`CN=Android Debug, O=Android`); the
release key uses `CN=CalmReader Mobile, O=CalmReader`.

---

## Mobile: compatibility & install notes

- The release APK is a **universal** APK: native libraries for `arm64-v8a`,
  `armeabi-v7a`, and `x86_64` are all included, so it installs on physical phones
  and emulators regardless of architecture.
- Signing uses **v2 (APK Signature Scheme v2)**, which is verified by every
  Android 7.0+ device (minSdk 24) — so the APK installs on all supported devices.
  (v1/JAR signing is not required for minSdk 24+.)
- If install fails with *App not installed* / `INSTALL_FAILED_UPDATE_INCOMPATIBLE`
  **even though `apksigner verify` reports "Verifies"**, the device already holds
  a copy of the app signed with a **different** key (e.g. a previous `flutter run`
  debug build). Resolve it by **uninstalling the existing app first**, then
  installing the release APK.
- For friction-free testing without uninstalling, use the universal **debug** APK
  (`build-artifacts/app-debug.apk`): it is signed with the standard Flutter debug
  keystore and matches every `flutter run` install. Debug builds are not accepted
  by Google Play.

## Mobile: debug build for testing

A release-signed APK is only accepted by a device that does not already hold a
different signature for the same package. If installing on a device that
previously ran a **debug** build (`flutter run`) fails with *App not installed* /
signature mismatch, build and install a **debug** APK instead — the standard
Flutter debug keystore matches every `flutter run` install, so it always installs
cleanly:

```bash
flutter build apk --debug --target-platform android-arm64
# -> build/app/outputs/flutter-apk/app-debug.apk  (debug-keystore signed)
```

Verify it the same way:

```bash
$BUILD_TOOLS/apksigner verify -v build/app/outputs/flutter-apk/app-debug.apk
$BUILD_TOOLS/zipalign -c -v 4 build/app/outputs/flutter-apk/app-debug.apk
```

Debug builds are fine for functionality testing but are **not** optimized and are
not accepted by Google Play. For a Play-ready / production artifact, use the
signed release APK and (if needed) uninstall the existing app first.

## Mobile: CI/release notes

- The release keystore and `key.properties` are **never** committed (`.gitignore`
  excludes `*.jks` and `android/key.properties`).
- In CI, inject signing credentials from GitHub secrets by writing `key.properties`
  from the workflow (or pass `-PstorePassword=...` / `-PkeyPassword=...` and have
  the build read Gradle project properties), then run the build steps above.
- Release artifacts are published as `build/app/outputs/flutter-apk/app-release.apk`
  (APK) or `app-release.aab` (appbundle). Pre-built deliverable APKs are also
  dropped in `calmreadapp/build-artifacts/` for convenience (git-ignored).
- See `docs/TROUBLESHOOTING.md` ("App appears to be invalid") for the unsigned-APK
  diagnosis.

---

## Web: build the bundle

The web app lives at the repository root (`calmreadapp/`), separate from the
Flutter mobile app.

```bash
cd calmreadapp
npm ci          # or: npm install
npm run build   # -> vite build && esbuild server.ts -> dist/
```

`npm run build` runs:

```
vite build
esbuild server.ts --bundle --platform=node --format=cjs \
  --packages=external --sourcemap --outfile=dist/server.cjs
```

Outputs (in `dist/`):

- `index.html` — SSR/server-rendered shell
- `assets/index-<hash>.js`, `assets/index-<hash>.css` — client bundle
- `server.cjs` + `server.cjs.map` — bundled Express server entry

### Known warning (benign)

esbuild warns: `"import.meta" is not available with the "cjs" output format and
will be empty`. The server uses `import.meta.url` to compute `__filename`. In a
CJS bundle this resolves to an empty string, which is harmless because the
Express server entry is only consumed via `node dist/server.cjs`. The build still
exits `0`.

---

## Web: run

```bash
# Development (live reload via Vite + tsx)
npm run dev      # -> tsx server.ts  (Vite-served client + Express API)

# Production (Node serving the built bundle)
npm start        # -> node dist/server.cjs
```

Required env vars (copy from `.env.example`):

```bash
cp .env.example .env
# edit .env: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_URL,
#            SUPABASE_ANON_KEY, VITE_CALMREADER_URL
```
