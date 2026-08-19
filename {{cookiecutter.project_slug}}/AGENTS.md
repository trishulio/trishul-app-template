# AGENTS.md

Guidance for AI coding agents working in this repo. Read this before writing code.

## Project overview

This project is generated from the **trishul-app-template** (cookiecutter). Keep it in sync with the template via `cruft update`.

- **Frontend** (`/frontend`): Vite + React 19 + TypeScript, Tailwind v4, TanStack Query, Zustand, react-router v7. API client is generated from an OpenAPI spec via **orval** (`npm run generate:orval`). Don't hand-edit generated files.
- **Backend** (`/backend`): Java + Spring Boot (Maven), built on the `sh.trishul:trishul-app-parent` parent. PostgreSQL runtime dependency. Main class: `{{ cookiecutter.tld }}.{{ cookiecutter.domain }}.Application` (package generated from the project's FQDN).
- **Infrastructure** (`/infrastructure`): Terraform landscapes per environment.
- The package/namespace is derived from the project's FQDN (the `{{ cookiecutter.tld }}`/`{{ cookiecutter.domain }}` cookiecutter variables).

## How to run

### Backend (Spring)

```bash
cd backend
make app-run        # starts the app via docker-compose (backend + deps)
make install        # build & verify compilation (mvn clean install via docker; no local maven needed)
```

- Config: `backend/src/main/resources/application.properties` (imports `app-application.properties`) and `application-dev.properties` for the `dev` profile.
- `ddl-auto=update` in dev; verify schema assumptions against the actual DB before relying on them.

### Frontend (Vite)

```bash
cd frontend
npm install
npm run dev        # local dev server
npm run build      # generate:orval -> tsc -b -> vite build
npm run check      # lint + prettier checks (used by prepush)
```

- Requires Node `>=24`.
- The generated API client lives under `frontend/src` (orval output) — regenerate with `npm run generate:orval`, never edit by hand.

## Guidelines / pitfalls to avoid

These rules are hard-won. Follow them.

1. **Empty optional fields → HTTP 500.** Optional/nullable server fields are not initialized; reading them unguarded throws NPE and surfaces as a 500. Always null-check optional/nullable fields on the server before use and return a proper 4xx with a message instead of crashing.

2. **String length limits → silent 409.** Text fields silently hit a ~255 (VARCHAR) limit and fail with an opaque 409. Enforce and surface max length: cap at the DB column length, return **400 with a clear "max N characters" message**, and show the constraint to the user up front.

3. **Monetary totals can go negative.** Totals are computed as `price - discount` with **no clamping**, so a discount larger than the price produces a negative total. Validate/clamp totals (never below zero) and format monetary values properly before persisting or displaying.

4. **UI must not silently no-op on empty required fields.** Forms must show **inline validation + friendly error messages** for missing required fields instead of failing with no feedback.

5. **Testability: use `data-testid` + stable selectors.** Never rely on placeholder text or visual-only attributes for selecting elements in tests. Add stable `data-testid` attributes so tests (and agents) can target elements reliably.

6. **Search/dropdown overlays must auto-close on select and close on `Escape`.** Overlays that stay open after a selection (or can't be dismissed with Escape) trap the user and break flow.

7. **Avoid fetch/mutation races that blank out typed form values.** A slow refetch/mutation response can overwrite freshly typed input and wipe the form. Guard against stale responses overriding user-typed state.

8. **List counters are unreliable under concurrency.** Parallel/duplicate writes can make list item counts drift. Verify correctness **by identity, not by count** — assert on the specific items present, not the array length.

9. **Always do a manual/real-browser check.** Headless browser sessions are unstable and can produce false failures or false passes. Confirm behavior in a real/manual browser before declaring a UI task done.

## Conventions

- Keep changes focused and idiomatic; run `npm run check` in frontend and `make install` in backend before pushing.
- Verify against the real system/DB rather than assuming schema or behavior.
- Generic, reusable components belong in the `trishul-app-template`, not in this repo (this app is template-derived; sync back improvements via `cruft update`).

## Coding Patterns to Follow

10. **Normalize data inside setters, not call-sites.** When a DTO or model field needs sanitization (e.g. blank string → null), put that logic in the **setter method** itself so every caller benefits automatically. Do not scatter per-call-site guards like loops in service methods.

11. **No hardcoded key/string literals — use a central constants file.** Magic strings (e.g. keyboard keys like `"Escape"`, `"Enter"`) must be defined in a shared constants file (e.g. `frontend/src/lib/keys.ts`) and referenced by name. This prevents typos, aids refactoring, and makes intent explicit.

12. **Build backend changes with `make install` in the first pass.** Don't rely on static checks or leave compilation to review time — after backend code changes, run `make install` (docker-backed `mvn clean install`, no local Maven needed) to verify it compiles before finishing the task.

## Backend domain wiring (Trishul autoconfiguration pattern)

- Domain services are **plain classes** (no `@Service`/`@Component`). Register them as `@Bean`s in a per-domain `XxxServiceAutoConfiguration` `@Configuration` class, using `@ConditionalOnMissingBean` so downstream apps can override them.
- Read the current user from `sh.trishul.auth.session.context.holder.ContextHolder` (via `getPrincipalContext().getUsername()`), NOT Spring's `SecurityContextHolder`.
- Use `sh.trishul.model.json.JsonMapper.INSTANCE` for JSON serialization. See `.agents/skills/build-trishul-api/SKILL.md` for the full pattern.