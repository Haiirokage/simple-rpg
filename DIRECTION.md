# Game Direction Document

## Vision

An open-ended RPG where the player can inhabit any role a person could have in a living world — wilderness survivor, village guard, blacksmith, traveling trader, adventurer, bandit, or anything in between. The core systems (skills, attributes, knowledge, equipment, reputation, economy) are role-agnostic; what differs is which systems a player engages with and how deeply.

Each playstyle should feel like a fleshed-out game in its own right. A player who never leaves the forest and masters survival should have as rich an experience as one who becomes a renowned trader between settlements. And crucially, a single playthrough can span multiple roles — a farmer's son who learns to fight, gains reputation, accumulates influence, and eventually rules a kingdom. The systems must support both horizontal diversity (many roles at one tier of society) and vertical progression (rising from nobody to power).

**Priority order**: Build the core single-run experience first. The current forest survival loop is the first complete "role" — deepen it, then expand the world and systems that enable other roles. Meta-progression (new game+, retirement, persistent unlocks) comes last, once the base game supports enough variety.

---

## Current State Summary

**What exists (first role: forest survivor, shallow but cohesive)**:
- 1 biome (forest), 2 creatures (deer, wolf), 3 encounters
- 4 skills, 4 attributes, 1 acuity type (combat)
- 11 resources, basic crafting/enrichment, 4 structures + 3 home upgrades
- 12-month seasonal cycle with survival pressure
- Distance-based ranged combat with wound/AI systems
- Knowledge tier system per biome
- Discovery-based progression

**What's missing to realize the full vision**:
- Only ranged combat (no melee, no defense, no armor)
- Two creatures, three encounters — not enough variety
- One biome — no sense of world beyond the forest
- Flat crafting (one tier of tools, few recipes)
- No economy, trade, or currency
- No NPCs, settlements, or social systems
- No reputation or social standing
- No narrative arc or role-specific goals
- No travel between locations

---

## Design Pillars

### 1. The world doesn't revolve around the player
- NPCs have routines, economies function, seasons change — the world moves with or without you
- The player finds their place in the world rather than being its center

### 2. Roles emerge from systems, not classes
- There is no class selection. A "blacksmith" is someone who spent time mastering crafting and metallurgy. A "bandit" is someone who chose to rob traders.
- The same skill and attribute systems underpin every role
- Specialization happens through player choice and time investment

### 3. Depth through mastery, not grind
- Skill progression unlocks new options, not just bigger numbers
- Knowledge of a place or trade should change how you interact with it
- A master hunter plays fundamentally differently than a novice, not just faster
- Combat should reward player skill (tactics, positioning, timing, target selection) enough that a weak character played well can overcome challenges that a strong character played poorly cannot. Character stats shift the odds, but never replace good decision-making.

### 4. Exploration rewards curiosity and risk
- New areas gated behind preparation and knowledge
- Encounters should have meaningful choices with real stakes
- The further you venture (geographically or socially), the greater the reward and danger

### 5. Specialization simplifies what you don't care about
- As a player's role emerges, the systems they aren't focused on should become manageable background tasks
- A blacksmith buys food at the market instead of foraging. A trader pays for lodging instead of building a shelter.
- Abstraction is earned through world infrastructure: settlements provide services (food, shelter, security) that replace manual survival loops
- The survival layer is the raw default — civilization is what abstracts it away
- This means the same systems serve both the survivalist (who engages deeply) and the blacksmith (who pays to skip them)

### 6. Every playthrough tells a different story
- Event log as narrative thread
- Player choices (what to prioritize, where to go, who to deal with) diverge meaningfully
- Seasonal rhythm and world events create natural story arcs

---

## Roles and Progression

Roles are not classes and don't form a hierarchy. They emerge from player choices, and progression means going deeper within your chosen path — not climbing a universal ladder. A wizard's apprentice, a bandit king, and an actual king all represent mastery in different dimensions. A farmer's son who becomes king is one story; one who becomes an archmage is equally valid.

A single playthrough can span multiple roles. You can blend them freely: a hunter who dabbles in herbalism, a trader who learned to fight on the road, a blacksmith who moonlights as a bandit.

### Possible roles (examples, not exhaustive)

- **Wilderness Survivor**: The current loop. Hunt, gather, craft, endure seasons.
- **Hunter/Trapper**: Specialize in tracking, trapping, skinning. Trade pelts and meat.
- **Farmer**: Cultivate land, raise animals. Seasonal planting and harvest cycles.
- **Blacksmith**: Master crafting and metallurgy. Acquire materials through trade or mining.
- **Trader**: Travel between settlements. Buy low, sell high. Manage inventory and routes.
- **Guard/Soldier**: Protect a settlement or serve a lord. Melee combat focus. Wages, reputation.
- **Adventurer**: Explore dangerous areas. Dungeon-like encounters. Treasure and rare discoveries.
- **Bandit**: Rob travelers. Hostile reputation with settlements. High risk, high reward.
- **Herbalist/Healer**: Gather medicinal plants. Craft remedies. Serve a community.
- **Wizard/Scholar**: Study arcane or natural forces. Magic system (future).
- **Leader/Ruler**: Govern territory, manage people, deal with threats through delegation and politics.

---

## Core Gameplay Modes

The game has two fundamental modes that apply regardless of role or location:

### Home
Where the player has established themselves. Provides access to storage, structures, crafting stations, and local actions. The *location* of home determines what's available:
- **Forest camp**: Gathering, hunting prep, basic crafting, survival structures
- **Village workshop**: Forge, market access, NPC interactions, jobs
- **Coastal shack**: Fishing, salt harvesting, boat access

Home can potentially be relocated or established in new biomes. A player who starts as a forest survivor might eventually settle in a village, gaining access to settlement infrastructure while losing the wilderness-specific options (or keeping them if they maintain both).

### Exploration
Venturing out from home. Brings risk, discovery, and new resources. What exploration looks like depends on where home is:
- **From forest camp**: Wilderness expeditions, biome discovery, hunting, gathering
- **From village**: Trade routes to other settlements, resource gathering trips, patrol duty
- **From anywhere**: Encounters, travel management, inventory/rations, danger

A game can focus heavily on one mode or the other. A homesteader might rarely explore. An adventurer might treat home as a brief resupply stop. Both should feel complete.

---

## Abstraction Mechanic

The game has deep survival systems (food, warmth, shelter, health), but not every moment of gameplay should require micromanaging them. The solution is **contextual abstraction** — the same systems engage or disengage based on where the player is and what they're doing.

### Context determines complexity
- **In a settlement**: Buy meals, rent rooms, purchase supplies. Survival needs still exist (satiation, health) but are met with simple transactions instead of multi-step gathering/crafting loops.
- **On the road**: Survival systems re-engage. A traveling trader must manage rations, carry capacity, shelter, and route safety. Inventory and weight matter. Weather and seasons matter.
- **In the wilderness**: Full survival depth. Forage, hunt, build, endure.

### No system is ever removed — just simplified by circumstance
- A blacksmith in town still eats, but buying bread is one action, not ten
- That same blacksmith traveling to buy ore faces the road's dangers and must pack food, manage weight, and find shelter
- A hunter in the forest engages survival fully, but when selling pelts in town, the trading interface abstracts the social complexity a merchant would navigate daily

### Design implications
- Money is the primary abstraction tool — earning it is how you "buy out" of manual survival
- Settlement services vary in quality and cost (cheap inn vs comfortable lodging, street food vs hearty meal)
- The tradeoff is always time vs money vs risk: manual is free, services cost coin, and the road between them is dangerous
- Every role has moments where the "other" systems demand attention — that's what makes the world feel real

---

## Systems Needed (role-agnostic foundations)

### Combat (partially exists)
- Ranged combat (exists, needs more depth)
- Melee combat (knife, spear, sword)
- Defense/armor system
- Creature AI variety (flee, ambush, pack, territorial)

### Economy & Trade (new)
- Currency
- NPC merchants with inventories and pricing
- Supply/demand affecting prices across settlements
- Trade routes with travel risk

### NPCs & Relationships (new)
- NPCs are persistent — generated on first encounter and stored
- Key settlement roles (blacksmith, innkeeper, guard captain) are always present; others are generated as the player discovers them
- Each NPC has a rapport score reflecting accumulated interactions (trade, conversation, favors, conflict)
- Rapport affects pricing, available dialogue, willingness to offer jobs or share information
- NPCs remember notable events (you saved them, robbed them, traded fairly over time)
- Not every NPC needs deep simulation — minor NPCs can be lighter weight, important ones get full persistence

### Social & Reputation (new)
- Reputation per faction/settlement (aggregate of NPC interactions + notable actions)
- Reputation gates access: trusted traders get better prices, known criminals get turned away
- Consequences for actions (theft, violence, generosity) ripple through NPC rapport and settlement reputation
- Jobs/contracts from NPCs gated by rapport and reputation

### Crafting & Production (partially exists)
- Multi-tier material progression (stone → iron → steel)
- Specialized crafting stations (forge, tannery, loom)
- Recipe discovery through experimentation or knowledge
- Quality system tied to skill and materials

### World & Travel (partially exists)
- Multiple biomes with distinct resources and creatures
- Settlements as social/economic hubs
- Travel system with supply management and encounters
- Route knowledge reducing travel time and danger
- Day/night and seasonal effects on travel

### Knowledge & Discovery (partially exists)
- Per-biome knowledge (exists)
- Per-trade knowledge (smithing lore, herb lore, market knowledge)
- Discovery system for recipes, locations, NPCs

### Player Status (partially exists)
- Health, energy, satiation (exists)
- Clothing/warmth (partially exists via wood consumption)
- Encumbrance/carrying capacity
- Conditions/status effects (poisoned, sick, well-rested)

---

## Expansion Roadmap

### Phase 1: Deepen the Forest Survivor Role

Complete the first role so it feels like a full game.

**Combat depth**:
- Melee combat system (knife, spear)
- Player takes damage from hostile creatures
- Armor/clothing system (leather armor, fur cloak)
- 2-3 more forest creatures (boar, bear, fox)
- Creature behavior variety

**More encounters**:
- 8-10 total forest encounters
- Multi-step encounters with branching paths
- Season-dependent encounters
- Risk/reward encounters

**Crafting progression**:
- Tool tier progression (stone → iron)
- More enrichment recipes
- Weapon variety
- Clothing/armor as equipment slots

**Resources**:
- Iron ore, herbs, honey
- New material chains

**Home & structures**:
- Forge, herb garden, upgraded structures
- Plot system expansion

### Phase 2: The World Beyond

Introduce the concept of a wider world. The player's forest home becomes one location among many.

**New biomes**:
- Mountain, wetlands, coast — each with unique resources, creatures, encounters

**Travel system**:
- Multi-day expeditions with supply management
- Camp/rest mechanics
- Route knowledge and danger scaling

**First settlement**:
- A village or trading post the player can visit
- Basic NPC merchants
- Simple economy (barter or currency)

### Phase 3: Social Systems

Enable roles that involve other people.

**NPCs with depth**:
- Routines, inventories, dialogue
- Reputation system
- Jobs/contracts

**Economy**:
- Supply/demand pricing
- Trade routes between settlements
- Specialization incentives (craft what the market needs)

**Reputation & consequences**:
- Faction standing
- Criminal actions and their fallout

### Phase 4: Role Diversity

With systems in place, add content that enables distinct playstyles.

**Crafting specializations**:
- Blacksmithing, tailoring, alchemy as deep skill trees
- Specialized stations and recipes

**Combat roles**:
- Guard duties, bounty hunting, arena
- Melee weapon variety and fighting styles

**Social roles**:
- Trading caravans, settlement building
- Teaching/mentoring NPCs

### Phase 5: Meta-Progression

Once the base game supports rich single runs.

**New Game+**:
- Persistent knowledge/discovery unlocks
- Skill milestone rewards
- Retirement for bonus meta-progress
- Difficulty modifiers
- Starting scenario selection (begin as forest survivor, village apprentice, etc.)

---

## Technical Considerations

- **State management**: TanStack Query + localStorage works but has a stale-closure issue with same-tick mutations. Consider a functional updater pattern for `useUpdateData` as complexity grows.
- **Content scaling**: Definition files (creatures, encounters, discoveries) are well-structured for adding content. Keep this pattern.
- **Biome system**: Currently hardcoded to forest. Needs to be biome-agnostic before Phase 2.
- **NPC/settlement data**: Will need a new data layer for NPC state, inventories, and relationships.
- **Balance**: As content grows, consider a balance spreadsheet or test harness for progression curves.

---

## Player Knowledge as Progression

The most powerful progression system has no save data — it's what the player themselves learns about the world.

### The world is always fully present
- There are no hard gates locking away content. Everything exists in the world from the start of every playthrough — hidden locations, rare creatures, obscure interactions.
- What changes is whether the player *knows* to go there, *when* to go, and *how* to prepare.
- A veteran on a fresh save is far more effective than a new player — not from unlocks, but from knowing the world's secrets.

### Meta-progression makes it more approachable, not possible
- Meta-unlocks (hints, starting bonuses, NPC knowledge) lower the barrier to reaching content, but that content was always reachable without them.
- A new player *could* stumble onto the unicorn lake at midnight — they just wouldn't know to try.
- This preserves the thrill of discovery while still giving meta-progression meaningful value.

### Design implications
- The world simulation must be consistent enough that secrets are discoverable through observation, not random luck
- Rare events tied to world rules (season, location, time, player state) rather than pure RNG
- The game should never explain everything — reward curiosity, experimentation, and community knowledge sharing
- Some knowledge should be subtle: a merchant with better prices on certain days, a creature that only appears during fog, a plant with hidden properties

---

## Beyond Realism (future layer)

The foundational systems are grounded in reality — survival, crafting, trade, social dynamics. Once these are solid, the game expands into the fantastical:

- **Magic**: A full system to be designed later. Could involve study, rare materials, innate talent, or all three. Should integrate with existing systems (a fire spell still interacts with the warmth system, a healing spell with health).
- **Mythology**: Larger-than-life elements — legendary creatures, ancient ruins, divine intervention, cursed artifacts. Not just combat encounters but world-shaping forces.
- **Races**: Different playable or NPC races with distinct traits, cultures, settlements, and tensions. Could affect starting conditions, available skills, social dynamics, and which roles are accessible.
- **The supernatural as a layer, not a replacement**: Magic and myth should sit on top of the realistic base, not replace it. A wizard still needs to eat. A mythical creature still has ecology. A cursed sword still follows the equipment system.

---

## Open Questions

- How punishing should death be? (Permadeath? Setback? Save points?)
- Is there a win condition, or is it purely sandbox until meta-progression adds structure?
- Should the player choose a starting scenario, or always begin the same way?
- Art direction — pixel art? Emoji? ASCII? Custom sprites?
- How large should the world map be? Abstract locations or spatial grid?
- Magic system: learned, innate, or both? How does it interact with skills/attributes?
- Races: cosmetic/cultural differences only, or mechanical differences too?
- How do mythological elements enter the world? Always present, or discovered/unlocked?
