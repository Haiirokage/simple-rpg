import { useEffect } from "preact/hooks";
import { useResources, useHandleNewDay } from "../data/resources/hooks";
import { useTime, useUpdateTime } from "../data/time/hooks";
import { getDate } from "../data/time/season-util";

const Header = () => {
  const { day, time, year } = useTime();
  const updateTime = useUpdateTime();
  const { refetch } = useResources();
  const handleNewDay = useHandleNewDay();

  useEffect(() => {
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
    }
  }, [time, updateTime, day, year, handleNewDay]);

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
