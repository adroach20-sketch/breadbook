/**
 * BreadBook Seed Script
 *
 * Creates the @BreadBook system account and seeds all Original recipes.
 * Safe to re-run — checks for existing records before inserting.
 *
 * Usage:
 *   npm run seed
 *
 * Requires .env with:
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *   BREADBOOK_SEED_EMAIL
 *   BREADBOOK_SEED_PASSWORD
 */

import { createClient } from '@supabase/supabase-js'
import { breadbookOriginals } from '../src/data/originals.js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: resolve(__dirname, '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
const seedEmail = process.env.BREADBOOK_SEED_EMAIL
const seedPassword = process.env.BREADBOOK_SEED_PASSWORD

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env')
  process.exit(1)
}
if (!seedEmail || !seedPassword) {
  console.error('Missing BREADBOOK_SEED_EMAIL or BREADBOOK_SEED_PASSWORD in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seed() {
  console.log('🍞 BreadBook Seed Script\n')

  // Step 1: Create or sign in as @BreadBook account
  console.log('1. Creating @BreadBook system account...')

  let userId: string

  // Try signing in first (account may already exist from a previous run)
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: seedEmail!,
    password: seedPassword!,
  })

  if (!signInError && signInData.user) {
    console.log('   Account already exists, signed in.')
    userId = signInData.user.id
  } else {
    // Account doesn't exist, create it
    console.log('   Creating new account...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: seedEmail!,
      password: seedPassword!,
      options: {
        data: { username: 'BreadBook' },
      },
    })

    if (signUpError) {
      console.error('   Failed to create account:', signUpError.message)
      process.exit(1)
    }
    userId = signUpData.user!.id
  }

  console.log(`   ✓ @BreadBook account ready (${userId})\n`)

  // Step 2: Fetch existing recipes by title to determine insert vs update
  console.log('2. Checking for existing BreadBook Originals...')
  const { data: existingRecipes } = await supabase
    .from('recipes')
    .select('id, title')

  const existingByTitle = new Map(
    (existingRecipes || []).map((r: { id: string; title: string }) => [r.title, r.id])
  )

  // Step 3: Upsert recipes — insert new, update existing (backfills image_url and new fields)
  console.log(`3. Seeding ${breadbookOriginals.length} recipes...\n`)

  let inserted = 0
  let updated = 0

  for (const recipe of breadbookOriginals) {
    const payload = {
      user_id: userId,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      ferment_type: recipe.ferment_type,
      hydration_pct: recipe.hydration_pct,
      yield_amount: recipe.yield_amount,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      tags: recipe.tags,
      is_public: true,
      is_breadbook_original: recipe.is_breadbook_original,
      source_credit: recipe.source_credit,
      image_url: recipe.image_url ?? null,
    }

    const existingId = existingByTitle.get(recipe.title)

    if (existingId) {
      // Update existing record to backfill image_url and any other new fields
      const { error } = await supabase
        .from('recipes')
        .update(payload)
        .eq('id', existingId)
      if (error) {
        console.error(`   ✗ ${recipe.title} (update): ${error.message}`)
      } else {
        console.log(`   ↺  ${recipe.title} (updated)`)
        updated++
      }
    } else {
      const { error } = await supabase.from('recipes').insert(payload)
      if (error) {
        console.error(`   ✗ ${recipe.title}: ${error.message}`)
      } else {
        console.log(`   ✓  ${recipe.title} (inserted)`)
        inserted++
      }
    }
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}, Updated: ${updated}`)

  // Sign out
  await supabase.auth.signOut()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
