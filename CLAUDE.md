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

## Current Status (v0.1)
Building core MVP: auth, recipe display, guided bake mode.

### What's in v0.1
- Supabase auth (email/password)
- BreadBook Originals (~10 seeded recipes)
- Recipe list with category tabs
- Recipe detail with baker's % toggle
- Guided Bake Mode with timers, notifications, wake lock

### What's deferred
- Starter Tracker (v0.2)
- Schedule Planner (v0.2)
- Recipe builder/editor
- Recipe import (Claude API)
- Community features
- Dark mode

## Database
Tables are defined in `supabase/migrations/001_initial_schema.sql`.
v0.1 tables: profiles, recipes, bake_sessions.

## Tone of Voice
Warm, knowledgeable, encouraging. Like a friend who bakes good bread. Not precious or overly technical. Celebrate every bake, even the ugly ones.
