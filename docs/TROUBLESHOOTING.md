# Troubleshooting

This file records known issues, error messages, root causes, and fixes encountered during diagnosis.

1) Gradle wrapper download 404
- Symptom: `java.io.FileNotFoundException` when wrapper tries to download gradle-8.9.1-all.zip
- Cause: The wrapper distribution URL was not reachable or the distribution moved
- Fix: Restore a working distribution URL in `android/gradle/wrapper/gradle-wrapper.properties` (we used 8.10.1). Alternatively, pre-install Gradle or allow network access to services.gradle.org.

2) Gradle daemon disappears during packaging
- Symptom: Gradle daemon exits during build
- Cause: JVM options, memory or incompatible Gradle/AGP/Kotlin combinations
- Fix: Run with `--no-daemon` and ensure `JAVA_HOME` points to JDK 17. Use Gradle wrapper 8.10.1 with Kotlin 1.9.24 and AGP 8.6.0.

3) Missing resources / styles aapt2 failures
- Symptom: Resource compilation errors referencing styles or themes
- Cause: Theme parent incompatible with compileSdk
- Fix: Update `res/values/styles.xml` to use an appropriate parent (e.g., `Theme.MaterialComponents.DayNight.DarkActionBar`) compatible with SDK 34.

4) Release builds signed with debug keystore
- Symptom: Play Store rejects app or security risk
- Fix: Configure a release keystore and update `android/app/build.gradle` to use it. Use CI secrets to provide signing credentials.

5) "App appears to be invalid" / `apksigner verify` -> `DOES NOT VERIFY: Missing META-INF/MANIFEST.MF`
- Symptom: A release `app-release.apk` builds but is rejected on install as "App appears to be invalid"; `apksigner verify -v` reports `DOES NOT VERIFY` and `Missing META-INF/MANIFEST.MF`, with no v1/v2/v3 signer.
- Root cause: The release build was never signed. In this project it happened because `android/key.properties` held placeholder passwords and the release keystore did not exist, so `android/app/build.gradle` skipped defining `signingConfigs.release` and produced an unsigned APK. A secondary bug was a path typo `rootProject.file('android/app/...')` that resolves to `android/android/app/...` (double `android/`), so even a present keystore was never found.
- Fix:
  1. Generate a release keystore: `keytool -genkeypair -storetype JKS -keystore android/app/calmreader-release-key.jks -alias calmreader -keyalg RSA -keysize 2048 -validity 10000 -storepass <STORE> -keypass <KEY> -dname "..."`.
  2. Set real values in `android/key.properties` with `storeFile=app/calmreader-release-key.jks` (resolved relative to the `android/` root).
  3. Ensure `android/app/build.gradle` resolves the keystore via `rootProject.file(properties['storeFile'])` (single `app/` prefix) and applies `signingConfigs.release` to the `release` build type.
  4. Rebuild: `flutter build apk --release`.
  5. Verify: `zipalign -c -v 4 <apk>` and `apksigner verify -v <apk>` (expect "Verifies" + "v2 scheme: true"), and confirm the signer SHA-256 matches the keystore.
- See `docs/BUILD.md` for the full replication recipe.

6) "App not installed" / signature mismatch on a device that previously ran the app
- Symptom: a valid, signed APK (apksigner reports "Verifies") still fails to install
  with "App not installed" or `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.
- Root cause: a different signature is already installed for the same package
  (e.g. a previous debug build signed with the Flutter debug keystore vs. a new
  release build signed with a release keystore).
- Fix: uninstall the existing app on the device, then install. For frictionless
  testing, build a debug APK (`flutter build apk --debug`) — it uses the standard
  debug keystore and installs over any `flutter run` build. For Play Store /
  production distribution, keep the signed release APK.

Recovery procedures

- If the build cache is corrupted, delete `~/.gradle/caches` and `build/` then rebuild.

Preventive measures

- Pin compatible tool versions in Gradle and in CI
- Store signing material in secure vaults and never commit keys to VCS
