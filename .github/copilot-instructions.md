<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Copilot / AI Agent Instructions for simple-game

A survival-farming sim built with Preact + React Query. Focus on deliberate, incremental changes after reading current code state. This is a time/energy-driven game where players manage resources, craft equipment, explore, and survive through seasons.

## 1. Architecture Overview

**Tech Stack:** Preact (TSX) + Vite + React Query 5 + localStorage + styled-components

**Data Flow Model:**
- All state stored in localStorage via React Query (no separate backend)
- `src/data/` contains domain hooks organized by feature (resources, time, equipment, exploration, knowledge, playerStatus, structures, homeUpgrades, attributes, eventLog)
- **Generic pattern:** `useDataQuery(key, fallback)` reads, `useUpdateData(key, default)` writes
- Mutations auto-filter zero-value fields; storage normalizes via `pickBy()` to keep state lean

**App Structure:**
- `src/app.tsx` → Root; switches between HomeLayout (home/crafting view) and ExplorationLayout (exploration map)
- `src/main.tsx` → QueryClientProvider wrapper
- `src/sections/` → Page-level layouts (HomeLayout, ExplorationLayout, Header, EventLog, PlayerStatus)
- `src/components/` → Reusable UI and action handlers

## 2. Core Game Subsystems

### Time & Daylight
- **State:** `useTime()` returns `{ time: 0-23, day: 0-359, year: 1 }` (day wraps annually)
- **Seasons:** `src/data/time/season-definitions.ts` maps months (0-11) → rise/set hours (Copenhagen-based: winter 8-17/9h, summer 3-22/19h)
- **Validation:** `isActionWithinDaylight(time, timeCost, day)` checks action completes before sunset; forest actions use this gate
- **Advancement:** `useUpdateTime()` mutates time; consumed after actions/exploration events

### Resources & Inventory
- **State:** `useResources()` → `{ resources: full defaults merged with persisted, data: persisted only }`
- **Write:** `useMutateResources()` → mutate partial state; auto-filters zero values, applies storage caps per resource type
- **Storage Capacity:** `getStorageCapacity(resourceKey, structures)` scales based on built structures (e.g., storage buildings)
- **Key Resources:** wood, stone, berry, rabbit, food, and equipment-specific consumables (trap, bait, etc.)
- **No Discovery Gate Yet:** TODO in hooks.ts indicates resource discoverability tracking planned (for craft gating)

### Equipment & Consumables
- **State:** `useEquipment()` → nested store: `{ consumables: { trap, bait, ... }, tools: { axe, pickaxe, ... }, ... }`
- **Mutations:** `useUpdateEquipment()` with `mutateSpecific(key, updates)` for nested updates
- **Active Traps:** `useResetTraps()` → zeros active trap count (post-day mechanics)
- **Usage:** Craft tasks create consumables/tools; actions consume them (e.g., bait used to set traps)

### Knowledge & Progression
- **State:** `useKnowledge()` → nested regions: `{ forest: { tier, level }, ... }`
- **Scaling:** `calculateYieldMultiplier(region, knowledge)` in `knowledge/util.ts` — higher knowledge = better resource yields
- **Unlock Complexity:** Actions have `complexity` field gated by knowledge level (discovery mechanism)

### Exploration & Events
- **Active Exploration:** `useExploration()` → `{ active: boolean, ... }` — toggles between home and exploration modes
- **End-of-Day Events:** `getEndOfDayEvent(month)` picks weighted random from POSITIVE/NEGATIVE/NEUTRAL lists
- **Event Likelihood:** Events have monthly likelihood array; picked via weighted probability

### Player Status
- **State:** `usePlayerStatus()` → health, energy, satiation, mood, condition
- **Energy Drain:** `applyResourceDecay()` in `consumption.ts` handles daily resource losses; energy restored via food
- **Satiation:** `updateSatiationFromFood()` calculates nutrition from consumed foods (NUTRITION_TYPES mapping)

### Structures & Building
- **State:** `useStructures()` → plot counts, buildings, production facilities
- **Yield Logic:** `getWoodCostPerDay()`, `getRabbitCatchLikelihood()` in `season-util.ts` — yields vary seasonally

## 3. Data Hooks Pattern (Critical)

**Read Pattern:**
```tsx
const { data, refetch } = useDataQuery<TypeName>("QUERY_KEY", defaultObject);
// data contains defaults merged with persisted (spread: defaults THEN persisted)
```

**Write Pattern:**
```tsx
const { mutate } = useUpdateData<TypeName>("QUERY_KEY", defaultObject);
mutate({ fieldA: newValueA }); // partial updates OK; zeros auto-removed
```

**Custom Hooks Pattern (e.g., resources, equipment):**
```tsx
// Wrapper hooks add business logic (filtering, storage caps, nested updates)
export const useMutateResources = () => {
  const { data } = useResources();
  // mergeData() applies caps, filters zeros before mutation
  const { mutate } = useUpdateData("RESOURCES", data);
};
```

Query keys used: `TIME_STATS`, `RESOURCES`, `EQUIPMENT`, `EXPLORATION`, `PLAYER_STATUS`, `KNOWLEDGE`, `STRUCTURES`, `HOME_UPGRADES`, `ATTRIBUTES`, `EVENT_LOG`

## 4. Actions System

**Definition Type:**
```typescript
type ActionDefinition = {
  id: string;
  name: string;
  timeCost: number;
  energyCost: number;
  resourceCost?: Partial<ResourceStore>;
  complexity?: number; // gated by knowledge
};
```

**Action Categories:**
- Forest: forage, gatherWood, gatherStone, setTrap (daylight-gated; yield scales with knowledge)
- Home: clearGround (8hr, 60 energy), craft tasks (craft traps, food, tools)
- Exploration: map movement, site discovery (awaits exploration feature completion)

**Action Handler Pattern:**
1. Component renders ActionButton(s) from definitions array
2. onClick → switch(action.id) → call handler function
3. Handler: mutate resources, update time, trigger events if day-end
4. Daylight check: use `isActionWithinDaylight(time, timeCost, day)` before allowing outdoor actions

**Styled Display:**
- `ActionButton` shows cost indicators (EnergyCircle, TimeIndicator) via styled-components
- Resource cost displayed inline if action has resourceCost

## 5. Component Conventions

- **Styled-Components Only:** All styling via styled-components; no inline CSS or sass in components
- **Hook-Based State:** Components are functional, using `useTime()`, `useResources()`, `useMutateResources()`, etc.
- **Action Rendering:** Iterate `FOREST_ACTIONS` or `HOME_ACTIONS`, render conditional buttons based on player state
- **Event Logging:** Major actions call `useAddEventLogEntry()` to record activity (EventLog visible in UI)

## 6. Key Files by Responsibility

**State & Logic:**
- `src/data/util.ts` → Generic `useDataQuery`, `useUpdateData` wrappers (the foundation)
- `src/data/resources/hooks.ts` → `useResources`, `useMutateResources`, consumption logic
- `src/data/time/hooks.ts` + `src/data/time/season-util.ts` → Time, daylight checks, seasonal yields
- `src/data/equipment/hooks.ts` → Equipment state, trap reset mechanics
- `src/data/knowledge/hooks.ts` → Knowledge progression, yield multipliers
- `src/data/playerStatus/hooks.ts` + `src/data/playerStatus/util.ts` → Health, energy, satiation updates
- `src/data/exploration/hooks.ts` → Exploration mode toggling
- `src/data/homeUpgrades/hooks.ts` → Building upgrades and unlocks
- `src/data/eventLog/hooks.ts` → Event history persistence

**UI & Sections:**
- `src/sections/HomeLayout.tsx` → Main home view dispatcher
- `src/sections/ExplorationLayout.tsx` → Exploration map view
- `src/components/actions/` → Action components (ForestBiome, HomeConstruction, ConsumableCrafting, FoodCrafting, ToolCrafting, HomeUpgrades)
- `src/components/ActionButton.tsx` → Reusable action button with cost display

**Event System:**
- `src/events/eod-events.ts` + `src/events/system-events.ts` → Event definitions with monthly likelihoods
- `src/events/util.ts` → `getEndOfDayEvent(month)`, event picking logic

## 7. Critical Patterns & Gotchas

✅ **Always do:**
- Read current code state before editing (no assumptions from memory)
- Make atomic changes: one file per edit, 3-5 lines context around change
- Use `multi_replace_string_in_file` for multiple independent edits in same session
- Verify after edits: `npm run lint`, check `get_errors`
- Document TODO items in code (e.g., resource discovery gating)

❌ **Avoid:**
- Inline CSS or SCSS in components (use styled-components)
- Changing query key strings (`TIME_STATS`, `RESOURCES`) without full codebase search
- Modifying `defaultResourceStore` shape without checking all mutation sites
- Storage cap logic outside `useMutateResources`
- Daylight checks only at action start (must verify end time too: `time + timeCost` before sunset)

⚠️ **Watch for:**
- Zero-value filtering: mutations auto-filter, but verify persisted state doesn't bloat
- Nested state updates: use `mutateSpecific()` for equipment sub-objects
- Storage capacity breaches: `mergeData()` in `useMutateResources` applies caps; verify in tests
- Seasonal variance: yields, events, daylight all shift monthly; test across seasons

## 8. Workflow Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite bundle
npm run lint       # ESLint check; --fix auto-repairs
```

## 9. How to Contribute Changes

1. **Read first:** Always `read_file` affected code before proposing/making changes
2. **Ask about intent:** "Should feature X be done this way?" — I'll challenge assumptions
3. **Small steps:** One logical change per PR/session; divide large tasks
4. **Keep patterns:** Match existing code style (hooks, styled-components, action defs)
5. **Verify:** Run lint & build after edits; check for ripple effects in related files
6. **Document gaps:** Mark TODO/FIXME for incomplete features or architectural decisions needed

**Personality:** I'm a sparring partner for ideas, a tool for fast implementation, and a code quality guardian. Challenge me on approach; I'll make small, focused changes and catch edge cases.
