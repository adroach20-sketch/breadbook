# BreadBook Dark Mode Palette Redesign

**Date:** 2026-03-10
**Status:** Approved — ready for implementation
**Based on:** UI audit (`plans/ui-audit.md`) + 3-round expert panel review

---

## Design Principles (Agreed by Panel)

1. **"Late-night bakery, not void of space."** Dark mode should feel warm and layered — browns, ambers, and creams on dark chocolate backgrounds. Never cold, never gray, never flat.

2. **Every token has ONE semantic role.** `dough` is surfaces and borders, never text. `wheat` is accent on dark backgrounds only, never on light surfaces. `ash` is secondary text, not a surface color.

3. **Card visibility requires border + surface lift.** Neither alone is sufficient in dark mode. Cards use a visible border (full opacity `border-dough`, no `/50` hack) AND a background distinct from the page.

4. **No opacity hacks for text.** Replace all `text-ash/50`, `text-ash/60`, `text-ash/70` with the `ash-muted` semantic token. Opacity-based text produces inconsistent colors across different backgrounds.

5. **Active states use more than color.** Navigation active states must include a non-color indicator (weight change, underline, indicator bar) for colorblind users and low-light readability.

6. **WCAG AA minimum for all functional text.** 4.5:1 for normal text, 3:1 for large text (18px+ or 14px bold). Non-text UI components (borders, icons) target 3:1 per SC 1.4.11.

7. **OLED-aware.** Avoid pure black (`#000000`) — use warm near-black (`#1C1310`) to prevent visible pixel banding on OLED screens.

---

## Final Agreed Palette

### Light Mode

| Token | Hex | Tailwind Class | Semantic Role |
|-------|-----|----------------|---------------|
| `crust` | `#8B5E3C` | `bg-crust`, `text-crust` | Primary brand / action button bg |
| `crust-light` | `#A3764E` | `bg-crust-light` | Hover state for brand |
| `crust-dark` | `#6E4A2F` | `bg-crust-dark` | Pressed state for brand |
| `crumb` | `#FBF7F0` | `bg-crumb` | Page background |
| `steam` | `#FFFFFF` | `bg-steam`, `text-steam` | Card / elevated surface / inverse text |
| `dough` | `#F5ECD7` | `bg-dough`, `border-dough` | Subtle surface, borders, badge bg |
| `char` | `#2C1A0E` | `text-char` | Primary text |
| `ash` | `#5C4033` | `text-ash` | Secondary text (descriptions, metadata) |
| `wheat` | `#D4A96A` | `text-wheat`, `bg-wheat` | Accent — ONLY on dark backgrounds (bg-char, bg-crust) or as decorative/large text |
| `ash-muted` | `#8B7B6B` | `text-ash-muted` | **NEW.** Muted/hint text, captions, small labels. Replaces all ash opacity variants |

### Dark Mode

| Token | Hex | Contrast on Crumb | Contrast on Steam | Notes |
|-------|-----|-------------------|-------------------|-------|
| `crumb` | `#1C1310` | — | — | Warm near-black. Avoids OLED banding. Warmer than audit's `#151010` |
| `steam` | `#2D2118` | ~2.0:1 | — | Card surface. Combined with border-dough, cards are clearly delineated |
| `dough` | `#3D2E22` | ~2.2:1 | ~1.3:1 | Borders and badge backgrounds. Must use at full opacity (no `/50`) |
| `char` | `#F0E6D6` | ~12.5:1 | ~10.0:1 | Primary text. Unchanged from current — excellent readability |
| `ash` | `#C8B098` | ~7.2:1 | ~5.6:1 | Secondary text. Warmer and slightly lighter than current `#B8A08A` |
| `wheat` | `#E5C080` | ~8.0:1 | ~6.2:1 | Accent. Brighter than current for dark mode visibility |
| `crust` | `#C09268` | ~5.8:1 | ~4.6:1 | Brand primary. Lighter than current `#A3764E` for button contrast |
| `crust-light` | `#D4A87C` | — | — | Hover |
| `crust-dark` | `#A3764E` | — | — | Pressed |
| `ash-muted` | `#AA9580` | ~5.2:1 | ~4.2:1 | **NEW.** Muted text. See dissenting opinion below |

### CSS Variable Block (copy-paste ready)

```css
@theme {
  --color-crust: #8B5E3C;
  --color-crust-light: #A3764E;
  --color-crust-dark: #6E4A2F;
  --color-dough: #F5ECD7;
  --color-wheat: #D4A96A;
  --color-crumb: #FBF7F0;
  --color-char: #2C1A0E;
  --color-ash: #5C4033;
  --color-steam: #FFFFFF;
  --color-ash-muted: #8B7B6B;

  /* Font families */
  --font-heading: 'Lora', Georgia, serif;
  --font-body: 'Inter', system-ui, sans-serif;
}

.dark {
  --color-crumb: #1C1310;
  --color-steam: #2D2118;
  --color-dough: #3D2E22;
  --color-char: #F0E6D6;
  --color-ash: #C8B098;
  --color-wheat: #E5C080;
  --color-crust: #C09268;
  --color-crust-light: #D4A87C;
  --color-crust-dark: #A3764E;
  --color-ash-muted: #AA9580;
}
```

---

## Semantic Role Mapping

Use this as the source of truth when choosing colors. If a use case isn't listed, ask before inventing a new pattern.

| Role | Classes | Use For |
|------|---------|---------|
| **Primary text** | `text-char` | Headings, body copy, form labels |
| **Secondary text** | `text-ash` | Descriptions, metadata, dates, helper text |
| **Muted text** | `text-ash-muted` | Hints, captions, timestamps, small non-critical labels. Never below 12px. Prefer on `bg-crumb` over `bg-steam` |
| **Primary action** | `bg-crust text-steam` | CTA buttons ("Start Bake", "Save", "Sign Up") |
| **Primary action hover** | `hover:bg-crust-light` | Button hover state |
| **Secondary action** | `bg-dough text-ash` | Filter chips, secondary buttons, badge backgrounds |
| **Card surface** | `bg-steam border border-dough rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]` | Cards, modals, panels, bottom sheets |
| **Page background** | `bg-crumb` | Page-level background. Auth pages use this, NOT bg-dough |
| **Form input** | `bg-steam border border-dough text-char` | Text inputs, textareas, selects |
| **Border** | `border-dough` | Card borders, section dividers. Always full opacity in dark mode |
| **Accent text** | `text-wheat` | ONLY on dark backgrounds (bg-char, bg-crust). Timer labels, accent highlights |
| **Active nav (desktop)** | `text-steam font-semibold` | Desktop top nav active link. NOT text-wheat |
| **Active nav (mobile)** | `text-crust font-semibold` + indicator bar | Bottom nav active item with 2px rounded indicator |
| **Inactive nav** | `text-ash` | Both desktop and mobile inactive nav items |
| **Error** | `text-red-600 dark:text-red-400` | Error messages, validation text |
| **Error banner** | `bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300` | Auth error banners |
| **Success** | `text-green-600 dark:text-green-400` | Success confirmations |
| **Warning** | `text-amber-700 dark:text-amber-300` | Warning notices |
| **Warning banner** | `bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300` | Notification permission banners etc. |
| **Health badge (good)** | `bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400` | Starter health "Thriving" |
| **Health badge (warning)** | `bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400` | Starter health "Needs attention" |
| **Health badge (critical)** | `bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400` | Starter health "Neglected" |
| **Back/cancel link** | `text-crust hover:text-crust-light` | Navigational back links, cancel actions |

---

## Implementation Plan

### Step 1: Update CSS Variables (highest leverage — fixes ~60% of dark mode issues)

**File:** `src/index.css`

Replace the entire `@theme` block and `.dark` block with the CSS from the "CSS Variable Block" section above. This single change fixes:
- Card visibility (steam-dark lifted from `#241A12` to `#2D2118`)
- Border visibility (dough-dark lifted from `#2C1F14` to `#3D2E22`)
- Secondary text readability (ash-dark bumped from `#B8A08A` to `#C8B098`)
- Brand color contrast (crust-dark bumped from `#A3764E` to `#C09268`)
- Accent visibility (wheat-dark bumped from `#D4A96A` to `#E5C080`)
- Adds `ash-muted` token for both modes

### Step 2: Remove `border-dough/50` opacity on all card borders

Change every `border-dough/50` to `border-dough` (full opacity). This is critical for dark mode card visibility.

**Files and changes:**

| File | Current | Change to |
|------|---------|-----------|
| `src/components/RecipeCard.tsx` (line 35) | `border border-dough/50` | `border border-dough` |
| `src/features/journal/BakeLogCard.tsx` (line 16) | `border border-dough/50` | `border border-dough` |
| `src/features/starter/StarterCard.tsx` (line 30) | `border border-dough/50` | `border border-dough` |
| `src/features/starter/FeedingCalendar.tsx` (line 26) | `border border-dough/50` | `border border-dough` |
| `src/features/starter/ActivityChart.tsx` (line 88) | `border border-dough/50` | `border border-dough` |
| `src/pages/StarterDetail.tsx` (lines 159, 187, 231, 282) | `border border-dough/50` | `border border-dough` |
| `src/pages/RecipeDetail.tsx` (lines 119, 124) | `border border-dough/50` | `border border-dough` |
| `src/features/community/FeedPostCard.tsx` (line 23) | `border border-dough/50` | `border border-dough` |
| `src/components/FilterPanel.tsx` (lines 175, 197) | `border border-dough/50` | `border border-dough` |

### Step 3: Add dark mode shadow to card pattern

Add `dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]` alongside existing `shadow-sm` on all card components. This provides edge definition on OLED screens.

Same files as Step 2 — anywhere you see `shadow-sm`, append the dark variant. The standard card class pattern becomes:

```
bg-steam rounded-xl shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-dough
```

### Step 4: Fix invisible `text-dough` usage (5 lines)

`dough` is a surface token, not a text token. Replace all `text-dough` instances:

| File | Line(s) | Current | Change to |
|------|---------|---------|-----------|
| `src/components/Layout.tsx` | 55 | `text-dough/70` | `text-ash` |
| `src/components/Layout.tsx` | 62 | `text-dough/70` | `text-ash` |
| `src/components/Layout.tsx` | 87 | `text-dough/70` | `text-ash` |
| `src/features/bake-mode/BakeMode.tsx` | 285 | `text-dough/70` | `text-ash` |
| `src/features/bake-mode/BakeMode.tsx` | 292 | `text-dough/70` | `text-ash-muted` |
| `src/pages/Home.tsx` | 37 | `text-dough/80` | `text-steam/80` |

Note: On `bg-crust` header surfaces, `text-ash` in dark mode resolves to `#C8B098` on crust `#C09268` — that's low contrast (~1.2:1). Instead, use `text-steam` for text on brand-colored headers. Updated fix:

| File | Line(s) | Current | Change to | Why |
|------|---------|---------|-----------|-----|
| `src/components/Layout.tsx` | 55 | `text-sm text-dough/70 hover:text-steam` | `text-sm text-steam/70 hover:text-steam` | On bg-crust, steam (dark surface color) provides contrast |
| `src/components/Layout.tsx` | 62 | `text-sm text-dough/70 hover:text-steam` | `text-sm text-steam/70 hover:text-steam` | Same |
| `src/components/Layout.tsx` | 87 | `text-sm text-dough/70 hover:text-steam` | `text-sm text-steam/70 hover:text-steam` | Same |
| `src/features/bake-mode/BakeMode.tsx` | 285 | `text-dough/70` | `text-steam/70` | Exit button on bg-crust |
| `src/features/bake-mode/BakeMode.tsx` | 292 | `text-dough/70` | `text-steam/70` | Step counter on bg-crust |
| `src/pages/Home.tsx` | 37 | `text-dough/80` | `text-steam/80` | Subtitle on bg-crust CTA card |

### Step 5: Replace opacity hacks with `text-ash-muted`

| File | Line(s) | Current | Change to |
|------|---------|---------|-----------|
| `src/features/community/ProfileEdit.tsx` | 87, 113 | `text-ash/60` | `text-ash-muted` |
| `src/pages/RecipeDetail.tsx` | 114 | `text-ash/60` | `text-ash-muted` |
| `src/features/community/FeedPostCard.tsx` | 76 | `text-ash/70` | `text-ash-muted` |
| `src/pages/StarterDetail.tsx` | 423 | `text-ash/70` | `text-ash-muted` |
| `src/components/FilterPanel.tsx` | 120 | `text-ash/60` | `text-ash-muted` |
| `src/features/community/CommentSection.tsx` | 45 | `text-ash/50` | `text-ash-muted` |
| `src/features/community/ProfileEdit.tsx` | 154 | `text-ash/60` | `text-ash-muted` |

Also update placeholder text where practical (lower priority since placeholders are WCAG-exempt):
- Search for `placeholder:text-ash/50` and replace with `placeholder:text-ash-muted`

### Step 6: Fix `text-wheat` contrast failures

Wheat fails contrast on light and medium surfaces. Restrict usage:

| File | Line(s) | Current | Change to | Rationale |
|------|---------|---------|-----------|-----------|
| `src/components/Layout.tsx` | 39-41 | `text-wheat` (active desktop nav) | `text-steam font-semibold` | Steam on crust = strong contrast + weight = clear active state |
| `src/components/Layout.tsx` | 48 | `hover:text-wheat` (theme toggle hover) | `hover:text-steam/80` | Consistent hover on crust header |
| `src/features/community/FeedPostCard.tsx` | 62 | `text-xs text-wheat` (rating) | `text-xs text-crust` | Crust has better contrast on steam |
| `src/features/bake-mode/FoldTracker.tsx` | 70 | `text-xs text-wheat` | `text-xs text-ash-muted` | On bg-crumb, wheat = 2.0:1 FAIL |
| `src/features/bake-mode/BakeMode.tsx` | 293 | `text-wheat` (room temp on bg-crust) | Keep as-is | Wheat on crust-dark works in dark mode (~1.3:1 fails... actually replace with `text-steam/80`) |

Correction for BakeMode.tsx line 293: `text-wheat` on `bg-crust` in dark mode is wheat-dark (`#E5C080`) on crust-dark (`#C09268`) = ~1.4:1. FAIL. Change to `text-steam font-medium` for guaranteed contrast.

### Step 7: Fix bottom nav active state

**File:** `src/components/Layout.tsx` (lines 101-116)

Current active state: `text-crust font-medium` — weak in dark mode.

Change the active nav item to include an indicator bar:

```tsx
<Link
  key={item.path}
  to={item.path}
  className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors relative ${
    isNavActive(item.path, location.pathname)
      ? 'text-crust font-semibold'
      : 'text-ash'
  }`}
>
  <span className="text-xl mb-0.5">{item.icon}</span>
  {item.label}
  {isNavActive(item.path, location.pathname) && (
    <span className="absolute bottom-0.5 w-4 h-0.5 bg-crust rounded-full" />
  )}
</Link>
```

This adds a 2px-tall, 16px-wide rounded pill indicator below the active nav item — visible in all modes and for colorblind users.

### Step 8: Fix auth pages (Login, SignUp, BakeComplete)

These pages use `bg-dough` as the page background, which becomes near-invisible in dark mode.

| File | Line | Current | Change to |
|------|------|---------|-----------|
| `src/pages/Login.tsx` | 33 | `min-h-screen bg-dough` | `min-h-screen bg-crumb` |
| `src/pages/Login.tsx` | 41 | `bg-steam rounded-xl` | `bg-steam rounded-xl border border-dough shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]` |
| `src/pages/Login.tsx` | 56, 69 | `bg-crumb` (input bg) | `bg-steam` (inputs use card surface) — then add `dark:bg-crumb` so inputs are slightly darker than the card in dark mode |
| `src/pages/Login.tsx` | 43 | `bg-red-50 text-red-700` | `bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300` |
| `src/pages/SignUp.tsx` | 30, 38, 53, 67, 82 | Same patterns | Same fixes |
| `src/features/bake-mode/BakeComplete.tsx` | 11 | `min-h-screen bg-dough` | `min-h-screen bg-crumb` |
| `src/features/bake-mode/BakeComplete.tsx` | 23 | `bg-wheat text-char` | `bg-wheat text-char dark:text-crumb` (dark text on accent bg in dark mode) |

### Step 9: Add dark mode variants to non-palette colors

All Tailwind utility colors (red, green, amber) need `dark:` variants:

**Error messages:**
| File | Line(s) | Current | Change to |
|------|---------|---------|-----------|
| `src/features/journal/JournalForm.tsx` | 140 | `text-red-600` | `text-red-600 dark:text-red-400` |
| `src/features/community/ProfileEdit.tsx` | 70 | `text-red-600` | `text-red-600 dark:text-red-400` |
| `src/features/starter/FeedingLogForm.tsx` | 55 | `text-red-600` | `text-red-600 dark:text-red-400` |
| `src/pages/Schedule.tsx` | 107 | `text-red-600` | `text-red-600 dark:text-red-400` |

**Success message:**
| File | Line | Current | Change to |
|------|------|---------|-----------|
| `src/features/community/ProfileEdit.tsx` | 71 | `text-green-600` | `text-green-600 dark:text-green-400` |

**Health status badges:**
| File | Change |
|------|--------|
| `src/data/types.ts` (line 171-173) | Update `healthStatusColors` config — see semantic role mapping above for exact classes |

**Warning banner:**
| File | Line(s) | Current | Change to |
|------|---------|---------|-----------|
| `src/features/starter/ReminderSettings.tsx` | 43 | `bg-amber-50` | `bg-amber-50 dark:bg-amber-950/30` |
| `src/features/starter/ReminderSettings.tsx` | 44 | `text-amber-700` | `text-amber-700 dark:text-amber-300` |

### Step 10: Fix ActivityChart hardcoded hex values

**File:** `src/features/starter/ActivityChart.tsx`

Create a `useThemeColors()` hook and use it to pass resolved hex values to Recharts:

**New file:** `src/hooks/useThemeColors.ts`

```ts
import { useEffect, useState } from 'react'
import { usePreferences } from '../store/preferences'

export function useThemeColors() {
  const { themeMode } = usePreferences()
  const [colors, setColors] = useState(getColors())

  function getColors() {
    const style = getComputedStyle(document.documentElement)
    return {
      crust: style.getPropertyValue('--color-crust').trim(),
      crumb: style.getPropertyValue('--color-crumb').trim(),
      dough: style.getPropertyValue('--color-dough').trim(),
      steam: style.getPropertyValue('--color-steam').trim(),
      char: style.getPropertyValue('--color-char').trim(),
      ash: style.getPropertyValue('--color-ash').trim(),
      wheat: style.getPropertyValue('--color-wheat').trim(),
      ashMuted: style.getPropertyValue('--color-ash-muted').trim(),
    }
  }

  useEffect(() => {
    // Re-read after theme class change settles
    const timer = setTimeout(() => setColors(getColors()), 50)
    return () => clearTimeout(timer)
  }, [themeMode])

  return colors
}
```

Then in ActivityChart.tsx, replace all hardcoded hex values:

| Line | Current | Change to |
|------|---------|-----------|
| 112 | `stroke="#F5ECD7"` | `stroke={colors.dough}` |
| 114 | `fill: '#5C4033'` | `fill: colors.ash` |
| 119 | `fill: '#5C4033'` | `fill: colors.ash` |
| 125 | `fill: '#5C4033'` | `fill: colors.ash` |
| 130 | `backgroundColor: '#FBF7F0'` | `backgroundColor: colors.crumb` |
| 131 | `border: '1px solid #F5ECD7'` | `border: \`1px solid ${colors.dough}\`` |
| 142 | `stroke="#8B5E3C"` | `stroke={colors.crust}` |
| 143 | `fill: '#8B5E3C'` | `fill: colors.crust` |
| 152 | `stroke="#D4A96A"` | `stroke={colors.wheat}` |
| 153 | `fill: '#D4A96A'` | `fill: colors.wheat` |

### Step 11: Standardize inconsistent patterns

**Back/cancel links:** Standardize to `text-crust hover:text-crust-light`
- Check: `StarterDetail.tsx` (uses `text-ash`), `RecipeDetail.tsx` (uses `text-crust`), `ScheduleTimeline.tsx` (uses `text-crust`)
- Change all to `text-crust hover:text-crust-light`

**Error text color:** Standardize to `text-red-600 dark:text-red-400`
- Login.tsx and SignUp.tsx use `text-red-700` — change to `text-red-600 dark:text-red-400`

**Remove schedule-file-only dark overrides:** The schedule files (`ScheduleForm.tsx`, `ScheduleHistory.tsx`, `ScheduleTimeline.tsx`) use explicit `dark:text-steam`, `dark:text-dough`, `dark:border-ash/30` patterns that were stopgaps. After the palette update (Step 1), these are no longer needed and may conflict. Audit each and remove explicit `dark:` overrides that duplicate what the CSS variable swap now handles correctly. Keep only dark overrides for non-palette colors (red, green, amber).

---

## Implementation Order & Effort Estimates

| Step | Description | Effort | Impact |
|------|-------------|--------|--------|
| 1 | Update CSS variables in `index.css` | 5 min | Fixes ~60% of issues automatically |
| 2 | Remove `border-dough/50` → `border-dough` | 15 min | Cards become visible |
| 3 | Add dark mode shadow to cards | 15 min | OLED edge definition |
| 4 | Fix `text-dough` usage | 10 min | Header text becomes visible |
| 5 | Replace opacity hacks with `text-ash-muted` | 10 min | Consistent muted text |
| 6 | Fix `text-wheat` contrast | 10 min | Accent text becomes readable |
| 7 | Fix bottom nav active state | 10 min | Navigation clarity |
| 8 | Fix auth pages | 15 min | First-impression dark mode |
| 9 | Add dark: variants to utility colors | 15 min | Error/success/badge visibility |
| 10 | Fix ActivityChart (+ create hook) | 30 min | Chart dark mode support |
| 11 | Standardize inconsistent patterns | 20 min | System consistency |

**Total estimated effort:** ~2.5 hours

Steps 1-7 are the critical path (~1 hour). Steps 8-11 are important polish (~1.5 hours).

---

## Dissenting Opinions

### Marcus (Accessibility) — ash-muted contrast on steam surfaces

`ash-muted` (`#AA9580`) on `steam-dark` (`#2D2118`) = ~4.2:1. This technically fails WCAG AA for normal-sized text (threshold: 4.5:1). The panel accepted this as a pragmatic compromise because:
- Pushing it lighter erodes the visual distinction between `ash-muted` and `ash`
- The token is intended for hint/caption text, not primary content
- On `bg-crumb` it achieves 5.2:1 (solid pass)

**Mitigation agreed upon:** Never use `text-ash-muted` below 12px font size. Prefer placing muted text on `bg-crumb` surfaces where possible. If muted text must appear on `bg-steam` at small sizes, consider using `text-ash` instead.

### Sarah (Visual Design) — card shadow in dark mode

Sarah initially preferred relying on border + surface lift alone without shadows, arguing that `dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]` adds visual noise. The panel overruled this based on Priya's real-world OLED testing experience. Sarah accepted but notes: if the shadow looks heavy on non-OLED screens, it can be reduced to `rgba(0,0,0,0.2)`.

### Kenji (Systems) — schedule file dark overrides

Kenji wanted to remove ALL explicit `dark:` overrides from the schedule files immediately, arguing they'll create maintenance burden as a parallel dark mode system. The panel agreed in principle but deferred this to Step 11 to avoid regressions — each override should be tested before removal.

---

## Files Changed Summary

### Modified files:
- `src/index.css` — palette update + new token
- `src/components/Layout.tsx` — nav text, active state, border
- `src/components/RecipeCard.tsx` — border, shadow
- `src/components/FilterPanel.tsx` — border, muted text
- `src/components/SearchBar.tsx` — border
- `src/features/journal/BakeLogCard.tsx` — border, shadow
- `src/features/journal/JournalForm.tsx` — error text dark variant
- `src/features/starter/StarterCard.tsx` — border, shadow
- `src/features/starter/FeedingCalendar.tsx` — border
- `src/features/starter/ActivityChart.tsx` — use theme hook, border
- `src/features/starter/FeedingLogForm.tsx` — error text dark variant
- `src/features/starter/ReminderSettings.tsx` — warning banner dark variant
- `src/features/bake-mode/BakeMode.tsx` — text-dough fix, wheat fix
- `src/features/bake-mode/BakeComplete.tsx` — bg fix, dark text on accent
- `src/features/bake-mode/FoldTracker.tsx` — wheat replacement
- `src/features/community/FeedPostCard.tsx` — border, muted text, rating color
- `src/features/community/CommentSection.tsx` — muted text
- `src/features/community/ProfileEdit.tsx` — muted text, error/success dark variants
- `src/features/community/ShareToFeedModal.tsx` — border
- `src/features/starter/QuickFeedModal.tsx` — border
- `src/pages/Home.tsx` — text-dough fix
- `src/pages/Login.tsx` — bg fix, error banner dark variant, input bg
- `src/pages/SignUp.tsx` — same as Login
- `src/pages/RecipeDetail.tsx` — border, muted text
- `src/pages/StarterDetail.tsx` — border, muted text
- `src/pages/Schedule.tsx` — error text dark variant
- `src/pages/Feed.tsx` — (badge bg, inherits from palette fix)
- `src/pages/CommunityRecipes.tsx` — (badge bg, inherits from palette fix)
- `src/pages/Recipes.tsx` — (badge bg, inherits from palette fix)
- `src/data/types.ts` — health status badge dark variants

### New files:
- `src/hooks/useThemeColors.ts` — theme-aware color hook for non-CSS contexts (charts, canvas)

### Documentation to update after implementation:
- `CLAUDE.md` — update Color Palette Quick Reference with `ash-muted`, add wheat usage restriction note
- `ROADMAP.md` — log this as a stability/polish pass in the decision log
