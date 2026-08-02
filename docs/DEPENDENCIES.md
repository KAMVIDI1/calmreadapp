# Dependencies

This file lists the project's important dependencies and their role. The repo
contains two independent apps (mobile + web), each with its own dependency set.

## Mobile / Flutter

Toolchain:

- Flutter SDK **3.44.8** (stable) — runtime and framework
- Dart **3.12.2** (bundled with Flutter)
- OpenJDK **17** — required by AGP 8.9.1 / Kotlin 1.9.24 (JDK 21/25 is incompatible)
- Gradle wrapper **8.11.1** (`android/gradle/wrapper/gradle-wrapper.properties`)
- Android Gradle Plugin **8.9.1** (`android/settings.gradle`, `com.android.application`)
- Kotlin **1.9.24** (`org.jetbrains.kotlin.android`)
- Android SDK: `platforms;android-36`, `build-tools;35.0.0`, NDK (any 28.x)

Flutter/Dart packages are declared in `calmreadapp/calmreader_mobile/pubspec.yaml`.
To list actual package versions:

```bash
cd calmreadapp/calmreader_mobile
flutter pub deps --style=compact
```

Current (high-level) pub packages: `google_fonts`, `http`, `url_launcher`,
`connectivity_plus`, `shared_preferences`, `cupertino_icons`.

## Web (Vite + React + Express)

Build/runtime dependencies (declared in `calmreadapp/package.json`):

- **Vite 6** — client dev server and bundler
- **React 19** (`react`, `react-dom`) — UI library
- **@vitejs/plugin-react** — Vite React Fast Refresh / JSX
- **TypeScript ~5.8** — typed superset of JS
- **Express 4** — server-side renderer / API (`server.ts`)
- **esbuild 0.25** — bundles `server.ts` to CJS (`dist/server.cjs`)
- **tsx 4** — runs `server.ts` directly in dev (`npm run dev`)
- **Tailwind CSS 4** (`tailwindcss`, `autoprefixer`, `@tailwindcss/vite`) — styling
- **Supabase** (`@supabase/supabase-js`) — auth + backend
- **GoogleGenAI** (`@google/genai`) — LLM integration
- **UI primitives**: `lucide-react` (icons), `motion` (animations)

Dev dependencies: `@types/node`, `@types/express`, `eslint` (via lints).

## Why they exist / alternatives

- Kotlin: required by AGP when Android modules include Kotlin sources. Removing
  it breaks Kotlin-based build scripts.
- AGP: required to compile and package the Android app. Bump only to versions
  supported by the pinned Flutter release.
- Gradle wrapper: pinned at 8.11.1 for AGP 8.9.1 compatibility; do not rely on a
  system Gradle (use `./gradlew`).
- Vite + esbuild: split client (Vite) from server (esbuild CJS) bundling for a
  server-rendered web app.
