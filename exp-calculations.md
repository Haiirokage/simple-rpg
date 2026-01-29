# Ranged Skill Experience Calculations

## Current System (Updated 2026-01-28)

### Assumptions
- **Bow**: Crude bow, level 10 (range = 134m)
- **Player Dexterity**: 20 (dexMult = 1.0)
- **Target**: Archery Target (undiscovered) at 50m and 100m, body shots
- **Damage**: Critical = 109.76 HP, Severe = 54.88 HP
- **Critical Bonus**: 2x exp multiplier (total 4x vs severe when accounting for damage)
- **Critical hits**: Only possible when hit chance > 20%

### Active Formulas
```
Exp Threshold: 10 * 1.5^level

Hit Chance: distanceMultiplier * dexMult * rangedMult
  - distanceMultiplier = sqrt((bowRange - distance) / (bowRange - confidentRange))
  - dexMult = 0.8 + playerDex / 100
  - rangedMult = 0.15 + playerRanged / 30

Experience: healthLost * distanceFactor * difficultyMultiplier * severityBonus
  - distanceFactor = max(0.1, (distance - 20) / 100)
  - difficultyMultiplier = max(0.1, 1.0 - max(0, hitChance - 0.05))
  - severityBonus = critical ? 2 : 1

Hit Severity:
  - Body target: Critical if hitMargin * 5 < 1 (where hitMargin = max(0, roll - hitChance + 0.4))
  - Critical rate ≈ min(20%, max(0, hitChance - 20%))
  - Severe rate ≈ 20% when crits possible, otherwise = hitChance
```

## Leveling Requirements

| Level | Exp Needed | Cumulative Exp |
|-------|------------|----------------|
| 0→1   | 10         | 10             |
| 1→2   | 15         | 25             |
| 2→3   | 22         | 47             |
| 3→4   | 33         | 81             |
| 4→5   | 50         | 131            |
| 5→6   | 76         | 207            |
| 6→7   | 113        | 321            |
| 7→8   | 170        | 491            |
| 8→9   | 256        | 747            |
| 9→10  | 384        | 1,131          |
| 10→11 | 576        | 1,707          |
| 15→16 | 4,384      | 17,837         |
| 20→21 | 33,392     | 189,340        |

## Current Progression (sqrt distance mult, /30 skill scaling)

| Level | Distance | Dist Mult | Hit% | Crit% | Sev% | Diff Mult | Exp/Shot | Shots to Level |
|-------|----------|-----------|------|-------|------|-----------|----------|----------------|
| 0     | 50m      | 0.885     | 13.3%| 0%    | 13.3%| 0.917     | 15.10    | **5.0**        |
| 0     | 100m     | 0.563     | 8.4% | 0%    | 8.4% | 0.966     | 42.41    | **2.8**        |
| 1     | 50m      | 0.885     | 16.2%| 0%    | 16.2%| 0.888     | 14.62    | **6.3**        |
| 1     | 100m     | 0.563     | 10.3%| 0%    | 10.3%| 0.947     | 41.58    | **3.5**        |
| 5     | 50m      | 0.885     | 28.0%| 8.0%  | 20.0%| 0.770     | 6.60     | **11.5**       |
| 5     | 100m     | 0.563     | 17.8%| 0%    | 17.8%| 0.872     | 38.30    | **11.2**       |
| 10    | 50m      | 0.885     | 42.8%| 20.0% | 20.0%| 0.622     | 10.25    | **56.2**       |
| 10    | 100m     | 0.563     | 27.2%| 7.2%  | 20.0%| 0.778     | 16.68    | **34.5**       |
| 20    | 50m      | 0.885     | 75.5%| 20.0% | 20.0%| 0.295     | 4.87     | **411**        |
| 20    | 100m     | 0.563     | 48.0%| 20.0% | 20.0%| 0.570     | 9.69     | **207**        |
| 30    | 50m      | 0.885     | 100% | 20.0% | 20.0%| 0.100     | 1.65     | -              |
| 30    | 100m     | 0.563     | 68.7%| 20.0% | 20.0%| 0.363     | 7.77     | -              |
| 50    | 50m      | 0.885     | 100% | 20.0% | 20.0%| 0.100     | 1.65     | -              |
| 50    | 100m     | 0.563     | 100% | 20.0% | 20.0%| 0.100     | 4.39     | -              |

## Key Observations

### 1. Early Levels Are Fast (0-5)
- Level 0→1: Only **2.8 shots** at 100m, **5.0 shots** at 50m
- Level 1→2: Only **3.5 shots** at 100m, **6.3 shots** at 50m
- Distant shots give much better exp due to difficulty multiplier
- New players get immediate feedback and quick first level

### 2. Mid Game Plateau Emerges (5-10)
- Level 5→6: **11 shots** at either distance
- Level 10→11: **34-56 shots** depending on distance
- Players need to start varying their practice or seek new challenges
- Distance becomes critical - 100m is nearly 2x better than 50m

### 3. Late Game Requires Variety (20+)
- Level 20→21: **207 shots at 100m**, **411 shots at 50m**
- Close shots become very inefficient (high hit chance = low difficulty mult)
- 50m archery target saturates at level 30 (100% hit chance)
- 100m archery target saturates at level 49 (100% hit chance)

### 4. Hit Chance Saturation Problem Returns
- With /30 scaling, players hit 100% accuracy too early:
  - **Level 30**: 100% hit at 50m
  - **Level 49**: 100% hit at 100m
- Once at 100%, difficulty multiplier drops to 0.1x (minimum)
- This makes further progression require moving to harder targets (discovered enemies)
- Consider using /35 scaling to delay saturation until level 41 (50m) and never reach 100% at 100m

### 5. Exp Formula Impact
- New formula `10 * 1.5^x` is **5x easier** than old `50 * 1.5^x`
- This compensates for the sqrt distance nerf (~30% harder hits at range)
- Results in faster early progression but same late-game plateau pattern

## Skill Scaling Trade-off: /30 vs /35

The skill scaling factor determines how quickly ranged skill level improves hit chance.

### Current (/30 scaling)
```
rangedMult = 0.15 + playerRanged / 30
```
- **Pros**: Faster progression, compensates for sqrt nerf, more forgiving for new players
- **Cons**: Players reach 100% hit chance too early (level 30 at 50m, level 49 at 100m)
- **Effect**: Diminishing returns kick in before reaching high skill levels

### Alternative (/35 scaling)
```
rangedMult = 0.15 + playerRanged / 35
```
- **Pros**: Delays 100% hit at 50m to level 41, prevents 100% at 100m until level 88
- **Cons**: Slightly slower progression (~14% fewer hits), more challenging early game
- **Effect**: Maintains difficulty multiplier bonus at high levels, encourages long-range practice

### Recommendation
- **Use /35** if you want sqrt to prevent hit saturation as intended
- **Use /30** if you prioritize faster progression and accept that players will eventually saturate
- The current /30 somewhat defeats the purpose of switching from cbrt to sqrt
