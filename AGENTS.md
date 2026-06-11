<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Alterio — Agent Instructions

## Project
"LinkedIn for startup projects." Founders publish projects, others join as collaborators, advisors, or investors (network only, no payments). Latin name: *alterum alterius auxilio eget* — each needs the other's help.

## Stack
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Package manager:** pnpm (never npm)
- **Deploy:** Vercel

## Project structure
```
src/
  app/           # App Router pages and API routes
  components/    # Shared UI components
  lib/
    supabase/
      client.ts          # Browser Supabase client
      server.ts          # Server Supabase client
      database.types.ts  # Auto-generated types (do not edit manually)
supabase/
  migrations/    # SQL migrations — apply with: pnpm db:push
```

## Rules
- Use `pnpm`, never `npm` or `yarn`
- Server components fetch data directly via `createClient()` from `@/lib/supabase/server`
- Client components use `createClient()` from `@/lib/supabase/client`
- All DB changes go in a new migration file in `supabase/migrations/` then `pnpm db:push`
- After schema changes, regenerate types: `pnpm db:types`
- Never edit `database.types.ts` manually
- RLS must be enabled on every new table
- No comments unless the WHY is non-obvious
- No `any` — use generated Supabase types

## Key entities
- `profiles` — extends `auth.users`, auto-created on signup
- `projects` — published by a founder
- `project_roles` — roles a project is looking for
- `project_members` — role per user per project (founder/collaborator/investor/follower)
- `applications` — user applies to a project_role
