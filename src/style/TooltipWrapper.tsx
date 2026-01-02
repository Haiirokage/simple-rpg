import { useRef, useState } from "preact/hooks";
import styled from "styled-components";

const EventPopover = styled.div<{ $top?: number; $left?: number }>`
  background-color: #f5f5f5;
  color: #333;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  max-width: 320px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: fixed;
  top: ${(props) => props.$top}px;
  left: ${(props) => props.$left}px;
  z-index: 1000;
`;

const TooltipWrapper = (props: { children: React.ReactNode; description?: string }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom,
        left: rect.left,
      });
    }
    setShowPopover(true);
  };

  return (
    <>
      <span
        ref={triggerRef}
        className="eventName"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowPopover(false)}
      >
        {props.children}
      </span>
      {showPopover && props.description && (
        <EventPopover
          $top={popoverPos.top}
          $left={popoverPos.left}
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
        >
          {props.description}
        </EventPopover>
      )}
    </>
  );
};

export default TooltipWrapper;
