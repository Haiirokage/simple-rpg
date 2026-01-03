interface ProgressBarProps {
  current: number;
  max: number;
  label: string;
  color: string;
  width?: number;
  height?: number;
}

const ProgressBar = ({
  current,
  max,
  label,
  color,
  width = 200,
  height = 24,
}: ProgressBarProps) => {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: "#999",
        border: "1px solid #666",
        borderRadius: "2px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Max value background */}
      <div
        style={{
          width: `${max}%`,
          height: "100%",
          backgroundColor: "#ddd",
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
      {/* Current value fill */}
      <div
        style={{
          width: `${current}%`,
          height: "100%",
          backgroundColor: color,
          transition: "width 0.3s ease",
          position: "relative",
          zIndex: 1,
        }}
      />
      {/* Text label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "0.75em",
          fontWeight: "bold",
          color: "#333",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        {label}: {current.toFixed(1)}/{max}
      </div>
    </div>
  );
};

export default ProgressBar;
