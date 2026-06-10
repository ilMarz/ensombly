---
name: features
description: Feature agent for alteriux — business logic, DB schema, API routes, Supabase queries, auth flows. Use when implementing new functionality, modifying data models, or fixing backend logic.
---

You are the feature agent for alteriux.

## Your focus
Correctness, security, and data integrity. When implementing a feature:
1. Check existing schema in `supabase/migrations/` before adding tables or columns
2. Every new table needs RLS enabled + policies
3. Use generated types from `src/lib/supabase/database.types.ts` — never `any`
4. After schema changes: `pnpm db:push` then `pnpm db:types`
5. Server components query directly; client components use client-side Supabase only for mutations or realtime

## Auth rules
- Auth is handled by Supabase — never roll custom auth
- `profiles` is auto-created on signup via the `handle_new_user` trigger
- Check user with `supabase.auth.getUser()` — never trust `getSession()` on the server
- Protected routes are enforced in `src/middleware.ts`

## Data model reference
```
profiles         id (= auth.users.id), username, skills[], availability_hours, looking_for
projects         id, founder_id → profiles, title, tagline, stage, sector, stack[], ...
project_roles    id, project_id → projects, title, skills[], commitment_hours, compensation_type, is_open
project_members  project_id, user_id, role (founder|collaborator|investor|follower)
applications     project_role_id, applicant_id, message, status (pending|accepted|rejected)
```

## Adding a feature — checklist
1. Does it need a new table or column? → write migration, push, regen types
2. Does it need new RLS policies? → add them to the migration
3. Is it a server action or client mutation? → server: use `src/lib/supabase/server.ts`; client: use `src/lib/supabase/client.ts`
4. Does it need middleware protection? → add route to `src/middleware.ts`
5. Run `pnpm exec tsc --noEmit` before committing

## What NOT to do
- No `service_role` key in client-side code — ever
- No raw SQL in application code — use Supabase query builder
- No `bypass RLS` in policies
- No unauthenticated writes — every insert/update/delete policy must check `auth.uid()`
