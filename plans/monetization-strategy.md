# BreadBook Monetization Strategy

> Decided 2026-03-10. Result of multi-team debate (roadmap team, monetization team, baker interviews).

---

## Core Philosophy

**BreadBook is free. Everything. For everyone. Forever.**

No paywalls. No gated features. No premium tiers that split the community. No "In-App Purchases" badge in app stores. The entire app — recipes, guided bake mode, starter tracker, journal, community, Academy — is free.

Revenue comes from three sources that don't tax users:

1. Brand partnerships & affiliate revenue
2. Optional "Baker's Circle" voluntary support ($5/year)
3. Creator tip jar & digital product sales (BreadBook takes 15%)

---

## Why This Model

- **Community-first:** BreadBook is a community app, not a SaaS tool. Paywalling fragments the community and kills growth.
- **Volume over conversion:** We want lots of users, not a few paying ones. More users = more engagement = more value to brand partners.
- **No IAP stigma:** The App Store "In-App Purchases" label is a trust killer for community apps. Keeping the app 100% free removes that friction entirely.
- **Revenue scales with audience, not conversion rate.** Brand partnerships and affiliate revenue grow with eyeballs, which aligns with our growth priority.

---

## Revenue Stream 1: Brand Partnerships & Affiliate

### Target Partners

| Category | Brands | Why They'd Pay |
|---|---|---|
| Flour | King Arthur, Bob's Red Mill, Central Milling, Cairnspring Mills | Sourdough bakers buy specialty flour repeatedly. Laser-targeted audience. |
| Equipment | Lodge, Challenger Breadware, Brod & Taylor, Mockmill | High-ticket items ($50-300) that bakers research before buying. |
| Baking tools | Wiremonkey (lames), banneton makers, Danish dough whisks | Niche products with passionate buyers. |
| Starter supplies | Cultures for Health, Sourhouse | Direct match to starter tracker users. |

### Partnership Formats

**Sponsored Originals** — "BreadBook Originals, crafted with King Arthur flour." A recipe collection featuring a partner's products. Users get great, tested recipes. Brand gets targeted reach. Not ads — genuinely useful content.

**Academy Recommendations** — Contextual product mentions in educational cards. "For this step, we recommend a Challenger bread pan." Natural, helpful, not intrusive. These already exist as educational content — adding specific product recommendations is a service, not a sales pitch.

**Seasonal Campaigns** — "Rye Month, presented by Bob's Red Mill." A month of themed content. The brand sponsors the experience.

**Affiliate Links** — Recipe ingredient lists and Academy cards link to recommended products. Standard affiliate commission (typically 5-15% depending on program). This starts generating revenue the day we have traffic — zero code changes needed, just content updates.

### Revenue Potential

| Stage | Users | Est. Monthly Revenue |
|---|---|---|
| 1K active users | Early affiliate links | $50-200/mo |
| 5K active users | First brand partnership | $500-2K/mo per partner |
| 10K+ active users | Multiple partnerships + mature affiliate | $2K-5K+/mo |

### What We Need to Get There

- **Analytics / engagement data** — user counts, daily active users, popular recipes, bake completion rates. This is what we show brands.
- **Affiliate link infrastructure** — ability to embed product links in recipes and Academy cards with tracking.
- **Sponsored content framework** — a way to mark content as "presented by [brand]" that feels warm, not corporate.
- **Most importantly: USERS.** None of this works without an engaged audience. Focus on growth first.

---

## Revenue Stream 2: Baker's Circle (Voluntary Support)

### What It Is

A $5/year voluntary support tier. Think "buy BreadBook a bag of flour." No features are locked — it's a love-the-app gesture with identity perks.

### What Baker's Circle Members Get

**Identity & Expression:**
- Baker's Circle badge on profile and community posts
- Custom profile URL (`breadbook.app/@username`)
- Choose a "baker title" (displayed under name — "The Rye Whisperer," etc.)
- Custom starter avatar/icon on starter profile
- Pin best bake to top of profile
- "My Signature Bakes" curated gallery section

**Community Recognition:**
- Comments visually highlighted (like YouTube member comments)
- Recipes show a subtle Baker's Circle indicator
- Vote on next BreadBook Original recipe (monthly poll)
- Early access to new features (beta ring)

**Personal Stats & Expression:**
- Baker DNA stats page (total loaves, hydration trends, favorite flour, baking streaks)
- GitHub-style bake heatmap calendar
- Shareable year-in-review card ("Your 2026 Baking Year" — Spotify Wrapped for bakers)
- Seasonal achievement badges ("Summer Baker 2026," "100 Loaves Club")

### What Baker's Circle Is NOT

- Not a paywall. Free users get the complete app.
- Not required for any functionality.
- Not a "premium" tier. It's a supporter badge.

### Implementation

**Web-only payment** — Stripe Checkout on the website, not in-app purchase. Avoids App Store fees and IAP label.

**Supabase schema:**
```sql
ALTER TABLE profiles ADD COLUMN circle_member BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN circle_since TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN baker_title TEXT;
ALTER TABLE profiles ADD COLUMN custom_username TEXT UNIQUE;
```

**Client-side:** `useCircle()` hook for conditional rendering of badges and perks. No feature gating — purely additive UI.

### Revenue Potential

At 3-5% conversion of active users:
- 1,000 users → $150-250/year
- 5,000 users → $750-1,250/year
- 10,000 users → $1,500-2,500/year

This is not a revenue driver. It's a community identity system that happens to generate a small amount of revenue and, more importantly, **validates that users love the product.**

---

## Revenue Stream 3: Creator Tip Jar & Digital Sales

### What It Is

Creators (bakers who share recipes and content) can receive tips and sell digital products through BreadBook. BreadBook takes 15% of transactions.

### How It Works

**Tip Jar** — "Love this recipe? Buy this baker a bag of flour." Quick-tap amounts: $3, $5, $10. Appears on creator profiles and recipe pages.

**Digital Product Sales** (future) — Creators sell PDF recipe collections, video tutorials, workshop tickets. BreadBook handles payment, creator handles fulfillment.

### Implementation

Stripe Connect (Standard accounts). Each creator connects their own Stripe account. BreadBook collects payment, takes 15%, sends the rest to the creator automatically.

### When to Build This

Not yet. This requires:
1. An active creator community (people posting recipes and content)
2. Enough users that creators have an audience to sell to
3. The creator profile / portfolio features to exist

**Gate:** Don't build until there are 10+ active creators posting weekly and 2K+ active users.

---

## Founding Baker Program

All users who signed up before the monetization launch date get **"Founding Baker"** status:
- Permanent Baker's Circle membership (free forever)
- Unique "Founding Baker" badge (more prestigious than Circle badge — "I was here before it blew up")
- This is not a billing workaround — it's the origin story

**Implementation:** One SQL query on launch day:
```sql
UPDATE profiles
SET circle_member = true, circle_since = created_at
WHERE created_at < '[launch_date]';
```

**Marketing angle:** Announce 2-3 weeks before monetization launch: "Everyone here now becomes a Founding Baker — free forever. Tell your baker friends."

---

## Anti-Patterns — What We Will Never Do

| Never | Why |
|---|---|
| Lock recipes behind a paywall | Recipes are free everywhere online. Paywalling them is a losing proposition. |
| Gate Guided Bake Mode | Mid-bake paywall = uninstall. |
| Gate Starter Tracker | Daily-use tool. Feels like ransom. |
| Gate community features | Splits the community. Free users become second-class. |
| Gate Academy / educational content | Knowledge paywalls feel hostile in a hobby community. |
| Lock anyone out of their own data | Bake Journal, logs, history = their data. Always accessible. |
| Show banner ads | Kills the warm, focused baking experience. Contextual affiliate is fine; display ads are not. |

---

## Timeline

| Phase | What | Revenue Action |
|---|---|---|
| **Now** | Build the free product, grow users | None. Focus on engagement. |
| **500+ users** | Add affiliate links to recipes & Academy | Passive affiliate income begins |
| **2K+ users** | Launch Baker's Circle ($5/yr) | Community identity + small revenue |
| **5K+ users** | Pitch first brand partnership | Real revenue begins |
| **5K+ users, 10+ active creators** | Build creator tip jar | Transaction revenue begins |
| **10K+ users** | Multiple brand partners, mature affiliate | Sustainable revenue |

---

## Key Risks

1. **Not enough users to matter.** All revenue streams require scale. If growth stalls at 200 users, none of this works. Growth is the #1 priority, not monetization.
2. **Brand partnerships feel like ads.** Must be genuinely useful recommendations, not banner ads. "We tested this with King Arthur flour" is good. A King Arthur logo banner is bad.
3. **Baker's Circle conversion too low to matter.** That's fine — it's a community signal, not a revenue engine. If nobody pays $5/year, the product isn't sticky enough yet. Fix the product, not the price.
4. **Creator tools built before there are creators.** Gate: 10+ weekly active creators, 2K+ users. Don't build the marketplace before there's a market.
