## What does this add or change?

<!-- e.g. "Adds SolidStart template", "Adds Clerk auth option for Next.js/Express" -->

## Checklist

- [ ] Read `CONTRIBUTING.md`
- [ ] Template files added under `templates/<dir>` (or module under `templates/modules/`)
- [ ] Registered in `src/lib/registry.ts` (`FRAMEWORKS` / `DATABASES` / `AUTHS`)
- [ ] `version` set (new template: `1.0.0`; existing template edit: bumped)
- [ ] Added/updated a case in `smoke-test.js`'s `TEST_CASES` and ran `npm run test:smoke`
- [ ] `npm run lint` and `npx tsc --noEmit` pass
- [ ] Added a line under `[Unreleased]` in `CHANGELOG.md`

## Notes for reviewers

<!-- Anything a reviewer can't tell from the diff: why this dir layout, why this db/auth combo, etc. -->
