# BreadBook

Your sourdough starter's best friend. Browse tested recipes, follow guided bakes with built-in timers, and never miss a feeding.

## What It Does

BreadBook is a sourdough lifestyle app built around the one thing that connects it all: your starter.

- **BreadBook Originals** — A curated library of 19+ tested recipes across every category: loaves, focaccia, pizza, pancakes, crackers, bagels, cinnamon rolls, and more.
- **Guided Bake Mode** — Follow your recipe step by step with countdown timers, browser notifications, screen wake lock, per-step ingredient checklists, and in-bake logging (fold tracking, rise check-ins, room temp capture).
- **BreadBook Academy** — Inline knowledge cards that explain what each step does, when to skip it, and how it interacts with other steps. Learn while you bake.
- **Bake Journal** — Log your bakes with star ratings, crumb/crust/flavor notes, photos, and reflections. Share your results as a downloadable card.
- **Starter Tracker** — Track your starter's health, feeding schedule, activity chart, and 14-day guided startup path.
- **Smart Schedule Planner** — Plan your bake backwards from when you want to eat. Handles feeding timing, room temp adjustments, and quiet hours.
- **Loaf Troubleshooter** — 20+ searchable symptoms with plain-language explanations and fixes.
- **Community** — Share bake photos, browse other bakers' recipes, and comment on the feed.
- **Guest Access** — Browse recipes and community without an account. Soft gates prompt sign-up only when needed.
- **Baker's Percentage Toggle** — View ingredients in grams or baker's percentages with one tap.
- **Dark Mode** — System, light, or dark theme toggle.

## Tech Stack

- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS v4
- **Backend/Auth:** Supabase (Postgres + Auth)
- **State:** Zustand
- **Deploy:** Render

## Local Development

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/adroach20-sketch/breadbook.git
   cd breadbook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase URL and anon key (see Supabase Setup below).

4. Start the dev server:
   ```bash
   npm run dev
   ```

### Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project named `breadbook`
2. In your project dashboard, go to **Settings > API** and copy:
   - **Project URL** → paste as `VITE_SUPABASE_URL` in `.env`
   - **anon / public key** → paste as `VITE_SUPABASE_ANON_KEY` in `.env`
3. Go to **SQL Editor** and run the migration in `supabase/migrations/001_initial_schema.sql`
4. Seed the BreadBook Originals:
   ```bash
   npm run seed
   ```

## Deployment (Render)

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variables:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Render dashboard

## Project Structure

```
breadbook/
├── public/                  # Static assets (icon)
├── src/
│   ├── components/          # Shared UI components
│   ├── data/                # Recipe data + types
│   ├── features/            # Feature-specific components
│   │   └── bake-mode/       # Guided bake mode
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Supabase client, utilities
│   ├── pages/               # Route pages
│   └── store/               # Zustand stores
├── scripts/                 # Seed script
├── supabase/migrations/     # Database schema
└── package.json
```
