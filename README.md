# Tauri Desktop Raw Template

Skeleton template for a cross-platform desktop app using **Tauri v2** (Rust shell) + **React 19** (TypeScript) + **MUI v9** + **Vite 6** + **Vitest 4**, with no sidecar process. Use this when the Rust backend is enough.

Two starter pages — **Home** and **Settings** — wired up via React Router (HashRouter), a sample `invoke` call, and CI/release workflows pre-wired.

## Requirements

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 20+ | Use `fnm` / `nvm` to pin |
| npm | 10+ | Ships with Node |
| Rust | stable | `rustup default stable` |
| Tauri prereqs | — | See [tauri.app prerequisites](https://tauri.app/start/prerequisites/) |

Platform-specific extras:

- **macOS**: Xcode Command Line Tools (`xcode-select --install`)
- **Windows**: Microsoft C++ Build Tools, WebView2 (preinstalled on Win11)
- **Linux**: `libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf libxdo-dev libssl-dev`

## Getting started

```bash
git clone <this-repo>
cd tauri_desktop_raw_template
npm install            # install JS dependencies
npx tauri dev          # run the desktop app in dev mode (Rust + Vite together)
```

Useful scripts:

```bash
npm run dev            # Vite dev server only (browser mode at http://localhost:1420)
npm run build          # Production frontend build (tsc + vite)
npm test               # Run Vitest tests once
npm run test:watch     # Vitest in watch mode
npm run typecheck      # tsc --noEmit
npm run tauri:build    # Production desktop build (.dmg/.exe/.deb/.AppImage)
cd src-tauri && cargo test  # Run Rust tests
```

## Project layout

```
.
├── src/                    # React frontend
│   ├── components/         # Shared UI (NavBar)
│   ├── pages/              # Route-level components (HomePage, SettingsPage)
│   ├── test/               # Vitest setup (mocks Tauri APIs)
│   ├── App.tsx             # Routes
│   └── main.tsx            # Entry, ThemeProvider + HashRouter
├── src-tauri/              # Rust shell
│   ├── src/lib.rs          # Tauri commands (`get_app_version`, `greet`)
│   ├── build.rs            # Exposes APP_VERSION at compile time
│   ├── tauri.conf.json     # Single source of truth for version + window config
│   └── capabilities/       # Tauri permissions
├── vite.config.ts          # Vite + Vitest config
└── .github/workflows/      # CI: build, release-official (tag-triggered), release-beta (manual)
```

## Versioning & release

The version lives in **`src-tauri/tauri.conf.json` → `version`**. `build.rs` exposes it as `APP_VERSION` so Rust code can `env!("APP_VERSION")`. In dev builds, `[DEV]` is appended; CI release builds set `TAURI_RELEASE=true` to show the clean version.

- **Build CI** (`.github/workflows/build.yml`) — runs on every push/PR to `main`, tests + builds on macOS (ARM + Intel), Windows, Linux. PRs get a comment with download links.
- **Official release** (`.github/workflows/release-official.yml`) — triggered by pushing a `v*` tag, or manually via `workflow_dispatch`. Uses `synle/workflows/actions/release/{begin,end}-release` for the unified release flow.
- **Beta release** (`.github/workflows/release-beta.yml`) — manual `workflow_dispatch` only, takes an optional commit SHA.

## What to change after cloning

1. Rename the package in `package.json` (`name`, `description`).
2. Rename the Rust crate in `src-tauri/Cargo.toml` (`name`, `[lib].name`) and update the `app_lib::run()` call in `src-tauri/src/main.rs` to match.
3. Update `src-tauri/tauri.conf.json` (`productName`, `identifier`, `windows[].title`).
4. Replace icons in `src-tauri/icons/` (use `npx tauri icon path/to/icon.png`).
5. Update `.github/workflows/release-*.yml` `project_name` strings.

## License

MIT — see `LICENSE` if you add one.
