# BreadBook — Project Instructions

## What This Is
A sourdough lifestyle app. Users browse curated recipes (BreadBook Originals), follow guided bakes with timers, and track their sourdough starters. Built with React + Supabase.

## Architecture
- **React + TypeScript** SPA with Vite
- **Tailwind CSS v4** with custom BreadBook palette (defined via CSS @theme in index.css)
- **Supabase** for auth, Postgres DB, and storage
- **Zustand** for client state
- **React Router v6** for routing

## Key Conventions
- Mobile-first design — every UI decision prioritizes phone screens
- BreadBook Originals have `is_breadbook_original: true` and show a bread emoji badge
- Recipe data lives in `src/data/originals.ts` as a typed array (also seeded to Supabase via `scripts/seed.ts`)
- Baker's percentage toggle is global Zustand state, persisted to localStorage
- Timer in Guided Bake Mode must survive tab switches and page refreshes (localStorage cache)
- Use the BreadBook color palette: crust (#8B5E3C), dough (#F5ECD7), wheat (#D4A96A), crumb (#FBF7F0), char (#2C1A0E), ash (#5C4033), steam (#FFFFFF)
- Fonts: Lora for headings, Inter for body/UI

## Color Palette Quick Reference
| Name | Hex | Tailwind class |
|---|---|---|
| Crust | #8B5E3C | `text-crust`, `bg-crust` |
| Dough | #F5ECD7 | `text-dough`, `bg-dough` |
| Wheat | #D4A96A | `text-wheat`, `bg-wheat` |
| Crumb | #FBF7F0 | `text-crumb`, `bg-crumb` |
| Char | #2C1A0E | `text-char`, `bg-char` |
| Ash | #5C4033 | `text-ash`, `bg-ash` |
| Steam | #FFFFFF | `text-steam`, `bg-steam` |

## Current Status
Live at **breadbook.app** and **breadbook.onrender.com**. See `ROADMAP.md` for the full build plan.

### What's Built
- Project scaffold, Tailwind, routing, auth (email/password)
- BreadBook Originals (~10 seeded recipes, all reviewed for beginner usability)
- Recipe list with category tabs + detail with baker's % toggle
- Guided Bake Mode (step view, timers, notifications, wake lock, session persistence)
- Bake Journal (star rating, crumb/crust/flavor notes, what went well/change, photo upload, list/detail/edit/delete)
- Dark mode (CSS variable swap, system/light/dark toggle, persisted to localStorage)
- BreadBook Academy (13 inline knowledge cards, accordion UI, full + compact variants, deduplication across repeated step types)
- Recipe step restructure: bulk ferment split into active folds + passive rest phase for all Originals

### What's Next
- Modular Recipe Builder (create/edit, drag-to-reorder, hydration calc, batch scaler) — phase grouping for bulk ferment is the key UX decision
- Recipe Fork & Customize
- Expand Originals to 30+
- Recipe Explorer with search & filters
- Recipe Import (text paste + URL via Claude API)
- In-Bake Logging (fold timestamps, rise check-ins, dough observations, off-plan events)
- Live Schedule Adjustment
- Welcome screen on first login

### Phase 2: Starter Tracker, Feeding Plans, Schedule Planner, Loaf Troubleshooter
### Phase 3: Community (recipe sharing, bake feed, profiles, challenges)

## Database
Tables in `supabase/migrations/`: profiles, recipes, bake_sessions (001), bake_logs (002).
Storage bucket: `breadbook-photos` (public read, authenticated upload).
Future tables needed: starters, starter_logs, starter_schedules, bake_schedules, bake_event_logs, troubleshoot_sessions, recipe_likes, recipe_saves.

## Key Architecture Notes
- **Academy cards are inline components**, not a separate page. Content keyed by `academy_key` in a local TS file. Build once, use everywhere.
- **Recipe import always lands in the Modular Builder for review** — never auto-saves.
- **In-bake logging is passive, not intrusive** — log widgets are compact, secondary to step/timer.
- **Recipe fork lineage** — always show "Based on [Original] by [Baker]" on forked recipes.
- **Troubleshooter + in-bake log data connection** is a first-class architectural concern.
- **Live schedule adjustment** uses warm, reassuring language ("We've updated your schedule, you're still on track").

## Tone of Voice
Warm, knowledgeable, encouraging. Like a friend who bakes good bread. Not precious or overly technical. Celebrate every bake, even the ugly ones.
