# Security

Secrets handling

- Do NOT check API keys, keystores, or passwords into VCS.
- Use `key.properties` for Android signing but keep real passwords in environment variables or CI secrets.

Environment variables and keys

- `SUPABASE_URL` and `SUPABASE_ANON_KEY` should be supplied via environment variables at build/runtime. If server-only secrets are required, never embed them in the client.

Best practices

- Use HTTPS for all network traffic
- Validate and sanitize external content (e.g. EPUB/HTML) before rendering
- Use platform secure storage for tokens (Android Keystore / Keychain)
