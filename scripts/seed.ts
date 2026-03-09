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

  // Try signing up first
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: seedEmail!,
    password: seedPassword!,
    options: {
      data: { username: 'BreadBook' },
    },
  })

  if (signUpError && signUpError.message.includes('already registered')) {
    // Account exists, sign in instead
    console.log('   Account already exists, signing in...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: seedEmail!,
      password: seedPassword!,
    })
    if (signInError) {
      console.error('   Failed to sign in:', signInError.message)
      process.exit(1)
    }
    userId = signInData.user!.id
  } else if (signUpError) {
    console.error('   Failed to create account:', signUpError.message)
    process.exit(1)
  } else {
    userId = signUpData.user!.id
  }

  console.log(`   ✓ @BreadBook account ready (${userId})\n`)

  // Step 2: Check for existing recipes
  console.log('2. Checking for existing BreadBook Originals...')
  const { data: existingRecipes } = await supabase
    .from('recipes')
    .select('id')
    .eq('is_breadbook_original', true)

  const existingIds = new Set((existingRecipes || []).map((r: { id: string }) => r.id))

  // Step 3: Insert recipes
  console.log(`3. Seeding ${breadbookOriginals.length} recipes...\n`)

  let inserted = 0
  let skipped = 0

  for (const recipe of breadbookOriginals) {
    if (existingIds.has(recipe.id)) {
      console.log(`   ⏭  ${recipe.title} (already exists)`)
      skipped++
      continue
    }

    const { error } = await supabase.from('recipes').insert({
      id: recipe.id,
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
      is_breadbook_original: true,
      source_credit: recipe.source_credit,
    })

    if (error) {
      console.error(`   ✗ ${recipe.title}: ${error.message}`)
    } else {
      console.log(`   ✓ ${recipe.title}`)
      inserted++
    }
  }

  console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`)

  // Sign out
  await supabase.auth.signOut()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
