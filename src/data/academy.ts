// BreadBook Academy — inline knowledge cards keyed by step type
// Voice: warm, practical, opinionated. Like a patient friend who bakes a lot.

import type { AcademyCard } from './types'

export const academyCards: Record<string, AcademyCard> = {
  // ─── Tier 1: Full cards (showByDefault: true) ───

  autolyse: {
    key: 'autolyse',
    title: 'Autolyse',
    summary: 'Flour and water rest that builds gluten without any work from you.',
    explanation:
      'When flour and water sit together, gluten starts forming on its own. This passive rest means less kneading later and a more extensible dough that\'s easier to shape. Think of it as giving the flour a head start — it hydrates fully and the proteins start linking up before you add anything else.',
    tips: [
      'Even 20 minutes makes a noticeable difference. An hour is great if you have the time.',
      'Use room-temperature water — warm water speeds up enzyme activity more than you want at this stage.',
      'The dough will look shaggy at first. That\'s perfect. Don\'t try to make it smooth.',
    ],
    interactions: [
      'Mix the levain in *after* the autolyse rest, not before. The rest works better without the acid from the starter.',
      'Salt goes in after too — it tightens the gluten network and slows down the passive development you want.',
    ],
    whenToSkip:
      'Same-day discard recipes and enriched doughs (brioche, cinnamon rolls) usually skip this. If there\'s no long ferment, autolyse won\'t add much.',
    showByDefault: true,
  },

  levain: {
    key: 'levain',
    title: 'Levain Build',
    summary: 'A small batch of starter fed specifically for this bake.',
    explanation:
      'A levain is just your starter, fed at a specific ratio and timing so it peaks right when you need it. Building a levain means you\'re not dumping your whole starter jar into the dough — you\'re creating a fresh, vigorous batch tuned to this recipe. Peak levain = maximum rising power.',
    tips: [
      'The float test works: drop a spoonful in water. If it floats, it\'s ready.',
      'A young levain (just starting to dome) gives milder flavor. A mature levain (starting to collapse) gives more tang.',
      'Room temp affects timing a lot. 75\u00b0F kitchen? About 4-6 hours. 68\u00b0F? Could be 8-12.',
    ],
    interactions: [
      'If your recipe has an autolyse step, start the levain first — it usually takes longer to peak than the autolyse takes to rest.',
      'Using whole wheat or rye in your levain speeds up fermentation. All white flour is slower but milder.',
    ],
    whenToSkip:
      'Discard recipes don\'t need a levain build — they use unfed starter straight from the fridge.',
    showByDefault: true,
  },

  bulk_ferment: {
    key: 'bulk_ferment',
    title: 'Bulk Fermentation',
    summary: 'The main rise \u2014 where flavor develops and the dough comes alive.',
    explanation:
      'This is where most of the magic happens. Yeast produces CO\u2082 (the gas that makes your bread rise) and organic acids (the flavor). The dough transforms from a shaggy mass into something alive and jiggly. You\'re looking for roughly a 50-75% increase in volume, not a full double \u2014 that\'s usually overproofed.',
    tips: [
      'Use a straight-sided container with volume markings or a rubber band at the starting level. Eyeballing volume increase in a round bowl is unreliable.',
      'Warmer kitchen = faster bulk. 78\u00b0F might be 4 hours. 68\u00b0F could be 6-8. Trust the dough, not the clock.',
      'The dough should feel airy, jiggly, and slightly domed on top when it\'s ready. If it\'s flat or liquidy, it went too long.',
    ],
    interactions: [
      'Stretch & folds happen during the first 1-2 hours of bulk ferment. The rest of the time, you leave the dough alone and let fermentation do its thing.',
      'If you\'re cold proofing after, you can end bulk a little earlier (around 50% rise). The fridge will finish the job slowly.',
    ],
    showByDefault: true,
  },

  stretch_fold: {
    key: 'stretch_fold',
    title: 'Stretch & Fold',
    summary: 'Gentle strength-building during bulk ferment \u2014 replaces heavy kneading.',
    explanation:
      'These happen during the first part of bulk fermentation. Instead of kneading on a counter, you stretch one side of the dough up and fold it over itself, then rotate and repeat. Each set (usually 4 folds \u2014 north, south, east, west) builds gluten structure while keeping the gas bubbles intact. After your last set, the dough rests undisturbed for the remainder of bulk.',
    tips: [
      'Wet your hands first \u2014 the dough won\'t stick.',
      '3-4 sets spaced 30 minutes apart is standard. You\'ll feel the dough get tighter and more resistant with each set.',
      'If the dough tears instead of stretches, let it rest longer between sets.',
    ],
    interactions: [
      'If you\'re laminating, cut your stretch & folds in half \u2014 lamination builds a lot of strength on its own.',
      'If the dough already feels strong and extensible after 2 sets, you can skip the rest. Over-developing gluten makes shaping harder.',
    ],
    showByDefault: true,
  },

  lamination: {
    key: 'lamination',
    title: 'Lamination',
    summary: 'Stretching dough paper-thin on a wet surface \u2014 maximum strength in one move.',
    explanation:
      'You spread the dough out as thin as possible on a wet countertop (you should almost be able to see through it), then fold it back up like a letter. This creates tons of gluten structure in a single step and is the best way to evenly distribute mix-ins like cheese, olives, chocolate, or herbs throughout the dough.',
    tips: [
      'Wet your counter and hands generously \u2014 the dough should slide, not stick.',
      'Do this about 1 hour into bulk ferment, after one set of stretch & folds. The dough needs some initial structure first.',
      'Don\'t panic if it tears a little. Small tears are fine. If it\'s tearing a lot, it needed more rest first.',
    ],
    interactions: [
      'If you\'re laminating, reduce your stretch & fold sets from 4 to 2. Lamination plus 4 sets of folds will over-develop the gluten.',
      'This is the perfect time to add inclusions (nuts, dried fruit, chocolate, cheese). Spread them evenly before folding back up.',
    ],
    whenToSkip:
      'Most simple loaves don\'t need lamination \u2014 stretch & folds are enough. Use it when you want extra strength (high hydration doughs) or need to add mix-ins.',
    showByDefault: true,
  },

  shape: {
    key: 'shape',
    title: 'Shaping',
    summary: 'Building surface tension so the loaf holds its shape and springs in the oven.',
    explanation:
      'Shaping creates a taut skin on the outside of the dough. That tension is what gives you oven spring \u2014 the dramatic puff when the loaf first hits the heat. Without good surface tension, the loaf spreads sideways instead of rising up. Pre-shaping (a loose round) followed by a 15-20 minute bench rest, then final shaping (tight round or batard) is the standard two-step approach.',
    tips: [
      'Use less flour than you think. A slightly tacky surface helps build tension. Too much flour and the dough slides instead of gripping.',
      'Work quickly and confidently. Overhandling deflates the gas you spent hours building.',
      'If the dough keeps springing back and won\'t hold shape, let it rest 5-10 more minutes and try again.',
    ],
    interactions: [
      'If you\'re cold proofing after shaping, you can shape a bit tighter \u2014 the cold slows relaxation so it\'ll hold.',
      'Under-fermented dough is very hard to shape (too tight, springs back aggressively). If shaping is a fight, your bulk may have been too short.',
    ],
    showByDefault: true,
  },

  cold_proof: {
    key: 'cold_proof',
    title: 'Cold Proof',
    summary: 'Slow fridge ferment \u2014 develops flavor and lets you bake on your schedule.',
    explanation:
      'After shaping, the dough goes into the fridge (usually in a banneton or bowl). The cold dramatically slows fermentation but doesn\'t stop it. This does two things: develops more complex, tangy flavor from the extended acid production, and gives you scheduling flexibility \u2014 you can bake it tomorrow morning instead of tonight.',
    tips: [
      '12-16 hours is the sweet spot for most loaves. Shorter = milder flavor. Longer = more sour.',
      'Bake straight from the fridge \u2014 cold dough scores better and gets better oven spring than room-temp dough.',
      'Cover tightly (plastic wrap or shower cap on the banneton) to prevent the surface from drying out.',
    ],
    interactions: [
      'Longer cold proof = more sour flavor. If you want mild, keep it under 12 hours.',
      'If your bulk ferment went long (dough was very active), shorten the cold proof or you risk overproofing.',
      'No fridge? You can proof at room temp for 1-2 hours instead, but you lose the flavor development and scheduling benefit.',
    ],
    showByDefault: true,
  },

  score: {
    key: 'score',
    title: 'Scoring',
    summary: 'Controlling where the loaf opens \u2014 function and beauty in one cut.',
    explanation:
      'Bread expands rapidly in the oven. If you don\'t score it, it\'ll burst open wherever the crust is weakest \u2014 usually the side or bottom. Scoring gives the steam a controlled escape route. The angle and depth of your cuts determine how the loaf opens: a shallow angle creates the classic "ear" flap, while a straight-down cut gives an even split.',
    tips: [
      'Use a razor blade (lame) or very sharp serrated knife. A dull blade drags and deflates.',
      'Score with confidence \u2014 one swift motion, about 1/4 inch deep. Hesitating creates a ragged cut.',
      'Cold dough (straight from the fridge) scores much cleaner than room-temp dough.',
    ],
    interactions: [
      'Angle matters \u2014 blade at 30\u00b0 to the surface for an ear, 90\u00b0 for an even split.',
      'Decorative scoring (leaf patterns, wheat stalks) should be shallower than your main expansion score.',
    ],
    showByDefault: true,
  },

  bake: {
    key: 'bake',
    title: 'Baking',
    summary: 'Two phases \u2014 steam first for spring, then dry heat for crust.',
    explanation:
      'Baking sourdough is a two-act play. Act 1: steam. The first 20 minutes need moisture \u2014 either from a covered Dutch oven or steam injected into the oven. Steam keeps the crust flexible so the loaf can expand fully (oven spring). Act 2: dry heat. Remove the lid or vent the steam, and let the crust caramelize and harden. This is where you get that deep golden-brown color and crackling texture.',
    tips: [
      'Preheat the Dutch oven with the oven \u2014 dropping dough into a cold pot kills your oven spring.',
      'Steam in the first 20 minutes is what gives you that crackling crust. Lid on, or ice cubes in a tray below.',
      'The loaf is done when it\'s deeply browned (darker than you think) and sounds hollow when tapped on the bottom.',
    ],
    interactions: [
      'If you skipped cold proofing, you may get less oven spring \u2014 room-temp dough is more relaxed and spreads more.',
      'Scoring depth matters here \u2014 too shallow and the steam can\'t escape properly. Too deep and the loaf loses structure.',
    ],
    showByDefault: true,
  },

  // ─── Tier 2: Stubs (showByDefault: false) ───

  mix: {
    key: 'mix',
    title: 'Mixing',
    summary: 'Combining ingredients to form the initial dough.',
    explanation:
      'Mixing brings flour, water, salt, and levain together into a cohesive mass. You\'re not looking for a smooth dough at this stage \u2014 just make sure there\'s no dry flour left. The heavy lifting of gluten development happens later during bulk ferment and folding.',
    tips: [
      'Mix until no dry flour remains. Shaggy is fine \u2014 smooth comes later.',
      'If your recipe has an autolyse, you\'re adding levain and salt to an already-hydrated dough. Squeeze and fold to incorporate, don\'t knead.',
    ],
    interactions: [
      'Hold back 5-10% of the water if you\'re new to high-hydration doughs. You can add it during stretch & folds once you get a feel for the texture.',
    ],
    showByDefault: false,
  },

  proof: {
    key: 'proof',
    title: 'Proofing',
    summary: 'Final rise at room temperature after shaping.',
    explanation:
      'Room-temp proofing is the last rise before the oven. The shaped dough relaxes slightly and gets its final gas production. This is usually shorter than bulk ferment \u2014 1-2 hours depending on temperature. The poke test helps: press gently with a floured finger. If it springs back slowly, it\'s ready. If it springs back fast, give it more time.',
    tips: [
      'The poke test is your friend. Slow spring-back = ready. Fast = needs more time. No spring-back = overproofed.',
      'Cover the dough to prevent a skin from forming.',
    ],
    interactions: [
      'Most sourdough recipes skip room-temp proof and go straight to cold proof after shaping. If your recipe calls for both, the room-temp proof is usually just 30-60 minutes.',
    ],
    showByDefault: false,
  },

  preheat: {
    key: 'preheat',
    title: 'Preheating',
    summary: 'Getting the oven and vessel screaming hot for maximum oven spring.',
    explanation:
      'A properly preheated oven (and Dutch oven, if using one) is non-negotiable for good oven spring. The initial blast of heat causes rapid gas expansion inside the dough. Most recipes call for 450-500\u00b0F. Give it at least 30 minutes after the oven says it\'s reached temperature \u2014 the walls and baking vessel need time to fully saturate with heat.',
    tips: [
      'Preheat for 30-60 minutes, not just until the oven beeps. The oven thermometer lies \u2014 the walls aren\'t hot yet.',
      'If using a Dutch oven, preheat it inside the oven. A cold Dutch oven = sad oven spring.',
    ],
    interactions: [
      'Start preheating 30-45 minutes before your cold proof ends, so the oven is ready when you are.',
    ],
    showByDefault: false,
  },

  cool: {
    key: 'cool',
    title: 'Cooling',
    summary: 'The hardest part \u2014 waiting while the crumb sets.',
    explanation:
      'The bread is still baking inside after it leaves the oven. Starches are setting, moisture is redistributing, and the crumb structure is firming up. Cutting into a hot loaf releases all that steam at once, leaving you with a gummy interior. It\'s the cruelest wait in baking, but it matters.',
    tips: [
      'Cool on a wire rack so air circulates underneath. A cutting board traps moisture and makes the bottom soggy.',
      'Wait at least 1 hour for smaller loaves, 2 hours for large boules. Yes, really.',
    ],
    interactions: [
      'If you absolutely can\'t wait, tear it open instead of slicing \u2014 slightly less damage to the crumb structure.',
    ],
    showByDefault: false,
  },
}
