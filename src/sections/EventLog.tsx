import { useMemo } from "preact/hooks";
import styled from "styled-components";
import { useEventLog } from "../data/eventLog/hooks";
import { getEventById } from "../events/util";
import { getDate } from "../data/time/season-util";

const EventLogContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fdfdfd;
  padding: 12px;
  width: 200px;
  height: 600px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

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

  &:last-child {
    border-bottom: none;
  }

  span.timestamp {
    font-weight: bold;
    color: #666;
  }

  span.eventName {
    color: #333;
  }
`;

const EventLog = () => {
  const { eventLog } = useEventLog();

  const mappedEvents = useMemo(() => {
    return eventLog.eventLog.map((entry) => ({
      timestamp: `Y${entry.year} ${getDate(entry.day, true)}`,
      eventName: getEventById(entry.eventId)?.name ?? "Unknown Event",
    }));
  }, [eventLog.eventLog]);

  return (
    <EventLogContainer>
      <h2>Event Log</h2>
      {mappedEvents.map((item, index) => (
        <EventItem key={index}>
          <span className="timestamp">{item.timestamp}</span> -{" "}
          <span className="eventName">{item.eventName}</span>
        </EventItem>
      ))}
    </EventLogContainer>
  );
};

export default EventLog;
