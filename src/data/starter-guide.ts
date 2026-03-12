export interface GuideDay {
  day: number
  title: string
  emoji: string
  instruction: string
  tip: string
  expectation: string
  feedingRatio: string | null // e.g., "1:1:1" — null if no feed today
  feedingNote?: string        // plain-language gram amounts, e.g. "50g starter + 50g flour + 50g water"
  reassurance?: string        // "don't panic" callout for tricky days (Days 3–5)
  canBakeEarly?: boolean      // show "is it ready?" callout from this day onward
}

/**
 * 14-day guided starter creation path.
 * Day 1 = starter creation day (mix flour + water).
 * Days 2–14 = daily guidance with feeding instructions.
 */
export const starterGuide: GuideDay[] = [
  {
    day: 1,
    title: 'Day 1: The Beginning',
    emoji: '🌱',
    instruction: 'Mix 50g whole wheat or rye flour with 50g lukewarm water (around 78°F) in a clean jar. Stir until there are no dry spots. Cover loosely with a lid, towel, or plastic wrap — it needs air but not dust.',
    tip: 'Use a clear jar so you can see activity from the side. Mark the level with a rubber band or tape so you can track how much it rises.',
    expectation: 'Nothing will happen today. That\'s completely normal. The wild yeast and bacteria haven\'t woken up yet.',
    feedingRatio: null,
  },
  {
    day: 2,
    title: 'Day 2: Patience',
    emoji: '⏳',
    instruction: 'Don\'t do anything today. Just let it sit at room temperature (ideally 75–80°F). Check on it once or twice — you might see a small bubble or two.',
    tip: 'A warm spot helps. On top of the fridge, near (not on) the oven, or in a turned-off oven with the light on are all good spots.',
    expectation: 'You might see a few tiny bubbles. You might not. Both are fine. The organisms are just starting to colonize.',
    feedingRatio: null,
  },
  {
    day: 3,
    title: 'Day 3: First Feeding',
    emoji: '🍽️',
    instruction: 'Discard about half the mixture (you should have roughly 50g left). Add 50g all-purpose flour and 50g lukewarm water. Stir well. Cover loosely again.',
    tip: 'Why discard? Removing some starter keeps the population manageable and prevents acid buildup that would make it too sour to rise. Think of it like pruning a plant — you remove to strengthen. The "discard" doesn\'t have to go in the trash either — save it in the fridge for pancakes or crackers.',
    expectation: 'You might see some bubbles and a slightly sour or yeasty smell. The mixture may look a bit puffier than yesterday. It might also smell funky — that\'s the bad bacteria getting outcompeted. Totally normal.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    reassurance: 'Nothing visible yet? That\'s completely normal. Most starters don\'t show real activity until Day 5–7. Keep going.',
  },
  {
    day: 4,
    title: 'Day 4: Keep Going',
    emoji: '💪',
    instruction: 'Same as yesterday: discard half, feed with 50g flour and 50g water. Stir well, cover loosely.',
    tip: 'Consistency matters more than perfection. Try to feed at roughly the same time each day. Morning works well for most people.',
    expectation: 'More bubbles! The starter may start rising a bit after feeding. It might also have a strong sour or alcoholic smell. This is the "ugly phase" — it gets better.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    reassurance: 'Still not seeing much? Completely normal. The organisms need time to establish. Days 5–7 are when most starters really wake up.',
  },
  {
    day: 5,
    title: 'Day 5: Signs of Life',
    emoji: '🫧',
    instruction: 'Discard half, feed with 50g flour and 50g water. If you want, switch to bread flour instead of all-purpose — it has more protein for the yeast to eat.',
    tip: 'If your starter smells really bad (like nail polish remover or vomit), don\'t panic. That\'s acetone from the bacteria. It goes away as the good organisms take over.',
    expectation: 'The starter should be showing consistent bubbles and possibly some rise (maybe 25–50% volume increase after feeding). The smell should be shifting from funky to mildly sour.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    reassurance: 'If it still looks flat and smells weird — that\'s okay. Some starters take until Day 7 or even Day 10 to show visible activity. Temperature is the biggest factor: below 70°F things move very slowly.',
  },
  {
    day: 6,
    title: 'Day 6: Getting Stronger',
    emoji: '📈',
    instruction: 'Discard half, feed with 50g flour and 50g water. After feeding, put a rubber band at the top of the mixture so you can clearly see how much it rises.',
    tip: 'If it\'s not showing much activity yet, try moving it to a warmer spot. Temperature is the #1 factor in starter speed. Below 70°F, things move very slowly.',
    expectation: 'The rise should be more noticeable — 50% or more after feeding. Bubbles should be throughout the mixture, not just on top. It should smell pleasantly tangy.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
  },
  {
    day: 7,
    title: 'Day 7: One Week In!',
    emoji: '🎉',
    instruction: 'Discard half, feed with 50g flour and 50g water. You\'ve been at this a whole week — that\'s the hardest part done.',
    tip: 'Take a photo after feeding and again at peak rise. This helps you learn your starter\'s rhythm and gives you a reference for "what peak looks like" on your specific starter.',
    expectation: 'Your starter should be reliably rising 50–75% after feeding. It may not be doubling yet — that\'s normal for week 1. The smell should be pleasant and tangy, like yogurt.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 8,
    title: 'Day 8: Finding the Rhythm',
    emoji: '🥁',
    instruction: 'Discard half, feed with 50g flour and 50g water. From now on, start paying attention to *when* it peaks. Note the time you feed and check every couple hours.',
    tip: 'Log your feedings in BreadBook\'s Starter Tracker. The activity chart will show you patterns over time that are hard to spot day-to-day.',
    expectation: 'The starter should be rising predictably. At 75°F, peak should be around 4–8 hours after feeding. Cooler kitchens will be slower.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 9,
    title: 'Day 9: Strength Training',
    emoji: '🏋️',
    instruction: 'Try feeding at a 1:2:2 ratio today: keep 25g starter, add 50g flour and 50g water. This makes the starter work harder and builds strength.',
    tip: 'A higher-ratio feed takes longer to peak but produces a stronger, more resilient starter. Think of it like interval training.',
    expectation: 'The starter should still rise, but it may take longer to peak (8–10 hours). If it barely rises, go back to 1:1:1 tomorrow — it needs more time to mature.',
    feedingRatio: '1:2:2',
    feedingNote: '25g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 10,
    title: 'Day 10: Reading the Signs',
    emoji: '🔍',
    instruction: 'Feed 1:1:1 today (50g each). Watch for the "dome and fall" — your starter will rise, peak with a domed top, then start to flatten as it runs out of food.',
    tip: 'The moment just before it starts falling is "peak." That\'s when you want to use it for baking. Learning to read this is the key skill.',
    expectation: 'You should see a clear rise-peak-fall cycle within 4–8 hours at room temperature. Lots of bubbles visible through the jar.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 11,
    title: 'Day 11: The Float Test',
    emoji: '🫗',
    instruction: 'Feed normally (1:1:1). When it looks like it\'s at peak, try the float test: drop a small spoonful into a glass of water. If it floats, it\'s ready to bake with. An "active starter" means one that reliably doubles in size within 4–8 hours of feeding — that\'s what you\'re aiming for.',
    tip: 'The float test isn\'t 100% reliable — some healthy starters don\'t float, especially whole grain ones. But it\'s a good early indicator. Trust the rise pattern more than the float test.',
    expectation: 'If your starter doubles in 4–6 hours and passes the float test, congratulations — you could technically bake today. But a few more days of consistency will make your first bake better.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 12,
    title: 'Day 12: Almost There',
    emoji: '🏁',
    instruction: 'Feed normally (1:1:1). If your starter has been reliably doubling in 4–6 hours for the last 2–3 days, it\'s ready for baking.',
    tip: 'If it\'s NOT consistently doubling yet, don\'t worry. Some starters take 2–3 weeks. Keep feeding daily. Every starter has its own timeline.',
    expectation: 'Consistent doubling within 4–8 hours. Pleasant, tangy smell. Lots of bubbles visible through the jar. Predictable rise-peak-fall cycle.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 13,
    title: 'Day 13: Prep Day',
    emoji: '📋',
    instruction: 'Feed normally. Today, pick a recipe for your first bake! Browse the BreadBook recipes and look for something tagged "beginner." Make sure you have all the ingredients.',
    tip: 'Artisan Sourdough Made Simple is a great first bake — it\'s forgiving and teaches fundamental techniques. Plan to mix tomorrow when your starter peaks.',
    expectation: 'Your starter is ready. Take a moment to feel proud — you created a living culture from just flour and water. That\'s genuinely amazing.',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
    canBakeEarly: true,
  },
  {
    day: 14,
    title: 'Day 14: Bake Day!',
    emoji: '🍞',
    instruction: 'Feed your starter first thing in the morning. When it peaks (4–6 hours later), it\'s go time. Start your first bake! Use the BreadBook bake mode to guide you through every step.',
    tip: 'Don\'t stress about perfection. Your first loaf won\'t be your best — and that\'s exactly how it should be. The whole point is to learn. Log everything in your bake journal.',
    expectation: 'You\'re a sourdough baker now. Your starter will keep getting stronger with regular feedings. Welcome to the community!',
    feedingRatio: '1:1:1',
    feedingNote: '50g starter + 50g flour + 50g water',
  },
]

/** How many days the guided path covers */
export const GUIDE_TOTAL_DAYS = starterGuide.length
