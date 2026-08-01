# Database (Supabase)

This project integrates Supabase as the backend for authentication, database, and object storage.

Detected configuration

- Supabase endpoints and keys are referenced from `lib/src/services/supabaseAuth.*` (search in mobile code). If not present, they are injected at runtime via environment variables.

Tables and buckets

- Tables: user profiles, library items, downloads, reading progress (expected)
- Buckets: media (audio/video/epub/pdf) stored in Supabase Storage

Security and RLS

- Use Row Level Security (RLS) policies to ensure users only see their own data.
- Ensure Supabase `anon` key is only used for non-sensitive public operations and service role keys are not embedded in client builds.

SQL structure

If you have direct access to the Supabase SQL, export the schema via the Supabase dashboard or run `pg_dump` on the project database.
