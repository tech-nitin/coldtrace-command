import { motion } from "framer-motion";
import { SensorState } from "../../types/shipment";
import { sensorStateConfig } from "./statusStyles";

interface TemperatureSparklineProps {
  history: number[];
  criticalTemp: number;
  state: SensorState;
  width?: number;
  height?: number;
}

export function TemperatureSparkline({
  history,
  criticalTemp,
  state,
  width = 280,
  height = 64,
}: TemperatureSparklineProps) {
  const config = sensorStateConfig[state];
  const padding = 4;
  const values = [...history, criticalTemp];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = history.map((value, index) => {
    const x = padding + (index / (history.length - 1)) * (width - padding * 2);
    const y =
      height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height - padding} L ${points[0].x.toFixed(1)} ${height - padding} Z`;

  const criticalY =
    height - padding - ((criticalTemp - min) / range) * (height - padding * 2);

  const gradientId = `spark-gradient-${state}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-16 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={config.line} stopOpacity="0.22" />
          <stop offset="100%" stopColor={config.line} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Critical threshold line */}
      <line
        x1={padding}
        x2={width - padding}
        y1={criticalY}
        y2={criticalY}
        stroke="#C0473C"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.5"
      />

      <motion.path
        d={areaPath}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      <motion.path
        d={linePath}
        fill="none"
        stroke={config.line}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={config.line}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, duration: 0.3 }}
      />
    </svg>
  );
}
