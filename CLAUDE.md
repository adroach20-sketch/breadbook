# BreadBook — Project Instructions

## What This Is
A sourdough lifestyle app. Users browse curated recipes (BreadBook Originals), follow guided bakes with timers, and track their sourdough starters. Built with React + Supabase.

## Architecture
- **React + TypeScript** SPA with Vite 7
- **Tailwind CSS v4** with custom BreadBook palette (defined via CSS @theme in index.css)
- **Supabase** for auth, Postgres DB, and storage
- **Zustand** for client state
- **React Router v7** for routing
- **Capacitor** for native iOS + Android (wraps existing React app, ~95% code reuse)

## Key Conventions
- Mobile-first design — every UI decision prioritizes phone screens
- BreadBook Originals have `is_breadbook_original: true` and show a bread emoji badge
- Recipe data lives in `src/data/originals.ts` as a typed array (also seeded to Supabase via `scripts/seed.ts`)
- Baker's percentage toggle is global Zustand state, persisted to localStorage
- Timer in Guided Bake Mode must survive tab switches and page refreshes (localStorage cache)
- Use the BreadBook color palette (see quick reference below). Colors auto-swap in dark mode via CSS variables.
- Fonts: Lora for headings, Inter for body/UI

## Color Palette Quick Reference
| Name | Hex (light) | Dark mode | Tailwind class | Role |
|---|---|---|---|---|
| Crust | #8B5E3C | #C09268 | `text-crust`, `bg-crust` | Primary action, buttons, links |
| Crust Light | #A3764E | #D4A87C | `text-crust-light` | Hover states |
| Crust Dark | #6E4A2F | #A3764E | `text-crust-dark` | Active states |
| Dough | #F5ECD7 | #3D2E22 | `bg-dough`, `border-dough` | Borders, surfaces — **never use as text** |
| Wheat | #D4A96A | #E5C080 | `text-wheat`, `bg-wheat` | Accent on dark backgrounds only |
| Crumb | #FBF7F0 | #1C1310 | `bg-crumb` | Page background |
| Char | #2C1A0E | #F0E6D6 | `text-char` | Primary text |
| Ash | #5C4033 | #C8B098 | `text-ash` | Secondary text |
| Ash Muted | #8B7B6B | #AA9580 | `text-ash-muted` | Tertiary text, placeholders, timestamps |
| Steam | #FFFFFF | #2D2118 | `bg-steam` | Card/component backgrounds |

### Color Rules
- **`dough` is a surface token** — use for `bg-dough` and `border-dough`, never `text-dough`
- **`wheat` is for dark backgrounds only** — use on `bg-crust` or hero sections, not on light surfaces
- **Use `ash-muted` instead of opacity hacks** — `text-ash-muted` replaces `text-ash/50`, `text-ash/60`, `text-ash/70`
- **Card pattern:** `bg-steam border border-dough shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]`
- **Status colors need dark variants:** `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`
- **Recharts/canvas:** Use `useThemeColors` hook — these libs can't read CSS variables

## Current Status
Live at **breadbook.app** and **breadbook.onrender.com**. See `ROADMAP.md` for the full build plan.

### What's Built (v0.3 — "The Front Door") — COMPLETE
- Project scaffold, Tailwind v4, routing, auth, onboarding (3-step welcome flow)
- 19 BreadBook Originals seeded
- Recipe list + detail + baker's % toggle + favorites + explorer (search + filters)
- Guided Bake Mode with useBakeSession hook (timers, notifications, wake lock, session persistence)
- Bake Journal (star rating, notes, photos, edit/delete)
- Dark mode (WCAG AA compliant palette, `ash-muted` semantic token, `useThemeColors` hook)
- BreadBook Academy (13 inline knowledge cards, accordion UI, full + compact variants)
- In-Bake Logging: fold tracker, rise check-ins, room temp, dough observations, shaping/proofing logs, off-plan events
- Per-step ingredient checklists with tap-to-check UI + inline amounts
- Starter Tracker (dashboard, feeding log, activity chart, calendar, health status)
- Smart Schedule Planner v2 (reverse timeline, ratio-aware feeding, quiet hours, linked to Bake Mode)
- Community MVP (bake feed, photo sharing, comments, baker profiles, community recipes)
- ErrorBoundary, Timer aria-live, security fixes (RLS verified, views + functions patched)
- **v0.3:** Cross-feature nav (bake→journal, journal→recipe, schedule→bake)
- **v0.3:** Home dashboard smart slot (resume bake, log bake, starter needs feeding, guide progress)
- **v0.3:** Simple Loaf Troubleshooter (searchable symptom KB, 20+ symptoms)
- **v0.3:** Start Your Starter — 14-day guided path (`/starters/guide`)
- **v0.3:** Starter feeding reminders wired (`useStarterReminderSync`, reschedules on feed/save)
- **v0.3:** Baking stats on profile (streak, avg rating, favorite recipe)
- **v0.3:** Stop Bake (abandon session, clears localStorage + Supabase)
- **v0.3:** Starters added to nav; mobile nav icons-only (6 items, all screen sizes)

### What's Next (v0.4 — "Make It Yours")
1. Recipe Fork & Customize
2. Shareable bake results (photo share card for Instagram/link sharing)
3. Interactive Loaf Troubleshooter (decision-tree diagnostic)
4. Full filter panel + Explore tab editorial sections
5. Baking dashboard / analytics (history timeline, improvement trends)
6. DB migrations (expand profiles + recipes tables)
7. Capacitor shell (native iOS + Android with timer notifications)
8. 5-8 more Originals (target 30+)

### Product Strategy
- **App is 100% free.** No paywalls, no IAP, no premium tiers.
- **Revenue:** Brand partnerships/affiliate, Baker's Circle ($5/yr voluntary support), creator tip jar (15% cut).
- **Mobile:** Capacitor wraps existing React app. Native local notifications for timers, push for feeding reminders.
- See `plans/monetization-strategy.md` and `plans/mobile-app-capacitor.md` for full details.

## Database
Tables in `supabase/migrations/`: profiles, recipes, bake_sessions (001), bake_logs (002), bake_event_logs (003), starters, starter_logs, starter_schedules, bake_schedules, recipe_likes, recipe_saves.
Storage bucket: `breadbook-photos` (public read, authenticated upload).
Supabase MCP server configured in `~/.claude.json` — can run SQL directly against the project.

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
