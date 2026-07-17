# Tech Stack List — Stack Overflow Developer Survey 2025

Source: https://survey.stackoverflow.co/2025/technology (Web frameworks and technologies, "Have Used", all respondents)

## Web Frameworks & Technologies (ranked)

| # | Framework | Usage | SkipInit Template | Status |
|---|-----------|-------|-------------------|--------|
| 1 | Node.js | 48.7% | (runtime — covered via Express/Hono/NestJS/dll) | ✅ |
| 2 | React | 44.7% | `vite-react` | ✅ |
| 3 | jQuery | 23.4% | — (library legacy, bukan starter) | ➖ skip |
| 4 | Next.js | 20.8% | `nextjs-base` | ✅ |
| 5 | Express | 19.9% | `express` | ✅ |
| 6 | ASP.NET Core | 19.7% | `dotnet` | ✅ |
| 7 | Angular | 18.2% | `angular` | ✅ |
| 8 | Vue.js | 17.6% | `vue` | ✅ |
| 9 | FastAPI | 14.8% | `fastapi` | ✅ |
| 10 | Spring Boot | 14.7% | `springboot` | ✅ |
| 11 | Flask | 14.4% | `flask` | ✅ |
| 12 | ASP.NET (legacy) | 14.2% | — (legacy, superseded oleh ASP.NET Core) | ➖ skip |
| 13 | WordPress | 13.6% | — (CMS, di luar scope starter) | ➖ skip |
| 14 | Django | 12.6% | `django` | ✅ |
| 15 | Laravel | 8.9% | `laravel` | ✅ |
| 16 | AngularJS | 7.2% | — (deprecated 2022) | ➖ skip |
| 17 | Svelte | 7.2% | `sveltekit` | ✅ |
| 18 | Blazor | 7.0% | `blazor` | ✅ |
| 19 | NestJS | 6.7% | `nestjs` | ✅ |
| 20 | Ruby on Rails | 5.9% | `rails` | ✅ |
| 21 | Astro | 4.5% | `astro` | ✅ |
| 22 | Deno | 4.0% | `deno` | ✅ |
| 23 | Symfony | 4.0% | `symfony` | ✅ |
| 24 | Nuxt.js | 4.0% | `nuxt` | ✅ |
| 25 | Fastify | 2.9% | `fastify` | ✅ |
| 26 | Axum | 2.8% | `rust-axum` | ✅ |
| 27 | Phoenix | 2.4% | `phoenix` | ✅ |
| 28 | Drupal | 2.2% | — (CMS, di luar scope) | ➖ skip |
| — | htmx | <2% | `htmx` | ✅ |
| — | SolidJS | <2% | `solid` | ✅ |
| — | Flutter | <2% | — (mobile, di luar scope web) | ➖ skip |
| — | Quarkus | <2% | `quarkus` | ✅ |
| — | Hugo | <2% | — (SSG statis, di luar scope) | ➖ skip |

## Templates SkipInit di luar daftar survey

- `hono` — Hono (edge-first, populer tapi belum masuk survey)
- `remix` — Remix (merged ke React Router v7)
- `go-fiber` — Go Fiber (survey tidak list Go web framework spesifik)

## Ringkasan Coverage

- **25 / 28** entri survey tercakup template (semua kecuali skip disengaja).
- Skip disengaja (7): jQuery, ASP.NET legacy, AngularJS, WordPress, Drupal, Flutter, Hugo — legacy / CMS / mobile / SSG, bukan target starter.
- **Gap kandidat**: tidak ada — semua entri non-skip tercakup.

## Languages (top, konteks)

JavaScript 66% · HTML/CSS 61.9% · SQL 58.6% · Python 57.9% · Bash/Shell 48.7%

## Databases (opsi SkipInit)

PostgreSQL, MySQL, SQLite, MongoDB, Redis, MS SQL — semua masuk top database survey (PostgreSQL paling desired + admired sejak 2023, Redis +8% growth).
