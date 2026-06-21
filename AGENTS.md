# AGENTS.md

## Project

SpecFlow — a React 19 + Vite SPA that guides SAP consultants through a 4-step
wizard to draft Functional Specification Documents (FSD).

## Tech stack

- React 19 + React DOM 19
- Vite 6 with @vitejs/plugin-react
- TypeScript (strict mode)
- Vitest + @testing-library/react + jsdom for tests
- ESLint (typescript-eslint, flat config) + Prettier for lint/format

## Commands

| Command                | Purpose                                              |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start Vite dev server                                |
| `npm run build`        | Typecheck (`tsc --noEmit`) then build for production |
| `npm run preview`      | Preview the production build                         |
| `npm run typecheck`    | Run `tsc --noEmit` only                              |
| `npm run lint`         | Run ESLint on the whole project                      |
| `npm run format`       | Format all files with Prettier                       |
| `npm run format:check` | Check formatting without writing                     |
| `npm test`             | Run Vitest once (CI mode)                            |
| `npm run test:watch`   | Run Vitest in watch mode                             |
| `npm run test:ui`      | Run Vitest with browser UI                           |

## Conventions

- **Always run before committing:** `npm run typecheck && npm run lint && npm test && npm run build`
- **File structure:**
  - `src/lib/` — pure logic (defaults, buildSections, exportDoc, storage)
  - `src/components/` — React components
  - `src/types.ts` — shared TypeScript types
  - `src/App.tsx` — root app component
  - `src/main.tsx` — entry point (createRoot only)
  - `src/styles.css` — all styles (single file, grouped sections)
  - `src/test-setup.ts` — Vitest setup (jest-dom matchers)
- **TypeScript:** strict mode, no `any` without justification, use explicit types for props and state.
- **Tests:** co-located as `*.test.ts(x)` next to the module under test.
- **CSS:** use CSS custom properties (vars) defined in `:root` — avoid hardcoded colors.
- **State persistence:** localStorage with a versioned schema (`{ version, data, step, sections }`).
- **Git commits:** one commit per logical phase, conventional message style.

## Architecture notes

- 4-step wizard: Project setup → Requirements → Review scope → Functional spec
- State auto-saves to localStorage (debounced 400ms)
- Export: true `.docx` via the `docx` library; Print/PDF via `window.print()`
- No router — step state managed in React state
