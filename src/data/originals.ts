import type { Recipe } from './types'

// BreadBook Originals — curated recipes by @BreadBook
// Each recipe has accurate ingredients, baker's percentages, and timed steps.
// Baker's % is always relative to total flour weight = 100%.

export const breadbookOriginals: Recipe[] = [
  // ─────────────────────────────────────────────
  // 0. Artisan Sourdough Made Simple — Alexandra Cooks
  // ─────────────────────────────────────────────
  {
    id: 'bb-artisan-simple',
    title: 'Artisan Sourdough Made Simple',
    description:
      'The beginner-friendly classic from Alexandra Cooks. Just four ingredients, an overnight bulk ferment, and a cold proof — this no-fuss recipe is how thousands of bakers made their first loaf.',
    category: 'sourdough_loaf',
    ferment_type: 'overnight',
    hydration_pct: 75,
    yield_amount: '1 loaf',
    tags: ['beginner', 'classic', 'overnight', 'simple'],
    is_breadbook_original: false,
    source_credit: 'Alexandra Stafford / alexandracooks.com',
    ingredients: [
      { id: 'as-1', name: 'Bubbly Active Starter', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'as-2', name: 'Warm Water', amount: 375, unit: 'g', bakers_pct: 75 },
      { id: 'as-3', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'as-4', name: 'Fine Sea Salt', amount: 9, unit: 'g', bakers_pct: 1.8 },
    ],
    steps: [
      {
        id: 'as-s1', order: 1, type: 'mix', title: 'Make the Dough',
        instruction: 'Whisk 100g starter and 375g warm water together in a large bowl with a fork or spatula. Add 500g bread flour and 9g salt. Mix to combine, finishing by hand to form a rough dough. Cover with a damp towel and let rest.',
        timer_minutes: 30, timer_label: 'Rest', is_optional: false, academy_key: null, ingredient_ids: ['as-1', 'as-2', 'as-3', 'as-4'],
      },
      {
        id: 'as-s2', order: 2, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Grab a corner of the dough, stretch it up, and fold it into the center. Repeat 4–5 times around the bowl. Cover and rest 30 minutes.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'as-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Repeat the stretch and fold sequence. The dough should feel slightly tighter than before. Cover and rest. If you have time, do two more sets (4 total in 2 hours).',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'as-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Third set of stretch and folds. The dough should be noticeably smoother.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: true, academy_key: 'stretch_fold',
      },
      {
        id: 'as-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 4',
        instruction: 'Final set. The dough should feel strong and elastic. Even if you can only do one or two sets, your dough will benefit.',
        timer_minutes: null, timer_label: null, is_optional: true, academy_key: 'stretch_fold',
      },
      {
        id: 'as-s6', order: 6, type: 'bulk_ferment', title: 'Bulk Ferment (Overnight)',
        instruction: 'Cover the bowl with a towel and let rise at room temperature (70°F / 21°C) for 8–10 hours, or overnight. The dough is ready when it has increased about 50% in volume, has a few bubbles on the surface, and jiggles when you move the bowl. Use visual cues, not the clock — warmer kitchens will be faster.',
        timer_minutes: 480, timer_label: 'Bulk ferment (8 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'as-s7', order: 7, type: 'shape', title: 'Shape',
        instruction: 'Coax the dough onto a lightly floured surface. Gently shape into a round: fold the top down to the center, turn, repeat until you\'ve come full circle. Use a bench scraper to push and pull the dough to create tension.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'as-s8', order: 8, type: 'shape', title: 'Bench Rest & Final Shape',
        instruction: 'Let the dough rest seam side up for 30 minutes. Meanwhile, line an 8-inch bowl or proofing basket with a towel and dust with rice flour. Shape it again, then place seam side up in the lined bowl.',
        timer_minutes: 30, timer_label: 'Bench rest', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'as-s9', order: 9, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover the dough and refrigerate for 1 hour or up to 48 hours. A longer cold proof (24+ hours) develops better flavor and makes scoring easier.',
        timer_minutes: 60, timer_label: 'Minimum cold proof (1 hr)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'as-s10', order: 10, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Place a Dutch oven inside and preheat to 550°F (290°C). Let it get ripping hot — at least 30 minutes.',
        timer_minutes: 30, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'as-s11', order: 11, type: 'score', title: 'Score',
        instruction: 'Place parchment over the bowl and invert to release the dough. Score however you wish — a simple "X" works great. Use the parchment to transfer into the hot Dutch oven.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'as-s12', order: 12, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower the oven temperature to 450°F (230°C). Carefully cover the pot. Bake covered for 30 minutes to trap steam.',
        timer_minutes: 30, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'as-s13', order: 13, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove the lid and lower temperature to 400°F (200°C). Continue baking 10–15 minutes until deep golden brown. If needed, lift the loaf out and bake directly on the rack for the last 5 minutes.',
        timer_minutes: 15, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'as-s14', order: 14, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 1 hour before slicing. The crumb is still setting inside — patience!',
        timer_minutes: 60, timer_label: 'Cooling', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 1. Classic Country Loaf — the beginner anchor
  // ─────────────────────────────────────────────
  {
    id: 'bb-classic-country-loaf',
    title: 'Classic Country Loaf',
    description:
      'The foundational sourdough loaf. Simple, reliable, and the perfect starting point for any baker. A mild tang, open crumb, and crispy crust — this is the recipe everyone starts with.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 75,
    yield_amount: '1 loaf',
    tags: ['beginner', 'classic', 'crusty'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'ccl-1', name: 'Bread Flour', amount: 450, unit: 'g', bakers_pct: 90 },
      { id: 'ccl-2', name: 'Whole Wheat Flour', amount: 50, unit: 'g', bakers_pct: 10 },
      { id: 'ccl-3', name: 'Water', amount: 375, unit: 'g', bakers_pct: 75 },
      { id: 'ccl-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'ccl-5', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
    ],
    steps: [
      {
        id: 'ccl-s1', order: 1, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 450g bread flour and 50g whole wheat flour with 375g water in a large bowl. Mix until no dry flour remains. Cover and rest.',
        timer_minutes: 45, timer_label: 'Autolyse rest', is_optional: true, academy_key: 'autolyse', ingredient_ids: ['ccl-1', 'ccl-2', 'ccl-3'],
      },
      {
        id: 'ccl-s2', order: 2, type: 'mix', title: 'Add Starter & Salt',
        instruction: 'Add 100g active starter and 10g salt to the dough. Squeeze and fold through the dough until fully incorporated, about 3–4 minutes.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['ccl-4', 'ccl-5'],
      },
      {
        id: 'ccl-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Bulk fermentation starts now. Your first job is a set of stretch and folds. Wet your hands, grab one side of the dough, stretch it up, and fold it over to the other side. Rotate the bowl 90° and repeat 4 times (one full round). Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'ccl-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Repeat the same stretch and fold sequence. The dough should feel slightly tighter than before.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'ccl-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Third set of stretch and folds. The dough should be noticeably smoother and hold its shape better.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'ccl-s6', order: 6, type: 'stretch_fold', title: 'Stretch & Fold — Set 4',
        instruction: 'Final set. The dough should feel noticeably stronger and more elastic than when you started. You\'re done folding.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'ccl-s7', order: 7, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Hands off! Leave the dough covered at room temperature (72–78°F) for the remaining bulk time. The dough should rise 50–75% total and feel puffy, airy, and slightly domed on top. Don\'t rush this — trust the dough, not the clock.',
        timer_minutes: 180, timer_label: 'Bulk rest (3 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'ccl-s8', order: 8, type: 'shape', title: 'Pre-Shape',
        instruction: 'Gently turn the dough out onto an unfloured surface. Using a bench scraper, shape into a loose round. Let it rest 20 minutes uncovered (bench rest).',
        timer_minutes: 20, timer_label: 'Bench rest', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'ccl-s9', order: 9, type: 'shape', title: 'Final Shape',
        instruction: 'Flour your work surface lightly. Flip the dough, fold the edges toward the center, then flip seam-side down and use your hands to build tension by dragging toward you. Place seam-side up in a floured banneton.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'ccl-s10', order: 10, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover the banneton tightly and place in the fridge. Go to bed — this bakes tomorrow morning. The long, cold rest develops flavor and makes scoring much easier.',
        timer_minutes: 720, timer_label: 'Cold proof (8–14 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'ccl-s11', order: 11, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Place your Dutch oven inside and preheat to 500°F (260°C). Let it heat for at least 30 minutes.',
        timer_minutes: 30, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'ccl-s12', order: 12, type: 'score', title: 'Score',
        instruction: 'Remove dough from fridge. Turn out onto parchment paper. Score with a lame or sharp razor — a single swift slash at a 30° angle works great for beginners.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'ccl-s13', order: 13, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower dough into the hot Dutch oven. Cover with the lid. Reduce oven to 450°F (230°C). Bake covered to trap steam.',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'ccl-s14', order: 14, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove the lid. Continue baking until the crust is deep golden brown. Internal temp should reach 205–210°F (96–99°C).',
        timer_minutes: 25, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'ccl-s15', order: 15, type: 'cool', title: 'Cool',
        instruction: 'Remove from Dutch oven and cool on a wire rack. This is the hardest step — wait at least 1 hour before cutting. The crumb is still setting inside.',
        timer_minutes: 60, timer_label: 'Cooling', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 2. Whole Wheat Sourdough
  // ─────────────────────────────────────
  {
    id: 'bb-whole-wheat-sourdough',
    title: 'Whole Wheat Sourdough',
    description:
      'A hearty, nutty loaf with 50% whole wheat flour. Slightly denser than the Classic Country Loaf but packed with flavor. The autolyse is especially important here — it softens the bran and makes the dough easier to work with.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 78,
    yield_amount: '1 loaf',
    tags: ['whole wheat', 'hearty', 'intermediate'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'wws-1', name: 'Bread Flour', amount: 250, unit: 'g', bakers_pct: 50 },
      { id: 'wws-2', name: 'Whole Wheat Flour', amount: 250, unit: 'g', bakers_pct: 50 },
      { id: 'wws-3', name: 'Water', amount: 390, unit: 'g', bakers_pct: 78 },
      { id: 'wws-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'wws-5', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'wws-6', name: 'Honey', amount: 15, unit: 'g', bakers_pct: 3 },
    ],
    steps: [
      {
        id: 'wws-s1', order: 1, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 250g bread flour and 250g whole wheat flour with 390g water. Mix until no dry flour remains. Cover and rest. This longer autolyse softens the whole wheat bran.',
        timer_minutes: 60, timer_label: 'Autolyse rest', is_optional: false, academy_key: 'autolyse', ingredient_ids: ['wws-1', 'wws-2', 'wws-3'],
      },
      {
        id: 'wws-s2', order: 2, type: 'mix', title: 'Add Starter, Honey & Salt',
        instruction: 'Add 100g active starter, 15g honey, and 10g salt. Squeeze and fold through the dough until fully incorporated.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['wws-4', 'wws-5', 'wws-6'],
      },
      {
        id: 'wws-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Bulk fermentation starts now. Wet your hands and do a full round of stretch and folds — stretch one side up and over, rotate 90°, repeat 4 times. Whole wheat dough benefits from gentle handling. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'wws-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set of stretch and folds. The dough should feel slightly tighter than before.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'wws-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Third set. The dough should be smoother and hold its shape better.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'wws-s6', order: 6, type: 'stretch_fold', title: 'Stretch & Fold — Set 4',
        instruction: 'Final set. The dough should feel strong and elastic. You\'re done folding.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'wws-s7', order: 7, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Hands off! Let the dough ferment undisturbed at room temperature. Whole wheat ferments faster than white flour — watch for 50–75% rise. The dough should feel puffy and airy.',
        timer_minutes: 150, timer_label: 'Bulk rest (2.5 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'wws-s8', order: 8, type: 'shape', title: 'Pre-Shape & Final Shape',
        instruction: 'Pre-shape into a round, bench rest 20 min. Final shape and place in floured banneton seam-side up.',
        timer_minutes: 20, timer_label: 'Bench rest', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'wws-s9', order: 9, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover and refrigerate overnight. Go to bed — this bakes tomorrow morning.',
        timer_minutes: 600, timer_label: 'Cold proof (8–12 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'wws-s10', order: 10, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven with Dutch oven inside to 500°F (260°C).',
        timer_minutes: 30, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'wws-s11', order: 11, type: 'score', title: 'Score',
        instruction: 'Turn out onto parchment. Score with a simple cross or single slash.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'wws-s12', order: 12, type: 'bake', title: 'Bake — Covered',
        instruction: 'Bake covered at 450°F (230°C).',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'wws-s13', order: 13, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove lid and bake until deep brown.',
        timer_minutes: 25, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'wws-s14', order: 14, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 1 hour before slicing.',
        timer_minutes: 60, timer_label: 'Cooling', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 3. Rosemary Focaccia
  // ─────────────────────────────────────
  {
    id: 'bb-rosemary-focaccia',
    title: 'Rosemary Focaccia',
    description:
      'Pillowy, olive-oil-rich focaccia with crispy edges and fragrant rosemary. High hydration makes it light and airy. One of the most forgiving sourdough recipes — nearly impossible to mess up.',
    category: 'focaccia',
    ferment_type: 'long_ferment',
    hydration_pct: 80,
    yield_amount: '1 sheet pan',
    tags: ['beginner', 'crowd pleaser', 'olive oil'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'rf-1', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'rf-2', name: 'Water', amount: 400, unit: 'g', bakers_pct: 80 },
      { id: 'rf-3', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'rf-4', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'rf-5', name: 'Olive Oil', amount: 60, unit: 'ml', bakers_pct: 12 },
      { id: 'rf-6', name: 'Fresh Rosemary', amount: 3, unit: 'tbsp', bakers_pct: 0 },
      { id: 'rf-7', name: 'Flaky Salt (topping)', amount: 5, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'rf-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 500g bread flour, 400g water, 100g active starter, and 10g salt. Mix until a shaggy dough forms. Drizzle in 2 tablespoons of olive oil and incorporate.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['rf-1', 'rf-2', 'rf-3', 'rf-4', 'rf-5'],
      },
      {
        id: 'rf-s2', order: 2, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Bulk fermentation starts now. Wet your hands and do a full round of stretch and folds — stretch one side up and over, rotate 90°, repeat 4 times. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'rf-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough should feel smoother and more elastic.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'rf-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Final set. The dough should be noticeably stronger and hold together well. You\'re done folding.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'rf-s5', order: 5, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Cover and let the dough rise undisturbed at room temperature until doubled and bubbly.',
        timer_minutes: 210, timer_label: 'Bulk rest (3–4 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'rf-s6', order: 6, type: 'custom', title: 'Oil the Pan & First Stretch',
        instruction: 'Pour the remaining olive oil (about 3 tablespoons) into a sheet pan (9x13 or quarter sheet). Gently turn the dough into the pan. Stretch it toward the edges — it\'s OK if it doesn\'t reach all the way. Cover and let it rest.',
        timer_minutes: 30, timer_label: 'Pan rest', is_optional: false, academy_key: null,
      },
      {
        id: 'rf-s7', order: 7, type: 'custom', title: 'Second Stretch',
        instruction: 'The dough has relaxed and should stretch easily now. Gently pull it to fill the pan completely.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
      {
        id: 'rf-s8', order: 8, type: 'proof', title: 'Final Proof',
        instruction: 'Cover and let proof in the pan until puffy and jiggly, about 45 minutes.',
        timer_minutes: 45, timer_label: 'Final proof', is_optional: false, academy_key: 'proof',
      },
      {
        id: 'rf-s9', order: 9, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 425°F (220°C).',
        timer_minutes: 20, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'rf-s10', order: 10, type: 'custom', title: 'Dimple & Top',
        instruction: 'Oil your fingers and press deep dimples all over the dough. Scatter 3 tbsp fresh rosemary and 5g flaky salt across the top. Drizzle with a bit more olive oil.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['rf-6', 'rf-7'],
      },
      {
        id: 'rf-s11', order: 11, type: 'bake', title: 'Bake',
        instruction: 'Bake until golden brown on top and crispy on the bottom.',
        timer_minutes: 25, timer_label: 'Bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'rf-s12', order: 12, type: 'cool', title: 'Cool',
        instruction: 'Let cool in the pan for 5 minutes, then transfer to a wire rack. Best eaten warm.',
        timer_minutes: 5, timer_label: 'Cool in pan', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 4. Sourdough Pizza Dough (Overnight)
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-pizza-dough',
    title: 'Sourdough Pizza Dough',
    description:
      'Chewy, flavorful pizza dough with an overnight cold ferment. Makes 4 individual pizzas. The slow ferment develops complex flavor that instant yeast can\'t match.',
    category: 'pizza',
    ferment_type: 'overnight',
    hydration_pct: 68,
    yield_amount: '4 pizzas',
    tags: ['pizza night', 'overnight', 'family favorite'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'spd-1', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'spd-2', name: 'Water', amount: 340, unit: 'g', bakers_pct: 68 },
      { id: 'spd-3', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'spd-4', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'spd-5', name: 'Olive Oil', amount: 15, unit: 'ml', bakers_pct: 3 },
    ],
    steps: [
      {
        id: 'spd-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 500g bread flour, 340g water, 100g active starter, 10g salt, and 15ml olive oil. Mix until a smooth dough forms. Knead briefly on the counter, about 3 minutes.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['spd-1', 'spd-2', 'spd-3', 'spd-4', 'spd-5'],
      },
      {
        id: 'spd-s2', order: 2, type: 'bulk_ferment', title: 'Room Temp Rise',
        instruction: 'Cover and let rise at room temperature for 2 hours.',
        timer_minutes: 120, timer_label: 'Room temp rise', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'spd-s3', order: 3, type: 'shape', title: 'Divide & Ball',
        instruction: 'Turn dough onto a lightly floured surface. Divide into 4 equal pieces (~240g each). Shape each into a tight ball. Place in an oiled container or on a tray.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'spd-s4', order: 4, type: 'cold_proof', title: 'Cold Ferment',
        instruction: 'Cover and refrigerate overnight (12–24 hours). The longer the ferment, the more flavor.',
        timer_minutes: 720, timer_label: 'Cold ferment (12–24 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'spd-s5', order: 5, type: 'custom', title: 'Warm Up',
        instruction: 'Remove dough balls from the fridge 1–2 hours before you want to bake. Let them come to room temperature.',
        timer_minutes: 90, timer_label: 'Warm up', is_optional: false, academy_key: null,
      },
      {
        id: 'spd-s6', order: 6, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat your oven as hot as it goes (500–550°F / 260–290°C) with a pizza stone or steel inside.',
        timer_minutes: 45, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'spd-s7', order: 7, type: 'shape', title: 'Stretch & Top',
        instruction: 'On a floured surface, gently press and stretch each dough ball into a round, working from the center outward. Don\'t use a rolling pin — your hands keep the air bubbles. Transfer to parchment or a floured peel and add toppings.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
      {
        id: 'spd-s8', order: 8, type: 'bake', title: 'Bake',
        instruction: 'Slide pizza onto the stone/steel. Bake until the crust is puffed and charred in spots. Repeat for each pizza — stretch, top, and bake one at a time.',
        timer_minutes: 8, timer_label: 'Per pizza', is_optional: false, academy_key: 'bake',
      },
    ],
  },

  // ─────────────────────────────────────
  // 5. Sourdough Pancakes — the gateway
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-pancakes',
    title: 'Sourdough Pancakes',
    description:
      'The ultimate discard recipe. Fluffy, tangy pancakes that use up your unfed starter. Ready in 20 minutes — no overnight rest, no planning. The recipe that converts discard skeptics.',
    category: 'pancakes_waffles',
    ferment_type: 'same_day_discard',
    hydration_pct: 100,
    yield_amount: '8–10 pancakes',
    tags: ['discard', 'quick', 'breakfast', 'beginner', 'gateway'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'sp-1', name: 'Sourdough Discard', amount: 200, unit: 'g', bakers_pct: 0 },
      { id: 'sp-2', name: 'All-Purpose Flour', amount: 100, unit: 'g', bakers_pct: 100 },
      { id: 'sp-3', name: 'Egg', amount: 1, unit: 'large', bakers_pct: 0 },
      { id: 'sp-4', name: 'Milk', amount: 60, unit: 'ml', bakers_pct: 0 },
      { id: 'sp-5', name: 'Sugar', amount: 20, unit: 'g', bakers_pct: 20 },
      { id: 'sp-6', name: 'Baking Soda', amount: 3, unit: 'g', bakers_pct: 0 },
      { id: 'sp-7', name: 'Butter (melted)', amount: 30, unit: 'g', bakers_pct: 30 },
      { id: 'sp-8', name: 'Vanilla Extract', amount: 5, unit: 'ml', bakers_pct: 0 },
      { id: 'sp-9', name: 'Salt', amount: 2, unit: 'g', bakers_pct: 2 },
    ],
    steps: [
      {
        id: 'sp-s1', order: 1, type: 'mix', title: 'Mix Wet Ingredients',
        instruction: 'In a large bowl, whisk together 200g sourdough discard, 1 egg, 60ml milk, 30g melted butter, 20g sugar, and 5ml vanilla.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sp-1', 'sp-3', 'sp-4', 'sp-5', 'sp-7', 'sp-8'],
      },
      {
        id: 'sp-s2', order: 2, type: 'mix', title: 'Add Dry Ingredients',
        instruction: 'Add 100g flour, 3g baking soda, and 2g salt. Stir gently until just combined — lumps are OK! Overmixing makes pancakes tough.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sp-2', 'sp-6', 'sp-9'],
      },
      {
        id: 'sp-s3', order: 3, type: 'custom', title: 'Heat Griddle',
        instruction: 'Heat a griddle or non-stick pan over medium heat. Add a small pat of butter.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
      {
        id: 'sp-s4', order: 4, type: 'bake', title: 'Cook Pancakes',
        instruction: 'Pour ~¼ cup batter per pancake. Cook until bubbles form on the surface and edges look set, then flip. Cook another 1–2 minutes until golden. Repeat for all pancakes before moving on.',
        timer_minutes: 3, timer_label: 'Per pancake (first side)', is_optional: false, academy_key: null,
      },
      {
        id: 'sp-s5', order: 5, type: 'custom', title: 'Serve',
        instruction: 'Serve warm with butter, maple syrup, fresh fruit, or whatever makes you happy.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 6. Sourdough Crackers
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-crackers',
    title: 'Sourdough Crackers',
    description:
      'Thin, crispy, addictive crackers made from sourdough discard. Customize with any seasoning you like — everything bagel, rosemary, sesame, or just sea salt. Perfect with cheese or hummus.',
    category: 'crackers',
    ferment_type: 'same_day_discard',
    hydration_pct: 100,
    yield_amount: '~40 crackers',
    tags: ['discard', 'snack', 'quick', 'customizable'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'sc-1', name: 'Sourdough Discard', amount: 200, unit: 'g', bakers_pct: 0 },
      { id: 'sc-2', name: 'Olive Oil', amount: 30, unit: 'ml', bakers_pct: 0 },
      { id: 'sc-3', name: 'Salt', amount: 3, unit: 'g', bakers_pct: 0 },
      { id: 'sc-4', name: 'Everything Bagel Seasoning (or your choice)', amount: 10, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'sc-s1', order: 1, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 350°F (175°C). Line a baking sheet with parchment paper.',
        timer_minutes: 10, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'sc-s2', order: 2, type: 'mix', title: 'Mix',
        instruction: 'Combine 200g sourdough discard, 30ml olive oil, and 3g salt. Stir until smooth.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sc-1', 'sc-2', 'sc-3'],
      },
      {
        id: 'sc-s3', order: 3, type: 'shape', title: 'Roll Thin',
        instruction: 'Pour onto the parchment-lined baking sheet. Use an offset spatula or the back of a spoon to spread as thin as possible — thinner = crispier.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
      {
        id: 'sc-s4', order: 4, type: 'custom', title: 'Season',
        instruction: 'Sprinkle 10g of your chosen seasoning evenly across the top. Press gently so it sticks.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sc-4'],
      },
      {
        id: 'sc-s5', order: 5, type: 'bake', title: 'Bake',
        instruction: 'Bake until golden and crispy. Rotate the pan halfway through. Edges will crisp first — you can remove the outer pieces early if needed.',
        timer_minutes: 25, timer_label: 'Bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'sc-s6', order: 6, type: 'cool', title: 'Cool & Break',
        instruction: 'Let cool completely on the pan — they crisp up more as they cool. Break into irregular pieces. Store in an airtight container.',
        timer_minutes: 15, timer_label: 'Cooling', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 7. Sourdough Banana Bread
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-banana-bread',
    title: 'Sourdough Banana Bread',
    description:
      'Moist, tender banana bread with a subtle sourdough tang. Uses discard starter and overripe bananas — two things you probably already have. Optional chocolate chips for the indulgent version.',
    category: 'quick_bread',
    ferment_type: 'same_day_discard',
    hydration_pct: 100,
    yield_amount: '1 loaf',
    tags: ['discard', 'quick bread', 'sweet', 'beginner'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'sbb-1', name: 'Ripe Bananas', amount: 3, unit: 'large', bakers_pct: 0 },
      { id: 'sbb-2', name: 'Sourdough Discard', amount: 120, unit: 'g', bakers_pct: 0 },
      { id: 'sbb-3', name: 'All-Purpose Flour', amount: 200, unit: 'g', bakers_pct: 100 },
      { id: 'sbb-4', name: 'Sugar', amount: 130, unit: 'g', bakers_pct: 65 },
      { id: 'sbb-5', name: 'Butter (melted)', amount: 75, unit: 'g', bakers_pct: 38 },
      { id: 'sbb-6', name: 'Egg', amount: 1, unit: 'large', bakers_pct: 0 },
      { id: 'sbb-7', name: 'Baking Soda', amount: 5, unit: 'g', bakers_pct: 0 },
      { id: 'sbb-8', name: 'Salt', amount: 3, unit: 'g', bakers_pct: 0 },
      { id: 'sbb-9', name: 'Vanilla Extract', amount: 5, unit: 'ml', bakers_pct: 0 },
      { id: 'sbb-10', name: 'Chocolate Chips (optional)', amount: 100, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'sbb-s1', order: 1, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 350°F (175°C). Grease a 9x5 loaf pan or line with parchment.',
        timer_minutes: 10, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'sbb-s2', order: 2, type: 'mix', title: 'Mash & Mix Wet',
        instruction: 'Mash 3 ripe bananas in a large bowl. Add 75g melted butter, 1 egg, 120g sourdough discard, 130g sugar, and 5ml vanilla. Mix well.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sbb-1', 'sbb-2', 'sbb-4', 'sbb-5', 'sbb-6', 'sbb-9'],
      },
      {
        id: 'sbb-s3', order: 3, type: 'mix', title: 'Add Dry & Fold',
        instruction: 'Add 200g flour, 5g baking soda, and 3g salt. Fold gently until just combined. Fold in 100g chocolate chips if using.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sbb-3', 'sbb-7', 'sbb-8', 'sbb-10'],
      },
      {
        id: 'sbb-s4', order: 4, type: 'bake', title: 'Bake',
        instruction: 'Pour batter into prepared pan. Bake until a toothpick inserted in the center comes out clean.',
        timer_minutes: 55, timer_label: 'Bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'sbb-s5', order: 5, type: 'cool', title: 'Cool',
        instruction: 'Let cool in the pan for 10 minutes, then turn out onto a wire rack. Slice when cool enough to handle.',
        timer_minutes: 10, timer_label: 'Cool in pan', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 8. Sourdough Tortillas
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-tortillas',
    title: 'Sourdough Tortillas',
    description:
      'Soft, pliable flour tortillas with sourdough tang. Made with discard, so no planning needed. Once you make homemade tortillas, you won\'t go back to store-bought.',
    category: 'flatbread',
    ferment_type: 'same_day_discard',
    hydration_pct: 100,
    yield_amount: '8 tortillas',
    tags: ['discard', 'flatbread', 'quick', 'family favorite'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'st-1', name: 'Sourdough Discard', amount: 150, unit: 'g', bakers_pct: 0 },
      { id: 'st-2', name: 'All-Purpose Flour', amount: 200, unit: 'g', bakers_pct: 100 },
      { id: 'st-3', name: 'Olive Oil (or lard)', amount: 30, unit: 'ml', bakers_pct: 15 },
      { id: 'st-4', name: 'Salt', amount: 4, unit: 'g', bakers_pct: 2 },
      { id: 'st-5', name: 'Warm Water', amount: 30, unit: 'ml', bakers_pct: 15 },
    ],
    steps: [
      {
        id: 'st-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 200g flour and 4g salt. Add 150g sourdough discard, 30ml olive oil, and 30ml warm water. Mix until a smooth dough forms. Knead briefly on the counter, about 2 minutes.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['st-1', 'st-2', 'st-3', 'st-4', 'st-5'],
      },
      {
        id: 'st-s2', order: 2, type: 'custom', title: 'Rest',
        instruction: 'Cover the dough and let it rest for 30 minutes. This relaxes the gluten and makes rolling easier.',
        timer_minutes: 30, timer_label: 'Dough rest', is_optional: false, academy_key: null,
      },
      {
        id: 'st-s3', order: 3, type: 'shape', title: 'Divide & Roll',
        instruction: 'Divide dough into 8 equal pieces. Roll each into a ball, then roll out on a lightly floured surface as thin as you can — about 7–8 inches across.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
      {
        id: 'st-s4', order: 4, type: 'bake', title: 'Cook',
        instruction: 'Heat a dry cast iron skillet or griddle over medium-high heat. Cook each tortilla about 45 seconds per side — you want brown spots and puffing. Cook all 8 tortillas, stacking them in a clean towel to keep warm as you go.',
        timer_minutes: 1, timer_label: 'Per tortilla', is_optional: false, academy_key: null,
      },
    ],
  },

  // ─────────────────────────────────────
  // 9. Sourdough Cinnamon Rolls
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-cinnamon-rolls',
    title: 'Sourdough Cinnamon Rolls',
    description:
      'Soft, pillowy cinnamon rolls with an overnight sourdough rise. The slow ferment adds depth to the buttery, cinnamon-sugar filling. Topped with cream cheese frosting. A weekend project that\'s absolutely worth it.',
    category: 'enriched',
    ferment_type: 'overnight',
    hydration_pct: 55,
    yield_amount: '12 rolls',
    tags: ['enriched', 'weekend project', 'sweet', 'impressive'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'scr-1', name: 'All-Purpose Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'scr-2', name: 'Whole Milk (warm)', amount: 180, unit: 'ml', bakers_pct: 36 },
      { id: 'scr-3', name: 'Sourdough Starter (active)', amount: 150, unit: 'g', bakers_pct: 30 },
      { id: 'scr-4', name: 'Butter (softened)', amount: 75, unit: 'g', bakers_pct: 15 },
      { id: 'scr-5', name: 'Sugar', amount: 65, unit: 'g', bakers_pct: 13 },
      { id: 'scr-6', name: 'Eggs', amount: 2, unit: 'large', bakers_pct: 0 },
      { id: 'scr-7', name: 'Salt', amount: 7, unit: 'g', bakers_pct: 1.4 },
      // Filling
      { id: 'scr-8', name: 'Butter (softened, filling)', amount: 60, unit: 'g', bakers_pct: 0 },
      { id: 'scr-9', name: 'Brown Sugar', amount: 150, unit: 'g', bakers_pct: 0 },
      { id: 'scr-10', name: 'Cinnamon', amount: 15, unit: 'g', bakers_pct: 0 },
      // Frosting
      { id: 'scr-11', name: 'Cream Cheese', amount: 115, unit: 'g', bakers_pct: 0 },
      { id: 'scr-12', name: 'Powdered Sugar', amount: 120, unit: 'g', bakers_pct: 0 },
      { id: 'scr-13', name: 'Vanilla Extract', amount: 5, unit: 'ml', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'scr-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 500g flour, 180ml warm milk, 150g active starter, 2 eggs, 65g sugar, and 7g salt. Mix until a shaggy dough forms. Add 75g softened butter and knead (by hand or stand mixer) until smooth and elastic, about 8–10 minutes. The dough should pass the windowpane test.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['scr-1', 'scr-2', 'scr-3', 'scr-4', 'scr-5', 'scr-6', 'scr-7'],
      },
      {
        id: 'scr-s2', order: 2, type: 'bulk_ferment', title: 'Bulk Rise',
        instruction: 'Cover and let rise at room temperature until doubled in size.',
        timer_minutes: 240, timer_label: 'Bulk rise (3–5 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'scr-s3', order: 3, type: 'shape', title: 'Roll & Fill',
        instruction: 'Roll dough into a large rectangle, about 16x20 inches. Spread 60g softened butter over the surface. Mix 150g brown sugar and 15g cinnamon, and sprinkle evenly. Roll up tightly from the long side. Cut into 12 equal pieces.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['scr-8', 'scr-9', 'scr-10'],
      },
      {
        id: 'scr-s4', order: 4, type: 'custom', title: 'Arrange',
        instruction: 'Place rolls cut-side up in a greased 9x13 baking pan, leaving a little space between them.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null,
      },
      {
        id: 'scr-s5', order: 5, type: 'cold_proof', title: 'Overnight Proof',
        instruction: 'Cover tightly with plastic wrap and refrigerate overnight (8–12 hours). The slow cold rise develops flavor.',
        timer_minutes: 600, timer_label: 'Overnight proof', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'scr-s6', order: 6, type: 'proof', title: 'Morning Warm-Up',
        instruction: 'Remove the rolls from the fridge. Let them sit at room temperature — they should puff up noticeably. You\'ll preheat the oven in the next step while these warm up.',
        timer_minutes: 45, timer_label: 'Warm up', is_optional: false, academy_key: 'proof',
      },
      {
        id: 'scr-s7', order: 7, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 375°F (190°C).',
        timer_minutes: 15, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'scr-s8', order: 8, type: 'bake', title: 'Bake',
        instruction: 'Bake until golden brown on top and cooked through. Cover with foil if browning too fast.',
        timer_minutes: 28, timer_label: 'Bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'scr-s9', order: 9, type: 'custom', title: 'Frost & Serve',
        instruction: 'While rolls bake, mix 115g cream cheese, 120g powdered sugar, and 5ml vanilla until smooth. Spread frosting over warm rolls. Serve immediately.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['scr-11', 'scr-12', 'scr-13'],
      },
    ],
  },

  // ─────────────────────────────────────
  // 10. Sourdough Bagels
  // ─────────────────────────────────────
  {
    id: 'bb-sourdough-bagels',
    title: 'Sourdough Bagels',
    description:
      'Chewy, dense, properly boiled sourdough bagels. The overnight cold ferment gives them that classic bagel chew and tang. Boiling before baking is the secret — don\'t skip it.',
    category: 'bagels',
    ferment_type: 'overnight',
    hydration_pct: 58,
    yield_amount: '8 bagels',
    tags: ['bagels', 'overnight', 'boiled', 'intermediate'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'sb-1', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'sb-2', name: 'Water', amount: 290, unit: 'g', bakers_pct: 58 },
      { id: 'sb-3', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'sb-4', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'sb-5', name: 'Honey (dough)', amount: 15, unit: 'g', bakers_pct: 3 },
      { id: 'sb-6', name: 'Honey (boiling water)', amount: 30, unit: 'ml', bakers_pct: 0 },
      { id: 'sb-7', name: 'Toppings (sesame, poppy, everything)', amount: 0, unit: 'as desired', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'sb-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 500g bread flour, 290g water, 100g active starter, 15g honey, and 10g salt. Mix until a stiff dough forms. Knead on the counter for 8–10 minutes — bagel dough should be firm and smooth, not sticky. This is a workout.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sb-1', 'sb-2', 'sb-3', 'sb-4', 'sb-5'],
      },
      {
        id: 'sb-s2', order: 2, type: 'bulk_ferment', title: 'Bulk Rise',
        instruction: 'Cover and let rise at room temperature for 2–3 hours, until puffy but not doubled.',
        timer_minutes: 150, timer_label: 'Bulk rise (2–3 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'sb-s3', order: 3, type: 'shape', title: 'Shape Bagels',
        instruction: 'Divide dough into 8 equal pieces (~115g each). Roll each into a ball, then poke a hole through the center with your thumb. Stretch the hole to about 2 inches — it will shrink during proofing.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'sb-s4', order: 4, type: 'cold_proof', title: 'Overnight Cold Proof',
        instruction: 'Place shaped bagels on a parchment-lined tray. Cover tightly and refrigerate overnight.',
        timer_minutes: 600, timer_label: 'Cold proof (8–14 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'sb-s5', order: 5, type: 'preheat', title: 'Preheat & Boil Water',
        instruction: 'Preheat oven to 450°F (230°C). Bring a large pot of water to a boil and add 30ml honey.',
        timer_minutes: 15, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat', ingredient_ids: ['sb-6'],
      },
      {
        id: 'sb-s6', order: 6, type: 'custom', title: 'Boil Bagels',
        instruction: 'Drop 2–3 bagels into boiling water. Boil 45 seconds per side. Remove with a slotted spoon, place on a parchment-lined baking sheet, and add toppings immediately while still wet. Repeat for each batch — boil, top, then start the next batch.',
        timer_minutes: 2, timer_label: 'Per batch', is_optional: false, academy_key: null, ingredient_ids: ['sb-7'],
      },
      {
        id: 'sb-s7', order: 7, type: 'bake', title: 'Bake',
        instruction: 'Bake until deep golden brown. Rotate the pan halfway through.',
        timer_minutes: 20, timer_label: 'Bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'sb-s8', order: 8, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 15 minutes. Best eaten the same day — toast leftovers.',
        timer_minutes: 15, timer_label: 'Cooling', is_optional: false, academy_key: null,
      },
    ],
  },
]
