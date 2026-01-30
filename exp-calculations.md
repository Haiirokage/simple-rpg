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

## Archery Target vs Discovered Deer Comparison

### Target Stats
- **Archery Target**: 0 dex, 15 body armor, undiscovered
- **Deer**: 42 dex, 15 body armor, discovered (2x exp multiplier)
- **Player**: 20 dex

### Enemy Dex Multiplier Impact
When shooting discovered enemies:
```
enemyDexMult = clamp((playerDex - enemyDex + 30) / 40, 0, 1)
            = clamp((20 - 42 + 30) / 40, 0, 1) = 0.2
```
Deer are much harder to hit (0.2x hit chance) but give 2x exp when discovered.

### Comparison Table

| Level | Target       | Dist | Hit% | Diff Mult | Dist Factor | Disc Factor | Exp/Shot | Notes                    |
|-------|--------------|------|------|-----------|-------------|-------------|----------|--------------------------|
| 1     | Archery      | 100m | 10.3%| 0.947     | 0.8         | 1x          | **41.6** | Easy to practice         |
| 1     | Deer         | 50m  | 3.2% | 1.000     | 0.3         | 2x          | **32.9** | Very hard, full exp      |
| 1     | Deer         | 75m  | 2.2% | 1.000     | 0.55        | 2x          | **60.4** | Extremely hard           |
| 1     | Deer         | 100m | 2.1% | 1.000     | 0.8         | 2x          | **87.8** | Nearly impossible        |
| 5     | Archery      | 100m | 17.8%| 0.872     | 0.8         | 1x          | **38.3** | Reliable practice        |
| 5     | Deer         | 50m  | 8.9% | 0.961     | 0.3         | 2x          | **31.6** | Difficult                |
| 5     | Deer         | 75m  | 6.1% | 0.989     | 0.55        | 2x          | **59.5** | Very difficult           |
| 5     | Deer         | 100m | 4.6% | 1.000     | 0.8         | 2x          | **87.8** | Extremely difficult      |
| 10    | Archery      | 100m | 27.2%| 0.778     | 0.8         | 1x          | **16.7** | Consistent hits          |
| 10    | Deer         | 50m  | 8.6% | 0.964     | 0.3         | 2x          | **31.7** | Very difficult           |
| 10    | Deer         | 75m  | 5.9% | 0.991     | 0.55        | 2x          | **59.7** | Extremely difficult      |
| 10    | Deer         | 100m | 5.4% | 1.000     | 0.8         | 2x          | **87.8** | Nearly impossible        |
| 12    | Archery      | 100m | 31.4%| 0.736     | 0.8         | 1x          | **14.8** | Good practice            |
| 12    | Deer         | 50m  | 9.7% | 0.953     | 0.3         | 2x          | **31.3** | Very difficult           |
| 12    | Deer         | 100m | 6.4% | 0.986     | 0.8         | 2x          | **86.2** | Extremely challenging    |
| 20    | Archery      | 100m | 48.0%| 0.570     | 0.8         | 1x          | **9.7**  | Too easy                 |
| 20    | Deer         | 50m  | 37.3%| 0.677     | 0.3         | 2x          | **22.2** | Farmable                 |
| 20    | Deer         | 75m  | 25.6%| 0.794     | 0.55        | 2x          | **47.9** | Good exp                 |
| 20    | Deer         | 100m | 19.2%| 0.858     | 0.8         | 2x          | **75.1** | Best option              |
| 30    | Archery      | 100m | 68.7%| 0.363     | 0.8         | 1x          | **7.8**  | Saturated                |
| 30    | Deer         | 50m  | 57.5%| 0.475     | 0.3         | 2x          | **15.6** | Easy                     |
| 30    | Deer         | 75m  | 39.5%| 0.655     | 0.55        | 2x          | **39.5** | Moderate                 |
| 30    | Deer         | 100m | 29.7%| 0.753     | 0.8         | 2x          | **66.0** | Best option              |

### Key Insights

1. **Early Game (Level 1-5)**: Archery target at 100m is better for learning
   - More consistent hits (10-18%) vs deer (2-9%)
   - Similar or better exp per successful shot
   - Deer at 100m gives highest exp but extremely low hit chance makes it frustrating

2. **Mid Game (Level 10-20)**: Deer at 75-100m becomes viable and rewarding
   - Level 10: Deer at 100m gives **5x more exp** than archery target (84 vs 17)
   - Hit chances become reasonable (9-19%)
   - Distance matters a lot for deer - 100m is nearly 3x better than 50m

3. **Late Game (Level 20+)**: Deer hunting becomes necessary
   - Archery target exp drops below 10/shot due to high hit chance
   - Deer at 100m gives **8-10x more exp** than archery target
   - Deer remain challenging even at high levels due to their dexterity

4. **Natural Progression Path**:
   - Levels 0-5: Practice on archery target at 50-100m
   - Levels 5-10: Transition to deer at 50-75m
   - Levels 10+: Hunt deer at 100m for optimal exp
   - Discovered bonus (2x) makes seeking out and engaging enemies essential for progression
