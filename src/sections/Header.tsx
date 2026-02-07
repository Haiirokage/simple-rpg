import { useEffect, useCallback } from "preact/hooks";
import { useResources, useHandleNewDay } from "../data/resources/hooks";
import { useTime, useUpdateTime } from "../data/time/hooks";
import { usePlayerStatus, useHealPlayer, useUpdatePlayerStatus } from "../data/playerStatus/hooks";
import { useAttributes, useGrantExperience } from "../data/attributes/hooks";
import { getDate, getSeasonByDay } from "../data/time/season-util";
import { DAYS_IN_MONTH } from "../data/time/season-definitions";
import { calculateHealthRegenFromTime } from "../data/playerStatus/util";
import { usePrevious } from "../util";
import { useHandleNPCAllowance } from "../npc/npc-hooks";

const Header = () => {
  const { day, time, year, isResting } = useTime();
  const updateTime = useUpdateTime();
  const { refetch } = useResources();
  const handleNewDay = useHandleNewDay();
  const handleNPCAllowance = useHandleNPCAllowance();
  const { data: playerStatus } = usePlayerStatus();
  const healPlayer = useHealPlayer();
  const { attributes } = useAttributes();
  const grantExperience = useGrantExperience();
  const updatePlayerStatus = useUpdatePlayerStatus();
  const prevTime = usePrevious(time);

  const applyHealthRegen = useCallback(
    (timeDelta: number) => {
      if (timeDelta > 0) {
        const healthRegen = calculateHealthRegenFromTime(
          attributes.constitution.level,
          playerStatus.satiation,
          playerStatus.health,
          timeDelta,
        );
        if (healthRegen > 0) {
          const healthHealed = healPlayer(healthRegen);
          if (healthHealed > 0) {
            // Grant constitution experience equal to health regenerated
            grantExperience({ constitution: healthHealed * 100 });
          }
        }
      }
    },
    [attributes.constitution.level, playerStatus, healPlayer, grantExperience],
  );

  useEffect(() => {
    // Calculate time delta for this update
    const timeDelta = time - (prevTime ?? 0);
    applyHealthRegen(timeDelta);

    // Apply fatigue for staying awake past 14 hours after sunrise
    if (timeDelta > 0 && !isResting) {
      const { sunrise } = getSeasonByDay(day);
      const fatigueHour = sunrise + 14;
      const inFatigueZone = time > fatigueHour || time < sunrise;

      if (inFatigueZone) {
        const fatigueHours =
          time < sunrise ? time - (prevTime ?? 0) : time - Math.max(fatigueHour, prevTime ?? 0);

        if (fatigueHours > 0) {
          updatePlayerStatus({ energy: -fatigueHours * 10 });
        }
      }
    }

    if (time > 23) {
      const newDayRaw = day + 1;
      // day range is 1..360. Wrap into 1..360 and compute year increment.
      const newDay = ((newDayRaw - 1) % 360) + 1;
      const yearIncrement = newDayRaw > 360 ? 1 : 0;
      const newYear = year + yearIncrement;

      updateTime({
        time: time - 24,
        day: newDay,
        year: newYear,
      });

      handleNewDay();

      // First of the month - give NPCs their allowance
      if ((newDay - 1) % DAYS_IN_MONTH === 0) {
        handleNPCAllowance();
      }
    }
  }, [
    time,
    prevTime,
    updateTime,
    day,
    year,
    handleNewDay,
    handleNPCAllowance,
    applyHealthRegen,
    isResting,
    updatePlayerStatus,
  ]);

  return (
    <header>
      <p>
        Year {year}, {getDate(day)} - {time}:00
      </p>
      <button
        onClick={() => {
          localStorage.clear();
          refetch();
        }}
      >
        reset
      </button>
    </header>
  );
};

export default Header;
