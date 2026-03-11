# Schedule Planner v2 — Consensus Plan

## Research: Baker Interviews

Interviewed 4 bakers (complete beginner, enthusiastic beginner, experienced home baker, professional/instructor) about pre-bake starter prep habits.

### Key Findings
- Almost no home baker does 2 feeds before baking (very high confidence)
- Feeding ratio controls peak timing, not number of feeds (very high confidence)
- "Recently fed" and "peak" are redundant for schedule purposes (high confidence)
- Quiet hours (no active steps 10pm-7am) is non-negotiable for home bakers (very high confidence)
- Cold proof should bridge overnight gaps (high confidence)
- Beginners need exact amounts ("feed 50g flour + 50g water"), not just "feed your starter" (high confidence)

## Decisions

### 1. Simplify to 3 Starter Statuses (was 4)
- **"Ready to go"** — starter is active and bubbly. No prep steps.
- **"Needs a feed"** — one feed, timing based on ratio. 90% of home bakers.
- **"Been in the fridge a while"** — needs discard-and-refresh + build feed. For neglected starters only.

### 2. Feed Speed Picker (progressive disclosure)
Only shown when "Needs a feed" is selected:
- **"Feed tonight, bake tomorrow"** — 1:5:5 ratio, peaks in 8-10 hours
- **"Feed now, bake today"** — 1:1:1 ratio, peaks in 4-6 hours

Temperature adjustment still applies on top.

### 3. Feed Steps Include Actual Weights
- 1:1:1 = "Feed 50g starter + 50g flour + 50g water"
- 1:2:2 = "Feed 25g starter + 50g flour + 50g water"
- 1:5:5 = "Feed 10g starter + 50g flour + 50g water"

### 4. Quiet Hours Enforcement
- Default: 10 PM – 7 AM (no active steps)
- User-configurable via toggle + time pickers
- Engine shifts steps to avoid quiet window by extending passive steps (cold proof, bulk rest)
- If impossible to honor, show warning — don't silently ignore
- For "neglected" path: first feed timed so second feed starts at quiet hours end

### 5. Academy Cards in Schedule Timeline
- Show in expanded view of ScheduleStepCard (compact variant)
- Don't clutter collapsed view
- New `starter_feed` card needed

### Deferred
- Levain as separate concept from starter feed (adds complexity beginners won't understand)
- Advanced ratio picker (let users type custom ratios)

## Implementation Order
1. Add `starter_feed` Academy card → `academy.ts`
2. Update `StarterStatus` type (3 options) + add `FeedSpeed` type → `types.ts`
3. Update schedule engine (starter prep, feed amounts, quiet hours) → `schedule-engine.ts`
4. Update ScheduleForm (3 statuses, feed speed, quiet hours UI) → `ScheduleForm.tsx`
5. Add Academy cards to ScheduleStepCard expanded view → `ScheduleStepCard.tsx`
6. Build + verify
