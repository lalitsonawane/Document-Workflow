# SpecFlow

A guided web app for SAP consultants to draft **Functional Specification Documents (FSD)** from project context, business requirements, user stories, and scope boundaries.

## Tech stack

- React 19 + React DOM 19
- Vite 6 with @vitejs/plugin-react
- TypeScript (strict mode)
- Vitest + @testing-library/react + jsdom for tests
- ESLint (typescript-eslint, flat config) + Prettier for lint/format
- `docx` library for real `.docx` export (lazy-loaded)

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

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Workflow

| Step               | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| 1. Project setup   | SAP module, project name, FSD title, author, version           |
| 2. Requirements    | Business requirement and user stories with acceptance criteria |
| 3. Review scope    | In/out of scope, assumptions, dependencies                     |
| 4. Functional spec | Generated, editable FSD with export and print                  |

Drafts are saved automatically to `localStorage` (debounced 400ms, versioned schema). Use **Save draft** for an explicit save, **Export** for a true `.docx` download, and **Print / PDF** on the generated document.

## Features

- **Validation gating**: Continue and Generate buttons are disabled until required fields are filled.
- **Drag-to-reorder**: User stories can be reordered via native HTML5 drag-and-drop.
- **Restore defaults**: Reset user stories to the default SAP AP examples at any time.
- **Mobile readiness**: A compact progress bar replaces the sidebar on smaller screens.
- **ErrorBoundary**: Catches unexpected render errors with a reload prompt.
- **Accessibility**: Stepper uses `aria-current="step"` on the active step.

## Project structure

```
src/
  lib/          # pure logic (defaults, buildSections, exportDoc, docxGenerator, storage, readiness, validation)
  components/   # React components (Icon, Field, Stepper, StoryRow, Setup, Requirements, Review, Spec, Readiness, CompletionPanel, ErrorBoundary)
  types.ts      # shared TypeScript types
  App.tsx       # root app component
  main.tsx      # entry point (createRoot only)
  styles.css    # all styles (single file, grouped sections)
  test-setup.ts # Vitest setup (jest-dom matchers)
```

## Tests

```bash
npm test              # run once
npm run test:watch    # watch mode
```

38 tests across 5 files covering `buildSections`, `storage` (schema + migration), `readiness`, `validation`, and App rendering.

## Keyboard and navigation

- Use the stepper on the left to jump between completed steps.
- **Continue** advances through steps 1–3; step 3 generates the specification.
- The readiness panel tracks completion before generation.
# Document-Workflow
