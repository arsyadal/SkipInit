# Contributing to SkipInit

SkipInit's value is the size and quality of its template catalog. Adding a
new framework, database, or auth option is the highest-leverage contribution
you can make.

## Adding a new framework

1. **Add the template files** under `templates/<your-dir>/`. Mirror the
   structure of an existing template close to yours (e.g. `templates/hono`
   for a JS backend, `templates/flask` for Python). Any file ending in
   `.tmpl` is rendered through [Mustache](https://github.com/janl/mustache.js)
   before being zipped — the `.tmpl` suffix is stripped from the output
   filename. Files without `.tmpl` are copied as-is.

   Mustache view variables available to every template:
   ```
   projectName, projectNameSlug,
   frameworkLabel, databaseLabel,
   hasPostgres, hasSqlite, hasMongodb, hasMysql, hasRedis, hasMssql,
   hasLucia, hasJwt, hasNextauth
   ```

2. **Register it** in `src/lib/registry.ts` — add one entry to the
   `FRAMEWORKS` array:
   ```ts
   {
     id: "yourframework",       // used in API requests and the CLI command
     dir: "your-dir",           // matches templates/<dir>
     label: "Your Framework",   // shown in the UI
     lang: "js",                // groups it under a language tab — see the Language type
     supportsGenericModules: false, // true only if it should fall back to templates/modules/{db,auth}
                                     // (generic Node/TS db+auth snippets) when no
                                     // framework-specific module exists — see step 3
     version: "1.0.0",
     logo: `<svg ...>`,          // 24x24 (or native) viewBox, uses class="..." not className
   }
   ```
   This one array drives both the generator API (`/api/generate`) and the
   picker UI (`page.tsx`) — you do not need to touch either of those files
   for a framework-only addition.

3. **Database/auth support (optional).** If your framework needs
   framework-specific DB or auth boilerplate, add it under
   `templates/modules/<db-or-auth>-<framework-id>/` (e.g.
   `templates/modules/postgres-hono/`). The generator looks there first, and
   only falls back to the generic `templates/modules/<db-or-auth>/` module
   when `supportsGenericModules: true`.

4. **Smoke test.** Add a case to `TEST_CASES` in `smoke-test.js` covering
   your framework with at least one non-`none` database/auth combo where
   applicable, then run:
   ```bash
   npm run dev &        # in one terminal
   npm run test:smoke   # in another
   ```

5. **Changelog.** Add a line under `[Unreleased]` in `CHANGELOG.md`.

## Adding a new database or auth provider

Same idea, smaller scope: add an entry to `DATABASES` or `AUTHS` in
`src/lib/registry.ts` (see `DatabaseDef`/`AuthDef` in that file for the
shape — `AuthDef.requiresDatabase` is how you express a hard dependency,
e.g. Lucia requiring Postgres or SQLite), then add the module directories
under `templates/modules/` for each framework you want to support it on.
A generic (framework-agnostic) module under `templates/modules/<id>/` is
picked up automatically by every framework with `supportsGenericModules: true`.

## Template versioning

Each `FrameworkDef` carries a `version` field (semver). Bump it whenever you
change the files under `templates/<dir>` for an existing framework, and note
the change in `CHANGELOG.md`. New frameworks start at `1.0.0`. This lets
downstream tooling and future template-diffing features know when a
generated project is stale relative to the catalog.

## Code style

- No new abstractions for a single framework — follow the existing
  `.tmpl` + Mustache pattern rather than introducing a new templating
  mechanism.
- Run `npm run lint` before opening a PR.
