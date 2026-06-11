# Alteriux

> *alterum alterius auxilio eget* — each needs the other's help.

A network platform for startup projects. Founders publish their projects and find the people they need. Collaborators find meaningful work. Investors discover early-stage opportunities.

No payments, no equity splits on the platform — purely a network to connect the right people.

---

## The problem

Building a startup team is hard. Great ideas fail because the founder can't find a co-founder, a first engineer, or a first investor. Existing platforms (job boards, social networks) are not built for early-stage, pre-revenue projects where roles are fluid and compensation is often non-traditional.

---

## Personas & roles

### Founder
Registers and publishes one or more projects. Defines open roles with skills, commitment and compensation type. Receives applications from users and interest signals from investors. Can manage project members.

**Can:** create projects, add/edit roles, accept/reject applications, view investor interest.  
**Cannot:** apply to roles, send investor interest requests.

---

### User (Collaborator / Advisor)
Registers and browses published projects. Applies to open roles with a message. Follows projects they find interesting. Builds a profile with skills and availability.

**Can:** browse projects, follow projects, apply to open roles.  
**Cannot:** create projects, send investor interest requests.

---

### Investor
Registers and browses published projects. Cannot apply to roles. Instead, sends a structured interest signal to the founder with contact info (email and/or phone) and an optional message. The founder receives a notification.

**Can:** browse projects, express investor interest (contact + message).  
**Cannot:** create projects, apply to roles.

---

## Key entities

| Entity | Description |
|--------|-------------|
| `profiles` | One per auth user. Holds name, username, bio, skills, availability, role. |
| `projects` | Published by a founder. Has title, tagline, description, stage, sector, stack, links. |
| `project_roles` | Roles a project is looking for (title, skills, commitment, compensation). |
| `project_members` | Membership record linking a user to a project with a role (founder / collaborator / investor / follower). |
| `applications` | A user applies to a `project_role` with a message. Status: pending → accepted / rejected. |
| `investor_interests` | An investor expresses interest in a project with contact info and an optional message. |
| `notifications` | In-app notifications triggered by DB events (new application, new investor interest). |

---

## Project stages

| Stage | Description |
|-------|-------------|
| Idea | Concept only, no product yet |
| Prototype | Early proof of concept |
| MVP | Minimum viable product live |
| Growth | Product launched, growing |

---

## Compensation types (for roles)

| Type | Description |
|------|-------------|
| Equity | Shares / co-founder stake |
| Revenue share | % of future revenue |
| Voluntary | Unpaid / passion project |
| Paid | Fixed salary or contract |

---

## Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Supabase (Postgres + Auth + RLS + Realtime)
- **Deploy:** Vercel

---

## Local development

```bash
pnpm install
pnpm dev
```

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

### Key commands

```bash
pnpm dev              # dev server
pnpm build            # production build
pnpm exec tsc --noEmit  # type check
pnpm db:push          # apply migrations to Supabase
pnpm db:types         # regenerate database.types.ts
```

### Schema changes

1. Create `supabase/migrations/00N_description.sql`
2. `pnpm db:push`
3. `pnpm db:types`

Never edit `src/lib/supabase/database.types.ts` manually.
