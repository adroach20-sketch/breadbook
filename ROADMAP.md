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
- [x] `bake_event_logs` table with RLS (in-bake capture)
- [ ] `bake_schedules` table with RLS
- [x] Supabase Storage bucket: `breadbook-photos` (public read, authenticated upload)
- [ ] Enable Realtime on `bake_event_logs`

### 1.3 Authentication & Onboarding
- [x] Sign up / Log in / Log out
- [x] Protected routes (redirect to login)
- [x] User profile stored in `profiles` table
- [x] Welcome screen on first login: 3-step onboarding flow (Welcome → Create Starter → Pick First Recipe), `has_onboarded` on profiles table

### 1.4 BreadBook Academy (Knowledge Layer)
- [x] Academy content file (`src/data/academy.ts`) — 13 cards keyed by `academy_key` (9 Tier 1 full, 4 Tier 2 stubs)
- [x] Inline Academy card component (`src/components/AcademyCard.tsx`) — accordion expand/collapse, full + compact variants
- [x] Content per step type: what it does, when to use vs skip, tips, `showByDefault` tiering
- [x] Contextual interaction notes (e.g., "Adding lamination? Reduce stretch & fold sets from 4 to 2")
- [ ] Difficulty labels (beginner/intermediate/advanced) — deferred
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
- [x] 19 Originals seeded (v0.2.1: added High-Hydration Open Crumb, Rye & Caraway, Seeded Crust, Whole Spelt, Sandwich Loaf, Croissant Loaf, Cinnamon Swirl, Jalapeño Cheddar)
- [ ] Expand to 30+ Originals across all categories:
  - [x] Sourdough Loaves: High-Hydration Open Crumb, Whole Wheat, Rye & Caraway, Seeded Crust, Whole Spelt, Sandwich Loaf, Croissant Loaf, Cinnamon Swirl, Jalapeño Cheddar
  - [ ] Flatbreads & Baked: Pita, English Muffins, Sandwich Bread
  - [ ] Enriched: Brioche, Dinner Rolls, Cardamom Buns
  - [ ] Same-Day Discard: Waffles, Crepes, Everything Bagel Crackers, Banana Bread, Blueberry Muffins, Chocolate Chip Cookies, Tortillas, Fresh Pasta, Soft Pretzels, Scones, Quick Flatbreads
- [ ] All Originals built with Academy keys assigned, accurate timers, and baker's percentages
- [ ] `source_credit` field populated where inspired by known sources (Tartine, King Arthur, The Perfect Loaf)

### 1.8 Recipe Favorites
- [x] `recipe_saves` table (user_id + recipe_id, unique constraint, RLS)
- [x] Heart/bookmark icon on recipe cards and recipe detail page
- [x] Toggle favorite via Supabase insert/delete
- [x] "Favorites" filter tab on recipe list (alongside category tabs)
- [x] Favorites sort to top of default recipe list view
- [x] Optimistic UI (instant heart toggle, revert on error)

### 1.9 Recipe Explorer & Search
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

### 1.10 Recipe Import
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

### 1.11 Guided Bake Mode
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

### 1.12 In-Bake Logging
- [x] Log view panel (captured data for current bake)
- [x] **Stretch & Fold steps:**
  - [x] Large "Done" tap button — records timestamp
  - [x] Log of previous sets with timestamps
  - [x] Live "time since last fold" counter
- [x] **Bulk Ferment step:**
  - [x] Rise check-in button with quick-tap options: 25% / 50% / 75% / Doubled / Not sure
  - [x] Room temperature capture (one-time per bake, shown in header badge)
  - [x] Dough observation quick-taps — Feel: Tight / Springy / Slack / Sticky / Smooth / Jiggly — Smell: Mild / Yeasty / Tangy / Alcoholy
  - [x] All observations timestamped automatically
- [x] **Shaping step:**
  - [x] Log shaping method used (if different from planned)
  - [x] Dough feel at shaping: Good tension / Tore a bit / Very sticky / Couldn't build tension
- [x] **Proofing step:**
  - [x] Auto-timestamp when dough goes into fridge
  - [x] Optional poke test result: Sprang back fast / Sprang back slowly / Didn't spring back
- [x] **Off-Plan button (always visible, any step):**
  - [x] Quick options: Running late / Running early / Dough not ready / Got interrupted / Temperature changed
  - [x] Free text field for notes
  - [ ] Triggers live schedule recalculation
- [x] All log data saved to `bake_event_logs` table (localStorage primary + Supabase sync)
- [x] Log widgets are compact and secondary to step/timer — never block progress
- [x] Per-step ingredient checklists with tap-to-check UI (`ingredient_ids` on steps, `StepIngredients` component)
- [x] Inline ingredient amounts in step instruction text for all Originals

### 1.13 Live Schedule Adjustment
- [ ] When off-plan event logged or rise check-in suggests ahead/behind schedule:
  - [ ] Recalculate remaining timeline in real time
  - [ ] Display warm, reassuring message (e.g., "We've updated your schedule, you're still on track")
  - [ ] Save adjusted schedule to `bake_schedules`, preserve original for comparison

---

## Phase 2 — Bake Journal, Smart Scheduling & Troubleshooter

### 2.1 Starter Tracker
- [x] Database tables: `starters`, `starter_logs`, `starter_schedules`
- [x] **Starter Dashboard:**
  - [x] Card per starter: name, last fed (relative time), next feed due
  - [x] Estimated activity level: dormant / waking up / active / peak / past peak
  - [x] Mini sparkline of recent rise history
  - [x] Color-coded health: green (on schedule), yellow (feed soon), red (overdue)
  - [x] Quick-log button — tap to log feeding without leaving dashboard
- [x] **Feeding Log:**
  - [x] Log: water added, flour added, temperature, peak rise %, peak rise time, notes, photo
- [x] **Activity Chart:**
  - [x] Recharts line chart — rise/fall curve over last 7 days
  - [ ] Overlay multiple starters for comparison
  - [x] Notes field per log entry

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
- [x] **User inputs:**
  - [x] Target eat date & time
  - [x] Recipe to use
  - [x] Starter name (pulls from starters)
  - [x] Current starter status: active / recently fed / needs feed / dormant
  - [x] Room temperature
  - [x] Fridge available for cold proof? (yes/no)
- [x] **Reverse-engineered timeline:**
  - [x] Generates timestamps for every stage (feed starter → mix → bulk → shape → proof → bake → eat)
  - [x] Color-coded by category (starter prep, dough work, proofing, baking)
  - [ ] One-tap "Set Reminder" per step
  - [x] "Start Baking Now" button on timeline and "Start Bake" on schedule history — links to `/bake/{recipeId}`
  - [ ] Shareable as screenshot or link
  - [x] Saveable to schedule history
- [x] **Smart adjustments:**
  - [x] Room temp >75°F → shorter bulk ferment
  - [x] Dormant/cold starter → add 2 extra feeds
  - [x] No fridge → same-day proof schedule
  - [x] Warn if timeline too compressed
- [x] Database: `bake_schedules` table with `schedule_steps` jsonb

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
- [x] Database tables: `recipe_likes`, `recipe_saves`
- [ ] Mark recipes as `is_public = true` to share
- [x] Public recipe feed — browse community recipes
- [ ] Filter by category, hydration %, tags
- [ ] Search by title or ingredient
- [ ] Save/fork a community recipe (credits original baker)
- [x] Like / bookmark recipes

### 3.2 Bake Feed
- [x] Share bake log photos publicly to community feed
- [x] Minimal, warm sourdough-focused social feed
- [x] Comment on shared bakes
- [ ] Follow other bakers

### 3.3 Baker Profiles
- [x] Public profile page: avatar, bio, starter name, bake count, public recipes
- [ ] Follow / Unfollow
- [ ] "Bakes this month" counter
- [ ] Profile URL: `breadbook.app/@username`

### 3.4 Community Challenges
- [ ] Monthly BreadBook Challenge — everyone bakes the same recipe, shares results
- [ ] Admin-curated (manually set in Supabase, `challenges` table later)

---

## Phase 4 — Monetization Infrastructure

### 4.1 Affiliate & Recommendations
- [ ] Product recommendation slots in Academy cards (contextual affiliate links)
- [ ] Recommended products in recipe ingredient lists ("We tested with [Brand]")
- [ ] Affiliate link tracking (UTM params or redirect through BreadBook)

### 4.2 Baker's Circle (Voluntary Support — $5/year)
- [ ] `circle_member`, `circle_since`, `baker_title`, `custom_username` on profiles table
- [ ] Web-only Stripe Checkout (not in-app purchase)
- [ ] Baker's Circle badge on profiles and community posts
- [ ] Custom profile URL (`breadbook.app/@username`)
- [ ] Baker title (custom text under display name)
- [ ] "My Signature Bakes" curated gallery on profile
- [ ] Baker DNA stats page (total loaves, trends, streaks, heatmap calendar)
- [ ] Shareable year-in-review card
- [ ] Vote on next BreadBook Original (monthly poll)
- [ ] Early access / beta feature ring

### 4.3 Founding Baker Program
- [ ] One-time migration: all users before launch date get `circle_member = true` + Founding Baker badge
- [ ] Founding Baker badge (distinct from Circle badge)
- [ ] Announcement campaign 2-3 weeks before launch

### 4.4 Brand Partnerships
- [ ] Sponsored Originals framework ("crafted with [Brand]" recipe collections)
- [ ] Analytics dashboard (user counts, engagement, popular recipes) — for pitching partners
- [ ] Seasonal campaign support (themed content months)

### 4.5 Creator Economy (gated: 10+ active creators, 2K+ users)
- [ ] Creator tip jar ("Buy this baker a bag of flour" — $3/$5/$10)
- [ ] Stripe Connect integration (Standard accounts)
- [ ] BreadBook takes 15% of transactions
- [ ] Digital product sales (PDF recipe packs, workshop tickets) — future
- [ ] Creator audience analytics — future

---

## Infrastructure & Cross-Cutting

- [ ] Render deployment (auto-deploy on push to main)
- [x] Domain setup (`breadbook.app`)
- [ ] PWA support (add-to-homescreen, offline caching of active bake)
- [ ] ~~React Native~~ — CUT. Using Capacitor instead.
- [ ] Capacitor native shell (iOS + Android) — wraps existing React app. See `plans/mobile-app-capacitor.md`.
- [ ] Native local notifications for timers (survives background/lock screen)
- [ ] Push notifications for starter feeding reminders (via FCM/APNs)
- [ ] App Store + Play Store submission
- [ ] Apple Developer ($99/yr) + Google Play ($25 one-time) accounts

---

## Build Order (Updated 2026-03-10)

Revised after full team debate (roadmap team, monetization team, baker interviews). Organized by release, not original spec order.

### Completed ✅
- ~~Project scaffold + Tailwind + routing~~
- ~~Supabase setup + @BreadBook account~~
- ~~Auth screens + protected routes + onboarding~~
- ~~Academy knowledge base~~
- ~~Guided Bake Mode~~
- ~~In-Bake Logging (fold tracker, rise check-ins, observations, checklists)~~
- ~~Bake Journal~~
- ~~Recipe Favorites + Explorer~~
- ~~Starter Tracker~~
- ~~Smart Schedule Planner v2~~
- ~~Community MVP (feed, comments, profiles)~~
- ~~Dark mode (WCAG AA)~~
- ~~Deploy to Render + custom domain (breadbook.app)~~

### v0.3 — "The Front Door"
Goal: Convert signups into active bakers. Make the first session magical. Ship native app.

1. Connect existing flows (bake complete → journal prompt, starter status in schedule, journal → recipe link, schedule → bake mode)
2. "First Bake" guided path (beginner recipe → schedule → bake → journal → celebration)
3. Starter feeding plans (repeating schedules + reminders) — daily retention hook
4. Simple Loaf Troubleshooter (searchable symptom KB, linked from bad journal ratings)
5. Basic baking stats on profile (loaves baked, favorite recipe, streak)
6. DB migrations (expand profiles + recipes tables for v0.4 features)
7. **Capacitor shell** — wrap app as native iOS + Android, native timer notifications (see `plans/mobile-app-capacitor.md`)
8. **Parallel:** 10+ new Originals (target 25-30 total — flatbreads, enriched, discard)

### v0.4 — "Make It Yours"
Goal: Let bakers personalize. Deepen engagement.

1. Recipe Fork & Customize
2. Shareable bake results (photo share card for Instagram/link sharing)
3. Interactive Loaf Troubleshooter (decision-tree diagnostic)
4. Full filter panel + Explore tab editorial sections
5. Baking dashboard / analytics (history timeline, improvement trends)
6. **Parallel:** 5-8 more Originals (target 30+)

### v1.0 — "Ready for the World"
Goal: Polish, stability, App Store launch.

1. Modular Recipe Builder (scoped: no drag-to-reorder, use move up/down for mobile)
2. Push notifications for feeding reminders (Capacitor + Supabase Edge Function)
3. App Store + Play Store submission (icons, screenshots, privacy policy, review)
4. Auto-deploy CI/CD
5. Affiliate link infrastructure (product recommendations in Academy + recipes)
6. Community quality pass (if 50+ MAU gate met: better empty states, journal→feed bridge)

### Post-v1 — Growth & Monetization
Build order depends on user data and growth trajectory.

- Baker's Circle launch ($5/year voluntary support — web-only Stripe)
- Founding Baker migration (all pre-launch users → permanent Circle status)
- Brand partnership pitches (need analytics + engagement data)
- Recipe Import (Claude API — text paste, URL)
- Creator tip jar + Stripe Connect (gate: 10+ active creators, 2K+ users)
- Follow other bakers
- Community Challenges
- Live Schedule Adjustment
- Baker DNA stats + year-in-review cards

### Parked / Cut
- ~~React Native~~ — CUT. Capacitor wraps existing React app instead (~95% code reuse vs. 0%).
- ~~PWA-only mobile~~ — Replaced by Capacitor. iOS PWA push/timers too unreliable.
- ~~Realtime on bake_event_logs~~ — No use case until collaborative features exist.
- ~~Two-panel bake mode~~ — Power user / tablet feature. Low priority.
- ~~Starter-aware recipe suggestions~~ — Requires modeling starter readiness reliably. Simpler: show prep time on recipes.

---

## Decision Log

| Date | Decision | Context |
|---|---|---|
| 2026-03-10 | Dark mode palette redesign for WCAG AA compliance | UI audit found surface colors in dark mode had ~1.2:1 contrast ratio. Expert debate redesigned entire `.dark` CSS variable set. Added `ash-muted` semantic token. Cleaned ~50 files of redundant `dark:` overrides. See `plans/dark-mode-redesign.md` and `plans/ui-audit.md`. |
| 2026-03-10 | v0.2 feature batch: 9 features shipped | Favorites, Explorer, Starter Tracker, Schedule Planner, Community MVP, In-Bake Logging Phase 2 (dough observations, shaping/proofing, off-plan events). All built with parallel team execution + peer review. |
| 2026-03-10 | Schedule Planner v2: smarter feeding + quiet hours | Baker interviews → simplified starter status to 3 options, added ratio-aware feed timing with temp adjustment, quiet hours enforcement (extends passive steps), feed step active/passive split for overnight compatibility. Fixed nested button a11y issue, added starter_feed Academy card. See `plans/schedule-planner-v2.md`. |
| 2026-03-10 | v0.2.1: Full team review + stability pass | 5-expert team review (Engineer, UX, Baker, Security, A11y). Fixed: SECURITY DEFINER view, search_path vuln, added ErrorBoundary, Timer aria-live. Added: 8 new sourdough loaf recipes (19 total), Schedule→Bake link, onboarding flow, useBakeSession hook extraction. Supabase MCP connected for direct DB operations. |
| 2026-03-10 | Monetization strategy: free app + brand partnerships | Full team debate (roadmap, monetization, baker interviews). Decision: app is 100% free, no paywalls, no IAP. Revenue from brand partnerships/affiliate, optional Baker's Circle ($5/yr voluntary support), and creator tip jar (15% cut). React Native cut. Roadmap reordered: onboarding/retention before new features, community frozen until 50+ MAU. See `plans/monetization-strategy.md`. |
| 2026-03-10 | Mobile strategy: Capacitor (not RN, not PWA-only) | PWA timers unreliable when backgrounded on iOS. React Native = full rewrite. Capacitor wraps existing React app with ~95% code reuse, adds native local notifications (timers), push notifications (feeding reminders), and App Store/Play Store presence. Phase 1 (shell + timer notifications) targets v0.3. Push notifications + store submission targets v1.0. See `plans/mobile-app-capacitor.md`. |
