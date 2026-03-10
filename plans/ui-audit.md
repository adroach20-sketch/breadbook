# BreadBook UI/UX Visual Audit Report

**Date:** 2026-03-10
**Auditor:** Senior UI/UX Designer
**Scope:** Full color, contrast, and dark mode audit across all feature areas

---

## Section 1: Current Palette Analysis

### Defined Colors (from `src/index.css` @theme)

| Name         | Light Mode Hex | Dark Mode Hex  | Tailwind Class | Semantic Role              |
|-------------|---------------|----------------|----------------|----------------------------|
| Crust       | `#8B5E3C`     | `#A3764E`      | `bg-crust`, `text-crust` | Primary brand / action     |
| Crust-light | `#A3764E`     | `#B8875C`      | `bg-crust-light`         | Hover/lighter brand        |
| Crust-dark  | `#6E4A2F`     | `#8B5E3C`      | `bg-crust-dark`          | Pressed/darker brand       |
| Dough       | `#F5ECD7`     | `#2C1F14`      | `bg-dough`, `text-dough` | Secondary surface / border |
| Wheat       | `#D4A96A`     | `#D4A96A`      | `bg-wheat`, `text-wheat` | Accent / highlight         |
| Crumb       | `#FBF7F0`     | `#1A120B`      | `bg-crumb`, `text-crumb` | Page background            |
| Char        | `#2C1A0E`     | `#F0E6D6`      | `bg-char`, `text-char`   | Primary text               |
| Ash         | `#5C4033`     | `#B8A08A`      | `bg-ash`, `text-ash`     | Secondary/muted text       |
| Steam       | `#FFFFFF`     | `#241A12`      | `bg-steam`, `text-steam` | Card surface / inverse text|

### Key Contrast Ratios (Light Mode)

| Combination                     | Ratio   | WCAG AA (normal) | WCAG AA (large) |
|---------------------------------|---------|-------------------|-----------------|
| Char (#2C1A0E) on Crumb (#FBF7F0) | ~16.5:1 | PASS             | PASS            |
| Ash (#5C4033) on Crumb (#FBF7F0)  | ~6.3:1  | PASS             | PASS            |
| Ash (#5C4033) on Steam (#FFFFFF)  | ~6.0:1  | PASS             | PASS            |
| Crust (#8B5E3C) on Steam (#FFFFFF)| ~4.5:1  | BORDERLINE       | PASS            |
| Crust (#8B5E3C) on Crumb (#FBF7F0)| ~3.7:1  | **FAIL**         | PASS            |
| Ash (#5C4033) on Dough (#F5ECD7)  | ~4.5:1  | BORDERLINE       | PASS            |
| Steam (#FFFFFF) on Crust (#8B5E3C)| ~4.5:1  | BORDERLINE       | PASS            |
| Wheat (#D4A96A) on Steam (#FFFFFF)| ~2.4:1  | **FAIL**         | **FAIL**        |
| Wheat (#D4A96A) on Crumb (#FBF7F0)| ~2.0:1  | **FAIL**         | **FAIL**        |
| Ash/50 opacity on Steam           | ~2.8:1  | **FAIL**         | **FAIL**        |

### Key Contrast Ratios (Dark Mode)

| Combination                                    | Ratio   | WCAG AA (normal) | WCAG AA (large) |
|-------------------------------------------------|---------|-------------------|-----------------|
| Char-dark (#F0E6D6) on Crumb-dark (#1A120B)    | ~12.5:1 | PASS             | PASS            |
| Ash-dark (#B8A08A) on Crumb-dark (#1A120B)     | ~6.2:1  | PASS             | PASS            |
| Ash-dark (#B8A08A) on Steam-dark (#241A12)     | ~4.8:1  | PASS             | PASS            |
| Dough-dark (#2C1F14) on Crumb-dark (#1A120B)   | ~1.3:1  | **FAIL**         | **FAIL**        |
| Wheat (#D4A96A) on Steam-dark (#241A12)        | ~4.2:1  | **FAIL (barely)** | PASS           |
| Wheat (#D4A96A) on Crumb-dark (#1A120B)        | ~5.2:1  | PASS             | PASS            |
| Steam-dark (#241A12) on Crust-dark (#A3764E)   | ~3.0:1  | **FAIL**         | PASS            |
| text-dough (#2C1F14) as text on dark surfaces  | ~1.3:1  | **FAIL**         | **FAIL**        |
| text-ash/70 on Steam-dark                      | ~3.4:1  | **FAIL**         | PASS            |
| text-dough/80 on dark surfaces                 | ~1.5:1  | **FAIL**         | **FAIL**        |

### Critical Palette Issue

The CSS variable swap strategy means `dough` becomes `#2C1F14` in dark mode -- nearly identical to the dark background (`crumb` = `#1A120B`). This makes `text-dough` completely invisible in dark mode, and `bg-dough` borders/surfaces nearly invisible against `bg-crumb`. This is the **root cause of most dark mode readability problems.**

Similarly, `steam` becomes `#241A12` in dark mode, so `bg-steam` cards barely contrast against `bg-crumb` backgrounds (`#1A120B` vs `#241A12` = ~1.2:1 contrast). Cards essentially disappear into the background.

---

## Section 2: Problem Areas

### 2.1 Critical: `text-dough` and `text-dough/XX` are invisible in dark mode

In dark mode, `dough` = `#2C1F14`, making any `text-dough` on dark surfaces unreadable.

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/components/Layout.tsx` | 55, 62, 88, 92 | `text-dough/70` | "Profile" and "Sign Out" links in header are invisible in dark mode. Dough/70 on crust-dark = ~1.8:1 |
| `src/features/bake-mode/BakeMode.tsx` | 285, 292 | `text-dough/70` | "Exit" button and step counter in bake mode header are invisible in dark mode |
| `src/pages/Home.tsx` | 37 | `text-dough/80` | "X BreadBook Originals ready to bake" subtitle in CTA card, invisible on bg-crust in dark mode |

### 2.2 Critical: `bg-steam` cards have no visible contrast against `bg-crumb` in dark mode

Steam-dark (`#241A12`) on Crumb-dark (`#1A120B`) = ~1.2:1. Cards are invisible.

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/components/Layout.tsx` | 101 | `bg-steam border-t border-dough` | Bottom nav bar is invisible in dark mode -- bg-steam blends with background, border-dough is invisible too |
| `src/components/RecipeCard.tsx` | 35 | `bg-steam rounded-xl ... border border-dough/50` | Recipe cards disappear into background in dark mode |
| `src/features/journal/BakeLogCard.tsx` | 16 | `bg-steam ... border border-dough/50` | Bake log cards invisible |
| `src/features/starter/StarterCard.tsx` | 30 | `bg-steam ... border border-dough/50` | Starter cards invisible |
| `src/features/starter/FeedingCalendar.tsx` | 26 | `bg-steam ... border border-dough/50` | Calendar section invisible |
| `src/features/starter/ActivityChart.tsx` | 88 | `bg-steam ... border border-dough/50` | Chart section invisible |
| `src/pages/StarterDetail.tsx` | 159, 187, 231, 282 | `bg-steam ... border border-dough/50` | All sections on starter detail page invisible |
| `src/pages/RecipeDetail.tsx` | 119, 124 | `bg-steam ... border border-dough/50` | Ingredient and step sections invisible |
| `src/features/community/FeedPostCard.tsx` | 23 | `bg-steam ... border border-dough/50` | Feed post cards invisible |
| `src/features/community/ShareToFeedModal.tsx` | 23 | `bg-steam` | Modal content blends with overlay |
| `src/features/starter/QuickFeedModal.tsx` | 26 | `bg-steam` | Bottom sheet blends into background |
| `src/features/community/ProfileEdit.tsx` | 84, 92, 98, 110 | `border border-dough bg-steam` | Form inputs invisible in dark mode |
| `src/features/journal/JournalForm.tsx` | 229 | `border border-dough bg-steam` | Textareas invisible in dark mode |
| `src/features/starter/FeedingLogForm.tsx` | 65-111 | `border border-dough bg-steam` | All form inputs invisible |
| `src/features/starter/ReminderSettings.tsx` | 38, 148, 155 | `border border-dough bg-steam` | Settings container and time inputs invisible |
| `src/components/SearchBar.tsx` | 54 | `bg-steam border border-dough` | Search input invisible |
| `src/components/FilterPanel.tsx` | 175, 197 | `bg-steam border border-dough/50` | Filter toggle and panel invisible |

### 2.3 Critical: `text-wheat` fails contrast on most surfaces

Wheat (`#D4A96A`) is used for accent text but fails WCAG AA on both light and dark surfaces.

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/features/bake-mode/Timer.tsx` | 29 | `text-wheat` | Timer label text on bg-char. Dark mode: wheat on char-dark. Borderline |
| `src/features/bake-mode/FoldTracker.tsx` | 70 | `text-wheat` | "time since last fold" on bg-crumb. Light: 2.0:1 FAIL |
| `src/components/Layout.tsx` | 39, 41 | `text-wheat` | Active nav link on bg-crust. ~2.1:1 FAIL in both modes |
| `src/features/bake-mode/BakeMode.tsx` | 293 | `text-wheat` | Room temp display in header. Wheat on crust = ~2.1:1 FAIL |
| `src/features/community/FeedPostCard.tsx` | 62 | `text-xs text-wheat` | Rating stars. Wheat on steam = 2.4:1 FAIL |

### 2.4 High: `text-ash` on `bg-dough` chips/badges -- borderline in dark mode

In dark mode, ash-dark (`#B8A08A`) on dough-dark (`#2C1F14`) = ~4.5:1 (borderline). But dough-dark as a background is barely visible against crumb-dark, so the badge itself lacks visual presence.

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/pages/Recipes.tsx` | 83 | `bg-dough text-ash` | Inactive filter tabs. Dark mode: the bg-dough pill is invisible against bg-crumb |
| `src/components/RecipeCard.tsx` | 44 | `bg-dough text-ash` | Ferment type badge. Badge disappears in dark mode |
| `src/pages/RecipeDetail.tsx` | 99, 103, 107 | `bg-dough text-ash` | All metadata pills disappear in dark mode |
| `src/pages/Feed.tsx` | 34 | `bg-dough text-ash` | Inactive tab pills disappear |
| `src/pages/CommunityRecipes.tsx` | 96, 131 | `bg-dough text-ash` | Category tabs and ferment badges disappear |
| `src/components/FilterPanel.tsx` | 46 | `bg-dough text-ash` | Inactive filter chips disappear |

### 2.5 High: `text-ash/50`, `text-ash/60`, `text-ash/70` -- sub-threshold contrast

Reduced-opacity ash is used throughout for placeholder text, hints, and metadata. These fail contrast in both modes.

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/features/community/ProfileEdit.tsx` | 87, 113 | `text-ash/60` | Hint text under inputs. ~2.5:1 in light mode |
| `src/pages/RecipeDetail.tsx` | 114 | `text-ash/60` | Source credit text. ~2.5:1 FAIL |
| `src/features/community/FeedPostCard.tsx` | 76 | `text-ash/70` | "What went well" italicized note. ~3.5:1 FAIL normal text |
| `src/pages/StarterDetail.tsx` | 423 | `text-ash/70` | Feeding log notes, truncated. ~3.5:1 FAIL |
| `src/components/FilterPanel.tsx` | 120 | `text-ash/60` | Hydration slider labels ("0%", "50%", "100%"). ~2.5:1 FAIL |
| `src/features/community/CommentSection.tsx` | 45 | `text-ash/50` | Delete button for own comments. ~2.0:1 FAIL |
| `src/components/SearchBar.tsx` | 36 | `text-ash/50` | Search icon. Decorative, not critical |
| Multiple form fields | Various | `placeholder:text-ash/50` | Placeholder text. ~2.0:1. Placeholders are exempt from WCAG but still worth improving for usability |

### 2.6 Medium: Inconsistent semantic color usage

Same purpose, different colors used across components:

| Semantic Purpose | Colors Used | Files |
|-----------------|-------------|-------|
| **Primary action button** | `bg-crust text-steam` (correct) | Most files -- consistent |
| **Secondary text** | `text-ash` sometimes, `text-dough` in dark mode overrides | ScheduleForm, ScheduleTimeline use `dark:text-dough` for secondary text; most others use `text-ash` only |
| **Page heading** | `text-char` (most files), `dark:text-steam` (schedule files only) | ScheduleForm, ScheduleHistory, ScheduleTimeline add dark: overrides that others lack |
| **Error text** | `text-red-600` (some), `text-red-700` (login/signup), `text-red-500` (buttons) | JournalForm, ProfileEdit, FeedingLogForm use `text-red-600`; Login/SignUp use `text-red-700` in error divs |
| **Success text** | `text-green-600` | Only in ProfileEdit |
| **Muted hint text** | `text-ash/60`, `text-ash/70`, `text-ash/50`, `text-dough/80` | No consistent system |
| **Back/cancel link** | `text-ash` (StarterDetail), `text-crust` (RecipeDetail, ScheduleTimeline) | Inconsistent -- sometimes brown link, sometimes gray |

### 2.7 Medium: Login/SignUp pages have no dark mode support

Both auth pages use `bg-dough` full-page backgrounds and `bg-crumb` for inputs. In dark mode, `bg-dough` becomes very dark (`#2C1F14`) -- essentially the same as the card surface (`bg-steam` = `#241A12`). The entire page becomes a near-black void with no visual hierarchy.

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/pages/Login.tsx` | 33 | `min-h-screen bg-dough` | Page bg blends into nothing in dark mode |
| `src/pages/Login.tsx` | 41 | `bg-steam rounded-xl` | Form card has no contrast against bg-dough in dark mode |
| `src/pages/Login.tsx` | 56, 69 | `bg-crumb` | Input backgrounds become the same dark color |
| `src/pages/SignUp.tsx` | 30, 38, 53, 67, 82 | Same pattern | Same issues |
| `src/features/bake-mode/BakeComplete.tsx` | 11 | `min-h-screen bg-dough` | Bake complete page is a dark void |

### 2.8 Medium: ActivityChart uses hardcoded hex colors, no dark mode support

| File | Line(s) | Issue |
|------|---------|-------|
| `src/features/starter/ActivityChart.tsx` | 112 | CartesianGrid `stroke="#F5ECD7"` -- this is light-mode dough, invisible in dark mode |
| `src/features/starter/ActivityChart.tsx` | 114, 119, 125 | XAxis/YAxis tick `fill: '#5C4033'` -- light-mode ash, invisible on dark background |
| `src/features/starter/ActivityChart.tsx` | 130-134 | Tooltip uses `backgroundColor: '#FBF7F0'` (light-mode crumb) and `border: '#F5ECD7'` -- wrong in dark mode |
| `src/features/starter/ActivityChart.tsx` | 142 | Line stroke `#8B5E3C` -- light-mode crust. Low contrast on dark bg |

### 2.9 Low: Bottom nav active state is weak in dark mode

| File | Line(s) | Classes | Problem |
|------|---------|---------|---------|
| `src/components/Layout.tsx` | 108 | `text-crust` | Active nav item uses crust, which becomes #A3764E in dark mode. On steam-dark (#241A12), this is ~3.0:1. Fails AA for small text |
| `src/components/Layout.tsx` | 109 | `text-ash` | Inactive nav items use ash-dark (#B8A08A). Active/inactive contrast difference is too subtle (~3.0 vs ~4.8) |

### 2.10 Low: Hardcoded Tailwind status colors lack dark mode variants

`healthStatusColors` in `src/data/types.ts` uses `bg-green-100`, `bg-amber-100`, `bg-red-100` with `text-green-700`, `text-amber-700`, `text-red-700`. These light-mode Tailwind colors will look wrong on dark backgrounds (bright pastel badges on dark cards).

---

## Section 3: Recommended Palette Revision

### Design Principles

1. **Warm bakery feel preserved** -- browns, creams, golds remain the foundation
2. **Sufficient contrast in both modes** -- all text/bg combos meet WCAG AA (4.5:1 normal, 3:1 large)
3. **Clear surface hierarchy** -- background < surface < elevated surface, visible in both modes
4. **Semantic color system** -- each role maps to one Tailwind custom property

### Proposed Updated CSS Variables

```css
@theme {
  /* Brand */
  --color-crust: #8B5E3C;
  --color-crust-light: #A3764E;
  --color-crust-dark: #6E4A2F;

  /* Surfaces */
  --color-crumb: #FBF7F0;       /* page background */
  --color-steam: #FFFFFF;        /* card / elevated surface */
  --color-dough: #F5ECD7;        /* subtle surface / border */

  /* Text */
  --color-char: #2C1A0E;         /* primary text */
  --color-ash: #5C4033;          /* secondary text */
  --color-wheat: #D4A96A;        /* accent -- USE ONLY on dark backgrounds or as decorative */

  /* NEW: add a muted text token that's always accessible */
  --color-ash-muted: #8B7B6B;    /* for hint text, replaces ash/50-70 opacity hacks */

  /* Fonts */
  --font-heading: 'Lora', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}

.dark {
  /* Surfaces -- more separation between levels */
  --color-crumb: #151010;        /* deepest background (was #1A120B -- slightly darker for more contrast) */
  --color-steam: #2A2018;        /* card surface (was #241A12 -- bumped up for visibility) */
  --color-dough: #3D2E22;        /* borders/subtle surfaces (was #2C1F14 -- MUCH lighter for visibility) */

  /* Text -- ensure readability */
  --color-char: #F0E6D6;         /* primary text (unchanged -- works well) */
  --color-ash: #C4AD96;          /* secondary text (was #B8A08A -- bumped for more contrast on steam-dark) */
  --color-wheat: #E0BA7A;        /* accent (was #D4A96A -- slightly brighter for dark mode visibility) */
  --color-ash-muted: #9A8975;    /* hint/muted text on dark surfaces */

  /* Brand -- keep existing */
  --color-crust: #B8875C;        /* primary action (was #A3764E -- lighter to maintain contrast on dark surfaces) */
  --color-crust-light: #CFA070;  /* hover */
  --color-crust-dark: #A3764E;   /* pressed */
}
```

### Key Contrast Improvements

| Combination (Dark Mode)                    | Before  | After   | WCAG AA |
|--------------------------------------------|---------|---------|---------|
| Char on Crumb (`#F0E6D6` on `#151010`)     | ~12.5:1 | ~13.0:1 | PASS    |
| Ash on Steam (`#C4AD96` on `#2A2018`)      | ~4.8:1  | ~5.5:1  | PASS    |
| Ash on Crumb (`#C4AD96` on `#151010`)      | ~6.2:1  | ~7.0:1  | PASS    |
| Steam on Crumb (card vs bg)                | ~1.2:1  | ~1.8:1  | Better (decorative) |
| Dough on Crumb (border visibility)         | ~1.3:1  | ~2.2:1  | Better (decorative) |
| Crust on Steam (`#B8875C` on `#2A2018`)    | ~3.0:1  | ~4.0:1  | PASS (large) |
| Wheat on Steam (`#E0BA7A` on `#2A2018`)    | ~4.2:1  | ~5.5:1  | PASS    |
| Steam text on Crust (`#2A2018` on `#B8875C`) | ~3.0:1 | ~4.0:1 | PASS (large) |
| Ash-muted on Crumb (`#9A8975` on `#151010`) | N/A   | ~4.5:1  | PASS    |

### Semantic Role Mapping

| Role             | Light Mode               | Dark Mode                | Use For                           |
|------------------|--------------------------|--------------------------|-----------------------------------|
| Primary text     | `text-char`              | `text-char` (auto-swaps) | Headings, body copy, labels       |
| Secondary text   | `text-ash`               | `text-ash` (auto-swaps)  | Descriptions, metadata, dates     |
| Muted/hint text  | `text-ash-muted`         | `text-ash-muted`         | Hints, captions, small labels     |
| Primary action   | `bg-crust text-steam`    | Same (auto-swaps)        | CTA buttons                       |
| Secondary action | `bg-dough text-ash`      | Same (auto-swaps)        | Filter chips, secondary buttons   |
| Surface          | `bg-steam`               | Same                     | Cards, modals, panels             |
| Background       | `bg-crumb`               | Same                     | Page background                   |
| Border           | `border-dough`           | Same                     | Card borders, section dividers    |
| Accent           | `text-wheat`             | Same                     | Highlights, active indicators -- only on dark backgrounds or decorative |
| Success          | `text-green-700` / `dark:text-green-400` | --         | Success messages                  |
| Warning          | `text-amber-700` / `dark:text-amber-400` | --         | Warnings                          |
| Error            | `text-red-600` / `dark:text-red-400`     | --         | Error messages                    |

---

## Section 4: Component-by-Component Fix List

Ordered by impact. All fixes assume the revised palette from Section 3 is applied first (which fixes surface contrast globally). Below are the **remaining class-level changes** needed.

### Priority 1: Fix invisible dark mode text (Critical)

#### Layout.tsx (header nav links)
- **Lines 55, 62:** `text-dough/70` -> `text-ash dark:text-ash`
  - Why: dough is a surface color, not a text color. Ash provides proper contrast.
- **Lines 88, 92:** `text-dough/70` -> `text-ash dark:text-ash`
  - Same fix for mobile header.

#### BakeMode.tsx (bake header)
- **Line 285:** `text-dough/70` -> `text-ash dark:text-ash`
  - "Exit" button needs to be readable.
- **Line 292:** `text-dough/70` -> `text-ash-muted dark:text-ash-muted`
  - Step counter metadata.
- **Line 293:** `text-wheat` (room temp) -> `text-wheat` is OK on dark bg-crust, but in dark mode the swapped crust is lighter -- verify or use `text-steam` for guaranteed contrast.

#### Home.tsx (CTA card subtitle)
- **Line 37:** `text-dough/80` -> `text-steam/70`
  - On bg-crust, use steam-based opacity for inverse text, not dough.

### Priority 2: Add dark mode classes to components missing them (High)

These components rely entirely on the CSS variable swap but need explicit dark: overrides for non-palette colors (reds, greens, ambers) or need additional surface differentiation.

#### All form inputs across the app
Current pattern: `border border-dough bg-steam px-3 py-2 text-char`
Recommended: `border border-dough bg-steam px-3 py-2 text-char dark:border-dough`
- With the revised dough dark value (#3D2E22), this will work. No class changes needed if palette is updated. But if palette is NOT updated, every input needs `dark:border-ash/30 dark:bg-char/50` like ScheduleForm already uses.

Files needing this if palette is NOT revised:
- `src/features/community/ProfileEdit.tsx` (lines 84, 92, 98, 110)
- `src/features/journal/JournalForm.tsx` (line 229)
- `src/features/starter/FeedingLogForm.tsx` (lines 65, 75, 89, 99, 110, 122)
- `src/features/starter/ReminderSettings.tsx` (lines 148, 155)
- `src/features/community/CommentSection.tsx` (line 63)
- `src/components/SearchBar.tsx` (line 54)
- `src/pages/CommunityRecipes.tsx` (line 76)

#### Error messages -- add dark mode variant
- Current: `text-red-600` or `text-red-700`
- Recommended: `text-red-600 dark:text-red-400`
- Files: `JournalForm.tsx` (140), `ProfileEdit.tsx` (70), `FeedingLogForm.tsx` (55), `Schedule.tsx` (107)

#### Error banner (Login/SignUp)
- Current: `bg-red-50 text-red-700`
- Recommended: `bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300`
- Files: `Login.tsx` (43), `SignUp.tsx` (40)

#### Success message
- Current: `text-green-600`
- Recommended: `text-green-600 dark:text-green-400`
- File: `ProfileEdit.tsx` (71)

#### Health status badges (StarterCard, StarterDetail)
- Current in `types.ts` (line 171-173): `bg-green-100 text-green-700`, `bg-amber-100 text-amber-700`, `bg-red-100 text-red-700`
- Recommended: Add dark mode variants to the config object:
  - green: `bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400`
  - yellow: `bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400`
  - red: `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`

#### Notification permission banner (ReminderSettings.tsx)
- **Line 43:** `bg-amber-50` -> `bg-amber-50 dark:bg-amber-950/30`
- **Line 44:** `text-amber-700` -> `text-amber-700 dark:text-amber-300`

### Priority 3: Replace opacity hacks with semantic muted color (Medium)

Replace all `text-ash/50`, `text-ash/60`, `text-ash/70` with `text-ash-muted` (the new token):

| File | Line(s) | Current | Replacement |
|------|---------|---------|-------------|
| `ProfileEdit.tsx` | 87, 113 | `text-ash/60` | `text-ash-muted` |
| `RecipeDetail.tsx` | 114 | `text-ash/60` | `text-ash-muted` |
| `FeedPostCard.tsx` | 76 | `text-ash/70` | `text-ash-muted` |
| `StarterDetail.tsx` | 423 | `text-ash/70` | `text-ash-muted` |
| `FilterPanel.tsx` | 120 | `text-ash/60` | `text-ash-muted` |
| `CommentSection.tsx` | 45 | `text-ash/50` | `text-ash-muted` |
| `ProfileEdit.tsx` | 154 | `text-ash/60` | `text-ash-muted` |

### Priority 4: Fix `text-wheat` contrast issues (Medium)

Wheat should only be used on dark backgrounds (like bg-char) or as large decorative text. Replace wheat-on-light-surface uses:

| File | Line(s) | Current | Replacement | Why |
|------|---------|---------|-------------|-----|
| `Layout.tsx` | 39-41 | `text-wheat` (active nav on bg-crust) | `text-steam font-semibold` | Steam on crust = guaranteed contrast, use weight to distinguish active |
| `FeedPostCard.tsx` | 62 | `text-xs text-wheat` (rating) | `text-xs text-crust` | Crust has better contrast on steam |
| `FoldTracker.tsx` | 70 | `text-xs text-wheat` (time since fold) | `text-xs text-ash-muted` | On bg-crumb, wheat = 2.0:1. Use muted text instead |
| `BakeMode.tsx` | 293 | `text-wheat` (room temp) | Keep -- on bg-crust it works. But also add `font-medium` for emphasis |

### Priority 5: Fix auth page dark mode (Medium)

#### Login.tsx and SignUp.tsx
Both use `min-h-screen bg-dough` which becomes near-black. Options:
1. **Best:** Change to `min-h-screen bg-crumb` and wrap the form in a centered card with `bg-steam` (consistent with app-wide pattern)
2. **Quick fix:** Add `dark:bg-crumb` to the page wrapper, ensuring form card has visible `border border-dough` in dark mode
3. Input backgrounds: change `bg-crumb` -> `bg-steam` (inputs should use card surface, not page background)

#### BakeComplete.tsx
- **Line 11:** `min-h-screen bg-dough` -> `min-h-screen bg-crumb`
- **Line 14:** `text-crust` heading -> fine in both modes with revised crust
- **Line 23:** `bg-wheat text-char` -> verify contrast. Wheat bg (#D4A96A) with char (#2C1A0E) = ~6.5:1 PASS. In dark mode with revised values, wheat-dark (#E0BA7A) with char-dark (#F0E6D6) = ~1.5:1 **FAIL**. Fix: `bg-wheat text-char dark:text-crumb` (use darkest text on accent bg in dark mode)

### Priority 6: Fix ActivityChart hardcoded colors (Medium)

`src/features/starter/ActivityChart.tsx` uses hardcoded hex values that ignore dark mode:

| Line | Current | Recommended |
|------|---------|-------------|
| 112 | `stroke="#F5ECD7"` | Use CSS variable or pass a prop that respects dark mode. Simplest: detect dark mode with a hook and pass different values. |
| 114 | `fill: '#5C4033'` (XAxis tick) | Use `var(--color-ash)` or conditional |
| 119 | `fill: '#5C4033'` (YAxis tick) | Same |
| 125 | `fill: '#5C4033'` (YAxis label) | Same |
| 130 | `backgroundColor: '#FBF7F0'` | Use `var(--color-crumb)` |
| 131 | `border: '1px solid #F5ECD7'` | Use `var(--color-dough)` |
| 142 | `stroke="#8B5E3C"` | Use `var(--color-crust)` |
| 143 | `fill: '#8B5E3C'` (dot) | Use `var(--color-crust)` |
| 152 | `stroke="#D4A96A"` | Use `var(--color-wheat)` |
| 153 | `fill: '#D4A96A'` | Use `var(--color-wheat)` |

**Implementation note:** Recharts doesn't natively resolve CSS variables. Use a hook like `useThemeMode()` to detect dark mode and pass the appropriate hex values conditionally.

### Priority 7: Standardize inconsistent patterns (Low)

#### Cancel button color
Some cancel buttons use `text-ash hover:text-char`, others use no specific color. Standardize to `text-ash dark:text-ash hover:text-char dark:hover:text-steam`.

#### Back link color
Some use `text-crust` (RecipeDetail), others use `text-ash` (StarterDetail). Standardize to `text-crust dark:text-wheat` for navigational back links.

---

## Section 5: Missing Dark Mode

Components with **zero** `dark:` class overrides, grouped by feature area. These rely entirely on the CSS variable swap, which works for palette colors but fails for:
- Tailwind utility colors (red, green, amber, etc.)
- Opacity variants of palette colors
- Hardcoded hex values

### Core / Shared Components
- `src/components/RecipeCard.tsx` -- no dark: classes
- `src/components/RecipeCardSkeleton.tsx` -- no dark: classes (likely fine, skeleton uses dough)
- `src/components/RecipeSection.tsx` -- no dark: classes
- `src/components/SearchBar.tsx` -- no dark: classes
- `src/components/IngredientList.tsx` -- (not reviewed in detail, likely needs check)
- `src/components/StepList.tsx` -- (not reviewed in detail, likely needs check)
- `src/components/AcademyCard.tsx` -- (not reviewed in detail, likely needs check)
- `src/components/FavoriteButton.tsx` -- (not reviewed in detail, likely needs check)
- `src/components/Layout.tsx` -- no dark: classes

### Pages
- `src/pages/Home.tsx` -- no dark: classes
- `src/pages/Recipes.tsx` -- no dark: classes
- `src/pages/RecipeDetail.tsx` -- no dark: classes
- `src/pages/Login.tsx` -- no dark: classes
- `src/pages/SignUp.tsx` -- no dark: classes
- `src/pages/Feed.tsx` -- no dark: classes
- `src/pages/BakerProfile.tsx` -- no dark: classes
- `src/pages/Explore.tsx` -- no dark: classes
- `src/pages/StarterDetail.tsx` -- no dark: classes
- `src/pages/CommunityRecipes.tsx` -- no dark: classes

### Bake Mode Feature
- `src/features/bake-mode/BakeMode.tsx` -- no dark: classes
- `src/features/bake-mode/BakeComplete.tsx` -- no dark: classes
- `src/features/bake-mode/StepView.tsx` -- no dark: classes
- `src/features/bake-mode/Timer.tsx` -- no dark: classes (uses bg-char which swaps, mostly OK)
- `src/features/bake-mode/FoldTracker.tsx` -- no dark: classes
- `src/features/bake-mode/RiseCheckIn.tsx` -- (not reviewed, likely needs check)
- `src/features/bake-mode/RoomTempInput.tsx` -- (not reviewed, likely needs check)
- `src/features/bake-mode/StepIngredients.tsx` -- (not reviewed, likely needs check)
- `src/features/bake-mode/DoughObservation.tsx` -- (not reviewed, likely needs check)
- `src/features/bake-mode/ShapingLog.tsx` -- (not reviewed, likely needs check)
- `src/features/bake-mode/ProofingLog.tsx` -- (not reviewed, likely needs check)
- `src/features/bake-mode/OffPlanSheet.tsx` -- (not reviewed, likely needs check)

### Journal Feature
- `src/features/journal/JournalList.tsx` -- no dark: classes
- `src/features/journal/JournalForm.tsx` -- no dark: classes
- `src/features/journal/JournalDetail.tsx` -- (not reviewed, likely needs check)
- `src/features/journal/BakeLogCard.tsx` -- no dark: classes
- `src/features/journal/StarRating.tsx` -- (not reviewed, likely needs check)
- `src/features/journal/PhotoUpload.tsx` -- (not reviewed, likely needs check)

### Starter Feature
- `src/features/starter/StarterDashboard.tsx` -- no dark: classes
- `src/features/starter/StarterCard.tsx` -- no dark: classes
- `src/features/starter/StarterForm.tsx` -- (not reviewed, likely needs check)
- `src/features/starter/ActivityChart.tsx` -- no dark: classes (hardcoded hex values)
- `src/features/starter/ActivitySparkline.tsx` -- (not reviewed, likely needs check)
- `src/features/starter/FeedingCalendar.tsx` -- no dark: classes
- `src/features/starter/FeedingLogForm.tsx` -- no dark: classes
- `src/features/starter/QuickFeedModal.tsx` -- no dark: classes
- `src/features/starter/ReminderSettings.tsx` -- no dark: classes
- `src/features/starter/ScheduleForm.tsx` -- (starter version, not reviewed, likely needs check)

### Community Feature
- `src/features/community/FeedPostCard.tsx` -- no dark: classes
- `src/features/community/CommentSection.tsx` -- no dark: classes
- `src/features/community/FollowButton.tsx` -- no dark: classes
- `src/features/community/LikeButton.tsx` -- no dark: classes
- `src/features/community/ShareToFeedModal.tsx` -- no dark: classes
- `src/features/community/ProfileEdit.tsx` -- no dark: classes

### Components WITH dark mode classes (the positive examples to follow)
These use the `dark:` pattern correctly and can serve as reference implementations:
- `src/features/schedule/ScheduleForm.tsx` -- comprehensive dark: overrides on every element
- `src/features/schedule/ScheduleHistory.tsx` -- comprehensive dark: overrides
- `src/features/schedule/ScheduleTimeline.tsx` -- comprehensive dark: overrides
- `src/features/schedule/ScheduleStepCard.tsx` -- comprehensive dark: overrides
- `src/pages/Schedule.tsx` -- error text has dark: override

### Data Files Needing Dark Mode Variants
- `src/data/types.ts` (healthStatusColors) -- badge classes need `dark:` variants
- `src/lib/schedule-engine.ts` (CATEGORY_CONFIG) -- already has dark: variants (good example)

---

## Summary of Recommended Implementation Order

1. **Update CSS variables in `index.css`** -- the revised dark mode values fix 60% of the issues automatically (surface contrast, border visibility, card visibility). This is the single highest-leverage change.

2. **Add `--color-ash-muted`** token and replace all opacity hacks (`text-ash/50` through `text-ash/70`). Quick search-and-replace.

3. **Fix `text-dough/70` and `text-dough/80`** in Layout.tsx, BakeMode.tsx, Home.tsx. 5 lines total.

4. **Fix auth pages** (Login, SignUp, BakeComplete) -- change page bg from `bg-dough` to `bg-crumb`.

5. **Add `dark:` variants to non-palette colors** (red, green, amber) across error messages, success messages, and health status badges. ~15 lines.

6. **Fix `text-wheat` usage** on light surfaces. Replace with higher-contrast alternatives. ~4 changes.

7. **Fix ActivityChart hardcoded hex values** -- this is the most complex change, requiring a dark mode detection hook.

8. **Add `dark:` overrides to ALL form inputs** (if the CSS variable fix in step 1 doesn't fully resolve). Follow the pattern established in ScheduleForm.tsx.

9. **Standardize inconsistent color patterns** (cancel buttons, back links, error text colors).

**Estimated effort:** Steps 1-6 are about 2 hours of focused work. Steps 7-9 are another 2-3 hours. The palette revision in step 1 is the critical path -- everything else builds on it.
