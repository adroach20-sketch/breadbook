export type SymptomCategory = 'appearance' | 'crumb' | 'flavor' | 'other'

export interface TroubleshootFix {
  title: string
  detail: string
}

export interface Symptom {
  id: string
  category: SymptomCategory
  title: string
  emoji: string
  description: string
  cause: string
  confidence: 'most_likely' | 'possibly' | 'could_also_be'
  fixes: TroubleshootFix[]
  relatedSymptoms?: string[]
}

export const categoryLabels: Record<SymptomCategory, { label: string; emoji: string }> = {
  appearance: { label: 'Appearance', emoji: '👀' },
  crumb: { label: 'Crumb', emoji: '🍞' },
  flavor: { label: 'Flavor', emoji: '👅' },
  other: { label: 'Other', emoji: '🤔' },
}

export const symptoms: Symptom[] = [
  // ─── Appearance ───
  {
    id: 'flat-loaf',
    category: 'appearance',
    title: 'Flat loaf',
    emoji: '📏',
    description: 'Loaf spread out instead of rising up. Little to no height.',
    cause: 'Usually means the dough was over-proofed (the gluten structure gave out) or under-developed during bulk fermentation. Shaping tension matters too — if the dough wasn\'t pulled tight during shaping, it won\'t hold its shape in the oven.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Shorten bulk fermentation', detail: 'Try reducing bulk time by 30–60 minutes. The dough should feel airy and jiggly but still have some structure when you tug it.' },
      { title: 'Tighten your shaping', detail: 'After pre-shaping, let the dough rest 20 minutes, then shape with firm tension. The surface should feel taut, like a balloon. Practice the "letter fold + roll" technique.' },
      { title: 'Check your starter', detail: 'If your starter wasn\'t at peak activity when you mixed, the dough may not have had enough lift power. Use your starter 4–6 hours after feeding, when it\'s doubled and domed.' },
    ],
    relatedSymptoms: ['no-oven-spring', 'dense-crumb'],
  },
  {
    id: 'flying-crust',
    category: 'appearance',
    title: 'Flying crust (big ear or blowout)',
    emoji: '💥',
    description: 'A large flap of crust lifted away from the loaf, or the loaf burst open in an unexpected spot.',
    cause: 'This happens when steam pressure inside the loaf can\'t escape through the score. Either the score was too shallow, the oven wasn\'t steamy enough (so the crust set too fast), or the dough was slightly under-proofed — giving it explosive oven spring.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Score deeper', detail: 'Hold the blade at a 30–45° angle and cut about ½ inch deep. A confident, swift motion works better than a hesitant one.' },
      { title: 'Add more steam', detail: 'If using a Dutch oven, make sure the lid is on tight for the first 20 minutes. If baking on a stone, add a tray of boiling water or ice cubes below the loaf.' },
      { title: 'Proof a bit longer', detail: 'If the loaf is slightly under-proofed, it has more explosive energy. Try adding 15–30 minutes to your final proof. The poke test should spring back slowly with a small indent remaining.' },
    ],
    relatedSymptoms: ['large-holes'],
  },
  {
    id: 'pale-crust',
    category: 'appearance',
    title: 'Pale crust',
    emoji: '🫠',
    description: 'Crust didn\'t brown well. Looks washed out or anemic.',
    cause: 'Browning (Maillard reaction) needs high heat and sugars. If fermentation went too long, the yeast consumed most of the sugars. Or the oven temperature was too low, or the loaf was removed too early.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Bake hotter or longer', detail: 'After removing the lid (or steam), bake at 450–475°F until the crust is deep golden brown. Don\'t be afraid of dark — a rich brown crust tastes better than a pale one.' },
      { title: 'Shorten fermentation slightly', detail: 'Over-fermented dough has less residual sugar for browning. If your bulk or proof times are on the long side, try pulling back by 30 minutes.' },
      { title: 'Add a thin wash', detail: 'Brushing the loaf with water or a light egg wash before scoring can help promote browning. A sprinkle of rice flour on top adds contrast too.' },
    ],
  },
  {
    id: 'burnt-bottom',
    category: 'appearance',
    title: 'Burnt bottom',
    emoji: '🔥',
    description: 'Bottom of the loaf is too dark or charred, even if the top looks fine.',
    cause: 'Direct contact with a very hot surface (Dutch oven bottom, baking steel, or stone) without insulation. Thin or dark-colored vessels absorb and radiate more heat to the base.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Add a buffer layer', detail: 'Place a piece of parchment paper under the loaf, or stack a second baking sheet underneath your Dutch oven to diffuse the heat.' },
      { title: 'Raise the rack', detail: 'Move your baking vessel to the middle rack instead of the lower third. This keeps the bottom farther from the heating element.' },
      { title: 'Reduce temperature for uncovered bake', detail: 'After removing the lid, drop the oven to 425°F instead of keeping it at 450°F+. The top will still brown; the bottom won\'t burn.' },
    ],
  },
  {
    id: 'no-oven-spring',
    category: 'appearance',
    title: 'No oven spring',
    emoji: '😞',
    description: 'Loaf didn\'t puff up in the oven. Stayed the same size as when it went in.',
    cause: 'Oven spring relies on active yeast, good gluten structure, and steam. Over-proofing (yeast exhausted), weak gluten development, or no steam (crust sets too fast) can all kill oven spring.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Don\'t over-proof', detail: 'The dough should feel puffy but still have some resistance when poked. If the poke test indent stays put and doesn\'t spring back at all, it\'s gone too far.' },
      { title: 'Build more gluten', detail: 'Do 4–6 sets of stretch and folds during the first 2 hours of bulk fermentation. The dough should go from shaggy to smooth and elastic.' },
      { title: 'Ensure proper steam', detail: 'A Dutch oven with the lid on is the most reliable method. Preheat it for at least 30 minutes at 450°F+ before loading the dough.' },
    ],
    relatedSymptoms: ['flat-loaf', 'dense-crumb'],
  },
  {
    id: 'hard-thick-crust',
    category: 'appearance',
    title: 'Hard, thick crust',
    emoji: '🪨',
    description: 'Crust is excessively thick or hard, making it difficult to slice or chew.',
    cause: 'Usually from baking too long without steam, or baking at too high a temperature for too long. Low-hydration doughs also tend to develop thicker crusts.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Steam longer', detail: 'Keep the Dutch oven lid on for the first 20 minutes. Steam keeps the crust flexible so the loaf can expand, and results in a thinner, crispier (not thicker) crust.' },
      { title: 'Cover while cooling', detail: 'If the crust is too hard, wrap the warm loaf in a clean towel while it cools. The trapped moisture softens the crust slightly.' },
      { title: 'Increase hydration', detail: 'If your recipe is below 70% hydration, try adding 10–20g more water. Wetter doughs produce thinner, crispier crusts.' },
    ],
  },

  // ─── Crumb ───
  {
    id: 'large-holes',
    category: 'crumb',
    title: 'Large, uneven holes',
    emoji: '🕳️',
    description: 'Big pockets or tunnels in the crumb, especially near the top. Rest of the bread is tighter.',
    cause: 'Large gas pockets that weren\'t redistributed during shaping. Can also come from under-mixing (flour pockets trap gas), or an inconsistent bulk fermentation where some areas fermented more than others.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Shape more carefully', detail: 'During shaping, gently degas the outer surface while keeping the interior airy. A firm pre-shape followed by a 20-minute bench rest helps equalize gas distribution.' },
      { title: 'Mix more thoroughly', detail: 'Make sure there are no dry flour pockets after initial mixing. Autolyse for 30–60 minutes before adding starter to ensure even hydration.' },
      { title: 'Add one more fold set', detail: 'An extra set of stretch and folds during bulk helps redistribute gas more evenly through the dough.' },
    ],
    relatedSymptoms: ['flying-crust'],
  },
  {
    id: 'dense-crumb',
    category: 'crumb',
    title: 'Dense, tight crumb',
    emoji: '🧱',
    description: 'Very little openness. Bread feels heavy and compact.',
    cause: 'Most often from under-fermentation — the dough didn\'t develop enough gas. Can also be from weak starter, not enough stretch and folds, or too much flour during shaping (which tears the surface and deflates gas).',
    confidence: 'most_likely',
    fixes: [
      { title: 'Ferment longer', detail: 'Let bulk fermentation go until the dough has risen 50–75% in volume. It should be visibly bubbly around the edges and jiggle when you move the container.' },
      { title: 'Strengthen your starter', detail: 'Feed your starter twice a day for 2–3 days before baking. It should double in 4–6 hours and have a pleasant, tangy smell — not boozy or vinegary.' },
      { title: 'Use less bench flour', detail: 'Excess flour on the surface during shaping creates dry layers that block gas expansion. Use just enough to prevent sticking.' },
    ],
    relatedSymptoms: ['flat-loaf', 'no-oven-spring'],
  },
  {
    id: 'gummy-crumb',
    category: 'crumb',
    title: 'Gummy or wet crumb',
    emoji: '💧',
    description: 'Inside is sticky, doughy, or wet even though the crust looks baked.',
    cause: 'The most common reason is cutting the bread too soon — it needs at least 1–2 hours to finish setting internally. Can also mean the dough was under-baked, or the hydration was too high for the flour type.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Wait before cutting', detail: 'This is the #1 fix. Let the loaf cool completely — at least 2 hours, ideally on a wire rack. The starches are still setting inside even after it leaves the oven.' },
      { title: 'Bake longer', detail: 'After removing the lid, bake for a full 20–25 minutes at 450°F. The internal temperature should reach 205–210°F. Tap the bottom — it should sound hollow.' },
      { title: 'Reduce hydration', detail: 'If you\'re using a high-protein bread flour, it can handle 75%+ hydration. But all-purpose flour may struggle above 70%. Try reducing water by 20–30g.' },
    ],
  },
  {
    id: 'chewy-crumb',
    category: 'crumb',
    title: 'Chewy, rubbery crumb',
    emoji: '🫧',
    description: 'Bread has a tough, chewy texture — almost like it bounces back when compressed.',
    cause: 'Over-developed gluten (too much kneading or too many folds) or a very high protein flour can create an overly elastic crumb. Under-fermentation can also make the crumb feel tight and chewy.',
    confidence: 'possibly',
    fixes: [
      { title: 'Reduce folds', detail: 'Try 3–4 sets of stretch and folds instead of 6+. After the first couple of hours, let the dough rest undisturbed so the gluten can relax.' },
      { title: 'Try a different flour', detail: 'If you\'re using a very high-protein flour (14%+), try blending it with some all-purpose (10–11% protein) for a more tender crumb.' },
      { title: 'Extend fermentation', detail: 'A longer, slower ferment breaks down some of the gluten structure naturally, resulting in a more tender crumb. Try a longer cold proof (12–18 hours in the fridge).' },
    ],
  },

  // ─── Flavor ───
  {
    id: 'too-sour',
    category: 'flavor',
    title: 'Too sour',
    emoji: '😖',
    description: 'Overwhelming sour or vinegary taste that dominates the bread.',
    cause: 'Extended fermentation (especially at warm temperatures) produces more acetic acid. Using a starter that\'s past its peak (hungry/unfed) also contributes a sharper, more aggressive sour flavor.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Use starter at peak', detail: 'Mix your dough when the starter has just peaked (doubled, domed top). Past-peak starter has more acid and gives a more sour result.' },
      { title: 'Shorten warm ferment, lengthen cold', detail: 'A shorter bulk at room temp (4–5 hours) followed by a longer cold proof (fridge overnight) favors lactic acid (mild, yogurty) over acetic acid (sharp, vinegary).' },
      { title: 'Feed starter more often', detail: 'A healthy, well-fed starter produces a milder sour. Feed it twice a day for 2–3 days before your bake.' },
    ],
    relatedSymptoms: ['not-sour-enough'],
  },
  {
    id: 'not-sour-enough',
    category: 'flavor',
    title: 'Not sour enough',
    emoji: '😐',
    description: 'Bread tastes bland or like regular white bread. No tangy sourdough character.',
    cause: 'Short fermentation, cool temperatures, or a very young/freshly fed starter that hasn\'t developed enough acid yet.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Extend bulk fermentation', detail: 'Let the dough ferment longer at room temperature — aim for 6–8 hours for a more pronounced sour. Watch the dough, not the clock.' },
      { title: 'Use a warmer environment', detail: 'Warmer temps (78–82°F) speed up acid production. Try placing the dough near your oven or in a turned-off oven with the light on.' },
      { title: 'Use some whole grain', detail: 'Replacing 10–20% of white flour with whole wheat or rye gives the wild yeast more to work with and deepens the sour complexity.' },
    ],
    relatedSymptoms: ['too-sour'],
  },
  {
    id: 'yeasty-alcohol',
    category: 'flavor',
    title: 'Yeasty or alcohol taste',
    emoji: '🍺',
    description: 'Bread smells or tastes boozy, like beer or raw yeast.',
    cause: 'The yeast ran out of food and started producing more alcohol than CO2. This usually means over-fermentation or a starter that was too hungry (past peak) when used.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Shorten fermentation', detail: 'Pull the dough earlier — before it more than doubles. The dough should be airy and puffy, not collapsed or soupy.' },
      { title: 'Use starter at peak', detail: 'A well-timed starter (just doubled, pleasant tangy smell) produces balanced flavors. A past-peak starter smells boozy and passes that to the bread.' },
      { title: 'Reduce starter percentage', detail: 'If using more than 20% starter relative to flour, try dropping to 15%. Less starter = slower, more controlled fermentation.' },
    ],
  },
  {
    id: 'bland-no-salt',
    category: 'flavor',
    title: 'Bland or no salt taste',
    emoji: '🫥',
    description: 'Bread tastes flat and lifeless. Nothing pops.',
    cause: 'Most likely you forgot the salt, or didn\'t add enough. Salt is typically 2% of flour weight. Without it, bread tastes remarkably flat — and the dough ferments faster (salt regulates yeast activity).',
    confidence: 'most_likely',
    fixes: [
      { title: 'Check your salt amount', detail: 'Use 2% of your total flour weight in fine sea salt. For a typical 500g flour recipe, that\'s 10g (about 2 teaspoons of fine salt).' },
      { title: 'Add salt earlier', detail: 'If you add salt during autolyse or immediately after, it dissolves better and distributes more evenly. Pinching it in later can leave salty and bland spots.' },
      { title: 'Don\'t substitute table salt 1:1', detail: 'Kosher salt and coarse sea salt are less dense than fine salt. If using kosher salt, use about 25% more by volume (or weigh everything).' },
    ],
  },

  // ─── Other ───
  {
    id: 'rose-too-slow',
    category: 'other',
    title: 'Dough rose too slowly',
    emoji: '🐢',
    description: 'Bulk fermentation took much longer than expected. The dough barely moved for hours.',
    cause: 'Cool kitchen temperature, weak or immature starter, or too little starter in the mix. Every 5°F drop below 75°F adds roughly 1 hour to bulk fermentation time.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Warm up your environment', detail: 'Aim for 75–78°F. Use your oven with just the light on, a proofing box, or place the dough on top of your fridge (warm air rises).' },
      { title: 'Use more active starter', detail: 'Your starter should be predictably doubling in 4–6 hours. If it\'s sluggish, do 2–3 days of twice-daily feeds at 1:1:1 ratio before baking.' },
      { title: 'Increase starter percentage', detail: 'If your recipe uses 10% starter, try 15–20%. More starter = faster fermentation. Adjust timing expectations accordingly.' },
    ],
    relatedSymptoms: ['dense-crumb'],
  },
  {
    id: 'dough-too-sticky',
    category: 'other',
    title: 'Dough too sticky to handle',
    emoji: '🤲',
    description: 'Dough sticks to everything — hands, counter, bench scraper. Impossible to shape.',
    cause: 'High hydration dough needs time and technique. If the gluten isn\'t developed enough, the dough will be slack and sticky. Warm dough is also stickier than cool dough.',
    confidence: 'most_likely',
    fixes: [
      { title: 'Wet your hands, not the dough', detail: 'Keep a bowl of water nearby. Wet your hands before touching the dough. Don\'t add flour — it changes the hydration and creates dry spots.' },
      { title: 'Chill the dough', detail: 'Pop the dough in the fridge for 20–30 minutes before shaping. Cold dough is firmer and much easier to handle.' },
      { title: 'Build more gluten first', detail: 'Do a 30–60 minute autolyse before adding starter. Then do 4–6 sets of stretch and folds. Well-developed gluten holds together better even at high hydration.' },
    ],
  },
]
