# Agents & Commit Conventions

This document defines the commit conventions and agent guidelines for this repository.

## Conventional Commits (with Emoji)

- Format: `type(scope): <emoji> message`
- The emoji is placed between the scope and the message.
- Keep messages concise and imperative.
- Common types:
  - `feat`: new feature
  - `fix`: bug fix
  - `docs`: documentation
  - `refactor`: code refactoring without behavioral change
  - `perf`: performance improvement
  - `test`: tests
  - `ci`: continuous integration
  - `build`: build system or dependencies
  - `chore`: misc tasks with no functional impact
  - `revert`: revert a previous commit

Examples:

- `feat(gnome-shell): ✨ support GNOME Shell 50`
- `fix(browser-detect): 🐛 handle flatpak path edge-case`
- `docs(agents): 🧾 add agents guidelines`
- `refactor(menu): ♻️ split helpers per responsibility`

Recommended scopes (indicative): `gnome-shell`, `metadata`, `extension`, `helper`, `menu`, `constants`, `build`, `ci`, `docs`, `tests`.

## Git Absorb (Clean History)

Using **git absorb** is allowed (and encouraged) to keep a clean history by converting changes into fixup commits that are automatically squashed during rebase.

Suggested flow:

```bash
# Stage local changes
git add -A
# Create fixup commits for the relevant parents
git absorb
# Autosquash fixups onto the desired base
git rebase -i --autosquash origin/main
# Verify, then push
git log --graph --oneline --decorate --all
git push
```

> Note: Install the tool if needed (https://github.com/tummychow/git-absorb). In some environments, it may be preinstalled.

## Codebase Overview

- Entry point: `src/extension.ts` implements the GNOME Shell indicator (`FirefoxProfilesExtension`) and registers `FirefoxProfilesIndicator`.
- Helpers: `src/helper/digging.helper.ts` finds profiles from config files, `src/helper/menu.helper.ts` builds the indicator menu, `src/helper/runner.helper.ts` launches browsers with selected profiles.
- Constants: `src/constants/config-paths.constant.ts` defines supported browsers and their config locations/commands.
- Config: `metadata.json` lists supported `shell-version`s. `vite.config.ts` builds `dist/extension.js` and adds a banner including versions. `tsconfig.json` uses `strict` TypeScript, target `ES2022`.
- Tooling: `oxlint` for linting, `oxfmt` for formatting, `vitest` for tests, `vite` for build.
- Scripts: see `package.json` (`build`, `dev`, `lint`, `format`, `format:fix`, `test`, `test:watch`, `test:ui`).

## Development Workflow

- Branching: use feature branches; open PRs to `main` with clear scope and conventional commit-style titles.
- Lint/Format: run `pnpm run lint` and `pnpm run format` (or `format:fix`) before committing.
- Tests: run `pnpm test` locally; CI may run quality checks.
  - `test/package-compatibility.test.ts`: verifies that all GNOME Shell versions are properly aliased in `package.json` and configuration is correct.
  - `test/integration.test.ts`: verifies code compiles successfully with all GNOME Shell versions by running TypeScript compiler on each version alias. This ensures typing and build compatibility across all supported versions.
- Build: `pnpm build` produces `dist/extension.js` for packaging.

## GNOME Shell Compatibility Updates

When adding support for a new GNOME Shell major version:

- Update `metadata.json` by adding the new version to `shell-version`.
- Add the corresponding dev alias in `package.json` (e.g., `"@girs/gnome-shell-50": "npm:@girs/gnome-shell@50"`).
- Run `pnpm test` to verify compilation succeeds with all versions (including the new one).
- Verify APIs remain stable across versions and adjust code if needed.
- Test in a nested Wayland session and enable/disable the extension to validate runtime behavior.

## Logging and Errors

- Use GNOME `Main.notify` for user-visible notifications.
- Use `logError` with a clear context tag for unexpected exceptions.

## Packaging

- `Makefile` provides targets: `make`, `make pack`, `make install`, `make clean` to build, package, install locally, and clean artifacts.

---

This document is maintained by project contributors and agents. Keep it concise and actionable.
