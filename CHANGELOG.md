# Changelog

All notable changes to SkipInit are documented here.

## [Unreleased]

### Added
- Django, Flask (Python), Express, NestJS, Nuxt.js, Angular, Vue.js, Laravel, Symfony, Spring Boot, .NET Core templates
- MySQL, MS SQL, Redis database options
- NextAuth auth option

---

## [0.2.0] - 2026-07-16

### Added
- Language filter tabs (JS/TS, Python, Go, Rust, PHP, Java, C#)
- Framework search box — searches across all languages when typing
- Framework grid auto-filters by selected language
- Terminal CLI installer: `/api/cli` endpoint returns a shell script
- Copy-to-clipboard terminal command box in UI (auto-updates on selection change)
- Vite + React, Astro, SvelteKit, Remix, Hono, FastAPI, Go (Fiber), Rust (Axum) templates
- Database options: PostgreSQL, SQLite, MongoDB
- Auth options: Lucia, JWT
- Stack Overflow 2025 survey data used to prioritize frameworks

### Changed
- UI redesigned: dark desktop-first two-column layout
- Framework buttons now show SVG logos
- Database/Auth buttons now show icons
- Replaced hardcoded Next.js-only generator with dynamic `FRAMEWORK_TEMPLATES` map
- `route.ts` now resolves framework-specific and general DB/auth modules separately
- `.claude/` added to `.gitignore`
- `eslint.config.mjs` ignores `.claude/` skill files
- `next.config.ts` sets `turbopack.root` to fix workspace lockfile warning on Mac

### Fixed
- Lucia auth template had stray `drizzle-orm` import — removed
- SVG `className` inside `dangerouslySetInnerHTML` strings changed to `class`
- `GenerateRequest` types widened to match new DB/auth options

---

## [0.1.0] - 2026-07-16

### Added
- Initial commit — Next.js app bootstrapped with `create-next-app`
- Basic UI: project name input, framework/database/auth selectors
- `/api/generate` endpoint: Mustache template rendering + ZIP via `archiver`
- `templates/nextjs-base` boilerplate
- `templates/modules/postgres` and `templates/modules/lucia-auth` modules
- `README.md` with project overview
