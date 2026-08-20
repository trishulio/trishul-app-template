---
name: loc-fitness
description: Enforces a hard 60-line cap on frontend React components (non-auto-generated). Use when frontend/src files grow too large or to refactor a component past the cap. Trigger keywords: line count, LOC, refactor component, split component, 60 lines, top files by lines of code, large file, too many lines, reduce lines.
---

# LOC Fitness Skill

Enforce a hard cap of **max 60 lines per component** for hand-written source in
`frontend/src`. Auto-generated code (`lib/api/model/**`, `lib/api/client.ts`,
orval output) is excluded — never hand-edit generated files.

## The loop

Set up a **goal** to track this work, then run a loop until every
non-auto-generated `frontend/src` file is at or below 60 lines.

Work in the `frontend/src` directory (NOT the repo root) so `node_modules` and
unrelated files never appear in the results:

```
wc -l **/*.ts* | sort -k 1 -r | head -n 12 | tail -n 10
```

The 10 largest files are the currently-over-cap candidates. For each file that
is **non-auto-generated** and over 60 lines:

1. Read it fully.
2. Refactor it down to at or below 60 lines using the patterns below.
3. Re-run the loop.
4. Repeat until every non-auto-generated file is within the cap, then close the goal.

## Refactor patterns (prefer in this order)

### 1. One file == one component

A single `.tsx`/`.ts` file must own exactly **one** component. Any loose class,
standalone function, or constant that is not that component's own render body
belongs in its own dedicated file:

- shared constants → `lib/` constants file (e.g. `lib/keys.ts`) or a
  `constants.ts` next to the component
- type definitions / shared DTO interfaces → `types.ts` (or into an existing
  model module)
- free-standing functions → a named util module under `lib/`

### 2. Split a complex / big render into reusable sub-components
A component whose `return (...)` render is large should delegate pieces to
existing reusable sub-components. Prefer to **generalize an existing
subcomponent** that already fits the need, then reuse it — do not copy-paste.

- extract repeated markup (a row, a card, a row header, a label+input, a stats
  block) into a sub-component file under `components/`
- pass plain data + callback props; keep subcomponents render-only and dumb

### 3. Separate rendering from functional logic
For a single component, split out the non-render logic and data into a
component-specific hook:

- `<ComponentName>.tsx` — owns the render (JSX) only, pulls data via the hook
- `hooks/use<ComponentName>.ts` — functional component defining state, calling
  other hooks, and owning data / api / mutation logic

The hook file must ALSO satisfy the 60-line cap. If a hook exceeds it, split it
one level further: extract sub-hooks (e.g. `useTenantForm`, `useTenantList`,
`useTenantMutations`) and compose them inside `use<ComponentName>`.

## Guard rails

- Do NOT refactor `lib/api/**` (orval-generated) — it is regenerated from the
  backend OpenAPI spec.
- Do not change behavior; this is a structural refactor only.
- Keep imports tidy; prefer the existing `@/` alias for absolute imports.
- After the loop completes, run `npm run check` (lint + prettier) and the frontend
  build to confirm nothing broke before finishing.