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
- In-Bake Logging MVP: S&F fold tracker (mark done + auto-advance), bulk ferment rise check-ins (pill buttons), room temp capture (one-time, header badge), all events dual-stored (localStorage + Supabase sync)
- Per-step ingredient checklists with tap-to-check UI + inline amounts in instruction text
- External recipe support: Alexandra Cooks "Artisan Sourdough Made Simple" added as first recipe with `source_credit`

### What's Next
- Modular Recipe Builder (create/edit, drag-to-reorder, hydration calc, batch scaler) — phase grouping for bulk ferment is the key UX decision
- Recipe Fork & Customize
- Expand Originals to 30+
- Recipe Explorer with search & filters
- Recipe Import (text paste + URL via Claude API)
- In-Bake Logging Phase 2 (dough observations, shaping/proofing logging, off-plan events)
- Live Schedule Adjustment
- Welcome screen on first login

### Phase 2: Starter Tracker, Feeding Plans, Schedule Planner, Loaf Troubleshooter
### Phase 3: Community (recipe sharing, bake feed, profiles, challenges)

## Database
Tables in `supabase/migrations/`: profiles, recipes, bake_sessions (001), bake_logs (002), bake_event_logs (003).
Storage bucket: `breadbook-photos` (public read, authenticated upload).
Future tables needed: starters, starter_logs, starter_schedules, bake_schedules, bake_event_logs, troubleshoot_sessions, recipe_likes, recipe_saves.

## Key Architecture Notes
- **Academy cards are inline components**, not a separate page. Content keyed by `academy_key` in a local TS file. Build once, use everywhere.
- **Recipe import always lands in the Modular Builder for review** — never auto-saves.
- **In-bake logging is passive, not intrusive** — log widgets are compact, secondary to step/timer.
- **Recipe fork lineage** — always show "Based on [Original] by [Baker]" on forked recipes.
- **Troubleshooter + in-bake log data connection** is a first-class architectural concern.
- **Live schedule adjustment** uses warm, reassuring language ("We've updated your schedule, you're still on track").

## Quality Standards — Non-Negotiable

This is a live product with real users. Every feature must be built as if it ships tomorrow:

- **No placeholder UI.** Every component must be polished, responsive, and feel native on mobile. Skeleton loaders for loading states. Warm, helpful empty states — never just "No results."
- **No shortcuts in data handling.** Optimistic UI must handle error recovery gracefully. Loading, error, and empty states are first-class concerns, not afterthoughts.
- **Accessibility is required.** Focus rings, aria labels, keyboard navigation, screen reader support on all interactive elements.
- **Performance is required.** Debounce search inputs. Lazy load heavy panels. Paginate or virtualize long lists. Don't load data you don't need yet.
- **Dark mode must work perfectly** on every new component — bakers bake early morning and late night.
- **Mobile-first means mobile-first.** Large tap targets (44px minimum). One-thumb operation where possible. No hover-dependent interactions. Test mental model on a phone screen before building.
- **Empty states and edge cases define product quality.** What happens with zero data? What happens with one item? What happens with 500? Handle all three.
- **Warm, not corporate.** Error messages, empty states, confirmations — all should sound like a friend who bakes, not a software system. Match the tone of voice below.
- **Always choose the right way over the easy way.** If there's a shortcut that sacrifices UX, data integrity, or accessibility — don't take it.

## Tone of Voice
Warm, knowledgeable, encouraging. Like a friend who bakes good bread. Not precious or overly technical. Celebrate every bake, even the ugly ones.
