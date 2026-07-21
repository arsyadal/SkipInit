# Changelog

All notable changes to SkipInit are documented here.

## [Unreleased]

### Added
- Django, Flask (Python), Express, NestJS, Nuxt.js, Angular, Vue.js, Laravel, Symfony, Spring Boot, .NET Core templates
- MySQL, MS SQL, Redis database options
- NextAuth auth option
- `CONTRIBUTING.md` and a PR template documenting how to add a new framework/database/auth option
- Per-framework `version` field in the registry for tracking template content changes
- Better Auth auth option (generic module for all TS backends + a dedicated Next.js App Router handler), requires PostgreSQL, MySQL, or SQLite
- Light/dark theme toggle (`next-themes`), defaults to dark, respects system preference, persists choice
- Optional Docker output (Dockerfile + docker-compose.yml) for one framework per language: Next.js, FastAPI, Go (Fiber), Rust (Axum), Laravel, Spring Boot, .NET Core, Ruby on Rails, Phoenix — toggled via a checkbox that only appears for supported frameworks, or `docker` as a 5th CLI arg
- Turborepo monorepo template (`apps/web` Next.js + `apps/api` Express + shared `packages/ui`/`packages/config`), with PostgreSQL/MySQL/MongoDB/Redis/MS SQL and JWT auth wired into `apps/api`

### Fixed
- Rust (Axum) and Phoenix templates bound their dev server to `127.0.0.1`/`{127,0,0,1}` instead of `0.0.0.0`, making them unreachable from outside their own process (and from Docker containers); now bind all interfaces
- Spring Boot, Rails, and Phoenix hardcoded the database host as `localhost` with no override; now read `DB_HOST`/`${DB_HOST:localhost}` with a `localhost` fallback, matching the pattern already used by the Next.js/FastAPI/Go/Rust templates

### Changed
- `src/lib/registry.ts` is now the single source of truth for frameworks, databases, and auth providers — `route.ts` and `page.tsx` both read from it instead of keeping their own hardcoded copies in sync by hand

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
