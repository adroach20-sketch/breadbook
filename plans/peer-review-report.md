# Peer Review Report: BreadBook v0.2 Parallel Feature Build

**Reviewer:** Lead Engineer (automated review)
**Date:** 2026-03-10
**Scope:** All uncommitted changes from 5 parallel feature teams

---

## What Was Reviewed

14 modified files and ~40 new files across 5 feature areas:

| Feature Area | Files | Team |
|---|---|---|
| **1.8-1.9: Favorites + Explore page** | Explore.tsx, SearchBar, FilterPanel, RecipeSection, FavoriteButton, RecipeCard (modified), RecipeDetail (modified), useRecipeSearch, favorites store, recipe_saves migration | Team 1 |
| **1.12: In-Bake Logging Phase 2** | BakeMode (modified), StepView (modified), DoughObservation, ShapingLog, ProofingLog, OffPlanSheet, useBakeEvents (modified) | Team 2 |
| **2.1-2.2: Starter Tracker** | StarterDashboard, StarterDetail, StarterCard, StarterForm, QuickFeedModal, FeedingCalendar, FeedingLogForm, ActivityChart, ActivitySparkline, ScheduleForm, ReminderSettings, useStarters, useStarterLogs, useStarterActivity, useStarterSchedule, useNotifications, starterNotifications store, starter_tracker migration | Team 3 |
| **2.3: Smart Schedule Planner** | Schedule page, ScheduleForm, ScheduleTimeline, ScheduleHistory, ScheduleStepCard, schedule-engine, bake_schedules migration | Team 4 |
| **3.1-3.3: Community** | Feed, CommunityRecipes, BakerProfile, ProfileEdit, FeedPostCard, CommentSection, FollowButton, LikeButton, ShareToFeedModal, useCommunity, community-types, JournalDetail (modified), community migration | Team 5 |

---

## Integration Check (Shared Files)

### App.tsx (Routes)
- **Status:** Clean. All 5 teams' routes are properly added with no duplicates.
- Routes are well-organized: public, protected-with-layout, bake-mode (full-screen), catch-all.
- `/explore` correctly redirects to `/recipes` (backward compat).
- **Issue found & fixed:** Unused `Recipes` import left behind after Explore page replaced it.

### Layout.tsx (Navigation)
- **Status:** Clean. 5 nav items: Home, Explore, Schedule, Journal, Community.
- 5 items is the max for mobile bottom nav -- this is at the limit.
- Starters page is accessible via nav but not in bottom bar (correct -- it's a sub-feature, reachable from other pages).
- Desktop nav shows Profile and Sign Out links correctly.
- `isNavActive` helper handles prefix matching properly.

### types.ts (Shared Types)
- **Status:** Clean. Types are well-organized with section headers.
- Original types (Recipe, Ingredient, RecipeStep, BakeLog) untouched.
- Starter types added with clear separator comment.
- Schedule types added with clear separator comment.
- Community types wisely placed in their own file (`community-types.ts`) to avoid bloating the shared file.
- No overwrites or conflicts.

### index.css (Animations/Utilities)
- **Status:** Clean. Additive changes only.
- Added `slide-down` animation and `scrollbar-hide` utility.
- No conflicts with existing `slide-up` animation.
- Dark mode variables are consistent.

### package.json (Dependencies)
- **Status:** Clean. One new dependency: `recharts` for starter activity charts.
- `recharts` is well-known and documented -- good choice for the ActivityChart component.
- All other deps unchanged. No version conflicts.

---

## Issues Found and Fixed

### Critical (would break at runtime)

1. **Schedule.tsx: Missing `useNavigate` import** -- `useNavigate()` was called but never imported. Build error.
   - **Fix:** Removed `useNavigate` entirely since it wasn't actually used in the component logic. The `navigate` variable was dead code.

2. **Schedule.tsx: State update during render** -- `setView('form')` was called directly inside the render switch statement when timeline had no data. This causes a React "cannot update during rendering" error.
   - **Fix:** Moved the guard into a `useEffect` so the redirect happens after render completes.

3. **App.tsx: Unused `Recipes` import** -- The old `Recipes` page import was left behind after the Explore page replaced it. TypeScript build error (`TS6133`).
   - **Fix:** Removed the unused import.

4. **StarterDetail.tsx: Unused `Starter` type import** -- Build error (`TS6196`).
   - **Fix:** Removed unused type from import statement.

5. **FeedingCalendar.tsx: Unused `wasFed` variable** -- Build error (`TS6133`). The variable was declared but the code was refactored to use `feedCount` instead.
   - **Fix:** Removed the unused variable and the dead `feedDays` Set that was only used to compute it.

### Warning (could break under certain conditions)

6. **StarterDashboard.tsx: `useMemo` used for side effects** -- `useMemo` was used to trigger an async fetch, which violates React's rules (memo callbacks must be pure). React may skip or double-execute the callback in Strict Mode or future concurrent features.
   - **Fix:** Changed to `useEffect` with a stable dependency key (`starterIds.join(',')`).

7. **Feed.tsx: Dead `document.querySelector` in EmptyFeed** -- The "Discover bakers" button used `document.querySelector('[data-tab="discover"]')` to switch tabs, but no element has a `data-tab` attribute. The button would silently do nothing.
   - **Fix:** Passed `onSwitchToDiscover` callback prop from the parent `Feed` component, which calls `setActiveTab('discover')` directly.

8. **StarterDashboard.tsx: Direct mutation of hook state** -- Line 89 does `latestLogs[quickFeedStarterId] = log`, which directly mutates an object returned by `useLatestStarterLogs`. This won't trigger a re-render, so the UI won't update after a quick feed.
   - **Status: DEFERRED.** Proper fix requires adding a setter to `useLatestStarterLogs` hook. The user will see the stale state until they navigate away and back. Low severity since the modal closes anyway.

---

## Cross-Team Pattern Consistency

### Supabase Client Import
All teams use `import { supabase } from '../lib/supabase'` (or `../../lib/supabase`). **Consistent.**

### Auth Pattern
All teams use `import { useAuth } from '../lib/auth'` and destructure `{ user }`. Auth checks are consistent: operations are guarded with `if (!user) return`. **Consistent.**

### Tailwind / Dark Mode Patterns
- All teams use the BreadBook semantic color tokens (`text-char`, `bg-crumb`, `text-ash`, `bg-crust`, `text-steam`, etc.).
- Dark mode works through CSS custom property swapping in `index.css` -- no `dark:` prefix needed on individual components. **Consistent.**
- One exception: `schedule-engine.ts` uses `dark:text-red-400` and `dark:bg-green-950/30` for category config colors. These are the only `dark:` prefixed classes in the codebase but they are valid since they are for semantic meaning (red/green status indicators) rather than theme colors. **Acceptable.**

### Empty States
All empty states have warm, BreadBook-tone messaging:
- Starter dashboard: "No starters yet. Add your first starter"
- Feed (following): "Your feed is empty. Follow some bakers..."
- Feed (discover): "No bakes shared yet. Be the first to share a bake!"
- Community recipes: "No community recipes found. Share your own..."
- Baker profile not found: "Baker not found."
- Starter not found: "Starter not found. It may have been deleted."
- Search results: "No recipes match your search"
**Consistent and on-brand.**

### Loading States
All feature areas use skeleton loaders (`animate-pulse` with `bg-dough/50`):
- Explore: `RecipeCardSkeleton` component (grid of 6)
- Starter dashboard: 2 skeleton cards
- Starter detail: stacked skeleton blocks
- Feed: 3 skeleton post cards with aspect-square photo placeholder
- Community recipes: `RecipeCardSkeleton` (grid of 4)
- Baker profile: avatar circle + text skeleton
- Schedule: delegated to sub-components
**Consistent pattern across all teams.**

### Mobile-First / Tap Targets
- All interactive buttons meet 44px minimum tap target (verified via `min-h-[44px]`, `py-3`, or equivalent padding).
- Filter chips use `min-h-[36px]` -- slightly under the 44px recommendation but acceptable for non-primary actions.
- Search bar clear button is `w-5 h-5` -- slightly small but has adequate surrounding padding.
- Bottom nav items are full-width flex with `py-2` -- good tap targets.
- Bake mode navigation buttons are full-width with `py-3` -- excellent.
**Generally good. Minor deviations are acceptable for secondary controls.**

---

## Deferred Issues (Not Fixed)

### Note (low risk, worth knowing)

1. **Bundle size: 1017 KB** -- The production bundle is over 1 MB (gzip: 284 KB). `recharts` is the main contributor. Consider lazy-loading the starter detail page (ActivityChart) and schedule pages with `React.lazy()` in a future pass.

2. **StarterDashboard quick feed state mutation** -- As noted above, the quick feed won't visually update the last-fed time on the dashboard card until navigation. Low impact.

3. **useLatestStarterLogs and useAllStarterSchedules use `starterIds.join(',')` as dependency** -- This is a common pattern but will cause unnecessary refetches if array order changes. Acceptable for the current scale.

4. **Duplicate `categoryEmojis` maps** -- The same emoji map appears in `RecipeCard.tsx`, `CommunityRecipes.tsx`, `BakerProfile.tsx`, and `StarterDetail.tsx`. Should be extracted to a shared constant. Cosmetic issue, no runtime risk.

5. **Duplicate `fermentLabels` map** -- Same situation: appears in `RecipeCard.tsx`, `CommunityRecipes.tsx`, `RecipeDetail.tsx`. Should be shared.

6. **useBakerProfile makes 7 sequential Supabase calls** -- Each call awaits the previous one. These could be parallelized with `Promise.all` for faster profile loading. Performance concern, not a bug.

7. **No RLS policies verified** -- The migrations add tables but I cannot verify that Row Level Security policies are correctly configured without access to the Supabase dashboard. This is a security concern that should be verified before shipping.

8. **`recharts` import is global** -- The entire recharts library is bundled even though only the starter detail page uses it. Would benefit from code splitting.

---

## Verdict

### NEEDS ATTENTION

**Rationale:** 5 critical build errors were found and fixed. 2 runtime bugs were found and fixed (state-update-during-render, dead querySelector). 1 data integrity issue was identified and deferred. No security vulnerabilities were found in the client code, but RLS policies need verification.

The codebase is now compiling and the fixed issues would have caused immediate failures. After these fixes, the code is architecturally sound and the 5 feature teams maintained excellent consistency across patterns, styling, auth handling, and user experience.

---

## Recommended Next Steps

1. **Verify RLS policies** on all new Supabase tables (recipe_saves, starters, starter_logs, starter_schedules, feed_posts, feed_comments, follows, recipe_likes, profiles, bake_schedules). This is the highest-priority pre-ship task.

2. **Fix StarterDashboard quick feed stale state** -- Add a setter or refetch mechanism to `useLatestStarterLogs` so the UI updates immediately after a quick feed.

3. **Extract shared constants** -- Move `categoryEmojis` and `fermentLabels` to a shared file (`src/data/display-labels.ts` or similar).

4. **Add code splitting** -- Use `React.lazy()` for Schedule, StarterDetail, and Community pages to reduce initial bundle from 1 MB to ~600 KB.

5. **Parallelize BakerProfile queries** -- Convert the 7 sequential Supabase calls in `useBakerProfile` to `Promise.all`.

6. **Commit the fixes** and these 40+ new files in a clean commit.
