# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

A **skeleton template** for cross-platform desktop apps built with **Tauri v2** (Rust backend) + **React 19** (TypeScript frontend) + **MUI v9** + **Vite 6**. No sidecar process — all backend logic runs in the Rust crate. Use this template when you don't need a separate language runtime.

Sister templates (in adjacent directories) cover the sidecar variants:

- `tauri_desktop_node_sidecar_template` — Tauri + Node.js/Express sidecar
- `tauri_desktop_shell_sidecar_template` — Tauri + shell binary sidecar

## Build commands

```bash
npm install              # JS dependencies
npm run dev              # Vite dev server only (browser mode)
npx tauri dev            # Full desktop app in dev mode
npm run build            # Production frontend build
npx tauri build          # Production desktop build
npm test                 # Vitest (run once)
npm run test:watch       # Vitest watch mode
npm run typecheck        # tsc --noEmit
cd src-tauri && cargo test  # Rust tests
```

## Architecture

Two layers, talking via `invoke()`:

- **`src/` (React + TS)** — UI built with MUI v9. Routes via React Router (`HashRouter` so deep links work under `tauri://`). The `pages/` directory holds route-level components; `components/` holds shared UI. Tauri APIs are mocked in `src/test/setup.ts` so component tests don't need a Tauri runtime.
- **`src-tauri/` (Rust)** — Tauri v2 shell. Commands are declared in `src/lib.rs` with `#[tauri::command]` and registered in `tauri::Builder::default().invoke_handler(...)`. The crate exposes a `lib` (for `cargo test`), `cdylib`, and `staticlib`.

## Versioning

The single source of truth for the app version is **`src-tauri/tauri.conf.json` → `version`**. `build.rs` reads it and exposes `APP_VERSION` as a compile-time env var so Rust can `env!("APP_VERSION")` without depending on `Cargo.toml`'s version. Dev builds append `[DEV]`; CI release builds set `TAURI_RELEASE=true` for a clean version string.

`package.json` and `src-tauri/Cargo.toml` versions are not used by the app — leave them at `0.0.0` / `0.1.0`.

## Conventions

- All Rust structs sent to the frontend use `#[serde(rename_all = "camelCase")]`.
- Tauri commands are `snake_case` in Rust, called with `snake_case` strings from `invoke()`.
- Frontend parameter objects use `camelCase` (Serde converts).
- Always add tests for new code: React components get `*.test.tsx` (Vitest + Testing Library), Rust modules get `#[cfg(test)] mod tests` blocks.

## CI / Release Workflows

- **`build.yml`** — runs on every push/PR to `main`, runs `npm test` and `cargo test` then builds the Tauri bundle on macOS (ARM + Intel), Windows, Linux. Posts a PR comment with artifact download links.
- **`release-official.yml`** — triggered by `v*` tag pushes or manual `workflow_dispatch`. Uses `synle/workflows/actions/release/begin-release` → matrix Tauri build → `end-release` to finalize. Sets `TAURI_RELEASE=true` for clean version strings.
- **`release-beta.yml`** — manual `workflow_dispatch` only. Builds a draft prerelease tagged `release-beta-<date>-<sha>`.

Use the `/release-official` and `/release-beta` slash commands to trigger interactively.

## What to update when adapting this template

1. `package.json` → `name`, `description`
2. `src-tauri/Cargo.toml` → `[package].name`, `[lib].name` (and update `src-tauri/src/main.rs` to match)
3. `src-tauri/tauri.conf.json` → `productName`, `identifier`, `windows[].title`, `version`
4. `src-tauri/icons/` → replace with your own (use `npx tauri icon path/to/icon.png`)
5. `.github/workflows/release-*.yml` → `project_name` strings
6. `index.html` `<title>`

## GitHub Raw File URLs

Always use the `?raw=1` blob URL format: `https://github.com/{owner}/{repo}/blob/head/{path}?raw=1`.

Do NOT use `api.github.com/repos/.../contents/` or `raw.githubusercontent.com`.

## Git / PR Merge Policy

- Always use **squash and merge** for PRs.
- **Always rebase before pushing** (`git pull --rebase` before `git push`).
