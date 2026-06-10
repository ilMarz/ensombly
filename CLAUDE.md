@AGENTS.md

## Package manager
Always use `pnpm`. Never `npm` or `npx` — use `pnpm dlx` instead.

## Key commands
```bash
pnpm dev                 # dev server
pnpm build               # production build
pnpm exec tsc --noEmit  # type check (must pass before commit)
pnpm db:push             # apply migrations to remote Supabase
pnpm db:types            # regenerate src/lib/supabase/database.types.ts
```

## Skills available
- `/ui` — UI, layout, components, styling
- `/features` — business logic, schema, auth, Supabase queries

## Supabase workflow
Schema changes must go through migrations:
1. Create `supabase/migrations/00N_description.sql`
2. `pnpm db:push`
3. `pnpm db:types`

Never edit `src/lib/supabase/database.types.ts` manually.
Never commit `.env.local` or `supabase/.temp/`.
