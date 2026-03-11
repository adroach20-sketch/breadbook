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

  // ─────────────────────────────────────
  // High-Hydration Open Crumb
  // ─────────────────────────────────────
  {
    id: 'bb-high-hydration-open-crumb',
    title: 'High-Hydration Open Crumb',
    description:
      'The holy grail of artisan sourdough — big, glossy holes and a shattering crust. At 82% hydration this dough is wet and alive, but treat it gently and it will reward you with the most beautiful crumb you\'ve ever baked. Not for beginners, but absolutely worth the learning curve.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 82,
    yield_amount: '1 loaf',
    tags: ['advanced', 'open crumb', 'high hydration', 'crusty'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'hhoc-1', name: 'Bread Flour', amount: 450, unit: 'g', bakers_pct: 90 },
      { id: 'hhoc-2', name: 'Whole Wheat Flour', amount: 50, unit: 'g', bakers_pct: 10 },
      { id: 'hhoc-3', name: 'Water', amount: 410, unit: 'g', bakers_pct: 82 },
      { id: 'hhoc-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'hhoc-5', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
    ],
    steps: [
      {
        id: 'hhoc-s1', order: 1, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 450g bread flour and 50g whole wheat flour with 410g water. Mix until no dry flour remains — it will be shaggy and very wet. That\'s normal at this hydration. Cover and rest for a full hour. This long autolyse builds gluten structure before you even start folding.',
        timer_minutes: 60, timer_label: 'Autolyse rest', is_optional: false, academy_key: 'autolyse', ingredient_ids: ['hhoc-1', 'hhoc-2', 'hhoc-3'],
      },
      {
        id: 'hhoc-s2', order: 2, type: 'mix', title: 'Add Starter & Salt',
        instruction: 'Add 100g active starter and 10g salt to the autolysed dough. Wet your hands and squeeze the dough through your fingers, then fold it over itself repeatedly until everything is incorporated. It\'ll feel loose — that\'s the nature of high-hydration dough. Trust the process.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['hhoc-4', 'hhoc-5'],
      },
      {
        id: 'hhoc-s3', order: 3, type: 'lamination', title: 'Lamination Fold',
        instruction: 'About 1 hour into bulk fermentation. Wet your counter and your hands. Gently turn the dough out and stretch it into a thin, even rectangle — you should almost be able to see through it. Fold the left third over the center, then the right third over that. Now fold the bottom third up and the top third down. You\'ve just built serious gluten structure without deflating those early gas bubbles. Return to the bowl.',
        timer_minutes: 60, timer_label: 'Rest after lamination', is_optional: false, academy_key: 'lamination',
      },
      {
        id: 'hhoc-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Wet your hands. Gently stretch one side up and over the dough, rotate 90°, repeat 4 times. The dough should feel noticeably stronger after the lamination. Handle it like it owes you nothing — gentle, gentle, gentle. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'hhoc-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough should be smoother, more cohesive, and starting to hold its shape. This is your last fold — from here the dough rests undisturbed.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'hhoc-s6', order: 6, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Hands off. Let the dough ferment undisturbed at room temperature for 2–3 more hours. You\'re looking for a 50–75% rise, a domed top, visible bubbles on the surface and sides, and a jiggly wobble when you nudge the bowl. Read the dough, not the clock — temperature matters more than time.',
        timer_minutes: 150, timer_label: 'Bulk rest (2–3 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'hhoc-s7', order: 7, type: 'shape', title: 'Pre-Shape, Bench Rest & Final Shape',
        instruction: 'Gently turn the dough onto a lightly floured surface. Pre-shape into a loose round using a bench scraper — don\'t degas it. Let it rest 20–25 minutes uncovered. For final shaping, flour the top, flip it, and shape into a tight boule or batard. Use the bench scraper to drag it across the counter to build tension. Place seam-side up in a well-floured banneton. Every movement should be deliberate and gentle — you\'re preserving the open crumb structure you\'ve been building all day.',
        timer_minutes: 25, timer_label: 'Bench rest', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'hhoc-s8', order: 8, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover the banneton tightly and refrigerate for 12–16 hours. The cold proof firms the dough for easier scoring and develops complex tangy flavor. Go to bed — this bakes tomorrow.',
        timer_minutes: 840, timer_label: 'Cold proof (12–16 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'hhoc-s9', order: 9, type: 'preheat', title: 'Preheat Oven & Dutch Oven',
        instruction: 'Place your Dutch oven (lid on) in the oven and preheat to 450°F (230°C). Let it heat for a full 45 minutes — the thermal mass of the Dutch oven is what gives you oven spring.',
        timer_minutes: 45, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'hhoc-s10', order: 10, type: 'score', title: 'Score',
        instruction: 'Turn the dough out onto parchment paper. Score decisively with a lame or razor blade — one confident slash at a shallow angle. For open crumb, a single ear-style score works best. Don\'t hesitate — a timid score won\'t open properly.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'hhoc-s11', order: 11, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower the dough into the Dutch oven on its parchment. Cover with the lid and bake for 20 minutes. The trapped steam is what gives you that blistered, crackly crust.',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'hhoc-s12', order: 12, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove the lid. Bake for another 20–25 minutes until deep mahogany brown. Don\'t pull it early — dark is good. The caramelization is where the flavor lives.',
        timer_minutes: 22, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'hhoc-s13', order: 13, type: 'cool', title: 'Cool',
        instruction: 'Transfer to a wire rack and cool for at least 2 hours. Yes, two full hours. The crumb is still setting inside — cutting early will give you a gummy interior and ruin that open structure you worked so hard for. Listen for the crackling as it cools. That\'s the sound of a good bake.',
        timer_minutes: 120, timer_label: 'Cooling (2 hrs)', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Rye & Caraway Sourdough
  // ─────────────────────────────────────
  {
    id: 'bb-rye-caraway',
    title: 'Rye & Caraway Sourdough',
    description:
      'A hearty, aromatic loaf with 30% dark rye and whole caraway seeds. Rye flour behaves differently than wheat — it ferments faster, absorbs more water, and doesn\'t build gluten the same way. The result is a denser, more flavorful crumb with incredible depth. Think old-world bakery, not Instagram.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 72,
    yield_amount: '1 loaf',
    tags: ['intermediate', 'rye', 'flavorful', 'hearty'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'rc-1', name: 'Bread Flour', amount: 350, unit: 'g', bakers_pct: 70 },
      { id: 'rc-2', name: 'Dark Rye Flour', amount: 150, unit: 'g', bakers_pct: 30 },
      { id: 'rc-3', name: 'Water', amount: 360, unit: 'g', bakers_pct: 72 },
      { id: 'rc-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'rc-5', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'rc-6', name: 'Caraway Seeds', amount: 8, unit: 'g', bakers_pct: 1.6 },
    ],
    steps: [
      {
        id: 'rc-s1', order: 1, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 350g bread flour and 150g dark rye flour with 360g water. Mix until no dry flour remains. Cover and rest. Rye flour absorbs water more slowly than wheat — this rest lets it hydrate fully.',
        timer_minutes: 30, timer_label: 'Autolyse rest', is_optional: false, academy_key: 'autolyse', ingredient_ids: ['rc-1', 'rc-2', 'rc-3'],
      },
      {
        id: 'rc-s2', order: 2, type: 'mix', title: 'Add Starter & Salt',
        instruction: 'Add 100g active starter and 10g salt. Squeeze and fold through the dough until fully incorporated. The dough will feel stickier than a pure wheat dough — that\'s the rye. Don\'t add extra flour to compensate.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['rc-4', 'rc-5'],
      },
      {
        id: 'rc-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 1 (Add Caraway)',
        instruction: 'Scatter 8g caraway seeds over the dough and fold them in with your first set of stretch and folds. Stretch one side up and over, rotate 90°, repeat 4 times. The seeds will distribute themselves over the next few sets. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold', ingredient_ids: ['rc-6'],
      },
      {
        id: 'rc-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough won\'t feel as extensible as a wheat dough — rye doesn\'t build gluten the same way. That\'s fine. You\'re distributing the caraway and building what structure you can. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'rc-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Final set. Don\'t expect the same tightness you\'d get from a white flour dough. Rye is its own thing — embrace it.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'rc-s6', order: 6, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Let the dough ferment undisturbed at room temperature. Rye ferments faster than wheat, so keep a close eye — you\'re looking for 50% rise, not more. This might take only 2–3 hours depending on your kitchen temperature. Over-fermented rye dough collapses and becomes gummy.',
        timer_minutes: 150, timer_label: 'Bulk rest (2.5–3.5 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'rc-s7', order: 7, type: 'shape', title: 'Shape',
        instruction: 'Turn the dough out onto a floured surface. Shape into a round or oval — keep it simple. Rye dough doesn\'t hold tension the way wheat does, so don\'t over-work it trying to get a tight skin. A few gentle folds and a drag with your bench scraper is enough. Place seam-side up in a well-floured banneton (use rice flour if you have it — rye dough sticks).',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'rc-s8', order: 8, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover and refrigerate for 12–16 hours. The cold slows fermentation and makes the dough easier to handle tomorrow.',
        timer_minutes: 840, timer_label: 'Cold proof (12–16 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'rc-s9', order: 9, type: 'preheat', title: 'Preheat Oven & Dutch Oven',
        instruction: 'Place your Dutch oven (lid on) in the oven and preheat to 450°F (230°C) for 45 minutes.',
        timer_minutes: 45, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'rc-s10', order: 10, type: 'score', title: 'Score',
        instruction: 'Turn the dough out onto parchment. Score with a simple cross or slash — rye dough won\'t spring open the way wheat does, so don\'t worry about a dramatic ear.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'rc-s11', order: 11, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower into the Dutch oven on parchment. Cover and bake for 20 minutes.',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'rc-s12', order: 12, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove lid. Bake for another 20–25 minutes until deep brown. Rye loaves benefit from a darker bake — it brings out the malty sweetness.',
        timer_minutes: 22, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'rc-s13', order: 13, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 2 hours. Rye loaves actually improve overnight — the crumb sets and the flavors deepen. If you can wait until tomorrow, you\'ll be rewarded.',
        timer_minutes: 120, timer_label: 'Cooling (2 hrs)', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Seeded Crust Sourdough
  // ─────────────────────────────────────
  {
    id: 'bb-seeded-crust',
    title: 'Seeded Crust Sourdough',
    description:
      'A beautiful, crunchy loaf coated in a mix of sesame, sunflower, and flax seeds. The seeds go on the outside after shaping — they toast during baking and give every slice a nutty crunch. Underneath it all is a solid, versatile sourdough with a touch of whole wheat.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 76,
    yield_amount: '1 loaf',
    tags: ['intermediate', 'seeds', 'crusty', 'nutritious'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'sc-1', name: 'Bread Flour', amount: 425, unit: 'g', bakers_pct: 85 },
      { id: 'sc-2', name: 'Whole Wheat Flour', amount: 75, unit: 'g', bakers_pct: 15 },
      { id: 'sc-3', name: 'Water', amount: 380, unit: 'g', bakers_pct: 76 },
      { id: 'sc-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'sc-5', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'sc-6', name: 'Sesame Seeds', amount: 30, unit: 'g', bakers_pct: 0 },
      { id: 'sc-7', name: 'Sunflower Seeds', amount: 30, unit: 'g', bakers_pct: 0 },
      { id: 'sc-8', name: 'Flax Seeds', amount: 20, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'sc-s1', order: 1, type: 'custom', title: 'Prepare Seed Coating',
        instruction: 'Mix 30g sesame seeds, 30g sunflower seeds, and 20g flax seeds together on a wide plate or shallow bowl. Set aside — you\'ll use this after shaping.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['sc-6', 'sc-7', 'sc-8'],
      },
      {
        id: 'sc-s2', order: 2, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 425g bread flour and 75g whole wheat flour with 380g water. Mix until no dry flour remains. Cover and rest.',
        timer_minutes: 45, timer_label: 'Autolyse rest', is_optional: false, academy_key: 'autolyse', ingredient_ids: ['sc-1', 'sc-2', 'sc-3'],
      },
      {
        id: 'sc-s3', order: 3, type: 'mix', title: 'Add Starter & Salt',
        instruction: 'Add 100g active starter and 10g salt. Squeeze and fold through the dough until fully incorporated.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['sc-4', 'sc-5'],
      },
      {
        id: 'sc-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Wet your hands and do a full round of stretch and folds — stretch one side up and over, rotate 90°, repeat 4 times. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sc-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough should feel tighter and more elastic.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sc-s6', order: 6, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Third set. The dough should be smooth and hold its shape well.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sc-s7', order: 7, type: 'stretch_fold', title: 'Stretch & Fold — Set 4',
        instruction: 'Final set. The dough should feel strong and pillowy. You\'re done folding.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sc-s8', order: 8, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Let the dough ferment undisturbed at room temperature until it\'s risen 50–75% and feels puffy and airy.',
        timer_minutes: 180, timer_label: 'Bulk rest (3–4 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'sc-s9', order: 9, type: 'shape', title: 'Pre-Shape, Bench Rest & Final Shape with Seeds',
        instruction: 'Pre-shape into a round, bench rest 20 minutes. Final shape into a tight boule or batard. Now here\'s the fun part: lightly mist or wet the surface of the shaped dough with damp hands, then gently roll it on your plate of mixed seeds, pressing lightly so they stick. You want good coverage on the top and sides. Place seam-side up in a floured banneton (seeds facing down).',
        timer_minutes: 20, timer_label: 'Bench rest', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'sc-s10', order: 10, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover and refrigerate for 12–16 hours. The seeds won\'t absorb much moisture from the surface overnight — they\'ll stay crunchy after baking.',
        timer_minutes: 840, timer_label: 'Cold proof (12–16 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'sc-s11', order: 11, type: 'preheat', title: 'Preheat Oven & Dutch Oven',
        instruction: 'Place your Dutch oven (lid on) in the oven and preheat to 450°F (230°C) for 45 minutes.',
        timer_minutes: 45, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'sc-s12', order: 12, type: 'score', title: 'Score',
        instruction: 'Turn the dough out onto parchment (seeds are now on top). Score through the seeds — a single slash or a cross both work. The seeds will part along the score line and look gorgeous.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'sc-s13', order: 13, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower into the Dutch oven on parchment. Cover and bake for 20 minutes.',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'sc-s14', order: 14, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove lid. Bake for another 20–25 minutes until the seeds are toasted and the crust is deep golden. Your kitchen will smell incredible.',
        timer_minutes: 22, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'sc-s15', order: 15, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 1 hour before slicing. The seed crust will crackle as it cools.',
        timer_minutes: 60, timer_label: 'Cooling', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Whole Spelt Sourdough
  // ─────────────────────────────────────
  {
    id: 'bb-whole-spelt',
    title: 'Whole Spelt Sourdough',
    description:
      'A nutty, golden loaf with 50% whole spelt flour and a drizzle of olive oil. Spelt is an ancient grain with a sweet, mild flavor — but its gluten is fragile, so the rule here is "less is more." Fewer folds, shorter proof, gentler handling. The olive oil keeps the crumb tender.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 70,
    yield_amount: '1 loaf',
    tags: ['intermediate', 'spelt', 'nutty', 'ancient grain'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'ws-1', name: 'Bread Flour', amount: 250, unit: 'g', bakers_pct: 50 },
      { id: 'ws-2', name: 'Whole Spelt Flour', amount: 250, unit: 'g', bakers_pct: 50 },
      { id: 'ws-3', name: 'Water', amount: 350, unit: 'g', bakers_pct: 70 },
      { id: 'ws-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'ws-5', name: 'Salt', amount: 9, unit: 'g', bakers_pct: 1.8 },
      { id: 'ws-6', name: 'Olive Oil', amount: 15, unit: 'g', bakers_pct: 3 },
    ],
    steps: [
      {
        id: 'ws-s1', order: 1, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 250g bread flour and 250g whole spelt flour with 350g water. Mix until no dry flour remains. Cover and rest. Spelt absorbs water quickly, so even a 30-minute autolyse makes a difference.',
        timer_minutes: 30, timer_label: 'Autolyse rest', is_optional: false, academy_key: 'autolyse', ingredient_ids: ['ws-1', 'ws-2', 'ws-3'],
      },
      {
        id: 'ws-s2', order: 2, type: 'mix', title: 'Add Starter, Salt & Olive Oil',
        instruction: 'Add 100g active starter, 9g salt, and 15g olive oil. Squeeze and fold through the dough until everything is incorporated. The olive oil adds tenderness and helps compensate for spelt\'s weaker gluten.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['ws-4', 'ws-5', 'ws-6'],
      },
      {
        id: 'ws-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Wet your hands and do a gentle round of stretch and folds. Spelt gluten tears more easily than wheat, so go slowly. Stretch just until you feel resistance, then fold over. Rotate 90°, repeat 4 times. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'ws-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second and final set. Be gentle — spelt dough tells you when it\'s had enough. If it starts tearing, stop immediately. Two sets is plenty for this flour.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'ws-s5', order: 5, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Let the dough ferment undisturbed. Spelt ferments faster than wheat, so check early — you\'re looking for a 50% rise and a puffy, domed top. This may take only 2–2.5 hours in a warm kitchen. Over-proofed spelt dough falls apart during shaping, so err on the side of under rather than over.',
        timer_minutes: 135, timer_label: 'Bulk rest (2–3 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'ws-s6', order: 6, type: 'shape', title: 'Shape',
        instruction: 'Turn the dough out onto a lightly floured surface. Shape gently — minimal handling is the key with spelt. A few folds to create surface tension, then place in a well-floured banneton seam-side up. Don\'t chase a perfectly tight shape. Spelt rewards restraint.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'ws-s7', order: 7, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover and refrigerate for 8–12 hours. Keep the cold proof shorter than you would for a wheat loaf — spelt over-proofs more quickly, even in the fridge.',
        timer_minutes: 600, timer_label: 'Cold proof (8–12 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'ws-s8', order: 8, type: 'preheat', title: 'Preheat Oven & Dutch Oven',
        instruction: 'Place your Dutch oven (lid on) in the oven and preheat to 450°F (230°C) for 45 minutes.',
        timer_minutes: 45, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'ws-s9', order: 9, type: 'score', title: 'Score',
        instruction: 'Turn the dough out onto parchment. Score with a single slash or a simple pattern. Spelt dough won\'t spring as dramatically as wheat, but you\'ll still get a nice opening.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'ws-s10', order: 10, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower into the Dutch oven on parchment. Cover and bake for 20 minutes.',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'ws-s11', order: 11, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove lid. Bake for another 20–25 minutes until golden brown. Spelt crusts tend to be thinner and more delicate — beautiful in their own way.',
        timer_minutes: 22, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'ws-s12', order: 12, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 1 hour. The crumb will have a golden hue and a slightly sweet, nutty flavor that\'s uniquely spelt.',
        timer_minutes: 60, timer_label: 'Cooling', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Sourdough Sandwich Loaf
  // ─────────────────────────────────────
  {
    id: 'bb-sandwich-loaf',
    title: 'Sourdough Sandwich Loaf',
    description:
      'The everyday loaf your family will ask for every week. Soft crust, tender crumb, just a hint of sourdough tang. No Dutch oven, no scoring, no intimidating equipment — just a greased loaf pan and an overnight rise. This is sourdough for sandwiches, toast, and French toast.',
    category: 'sourdough_loaf',
    ferment_type: 'overnight',
    hydration_pct: 68,
    yield_amount: '1 loaf',
    tags: ['beginner', 'sandwich', 'everyday', 'soft crust', 'contains dairy'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'sl-1', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'sl-2', name: 'Whole Milk', amount: 340, unit: 'g', bakers_pct: 68 },
      { id: 'sl-3', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'sl-4', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'sl-5', name: 'Softened Butter', amount: 30, unit: 'g', bakers_pct: 6 },
      { id: 'sl-6', name: 'Honey', amount: 20, unit: 'g', bakers_pct: 4 },
    ],
    steps: [
      {
        id: 'sl-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 500g bread flour, 340g whole milk, 100g active starter, 10g salt, 20g honey, and 30g softened butter in a large bowl. Mix until a shaggy dough forms, then squish the butter through with your hands until it\'s fully incorporated. The dough will feel rich and slightly sticky. That\'s perfect.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['sl-1', 'sl-2', 'sl-3', 'sl-4', 'sl-5', 'sl-6'],
      },
      {
        id: 'sl-s2', order: 2, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Wet your hands and do a full round of stretch and folds — stretch one side up and over, rotate 90°, repeat 4 times. The butter makes the dough slippery at first, but it\'ll come together. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sl-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough should feel smoother and more cohesive.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sl-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Final set. The dough should be soft, smooth, and slightly pillowy. You\'re done folding — now it rests overnight.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'sl-s5', order: 5, type: 'bulk_ferment', title: 'Overnight Bulk Ferment',
        instruction: 'Cover the bowl and leave it on the counter overnight, 8–10 hours. In the morning the dough should be noticeably puffy and risen — maybe 1.5x its original size. The enriched dough (butter, milk, honey) ferments slower than a lean dough, so don\'t worry if it doesn\'t look doubled.',
        timer_minutes: 540, timer_label: 'Overnight rise (8–10 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'sl-s6', order: 6, type: 'shape', title: 'Shape for Loaf Pan',
        instruction: 'Turn the dough out onto a lightly floured surface. Gently flatten into a rectangle roughly the width of your loaf pan. Starting from the short end, roll the dough into a tight cylinder. Pinch the seam closed and place seam-side down in a greased 9x5 inch loaf pan. No banneton, no Dutch oven — just a regular loaf pan.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'sl-s7', order: 7, type: 'proof', title: 'Counter Proof',
        instruction: 'Cover loosely and let rise at room temperature until the dough domes about 1 inch above the rim of the pan. This takes 1–2 hours depending on your kitchen temperature. Don\'t rush it — if it\'s not above the rim, it needs more time.',
        timer_minutes: 90, timer_label: 'Proof (1–2 hrs)', is_optional: false, academy_key: 'proof',
      },
      {
        id: 'sl-s8', order: 8, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 375°F (190°C). No Dutch oven needed for this one.',
        timer_minutes: 15, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'sl-s9', order: 9, type: 'bake', title: 'Bake',
        instruction: 'Bake for 35–40 minutes until the top is golden brown and the internal temperature reads 195°F (90°C) if you have a thermometer. If the top is browning too fast, tent loosely with foil for the last 10 minutes.',
        timer_minutes: 37, timer_label: 'Bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'sl-s10', order: 10, type: 'cool', title: 'Cool',
        instruction: 'Let cool in the pan for 10 minutes, then turn out onto a wire rack and cool for at least 1 hour before slicing. This bread makes the best toast you\'ve ever had. You\'re welcome.',
        timer_minutes: 60, timer_label: 'Cooling (1 hr)', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Croissant Sourdough Loaf
  // ─────────────────────────────────────
  {
    id: 'bb-croissant-loaf',
    title: 'Croissant Sourdough Loaf',
    description:
      'A 2-day bake that produces the most outrageously flaky, buttery, tangy loaf you\'ve ever tasted. This is a laminated sourdough — the same technique used for croissants, adapted for a loaf pan. It\'s advanced and time-intensive, but the result is layers upon layers of golden, shattering pastry with sourdough depth. Set aside a weekend.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 65,
    yield_amount: '1 loaf',
    tags: ['advanced', 'croissant', 'flaky', 'enriched', 'contains dairy', 'contains egg', '2-day'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'cl-1', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'cl-2', name: 'Whole Milk', amount: 325, unit: 'g', bakers_pct: 65 },
      { id: 'cl-3', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'cl-4', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'cl-5', name: 'Sugar', amount: 30, unit: 'g', bakers_pct: 6 },
      { id: 'cl-6', name: 'Egg', amount: 50, unit: 'g', bakers_pct: 10 },
      { id: 'cl-7', name: 'Cold Unsalted Butter (lamination block)', amount: 225, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'cl-s1', order: 1, type: 'mix', title: 'DAY 1: Mix Dough',
        instruction: 'Combine 500g bread flour, 325g whole milk, 100g active starter, 10g salt, 30g sugar, and 1 egg (50g). Mix until a smooth, slightly sticky dough forms. Don\'t add the butter block yet — that\'s for Day 2.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['cl-1', 'cl-2', 'cl-3', 'cl-4', 'cl-5', 'cl-6'],
      },
      {
        id: 'cl-s2', order: 2, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Wet your hands and do a full round of stretch and folds. The dough is enriched, so it may feel a bit slack. That\'s normal. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'cl-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough should feel smoother. You\'re building enough gluten to handle lamination tomorrow.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'cl-s4', order: 4, type: 'bulk_ferment', title: 'Bulk Ferment',
        instruction: 'Let the dough rise at room temperature for 3–4 hours until it\'s puffy and roughly 50% larger. It won\'t rise as dramatically as a lean dough because of the sugar and egg.',
        timer_minutes: 210, timer_label: 'Bulk rise (3–4 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'cl-s5', order: 5, type: 'cold_proof', title: 'Chill Dough Overnight',
        instruction: 'Flatten the dough into a rough rectangle about 1 inch thick, wrap tightly in plastic wrap, and refrigerate overnight (8–12 hours). This isn\'t a proof — it\'s chilling the dough so it\'s firm enough to laminate with butter tomorrow. Cold dough + cold butter = flaky layers.',
        timer_minutes: 600, timer_label: 'Overnight chill (8–12 hrs)', is_optional: false, academy_key: null,
      },
      {
        id: 'cl-s6', order: 6, type: 'custom', title: 'DAY 2: Prepare Butter Block',
        instruction: 'Pound 225g cold unsalted butter between two sheets of parchment paper into a 6x6 inch square. The butter should be pliable but still cold — if it\'s rock hard, let it sit for 5 minutes. If it\'s soft and greasy, chill it for 10 minutes. Temperature control is everything here.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['cl-7'],
      },
      {
        id: 'cl-s7', order: 7, type: 'lamination', title: 'First Book Fold (Lamination)',
        instruction: 'Roll the chilled dough into a rectangle roughly twice the size of your butter block. Place the butter in the center and fold the dough over it like an envelope, pinching the edges to seal. Roll out into a long rectangle (about 8x18 inches). Fold the dough in thirds like a letter — this is your first book fold. If the butter starts breaking through or feeling soft, STOP and chill for 30 minutes before continuing. Wrap and refrigerate for 1 hour.',
        timer_minutes: 60, timer_label: 'Chill between folds', is_optional: false, academy_key: 'lamination',
      },
      {
        id: 'cl-s8', order: 8, type: 'shape', title: 'Second Book Fold & Shape',
        instruction: 'Remove from fridge. Roll out again into a long rectangle and do a second book fold (fold in thirds). Wrap and chill for 30 minutes. Then roll the dough into a rectangle roughly 8x12 inches. Starting from the short end, roll into a tight cylinder. Place seam-side down in a greased 9x5 inch loaf pan. These layers are your croissant structure — each fold multiplied them.',
        timer_minutes: 30, timer_label: 'Chill before shaping', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'cl-s9', order: 9, type: 'proof', title: 'Final Proof',
        instruction: 'Cover loosely and proof at room temperature for 2–3 hours. The dough should be visibly puffy and jiggly when you tap the pan. It won\'t double — enriched laminated dough rises slower. Be patient and don\'t rush this step.',
        timer_minutes: 150, timer_label: 'Proof (2–3 hrs)', is_optional: false, academy_key: 'proof',
      },
      {
        id: 'cl-s10', order: 10, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 375°F (190°C). No Dutch oven — just the loaf pan.',
        timer_minutes: 15, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'cl-s11', order: 11, type: 'bake', title: 'Bake',
        instruction: 'Bake for 45–50 minutes. The top will brown fast because of the butter, sugar, and egg — tent loosely with foil after 25 minutes if it\'s getting too dark. The loaf is done when deep golden and the internal temperature reads 190°F (88°C). The butter will be sizzling. That\'s a good sign.',
        timer_minutes: 47, timer_label: 'Bake (45–50 min)', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'cl-s12', order: 12, type: 'cool', title: 'Cool',
        instruction: 'Cool in the pan for 15 minutes, then carefully turn out onto a wire rack. Cool for at least 1 hour before slicing — the layers are still setting. When you cut into it, you should see distinct flaky layers. This bread doesn\'t need butter. It IS butter.',
        timer_minutes: 60, timer_label: 'Cooling (1 hr)', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Cinnamon Swirl Sourdough
  // ─────────────────────────────────────
  {
    id: 'bb-cinnamon-swirl',
    title: 'Cinnamon Swirl Sourdough',
    description:
      'A soft, enriched sourdough loaf with a ribboned cinnamon-sugar swirl running through every slice. Overnight bulk ferment keeps it simple — mix in the evening, shape and fill in the morning. This is the loaf that makes your entire house smell like a bakery.',
    category: 'sourdough_loaf',
    ferment_type: 'overnight',
    hydration_pct: 68,
    yield_amount: '1 loaf',
    tags: ['intermediate', 'cinnamon', 'sweet', 'enriched', 'contains dairy'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'cs-1', name: 'Bread Flour', amount: 500, unit: 'g', bakers_pct: 100 },
      { id: 'cs-2', name: 'Whole Milk', amount: 340, unit: 'g', bakers_pct: 68 },
      { id: 'cs-3', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'cs-4', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'cs-5', name: 'Softened Butter (dough)', amount: 30, unit: 'g', bakers_pct: 6 },
      { id: 'cs-6', name: 'Sugar (dough)', amount: 40, unit: 'g', bakers_pct: 8 },
      { id: 'cs-7', name: 'Brown Sugar (filling)', amount: 50, unit: 'g', bakers_pct: 0 },
      { id: 'cs-8', name: 'Ground Cinnamon (filling)', amount: 15, unit: 'g', bakers_pct: 0 },
      { id: 'cs-9', name: 'Softened Butter (filling)', amount: 30, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'cs-s1', order: 1, type: 'mix', title: 'Mix Dough',
        instruction: 'Combine 500g bread flour, 340g whole milk, 100g active starter, 10g salt, 40g sugar, and 30g softened butter. Mix until a cohesive dough forms, squishing the butter through with your hands until fully incorporated. It\'ll be slightly sticky and rich-feeling.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['cs-1', 'cs-2', 'cs-3', 'cs-4', 'cs-5', 'cs-6'],
      },
      {
        id: 'cs-s2', order: 2, type: 'stretch_fold', title: 'Stretch & Fold — Set 1',
        instruction: 'Wet your hands and do a full round of stretch and folds. The enriched dough will feel slack at first — that\'s the butter. It\'ll tighten up. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'cs-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 2',
        instruction: 'Second set. The dough should feel smoother and more elastic.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'cs-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 3',
        instruction: 'Final set. The dough should be soft, smooth, and hold together well. You\'re done folding — this rises overnight.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'cs-s5', order: 5, type: 'bulk_ferment', title: 'Overnight Bulk Ferment',
        instruction: 'Cover and leave on the counter overnight, 8–10 hours. In the morning the dough should be puffy, risen, and a little domed on top.',
        timer_minutes: 540, timer_label: 'Overnight rise (8–10 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'cs-s6', order: 6, type: 'custom', title: 'Make Cinnamon-Sugar Filling',
        instruction: 'Mix 50g brown sugar and 15g ground cinnamon together in a small bowl. Have 30g softened butter ready. This is your swirl filling.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: null, ingredient_ids: ['cs-7', 'cs-8', 'cs-9'],
      },
      {
        id: 'cs-s7', order: 7, type: 'shape', title: 'Roll, Fill & Shape',
        instruction: 'Turn the dough out onto a lightly floured surface. Roll or pat into a large rectangle, roughly 10x16 inches. Spread 30g softened butter evenly over the surface, leaving a 1-inch border along one short edge. Sprinkle the cinnamon-sugar mixture evenly over the butter. Starting from the short end (opposite the border), roll the dough tightly into a cylinder. Pinch the seam to seal and place seam-side down in a greased 9x5 inch loaf pan. Roll tightly to avoid swirl gaps — if the filling is too thick or the dough too dry, layers can separate during baking. A thin, even layer of filling works better than a thick one.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'shape',
      },
      {
        id: 'cs-s8', order: 8, type: 'proof', title: 'Counter Proof',
        instruction: 'Cover loosely and let rise until the dough domes about 1 inch above the rim of the pan. This takes 1–2 hours depending on your kitchen temperature.',
        timer_minutes: 90, timer_label: 'Proof (1–2 hrs)', is_optional: false, academy_key: 'proof',
      },
      {
        id: 'cs-s9', order: 9, type: 'preheat', title: 'Preheat Oven',
        instruction: 'Preheat oven to 350°F (175°C).',
        timer_minutes: 15, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'cs-s10', order: 10, type: 'bake', title: 'Bake',
        instruction: 'Bake for 40–45 minutes. The sugar in the filling caramelizes and browns fast, so tent loosely with foil if the top is getting too dark after 25 minutes. The loaf is done when golden brown and the internal temperature reads 190°F (88°C).',
        timer_minutes: 42, timer_label: 'Bake (40–45 min)', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'cs-s11', order: 11, type: 'cool', title: 'Cool',
        instruction: 'Cool in the pan for 15 minutes, then turn out onto a wire rack. Wait at least 45 minutes before slicing — the cinnamon filling is molten lava right out of the oven. When you do slice, the swirl should be visible in every piece. This bread, toasted with butter, is unreasonable.',
        timer_minutes: 45, timer_label: 'Cooling (45 min)', is_optional: false, academy_key: 'cool',
      },
    ],
  },

  // ─────────────────────────────────────
  // Jalapeño Cheddar Sourdough
  // ─────────────────────────────────────
  {
    id: 'bb-jalapeno-cheddar',
    title: 'Jalapeño Cheddar Sourdough',
    description:
      'A savory, spicy showstopper loaded with cubed sharp cheddar and diced jalapeños. The cheese melts into gooey pockets throughout the crumb, and any cheese on the crust caramelizes into crispy, golden edges. Use cubed cheddar (not shredded) for the best melt, and pat those jalapeños dry.',
    category: 'sourdough_loaf',
    ferment_type: 'long_ferment',
    hydration_pct: 74,
    yield_amount: '1 loaf',
    tags: ['intermediate', 'savory', 'cheese', 'spicy', 'contains dairy'],
    is_breadbook_original: true,
    source_credit: null,
    ingredients: [
      { id: 'jc-1', name: 'Bread Flour', amount: 425, unit: 'g', bakers_pct: 85 },
      { id: 'jc-2', name: 'Whole Wheat Flour', amount: 75, unit: 'g', bakers_pct: 15 },
      { id: 'jc-3', name: 'Water', amount: 370, unit: 'g', bakers_pct: 74 },
      { id: 'jc-4', name: 'Sourdough Starter (active)', amount: 100, unit: 'g', bakers_pct: 20 },
      { id: 'jc-5', name: 'Salt', amount: 10, unit: 'g', bakers_pct: 2 },
      { id: 'jc-6', name: 'Sharp Cheddar (cubed)', amount: 120, unit: 'g', bakers_pct: 0 },
      { id: 'jc-7', name: 'Jalapeños (diced, seeded, patted dry)', amount: 60, unit: 'g', bakers_pct: 0 },
    ],
    steps: [
      {
        id: 'jc-s1', order: 1, type: 'autolyse', title: 'Autolyse',
        instruction: 'Combine 425g bread flour and 75g whole wheat flour with 370g water. Mix until no dry flour remains. Cover and rest.',
        timer_minutes: 45, timer_label: 'Autolyse rest', is_optional: false, academy_key: 'autolyse', ingredient_ids: ['jc-1', 'jc-2', 'jc-3'],
      },
      {
        id: 'jc-s2', order: 2, type: 'mix', title: 'Add Starter & Salt',
        instruction: 'Add 100g active starter and 10g salt. Squeeze and fold through the dough until fully incorporated. No cheese or jalapeños yet — those come during the folds.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'mix', ingredient_ids: ['jc-4', 'jc-5'],
      },
      {
        id: 'jc-s3', order: 3, type: 'stretch_fold', title: 'Stretch & Fold — Set 1 (Plain)',
        instruction: 'First set of stretch and folds — no inclusions yet. Build some gluten structure first. Wet your hands, stretch one side up and over, rotate 90°, repeat 4 times. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'jc-s4', order: 4, type: 'stretch_fold', title: 'Stretch & Fold — Set 2 (Add Half the Fillings)',
        instruction: 'Pat jalapeños dry with a paper towel first — excess moisture will make the dough slack. Scatter half the cubed cheddar and half the diced jalapeños over the dough. Fold them in with your stretch and folds. Use cubed cheddar, not shredded, for melty pockets throughout the crumb. Cover and rest.',
        timer_minutes: 30, timer_label: 'Rest before next set', is_optional: false, academy_key: 'stretch_fold', ingredient_ids: ['jc-6', 'jc-7'],
      },
      {
        id: 'jc-s5', order: 5, type: 'stretch_fold', title: 'Stretch & Fold — Set 3 (Add Remaining Fillings)',
        instruction: 'Scatter the remaining cheddar and jalapeños over the dough and fold them in. By adding in two batches, you get more even distribution. The dough should feel chunky and loaded. That\'s exactly right.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'stretch_fold',
      },
      {
        id: 'jc-s6', order: 6, type: 'bulk_ferment', title: 'Bulk Ferment — Rest',
        instruction: 'Let the dough ferment undisturbed at room temperature for 3–4 hours. You\'re looking for a 50–75% rise, a domed top, and visible bubbles. The cheese chunks may make it harder to judge the rise — look at the edges of the bowl and trust the jiggle.',
        timer_minutes: 210, timer_label: 'Bulk rest (3–4 hrs)', is_optional: false, academy_key: 'bulk_ferment',
      },
      {
        id: 'jc-s7', order: 7, type: 'shape', title: 'Pre-Shape, Bench Rest & Final Shape',
        instruction: 'Gently turn the dough onto a lightly floured surface. Pre-shape into a round, bench rest 20 minutes. Final shape into a boule or batard — handle gently because cheese chunks will try to poke through the surface. That\'s OK. Any cheese on the outside will caramelize during baking and it\'s spectacular. Place seam-side up in a well-floured banneton.',
        timer_minutes: 20, timer_label: 'Bench rest', is_optional: false, academy_key: 'shape',
      },
      {
        id: 'jc-s8', order: 8, type: 'cold_proof', title: 'Cold Proof',
        instruction: 'Cover and refrigerate for 12–16 hours. The cold firms up the cheese and makes the dough easier to score.',
        timer_minutes: 840, timer_label: 'Cold proof (12–16 hrs)', is_optional: false, academy_key: 'cold_proof',
      },
      {
        id: 'jc-s9', order: 9, type: 'preheat', title: 'Preheat Oven & Dutch Oven',
        instruction: 'Place your Dutch oven (lid on) in the oven and preheat to 450°F (230°C) for 45 minutes.',
        timer_minutes: 45, timer_label: 'Preheat', is_optional: false, academy_key: 'preheat',
      },
      {
        id: 'jc-s10', order: 10, type: 'score', title: 'Score',
        instruction: 'Turn the dough out onto parchment. Score confidently — a single slash or a cross. You\'ll probably see cheese and jalapeño bits in the score line. That\'s the look you want.',
        timer_minutes: null, timer_label: null, is_optional: false, academy_key: 'score',
      },
      {
        id: 'jc-s11', order: 11, type: 'bake', title: 'Bake — Covered',
        instruction: 'Lower into the Dutch oven on parchment. Cover and bake for 20 minutes.',
        timer_minutes: 20, timer_label: 'Covered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'jc-s12', order: 12, type: 'bake', title: 'Bake — Uncovered',
        instruction: 'Remove lid. Bake for another 20–25 minutes until deep golden. Any cheese on the crust will caramelize into crispy, bubbly spots — that\'s not burning, that\'s the best part. Don\'t pull it early.',
        timer_minutes: 22, timer_label: 'Uncovered bake', is_optional: false, academy_key: 'bake',
      },
      {
        id: 'jc-s13', order: 13, type: 'cool', title: 'Cool',
        instruction: 'Cool on a wire rack for at least 1 hour. The cheese inside is molten right out of the oven and needs time to set. When you slice it, you\'ll see melty cheddar pockets and flecks of green jalapeño throughout. This bread with a bowl of soup? Unbeatable.',
        timer_minutes: 60, timer_label: 'Cooling', is_optional: false, academy_key: 'cool',
      },
    ],
  },
]
