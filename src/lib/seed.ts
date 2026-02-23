import { createAdminClient } from "@/lib/supabase/admin";

const SEED_ARTICLES = [
  {
    title: "Elden Ring: Nightreign Redefines Co-op Souls Combat",
    slug: "elden-ring-nightreign-redefines-co-op-souls-combat",
    excerpt: "FromSoftware's new standalone co-op experience takes the Elden Ring formula in an exciting new direction with roguelike elements and three-player cooperation.",
    content: `## A Bold New Direction for Elden Ring

FromSoftware has done it again. **Elden Ring: Nightreign** isn't just another DLC or expansion — it's a completely reimagined take on what a Souls-like game can be when designed from the ground up for cooperative play.

## What Makes Nightreign Different

The game introduces a fascinating roguelike structure to the Elden Ring universe. Each run takes place over a compressed three-day cycle, with the map literally shrinking as a deadly fog closes in — yes, it's battle royale meets Dark Souls, and it works far better than it has any right to.

### Key Changes from Base Elden Ring

- **Three-player co-op focus**: Every encounter is designed for teamwork
- **Roguelike progression**: Each run is unique with randomized encounters
- **New character classes**: Eight unique Nightreign heroes with distinct abilities
- **Condensed sessions**: Full runs take 30-40 minutes instead of hundreds of hours

## The Combat Evolution

Combat retains the weighty, deliberate feel FromSoftware is known for, but the addition of hero abilities adds a layer of tactical depth. The Mage can create shield barriers, the Knight can taunt enemies, and the Rogue can turn invisible. It's like FromSoftware studied the best co-op games and applied those lessons with their signature precision.

## Night Cycle System

The three-night structure creates natural difficulty escalation. Night 1 eases players in with familiar enemies, Night 2 introduces mini-bosses and environmental hazards, and Night 3 culminates in a massive boss fight that requires genuine coordination.

## Performance and Visuals

Running on an updated version of the Elden Ring engine, Nightreign looks gorgeous. The fog effects are particularly impressive, creating an oppressive atmosphere as the playable area shrinks. Performance is solid at 60fps on current-gen consoles.

## The Verdict

Elden Ring: Nightreign proves that FromSoftware can innovate within their own framework. By combining their masterful combat design with roguelike elements and genuine cooperative play, they've created something that feels both familiar and refreshingly new.

Whether you're a Souls veteran or someone who's been intimidated by the series' solo difficulty, Nightreign offers a compelling entry point that doesn't sacrifice the challenge these games are known for.`,
    category: "reviews" as const,
    status: "published" as const,
    hero_image: "https://media.rawg.io/media/games/b29/b294fdd866dcdb643e7bab370a552855.jpg",
    hero_image_alt: "Elden Ring: Nightreign screenshot",
    game_name: "Elden Ring: Nightreign",
    game_slug: "elden-ring-nightreign",
    game_platforms: ["PC", "PlayStation 5", "Xbox Series S/X"],
    game_genres: ["Action", "RPG", "Co-op"],
    game_developer: "FromSoftware",
    game_publisher: "Bandai Namco Entertainment",
    review_score: 9.2,
    review_pros: [
      "Brilliant co-op design that maintains Souls difficulty",
      "Roguelike structure adds tremendous replay value",
      "Hero abilities add strategic depth without oversimplifying",
      "Stunning visual design with oppressive atmosphere",
      "Accessible to newcomers while challenging for veterans"
    ],
    review_cons: [
      "Solo play feels incomplete without a full party",
      "Some hero abilities feel more useful than others",
      "Limited story compared to base Elden Ring"
    ],
    review_verdict: "Elden Ring: Nightreign is a masterful reimagining of the Souls formula that proves cooperative play and punishing difficulty can coexist beautifully.",
    ai_model: "claude-sonnet-4-20250514",
    published_at: new Date().toISOString(),
    view_count: 342,
    comment_count: 0,
  },
  {
    title: "GTA 6 Gets Fall 2025 Release Window Amid Massive Hype",
    slug: "gta-6-fall-2025-release-window-confirmed",
    excerpt: "Rockstar Games confirms the most anticipated game in history will arrive this fall, with new details about the Vice City setting and dual-protagonist system.",
    content: `## The Wait Is Almost Over

Rockstar Games has officially confirmed that **Grand Theft Auto VI** will launch in Fall 2025, ending years of speculation and making it arguably the most anticipated game release in history.

## What We Know So Far

The game returns to Vice City — Rockstar's fictionalized Miami — but this time it's a living, breathing modern metropolis that makes GTA V's Los Santos look like a proof of concept.

### Dual Protagonists

For the first time in the series, players will control two protagonists:
- **Jason**: A career criminal looking for one last score
- **Lucia**: A former cartel member trying to go straight

The dynamic between these two characters promises to deliver Rockstar's most emotionally complex narrative yet.

## Technical Ambitions

Industry insiders report that GTA 6 is pushing technical boundaries in several areas:

1. **Dynamic weather** that affects gameplay and NPC behavior
2. **Interior environments** for most buildings, not just story locations
3. **Evolving world** that changes over the course of the story
4. **Enhanced NPC AI** with daily routines and reactive behavior

## The Economic Impact

Pre-release analytics suggest GTA 6 could generate over $1 billion in its first 24 hours, shattering entertainment records across all media. The game's cultural impact is expected to rival major film releases.

## What This Means for Gaming

GTA 6 represents the culmination of over a decade of development and could set new standards for open-world game design. Whether it lives up to the astronomical expectations remains to be seen, but Rockstar's track record suggests they're one of the few studios that could pull it off.

The Fall 2025 release window gives Rockstar plenty of runway for final polish, though fans are hoping for a more specific date announcement soon.`,
    category: "news" as const,
    status: "published" as const,
    hero_image: "https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg",
    hero_image_alt: "GTA 6 promotional image",
    game_name: "Grand Theft Auto VI",
    game_slug: "grand-theft-auto-vi",
    game_platforms: ["PlayStation 5", "Xbox Series S/X"],
    game_genres: ["Action", "Adventure", "Open World"],
    game_developer: "Rockstar North",
    game_publisher: "Rockstar Games",
    ai_model: "claude-sonnet-4-20250514",
    published_at: new Date(Date.now() - 86400000).toISOString(),
    view_count: 1205,
    comment_count: 0,
  },
  {
    title: "Nintendo Switch 2: Everything We Know About Nintendo's Next Console",
    slug: "nintendo-switch-2-everything-we-know",
    excerpt: "A comprehensive look at Nintendo's upcoming hardware, from confirmed specs to rumored features and the launch lineup that could define the next generation.",
    content: `## The Next Chapter for Nintendo

Nintendo has officially unveiled the **Switch 2**, and it's exactly what fans have been hoping for — a more powerful successor that maintains the hybrid portable/home console concept that made the original Switch a phenomenon.

## Confirmed Specifications

The Switch 2 represents a significant leap in hardware capability:

- **Custom NVIDIA chip** with DLSS support for 4K output when docked
- **8-inch OLED screen** (up from 7 inches on Switch OLED)
- **Magnetic Joy-Cons** with improved analog sticks and Hall effect sensors
- **Backward compatible** with original Switch game library
- **Enhanced online infrastructure** with improved voice chat and party system

## The Launch Lineup

Nintendo is reportedly planning an aggressive launch window with several major titles:

### Confirmed
- **Mario Kart World** — a massive new entry with 48 tracks at launch
- **The Legend of Zelda** — a new title (not a port or remake)

### Rumored
- Enhanced ports of Breath of the Wild and Tears of the Kingdom running at 60fps
- A new Metroid title
- Pokémon Legends follow-up

## Pricing and Availability

While Nintendo hasn't announced official pricing, industry analysts expect the Switch 2 to launch at $349-$399, positioning it competitively against the Steam Deck and other portable gaming devices.

## What It Means for the Industry

The Switch 2 doesn't need to compete with PlayStation or Xbox on raw power. Instead, Nintendo is doubling down on what made the original Switch successful: the flexibility of playing anywhere with a library of incredible first-party games.

If the launch lineup delivers, the Switch 2 could once again prove that innovative design and great games matter more than teraflops.`,
    category: "previews" as const,
    status: "published" as const,
    hero_image: "https://media.rawg.io/media/games/7fa/7fa0b586293c5861ee32490e953a4571.jpg",
    hero_image_alt: "Nintendo Switch 2 concept",
    game_name: "Nintendo Switch 2",
    game_slug: "nintendo-switch-2",
    game_platforms: ["Nintendo Switch 2"],
    game_genres: ["Hardware", "Console"],
    game_developer: "Nintendo",
    game_publisher: "Nintendo",
    ai_model: "claude-sonnet-4-20250514",
    published_at: new Date(Date.now() - 172800000).toISOString(),
    view_count: 890,
    comment_count: 0,
  },
  {
    title: "Why 2025 Might Be the Greatest Year in Gaming History",
    slug: "why-2025-greatest-year-gaming-history",
    excerpt: "From GTA 6 to Elden Ring Nightreign, the Switch 2 to Monster Hunter Wilds — we look at why 2025's lineup is historically unprecedented.",
    content: `## A Perfect Storm of Releases

Every few years, the gaming industry has a banner year that fans look back on with fondness. 2017 had Breath of the Wild and Mario Odyssey. 2020 had Animal Crossing and The Last of Us Part II. But 2025? 2025 might just eclipse them all.

## The Heavy Hitters

Let's look at what's confirmed or highly likely for 2025:

### AAA Blockbusters
- **Grand Theft Auto VI** — The most anticipated game ever made
- **Elden Ring: Nightreign** — FromSoftware's co-op reinvention
- **Monster Hunter Wilds** — Capcom's flagship franchise goes next-gen
- **Death Stranding 2** — Kojima's latest auteur vision

### New Hardware
- **Nintendo Switch 2** — A new console generation from Nintendo
- **PS5 Pro** — Enhanced performance for Sony's platform

### Indie Gems
The indie scene is equally stacked, with titles like Hollow Knight: Silksong (surely this time?) and numerous promising projects from smaller studios.

## Why This Year Is Different

What makes 2025 special isn't just the quantity of major releases — it's the **diversity**. We're getting open-world epics, cooperative experiences, horror games, platformers, and entirely new hardware. There's genuinely something for every type of gamer.

## The Economic Factor

The gaming industry is projected to reach $200 billion in revenue in 2025, with GTA 6 alone potentially accounting for several billion. This kind of economic impact puts gaming firmly ahead of movies and music combined.

## Historical Comparison

| Year | Notable Releases |
|------|-----------------|
| 1998 | Ocarina of Time, Half-Life, Metal Gear Solid |
| 2004 | Half-Life 2, Halo 2, GTA: San Andreas |
| 2007 | BioShock, Portal, Super Mario Galaxy |
| 2017 | BotW, Horizon, Persona 5 |
| 2025 | GTA 6, Elden Ring NR, Switch 2, MH Wilds |

## The Caveat

Of course, with great expectations come potential disappointments. Delays, performance issues, and overhyped features could temper the excitement. But on paper, 2025's gaming calendar is absolutely loaded.

Whether you're a casual player or a hardcore enthusiast, this year demands your attention. Clear your backlogs and prepare your wallets — it's going to be one hell of a ride.`,
    category: "features" as const,
    status: "published" as const,
    hero_image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe73d6f9f657abc.jpg",
    hero_image_alt: "Gaming collage 2025",
    game_name: null,
    game_slug: null,
    game_platforms: null,
    game_genres: null,
    game_developer: null,
    game_publisher: null,
    ai_model: "claude-sonnet-4-20250514",
    published_at: new Date(Date.now() - 259200000).toISOString(),
    view_count: 567,
    comment_count: 0,
  },
  {
    title: "The Problem With Review Scores (And Why We Use Them Anyway)",
    slug: "problem-with-review-scores-why-we-use-them",
    excerpt: "An honest look at the limitations of numerical review scores, the culture they create, and why they remain the most effective way to communicate game quality.",
    content: `## The Uncomfortable Truth About Numbers

Here's a confession: as an AI-powered publication, we assign review scores knowing full well they're reductive. A single number can't capture the nuanced experience of playing a 60-hour RPG. And yet, we do it anyway. Here's why.

## The Case Against Scores

Critics of review scores make compelling arguments:

### They're Inherently Reductive
A 7.5 for a niche indie game means something completely different than a 7.5 for a AAA blockbuster. The number strips away context that matters.

### They Create Toxic Discourse
"Why did you give this a 7 instead of an 8?" This question, asked thousands of times across forums and comment sections, reduces criticism to arithmetic rather than engaging with the actual review text.

### They Enable Metacritic Culture
When developer bonuses are tied to aggregate scores, a single review can have outsized financial impact. That's a lot of pressure for what amounts to one person's (or one AI's) opinion.

## The Case For Scores

And yet, scores persist because they serve real purposes:

### They Respect Your Time
You don't always have time to read a 2,000-word review. A glance at a score gives you immediate context about quality, letting you decide whether to invest more time reading the full review.

### They Force Accountability
A score is a commitment. The reviewer has to distill their feelings into something concrete, which discourages wishy-washy criticism.

### They Enable Comparison
Is Monster Hunter Wilds better than Monster Hunter World? Scores provide a quick reference point, even if the comparison is imperfect.

## Our Approach

At The Game Gazette, we score reviews on a 0-10 scale with these principles:

- **Scores are not rankings** — a 9.0 RPG isn't "better" than a 9.0 platformer
- **The text always matters more** — read our pros, cons, and verdict
- **We own our subjectivity** — as an AI, we acknowledge our analysis comes from patterns in gaming discourse, not personal play experience

## The Bottom Line

Review scores are a flawed but useful tool. Like democracy, they're the worst system except for all the others we've tried. The key is treating them as a starting point for discussion, not the final word.

So when you see our score of 8.5 on the latest release, don't just look at the number — read the words around it. That's where the real review lives.`,
    category: "opinion" as const,
    status: "published" as const,
    hero_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6571c2.jpg",
    hero_image_alt: "Gaming review concept",
    game_name: null,
    game_slug: null,
    game_platforms: null,
    game_genres: null,
    game_developer: null,
    game_publisher: null,
    ai_model: "claude-sonnet-4-20250514",
    published_at: new Date(Date.now() - 345600000).toISOString(),
    view_count: 234,
    comment_count: 0,
  },
];

export async function seedArticles() {
  const supabase = createAdminClient();

  // Check if articles already exist
  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    console.log(`Database already has ${count} articles. Skipping seed.`);
    return { seeded: false, count };
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(SEED_ARTICLES)
    .select();

  if (error) {
    console.error("Seed error:", error);
    throw error;
  }

  console.log(`Seeded ${data?.length || 0} articles!`);
  return { seeded: true, count: data?.length || 0 };
}
