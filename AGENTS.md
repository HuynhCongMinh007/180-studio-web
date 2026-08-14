# Agent Instructions — 180 Studio Web

## 1. Purpose and scope

This repository contains the Next.js frontend for the **180 Studio Architecture Portfolio**: public portfolio pages and the protected admin CMS interface. It is a learning project, not a production system.

The authoritative product and frontend specification is [docs/specs/FE_NEXTJS_REBUILD_SPEC.md](docs/specs/FE_NEXTJS_REBUILD_SPEC.md). Do not infer required behavior from an old React implementation or from incomplete context.

The repository is currently initialized but has no application code, package manifest, or build/test tooling. Inspect the repository before referencing source paths or commands that may not exist yet.

## 2. Knowledge sources and ownership

Read sources in this order:

1. `.ai/KNOWLEDGE_INDEX.md` — navigation for the current repository.
2. `.ai/PROJECT_STATUS.md` — current phase, focus, next task, and known debt.
3. The applicable file in `directives/` — durable implementation rules. Until a directive exists, the relevant specification is the rule.
4. `docs/specs/FE_NEXTJS_REBUILD_SPEC.md` — required frontend behavior, routes, UI states, and acceptance criteria.

Use each store for one purpose only:

- `docs/specs/` defines **what** must be built.
- `directives/` defines **how** code and UI must be implemented.
- `.ai/PROJECT_STATUS.md` records **where the repository is now**.
- `.ai/memory/lessons.jsonl` records non-obvious lessons, errors, gotchas, and decisions.

Do not duplicate detailed UI values, API payloads, or project status in this file.

## 3. Session-start and task-routing flow

Before acting on a task:

1. Read `.ai/KNOWLEDGE_INDEX.md` and `.ai/PROJECT_STATUS.md`.
2. Classify the task and read the relevant rule/spec before editing code.
3. Inspect the existing files before assuming a component, route, command, dependency, or test suite exists.

| Task | Read before acting |
|---|---|
| UI, Button, Dialog, Form, responsive layout | `directives/ui-system.md` (when present) + relevant UI section of the FE spec |
| Page, route, component, data fetching | `directives/code-style.md` (when present) + relevant FE spec section |
| Validation or form submission | UI/code directive + FE spec + current API behavior |
| Testing or verification | `directives/testing.md` (when present) + FE Definition of Done |
| API contract ambiguity or required API change | FE spec and the API repository's contract/spec; do not invent an API in this repository |
| Question or review only | Status and only the relevant specification/rule |

For any non-trivial implementation plan, include a **References & Compliance** section naming the directives and specification sections actually read.

## 4. Implementation flow

1. State the understood task, scope, and relevant constraints.
2. For a non-trivial task, make a short plan grounded in the sources read.
3. Implement only the requested scope. Do not add speculative features or silently redesign the API.
4. Keep page composition, UI components, API client logic, validation, and domain types separated as prescribed by the specification.
5. Run the relevant formatter, type-check, lint, and tests when those commands exist; otherwise state what could not yet be verified.
6. Report completed work, verification performed, and remaining limitations truthfully.

## 5. Frontend hard constraints

- Prefer Server Components; use Client Components only for state, events, browser APIs, animation, or other client-only needs.
- Do not store access or refresh tokens in `localStorage` or expose secrets in client code.
- Do not hard-code reusable UI values when the established token or UI component provides them.
- Keep fetching and API-envelope parsing in the API layer rather than scattering it through visual components.
- Every asynchronous screen must deliberately handle loading, success, empty, and error states.
- Preserve accessibility requirements: labels, keyboard interaction, focus management for dialogs/lightboxes, and responsive behavior.
- Do not change an API endpoint, request payload, response shape, cookie behavior, or error contract solely from this repository.

## 6. Cross-repository collaboration

The API repository owns backend implementation and the API contract. If the frontend needs a contract change:

1. Describe the proposed endpoint, payload, response, error case, and frontend reason.
2. Record or link the corresponding API task/issue.
3. Do not implement a speculative client contract as if it already exists.
4. Update frontend integration only after the API contract and implementation are available.

## 7. Definition of done and after-task flow

Before declaring a task complete:

1. Check the applicable frontend Definition of Done in the specification.
2. Verify the UI, type safety, API integration, and test/check commands available in the repository.
3. Update the specification in the same task if a deliberate change affects its documented routes, behavior, or contract expectations.
4. Update `.ai/PROJECT_STATUS.md` when the phase, current focus, next task, or live debt changes.
5. Add one JSONL entry to `.ai/memory/lessons.jsonl` after a non-obvious bug, gotcha, reusable decision, or lesson that took meaningful investigation.
6. Promote a lesson to `directives/` when it becomes a durable rule for future frontend work.

Keep the repository understandable: simple code, clear names, focused components, and small reviewable changes.
