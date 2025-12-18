<!-- .github/copilot-instructions.md - guidance for AI coding agents -->
# Copilot / AI Agent Instructions for simple-game

A survival-farming sim built with Preact. Focus: deliberate, incremental changes after reading current code state.

## 1. Big Picture

**Tech Stack:** Preact (TSX) + Vite + React Query + localStorage + styled-components

**Architecture:**
- `src/main.tsx` → wraps App with QueryClientProvider
- `src/app.tsx` → minimal: just Header + GameLayout
- `src/components/` → UI components, including actions
- `src/data/` → state hooks and storage utilities

**Game Design:** Time-based progression (days, 0-23 hours). Resource gathering in forest, crafting at home. Energy limits actions. Daylight cycle gates outdoor work.

## 2. Core Subsystems

### Actions
- **Definition:** `ActionDefinition` type with `id`, `name`, `timeCost`, `energyCost`, optional `resourceCost`
- **Location:** `src/components/actions/definitions.ts` (FOREST_ACTIONS, HOME_ACTIONS arrays)
- **Usage:** Components iterate definitions, render ActionButton, switch on action.id for logic
- **Key Actions:**
  - Forest: forage, gatherWood, gatherStone, setTrap (costs energy/time)
  - Home: clearGround (8hr, costs 60 energy, generates wood/stone with plot scaling)

### UI Layout
- **GameLayout Component:** Master layout with styled grid (GameField, GameSection)
- **Styled Elements:** EnergyCircle, TimeIndicator, ClockFace (for ActionButton cost display)
- **Pattern:** styled-components for all component styling, no inline CSS

### Time & Daylight
- **Time:** `useTime()` → `{ day: number, time: 0-23 }`
- **Seasons:** `src/data/time/season-definitions.ts` defines 12 months with sunrise/sunset hours
- **Daylight Validation:** `isActionWithinDaylight(currentTime, actionTimeCost, day)` checks if action completes before sunset
- **Usage:** ForestBiome disables actions outside daylight
- **Tool Tip:** Copenhagen-based progression: winter (8-5pm, 9h), summer (3-10pm, 19h)

### Resource State
- **Read:** `useResources()` → returns `{ resources: full state, persistedResources: discovered only }`
- **Write:** `useMutateResources()` → mutate partial state, auto-filters out zero values before saving
- **Discovery Gating:** `hasDiscoveredResources(required, persisted)` checks if craft task should show
- **Pattern:** Only resources with value > 0 persist; zero values auto-removed

## 3. Important Files & Responsibilities

- `src/app.tsx`: Root component (Header + GameLayout only)
- `src/components/GameLayout.tsx`: Master layout, all UI sections
- `src/components/actions/ForestBiome.tsx`: Forest actions with daylight check
- `src/components/actions/HomeConstruction.tsx`: Building/clearing with plot generation
- `src/components/actions/ConsumableCrafting.tsx`: Craft traps/consumables, gated by resource discovery
- `src/components/ActionButton.tsx`: Reusable action button with energy/time/resource indicators
- `src/components/actions/definitions.ts`: Centralized action costs and mechanics
- `src/data/resources.ts`: useResources, useMutateResources, hasDiscoveredResources
- `src/data/time/season-definitions.ts`: Month definitions with sunrise/sunset
- `src/data/time/season-util.ts`: isActionWithinDaylight and season lookups
- `src/data/resources/util.ts`: formatResourceCost and resource helpers

## 4. Data Flow

**Reading State:**
```tsx
const { resources, persistedResources } = useResources();
const { day, time } = useTime();
```

**Writing State:**
```tsx
const { mutate } = useMutateResources();
mutate({ berry: berry - 2, wood: wood + 10 });
```

**Action Flow:**
1. Component reads state with hooks
2. ActionButton onClick → switch(action.id) → mutate resources + updateTime
3. Mutations auto-filter zero values before localStorage
4. React Query syncs UI

## 5. Critical Patterns & Gotchas

- **Read Before Edit:** Always `read_file` current state before changing. Don't assume or work from memory.
- **Small Atomic Changes:** One file per edit, 3-5 lines context. Use `multi_replace_string_in_file` for multiple independent edits.
- **Styled-components Only:** Use styled components for most styling.
- **Action Definition Updates:** When adding/changing actions, update definitions.ts + any component using them.
- **Daylight Checks:** Forest actions must verify both start and end time within daylight (use `isActionWithinDaylight`).
- **Resource Discovery:** Before adding craft tasks, ensure resources are discoverable through gameplay.
- **No Zero-Value Storage:** Mutations auto-filter, but verify persisted state doesn't bloat with unused keys.
- **Error Checks After Edits:** Run `get_errors` immediately after non-trivial changes.

## 6. What to Change / Not Change

**Safe to Change:**
- Component JSX, styling, props
- Action definitions (costs, ids, resourceCost)
- Daylight hour ranges in season-definitions.ts
- Adding new action components following existing pattern

**Avoid Without Review:**
- Query key strings (`'TIME_STATS'`, `'RESOURCES'`)
- localStorage serialization format
- Time advancement logic in app loop
- defaultResourceStore shape (ripple effects across UI)

## 7. Workflow Commands

- `npm run dev` → start dev server (http://localhost:5173)
- `npm run build` → build and test (tsc + vite)
- `npm run preview` → preview built output
- `npm run lint` → check errors; `npm run lint:fix` → auto-fix

## 8. How to Make Changes

1. **Ask before major edits:** "Should I do X?" or "Is Y a good approach?" — I'll challenge assumptions.
2. **Make small changes only:** One file, one concept, verify it works.
3. **Read the current code first:** Always. No assumptions.
4. **Keep quality high:** Suggest code reuse, pattern alignment, edge case handling.
5. **Track progress:** Use TODO list for multi-step work.
6. **Verify after edits:** Run linter/build to catch errors early.
