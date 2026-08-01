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

Recovery procedures

- If the build cache is corrupted, delete `~/.gradle/caches` and `build/` then rebuild.

Preventive measures

- Pin compatible tool versions in Gradle and in CI
- Store signing material in secure vaults and never commit keys to VCS
