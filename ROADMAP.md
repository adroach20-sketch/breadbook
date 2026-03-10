# BreadBook Roadmap

Full build plan derived from the [breadbook-spec.md](../../../Downloads/breadbook-spec.md). Organized by phase, with build order within each phase. Each item tracks status.

---

## Phase 1 — Core MVP

The foundation. Everything here ships before BreadBook is "v1."

### 1.1 Project Scaffold & Branding
- [x] Vite + React + TypeScript project
- [x] Tailwind CSS v4 with BreadBook palette (@theme in CSS)
- [x] Fonts: Lora (headings) + Inter (body/UI)
- [x] App icon (breadbook-icon.svg)
- [x] React Router routing skeleton
- [x] Zustand for client state
- [x] `.env.example` with all required vars
- [x] README with setup instructions
- [x] Dark mode support (CSS variable swap, system/light/dark toggle, persisted to localStorage)

### 1.2 Supabase Setup & System Account
- [x] Supabase project created
- [x] `profiles` table (extends auth.users)
- [x] `recipes` table with full schema and RLS
- [x] `bake_sessions` table with RLS
- [x] `@BreadBook` system account created
- [x] Seed script (`scripts/seed.ts`) — creates account + seeds Originals
- [ ] Expand `profiles` table: add `bio`, `starter_name` fields
- [ ] Expand `recipes` table: add `forked_from`, `version`, `fold_method`, `shaping_method`, `base_servings`, `yield_loaves` columns
- [ ] `bake_event_logs` table with RLS (in-bake capture)
- [ ] `bake_schedules` table with RLS
- [x] Supabase Storage bucket: `breadbook-photos` (public read, authenticated upload)
- [ ] Enable Realtime on `bake_event_logs`

### 1.3 Authentication & Onboarding
- [x] Sign up / Log in / Log out
- [x] Protected routes (redirect to login)
- [x] User profile stored in `profiles` table
- [ ] Welcome screen on first login: "Welcome to BreadBook!" with 3-card intro (Your Starter · Your Recipes · Your Community) and "Start with a BreadBook Original →" CTA

### 1.4 BreadBook Academy (Knowledge Layer)
- [ ] Academy content file (`src/data/academy.ts`) — keyed by `academy_key`
- [ ] Inline Academy card component (expand/collapse, used everywhere)
- [ ] Content per step type: what it does, when to use vs skip, beginner/intermediate/advanced label
- [ ] Contextual interaction notes (e.g., "Adding lamination? Reduce stretch & fold sets from 4 to 2")
- [ ] Method picker Academy cards (fold methods, shaping methods, scoring patterns)

### 1.5 Modular Recipe Builder
- [ ] Create/edit recipe form
- [ ] Drag-to-reorder step list
- [ ] Step type toggles (add/remove steps like autolyse, lamination, cold proof)
- [ ] **Phase grouping for bulk ferment:** Bulk fermentation should be a "phase" that contains sub-steps (stretch & folds, lamination, rest). Users toggle "Add stretch & folds" and the Builder inserts them inside the bulk phase automatically — no need to understand the folds-during-bulk convention. The phase renders as a visual group in bake mode. This is the #1 UX decision for the Builder — beginners (mom, brother) shouldn't have to learn recipe structure conventions.
- [ ] Academy cards expand inline when a step is added
- [ ] Method pickers for fold method, shaping method, scoring pattern
- [ ] Hydration calculator — adjusting hydration % recalculates water amount live
- [ ] Batch scaler — set number of loaves, all ingredients scale proportionally
- [ ] Baker's percentage toggle in builder (already works in read-only view)

### 1.6 Recipe Fork & Customize
- [ ] "Copy & Make It Mine" button on any recipe
- [ ] Pre-fills Modular Builder with original recipe data
- [ ] "Based on [Original Title] by [Baker]" lineage banner
- [ ] Guided walkthrough prompts at each decision point with Academy context
- [ ] Saves as new recipe with `forked_from` reference and `version: 1`
- [ ] Future troubleshoot amendments create version 2, 3, etc. — full history preserved

### 1.7 BreadBook Originals (Content)
- [x] ~10 Originals seeded (Classic Country Loaf, Focaccia, Pizza, Pancakes, Crackers, Bagels, Cinnamon Rolls, etc.)
- [ ] Expand to 30+ Originals across all categories:
  - [ ] Sourdough Loaves: High-Hydration Open Crumb, Whole Wheat, Rye & Caraway, Seeded Crust, Whole Spelt
  - [ ] Flatbreads & Baked: Pita, English Muffins, Sandwich Bread
  - [ ] Enriched: Brioche, Dinner Rolls, Cardamom Buns
  - [ ] Same-Day Discard: Waffles, Crepes, Everything Bagel Crackers, Banana Bread, Blueberry Muffins, Chocolate Chip Cookies, Tortillas, Fresh Pasta, Soft Pretzels, Scones, Quick Flatbreads
- [ ] All Originals built with Academy keys assigned, accurate timers, and baker's percentages
- [ ] `source_credit` field populated where inspired by known sources (Tartine, King Arthur, The Perfect Loaf)

### 1.8 Recipe Explorer & Search
- [x] Recipe list with category filter tabs (basic version)
- [ ] Explore tab with curated editorial sections:
  - [ ] BreadBook Originals (anchor section, always visible)
  - [ ] Trending This Week (most saved/baked)
  - [ ] Great for Beginners (low hydration, simple steps, discard-based)
  - [ ] Under 30 Minutes (same-day discard recipes)
  - [ ] Weekend Projects (long-ferment recipes)
  - [ ] Use Your Discard (surfaces when starter was fed recently)
  - [ ] Saved by You (bookmarked recipes)
- [ ] Unified search bar (searches title, ingredients, tags, step types)
- [ ] Filter panel (collapsible):
  - [ ] Category (multi-select)
  - [ ] Ferment type: Long / Overnight / Same-Day Discard
  - [ ] Hydration range slider (50%–100%)
  - [ ] Technique: autolyse / lamination / cold proof / preferment
  - [ ] Time commitment: under 1hr / 1–4hrs / 4–12hrs / overnight / multi-day
  - [ ] Source: Originals only / Community only / All
  - [ ] Difficulty: Beginner / Intermediate / Advanced
- [ ] Sort options: Most Saved · Most Baked · Newest · Highest Rated
- [ ] Recipe cards: photo, title, author (with badge for Originals), ferment type, hydration %, save count
- [ ] Starter-aware suggestions (banner on home dashboard):
  - [ ] "Your starter is active — ready to bake!" (fed 2–6hrs ago)
  - [ ] "Got discard? Here are 5 things you can make right now" (fed yesterday, hasn't baked)

### 1.9 Recipe Import
- [ ] "Import Recipe" button in recipe library (next to "New Recipe")
- [ ] Import options UI: Paste Text · Import from URL · Scan Photo (grayed out, "Coming soon")
- [ ] **Tier 1 — Text Paste:**
  - [ ] Text input area for pasting raw recipe text
  - [ ] Claude API structured prompt: extract title, description, ingredients, map steps to BreadBook types, estimate timers, assign academy_keys, flag uncertain mappings
  - [ ] Returns pre-filled Modular Builder for user review
  - [ ] Never auto-saves — user must review and confirm
- [ ] **Tier 2 — URL Import:**
  - [ ] URL input field
  - [ ] First attempt: parse `schema.org/Recipe` structured markup
  - [ ] Fallback: fetch page content → Claude API extraction
  - [ ] Auto-populate `source_credit` with source domain and original URL
  - [ ] "Imported from [source]" display on recipe card
- [ ] `VITE_ANTHROPIC_API_KEY` added to `.env.example`

### 1.10 Guided Bake Mode
- [x] Full-screen, distraction-free UI
- [x] One step at a time with step number and progress bar
- [x] Countdown timers with labels
- [x] Browser notifications on timer completion
- [x] Screen wake lock (Wake Lock API)
- [x] Timer survives tab switches and page refreshes (localStorage)
- [x] Prev / Next step navigation
- [x] "Bake complete!" celebration screen
- [ ] Two-panel concept (mobile: swipe between step view and log view)
- [ ] Prompt to open Bake Journal on completion

### 1.11 In-Bake Logging
- [ ] Log view panel (captured data for current bake)
- [ ] **Stretch & Fold steps:**
  - [ ] Large "Done" tap button — records timestamp
  - [ ] Log of previous sets with timestamps
  - [ ] Live "time since last fold" counter
- [ ] **Bulk Ferment step:**
  - [ ] Rise check-in button with quick-tap options: 25% / 50% / 75% / Doubled / More than doubled
  - [ ] Room temperature log (pre-filled from schedule planner if used)
  - [ ] Dough observation quick-taps — Feel: Tight / Springy / Slack / Sticky / Smooth / Jiggly — Smell: Mild / Yeasty / Tangy / Alcoholy
  - [ ] All observations timestamped automatically
- [ ] **Shaping step:**
  - [ ] Log shaping method used (if different from planned)
  - [ ] Dough feel at shaping: Good tension / Tore a bit / Very sticky / Couldn't build tension
- [ ] **Proofing step:**
  - [ ] Auto-timestamp when dough goes into fridge
  - [ ] Optional poke test result: Sprang back fast / Sprang back slowly / Didn't spring back
- [ ] **Off-Plan button (always visible, any step):**
  - [ ] Quick options: Running late / Running early / Dough not ready / Got interrupted / Temperature changed
  - [ ] Free text field for notes
  - [ ] Triggers live schedule recalculation
- [ ] All log data saved to `bake_event_logs` table
- [ ] Log widgets are compact and secondary to step/timer — never block progress

### 1.12 Live Schedule Adjustment
- [ ] When off-plan event logged or rise check-in suggests ahead/behind schedule:
  - [ ] Recalculate remaining timeline in real time
  - [ ] Display warm, reassuring message (e.g., "We've updated your schedule, you're still on track")
  - [ ] Save adjusted schedule to `bake_schedules`, preserve original for comparison

---

## Phase 2 — Bake Journal, Smart Scheduling & Troubleshooter

### 2.1 Starter Tracker
- [ ] Database tables: `starters`, `starter_logs`, `starter_schedules`
- [ ] **Starter Dashboard:**
  - [ ] Card per starter: name, last fed (relative time), next feed due
  - [ ] Estimated activity level: dormant / waking up / active / peak / past peak
  - [ ] Mini sparkline of recent rise history
  - [ ] Color-coded health: green (on schedule), yellow (feed soon), red (overdue)
  - [ ] Quick-log button — tap to log feeding without leaving dashboard
- [ ] **Feeding Log:**
  - [ ] Log: water added, flour added, temperature, peak rise %, peak rise time, notes, photo
- [ ] **Activity Chart:**
  - [ ] Recharts line chart — rise/fall curve over last 7 days
  - [ ] Overlay multiple starters for comparison
  - [ ] Notes field per log entry

### 2.2 Starter Feeding Plan
- [ ] Set repeating feeding schedule per starter (e.g., every 12hrs, every 24hrs)
- [ ] Set preferred feeding times (e.g., 8am and 8pm)
- [ ] Bake-driven feeding plan: auto-calculate feeds needed for peak activity at mix time
- [ ] 7-day feeding calendar view per starter
- [ ] Mark feeding as done from reminder notification
- [ ] **Reminders:**
  - [ ] Browser/push notifications
  - [ ] Types: regular schedule, bake-linked, optional rise check-in
  - [ ] Settings: enable/disable per starter, snooze (1hr, 2hr, tomorrow)
  - [ ] Quiet hours (user-configurable, e.g., 10pm–7am)

### 2.3 Smart Schedule Planner
- [ ] **User inputs:**
  - [ ] Target eat date & time
  - [ ] Recipe to use
  - [ ] Starter name (pulls from starters)
  - [ ] Current starter status: active / recently fed / needs feed / dormant
  - [ ] Room temperature
  - [ ] Fridge available for cold proof? (yes/no)
- [ ] **Reverse-engineered timeline:**
  - [ ] Generates timestamps for every stage (feed starter → mix → bulk → shape → proof → bake → eat)
  - [ ] Color-coded by category (starter prep, dough work, proofing, baking)
  - [ ] One-tap "Set Reminder" per step
  - [ ] "Add to Bake Mode" button — loads recipe + schedule into Guided Bake Mode with times pre-populated
  - [ ] Shareable as screenshot or link
  - [ ] Saveable to schedule history
- [ ] **Smart adjustments:**
  - [ ] Room temp >75°F → shorter bulk ferment
  - [ ] Dormant/cold starter → add 2 extra feeds
  - [ ] No fridge → same-day proof schedule
  - [ ] Warn if timeline too compressed
- [ ] Database: `bake_schedules` table with `schedule_steps` jsonb

### 2.4 Bake Journal
- [x] Database table: `bake_logs` (rating, crumb/crust/flavor notes, what went well, what to change, photo URLs)
- [x] Log a bake result after Guided Bake Mode completes (pre-fill recipe, date/time)
- [x] Photo upload (Supabase Storage: `breadbook-photos` bucket)
- [x] Star rating (1–5) + free text notes
- [x] "My Bakes" gallery — grid of bake photos with dates
- [x] Detail view with edit/delete
- [ ] Bake history timeline per recipe — see improvement over time
- [ ] Bulk/proof hours + room temp fields (deferred — belongs with In-Bake Logging)

### 2.5 Loaf Troubleshooter
- [ ] Database table: `troubleshoot_sessions`
- [ ] **Entry points:**
  - [ ] From Bake Journal ("Something went wrong? Troubleshoot this bake →")
  - [ ] From "Bake complete" screen
  - [ ] Standalone "Troubleshoot a Bake" in nav
  - [ ] From recipe detail page
- [ ] **When launched from logged bake:** pre-populate from `bake_event_logs` (fold timestamps, rise check-ins, observations, room temp, off-plan events) — skip to symptom picker
- [ ] **When launched standalone:** full manual question flow
- [ ] **Step 1 — Visual symptom picker** (illustrated cards, multi-select):
  - [ ] Appearance: Flat, Flying crust, Pale crust, Burnt bottom, Hard crust, No oven spring
  - [ ] Crumb: Large uneven holes, Dense tight, Gummy/wet, Chewy
  - [ ] Flavor: Too sour, Not sour enough, Yeasty/alcohol, Salt off
  - [ ] Other: Rose too slow, Rose too fast, Smells off
- [ ] **Step 2 — Follow-up questions** (skip fields already in bake log): room temp, bulk duration, poke/windowpane test, cold proof duration, flour type, starter health
- [ ] **Step 3 — Diagnosis cards** per symptom cluster:
  - [ ] Plain-language science explanation
  - [ ] 2–3 specific amendments with exact values
  - [ ] Confidence: Most likely / Possibly / Could also be
  - [ ] Links to related community recipes
- [ ] **Step 4 — Apply amendments:**
  - [ ] "Apply these fixes to [Recipe Name]" — diff view (original vs suggested)
  - [ ] Accept/reject each change individually
  - [ ] Save as new recipe version (v2, v3)
  - [ ] Link troubleshoot session to bake log

---

## Phase 3 — Community

### 3.1 Recipe Sharing
- [ ] Database tables: `recipe_likes`, `recipe_saves`
- [ ] Mark recipes as `is_public = true` to share
- [ ] Public recipe feed — browse community recipes
- [ ] Filter by category, hydration %, tags
- [ ] Search by title or ingredient
- [ ] Save/fork a community recipe (credits original baker)
- [ ] Like / bookmark recipes

### 3.2 Bake Feed
- [ ] Share bake log photos publicly to community feed
- [ ] Minimal, warm sourdough-focused social feed
- [ ] Comment on shared bakes
- [ ] Follow other bakers

### 3.3 Baker Profiles
- [ ] Public profile page: avatar, bio, starter name, bake count, public recipes
- [ ] Follow / Unfollow
- [ ] "Bakes this month" counter
- [ ] Profile URL: `breadbook.app/@username`

### 3.4 Community Challenges
- [ ] Monthly BreadBook Challenge — everyone bakes the same recipe, shares results
- [ ] Admin-curated (manually set in Supabase, `challenges` table later)

---

## Infrastructure & Cross-Cutting

- [ ] Render deployment (auto-deploy on push to main)
- [ ] Domain setup (`breadbook.app` or `breadbook.io`)
- [ ] PWA support (add-to-homescreen, offline caching of active bake)
- [ ] React Native migration path (post web launch)

---

## Build Order (Recommended)

This is the spec's recommended sequence. Items within a phase can shift, but the phase order matters.

1. ~~Project scaffold + Tailwind + routing~~ ✅
2. ~~Supabase setup + @BreadBook account~~ ✅
3. ~~Auth screens + protected routes~~ ✅
4. Academy knowledge base (content file + inline card component)
5. Modular Recipe Builder
6. Batch scaler + hydration calculator
7. Expand BreadBook Originals to 30+
8. Recipe Explorer & Search (Explore tab, search + filters)
9. Recipe Fork & Customize flow
10. Recipe Import (text paste → URL import)
11. ~~Guided Bake Mode (step view + timers)~~ ✅
12. In-Bake Logging (per-step-type log widgets)
13. Live Schedule Adjustment
14. Starter Tracker (feeding log, dashboard, chart)
15. Starter Feeding Plan (schedules, reminders, bake-linked feeds)
16. Smart Schedule Planner (reverse timeline from eat time)
17. ~~Bake Journal (log, photos, history)~~ ✅
18. Loaf Troubleshooter (symptoms, diagnosis, amendments)
19. Community features (sharing, feed, profiles, challenges)
20. ~~Dark mode~~ ✅
21. ~~Deploy to Render~~ ✅
22. ~~Custom domain (breadbook.app)~~ ✅
23. PWA support
