# SpecFlow

A guided web app for SAP consultants to draft **Functional Specification Documents (FSD)** from project context, business requirements, user stories, and scope boundaries.

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

Drafts are saved automatically to `localStorage`. Use **Save draft** for an explicit save, **Export** for a Word-compatible `.doc` download, and **Print / PDF** on the generated document.

## Keyboard and navigation

- Use the stepper on the left to jump between completed steps.
- **Continue** advances through steps 1–3; step 3 generates the specification.
- The readiness panel tracks completion before generation.
