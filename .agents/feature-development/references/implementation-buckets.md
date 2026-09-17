# Implementation Buckets

## Purpose

Use this reference before creating phase tasks to ensure the phase collectively covers every required layer of its vertical outcome.

This is a **skill checklist**, not a generated workspace document. Assign each relevant bucket to one or more tasks within execution waves, or mark it `N/A`. Record assigned buckets in the roadmap task table and task files.

## Buckets

### Domain and Shared Contracts

- Entities, invariants, and ownership boundaries
- Shared Zod schemas and inferred types — single source of truth
- Public DTO/API/event contracts needed by same-wave or cross-wave tasks
- Package boundaries: `apps/web`, `packages/db`, `packages/auth`

### Persistence (Drizzle)

- Tables / columns in `packages/db/src/schema/` (ask before `db:push`, `db:generate`, `db:migrate`)
- Indexes and compatibility with existing data
- Migration / backfill work when needed
- Auth tables in `packages/db/src/schema/auth.ts` after `bun run auth:generate`

### Backend and API (Astro)

- Server routes under `apps/web/src/pages/api/`
- Middleware (`apps/web/src/middleware.ts`) and session checks
- App wiring in `apps/web/src/services.ts` (`db` + `auth`)
- Validation (Zod), error and failure behavior
- Endpoint authorization: session, ownership, role rejection

### Frontend (Astro)

- Pages (`apps/web/src/pages/`), components, layouts
- Routes (ask before changing page structure)
- Tailwind utilities consistent with existing UI
- Loading, empty, error, success, and permission-denied states
- Accessibility and responsive behavior

### Auth / Permissions

- Better Auth config in `packages/auth` (ask before changing)
- Email/password (or other plugins) impact — load auth skills
- User-visible permission constraints

### Infrastructure and Async

- Background jobs when applicable
- Docker Compose / deployment config (ask first)
- External services and operational constraints
- Varlock `.env.schema` and generated env accessors (ask before env changes)

### Integrations

- External APIs, webhooks, events
- Retry, idempotency, rate-limit, and failure semantics
- Secrets/configuration shape (never secret values)

### Observability and Analytics

- Server logging
- Frontend: no ad-hoc `console.*` in shipped paths
- Error reporting, metrics, analytics when relevant

### Testing and Verification

- Pure-function/unit coverage (`bun test path/to/file.spec.ts`; prefer `it.each`)
- API/integration coverage
- Browser or manual verification of Astro flows
- Cross-task integration checks for the phase exit criteria

### Rollout and Compatibility

- Feature flags and staged rollout
- Backward compatibility
- Migration/deletion conditions
- Fallback or rollback behavior

### Documentation

- Feature workspace state (`current-feature-state.md`, roadmap, tasks)
- Glossary / ADR updates when terms or durable decisions change
- No separate knowledge distillation on ship — status `Shipped` is enough

## Decomposition Check

Before implementation:

1. List the phase's relevant buckets.
2. Assign every relevant bucket to a task.
3. Group tasks into execution waves — same-wave tasks must be file-disjoint and dependency-free.
4. Freeze cross-wave contracts in the phase PRD.
5. Confirm the combined tasks satisfy the phase PRD acceptance contract.

Do not create a task for every bucket mechanically. One coherent task may cover several related buckets; one large bucket may require multiple independent tasks in the same or different waves.
