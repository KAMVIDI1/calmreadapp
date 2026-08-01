# Maintenance

Upgrade procedure

1. Backup: tag the repo and export the keystore and `key.properties` securely.
2. Upgrade Flutter: test upgrades in a feature branch: `flutter upgrade` then run `flutter pub get` and `flutter build apk`.
3. Upgrade Gradle/AGP/Kotlin: do one at a time in small increments, run full CI.

Rollback

- Revert commits or checkout the previous tag. Re-deploy the previous artifact if needed.

Backup strategy

- Keep keystores and CI secrets in a cloud-based secret manager (GitHub Secrets, GCP Secret Manager).
