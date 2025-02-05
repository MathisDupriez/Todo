import React, { useRef, useState } from "react";

export type CircularSliderProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  size?: number;
};

const CircularSlider: React.FC<CircularSliderProps> = ({
  value,
  min,
  max,
  onChange,
  size = 150,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Convertir la valeur en angle (0 à 360°)
  const valueToAngle = (val: number) => ((val - min) / (max - min)) * 360;
  const angle = valueToAngle(value);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Calculer la position du bouton (knob)
  const angleRad = ((angle - 90) * Math.PI) / 180;
  const knobX = center + radius * Math.cos(angleRad);
  const knobY = center + radius * Math.sin(angleRad);

  // Gestion des Pointer Events pour une interaction fluide
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - center;
    const y = e.clientY - rect.top - center;
    let newAngle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    if (newAngle < 0) newAngle += 360;
    const newValue = min + (newAngle / 360) * (max - min);
    onChange(Math.round(newValue));
  };

  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      style={{ touchAction: "none", cursor: "pointer" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Cercle de fond */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
      />
      {/* Arc de progression */}
      <path
        d={describeArc(center, center, radius, 0, angle)}
        fill="none"
        stroke="#9E9E9E"
        strokeWidth={strokeWidth}
      />
      {/* Bouton */}
      <circle cx={knobX} cy={knobY} r={strokeWidth} fill="#616161" />
    </svg>
  );
};

// Fonction utilitaire pour convertir des coordonnées polaires en cartésiennes
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

// Fonction utilitaire pour décrire un arc en SVG
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default CircularSlider;
