import { useMemo, useRef, useEffect } from "preact/hooks";
import styled from "styled-components";
import { useEventLog } from "../data/eventLog/hooks";
import { getEventById } from "../events/util";
import { getDate } from "../data/time/season-util";
import TooltipWrapper from "../style/TooltipWrapper";

const EventLogContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fdfdfd;
  padding: 0 12px;
  width: 200px;
  height: 600px;
  overflow-y: scroll;

  h2 {
    margin: 0 0 8px;
    font-size: 14px;
  }
`;

const EventItem = styled.div`
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
  line-height: 1.4;
  position: relative;
  cursor: help;

  span {
    font-weight: bold;
  }
`;

const EventLog = () => {
  const { eventLog } = useEventLog();
  const containerRef = useRef<HTMLDivElement>(null);

  const mappedEvents = useMemo(() => {
    return eventLog.eventLog.map((entry) => {
      const event = getEventById(entry.eventId);
      const description =
        entry.descriptionIndex !== undefined
          ? event!.descriptions[entry.descriptionIndex] //TODO
          : undefined;

      return {
        timestamp: `Y${entry.year} ${getDate(entry.day, true)}`,
        eventName: event?.name ?? "Unknown Event",
        description,
      };
    });
  }, [eventLog.eventLog]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [mappedEvents]);

  return (
    <>
      <h2>Event Log</h2>
      <EventLogContainer ref={containerRef}>
        {mappedEvents.map((item, index) => (
          <TooltipWrapper description={item.description}>
            <EventItem key={index}>
              <span>{item.timestamp}</span>
              {` - ${item.eventName}`}
            </EventItem>
          </TooltipWrapper>
        ))}
      </EventLogContainer>
    </>
  );
};

export default EventLog;
