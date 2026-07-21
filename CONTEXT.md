# SkipInit — Handoff Context

Working session summary for picking up in a different tool/terminal. All work below is **uncommitted** (see `git status`) — nothing has been pushed or committed yet.

## What SkipInit is

Project starter downloader. Pick framework + database + auth (+ optional Docker), get a ready-to-run ZIP. Next.js 16 app. Core files:

- `src/lib/registry.ts` — single source of truth for frameworks/databases/auth providers. Both the API and UI read from this. **Read this file first**, it explains the whole data model.
- `src/app/api/generate/route.ts` — the generator. Resolves `templates/<framework-dir>` + `templates/modules/<db|auth|docker>-<framework>` (or generic `templates/modules/<db|auth>` fallback when `supportsGenericModules: true`), Mustache-renders every file, zips it.
- `src/app/page.tsx` — the picker UI.
- `templates/` — one dir per framework, `.tmpl` suffix stripped on output, Mustache vars rendered regardless of extension.
- `CONTRIBUTING.md` — how to add a new framework/db/auth option. Read this before adding anything.
- `smoke-test.js` (`npm run test:smoke`, needs `npm run dev` running in another terminal) — generates every registered combo and checks the zip isn't empty/missing key files.

## Vision (from user, stated earlier)

Goal: become the platform with the **biggest tech-stack template database in the world** — the catalog size is the moat (saves AI tokens/context vs regenerating boilerplate). Prefer data-driven scale (registry, community contributions) over one-off hardcoded additions.

## What happened this session (in order)

1. **Registry refactor** — `FRAMEWORK_TEMPLATES` (route.ts) and `FRAMEWORKS`/`dbLabels`/`authLabels` (page.tsx) were three separate hardcoded copies of the same data. Merged into `src/lib/registry.ts`. Added `version` field per framework (semver, bump when template files change) and `supportsGenericModules`/`dockerSupported` flags.
2. **CONTRIBUTING.md + PR template** — `.github/PULL_REQUEST_TEMPLATE.md`, documents the registry schema and how to add stacks.
3. **Better Auth** (new auth option, id `betterauth`) — generic module (`templates/modules/betterauth/`) for TS backends + dedicated Next.js handler (`templates/modules/betterauth-nextjs/`, uses `toNextJsHandler`). Requires PostgreSQL/MySQL/SQLite. Wired dependency injection into 11 frameworks' `package.json.tmpl`/`deno.json.tmpl` (all the `supportsGenericModules: true` ones).
4. **Light/dark theme** — `next-themes`, toggle button in header, `@custom-variant dark` in `globals.css` (Tailwind v4 class-strategy dark mode). Defaults dark. `src/components/theme-provider.tsx` wraps the app in `layout.tsx`.
5. **Docker output** — opt-in checkbox (`docker: boolean` in the generate request), only shown for frameworks with `dockerSupported: true` in the registry. Scoped to **one framework per language** (not all 28): Next.js, FastAPI, Go Fiber, Rust Axum, Laravel, Spring Boot, .NET Core, Rails, Phoenix. Each has `templates/modules/docker-<id>/{Dockerfile,docker-compose.yml,.dockerignore}.tmpl`.
   - Fixed real bugs found along the way: Rust Axum and Phoenix bound their dev server to `127.0.0.1`/loopback only (unreachable from Docker or anywhere outside their own process) — now `0.0.0.0`. Spring Boot/Rails/Phoenix hardcoded DB host as `localhost` with no override — now read `DB_HOST` env var with `localhost` fallback.
   - Validated all 34 framework×database combos via `docker compose config` (syntax-valid). **Could not boot-test containers for real** — Docker daemon isn't running in this sandbox (`docker` CLI present, daemon down). If you have a working daemon, worth actually running a few (`docker compose up --build`) to confirm they boot, not just parse.
6. **Turborepo monorepo template** (id `turborepo`) — `apps/web` (Next.js) + `apps/api` (Express, same db/auth pattern as standalone Express) + `packages/ui` + `packages/config`. DB support: Postgres/MySQL/MongoDB/Redis/MSSQL via `templates/modules/<db>-turborepo/apps/api/src/lib/db.ts.tmpl`. Auth support: JWT only for now (Lucia/NextAuth/BetterAuth not yet wired for turborepo — silently omitted if selected, doesn't error). This one **was** actually verified live: `npm install` + `npm run dev`, both apps booted, shared `@repo/ui` Button rendered.

All of the above: `tsc --noEmit`, `eslint`, `next build`, and `node smoke-test.js` (31 cases) pass clean as of the last message in this session.

## Known gaps / things flagged but not fixed (pre-existing, found incidentally)

- **Laravel, Rails, Phoenix templates are incomplete skeletons.** They have routes/controllers/config but are missing the framework's actual scaffold (`artisan`, Rails' `config/application.rb` + friends, Phoenix's `endpoint.ex`/`application.ex`). Their README's documented run commands — and now their Dockerfiles — would fail at that step because the base template can't actually boot. This predates this session; wasn't in scope to fix (would mean writing full Laravel/Rails/Phoenix skeletons, a much bigger job). Worth a dedicated pass.
- Turborepo + Lucia/NextAuth/BetterAuth: selecting these currently produces no auth files for the `turborepo` framework (no crash, just silently omitted) since only a JWT module was wired for it. Follow the pattern in `templates/modules/jwt-turborepo/` to extend.

## Still open (user asked to continue, this is next)

**Release process** — CHANGELOG has been accumulating under `## [Unreleased]` all session (never cut a version). Task: decide a version bump (this session added: Better Auth, theme toggle, Docker output for 9 frameworks, Turborepo template, registry refactor — that's arguably a minor/feature release, e.g. `0.3.0`), move the Unreleased content under a dated version heading, add README badges (build status, license, etc — check if CI even exists first, currently there's no `.github/workflows/`, only the PR template was added).

## How to verify changes

```bash
npx tsc --noEmit
npx eslint .
npm run build
# in one terminal:
npm run dev
# in another:
node smoke-test.js
```

For Docker-specific changes, `docker compose -f <generated>/docker-compose.yml config -q` validates syntax without needing a running daemon.
