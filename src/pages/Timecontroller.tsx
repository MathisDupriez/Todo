import React, { useState, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

// --- Composant CircularSlider --- //
type CircularSliderProps = {
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

  // Convertit la valeur en angle (0 à 360°)
  const valueToAngle = (val: number) => ((val - min) / (max - min)) * 360;
  const angle = valueToAngle(value);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // Position du bouton (knob)
  const angleRad = ((angle - 90) * Math.PI) / 180;
  const knobX = center + radius * Math.cos(angleRad);
  const knobY = center + radius * Math.sin(angleRad);

  // Gestion avec les Pointer Events pour une interaction fluide
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

// Fonction utilitaire pour convertir les coordonnées polaires en cartésiennes
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

// --- Composant TimeWheel --- //
type TimeWheelProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  size?: number;
  onChange: (value: number) => void;
};

const TimeWheel: React.FC<TimeWheelProps> = ({
  label,
  value,
  min = 0,
  max = 168,
  size = 150,
  onChange,
}) => {
  return (
    <Card variant="outlined" sx={{ p: 2, m: 1, width: size + 40 }}>
      <CardContent sx={{ textAlign: "center" }}>
        <Typography variant="h6">{label}</Typography>
        <CircularSlider
          value={value}
          min={min}
          max={max}
          size={size}
          onChange={onChange}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {value} heures
        </Typography>
      </CardContent>
    </Card>
  );
};

// --- Composant WheelsManager --- //
// Ce composant gère dynamiquement la création des roues par l'utilisateur.
const WheelsManager: React.FC = () => {
  type WheelData = { id: number; label: string; value: number };
  const [wheels, setWheels] = useState<WheelData[]>([
    { id: 1, label: "Devoir", value: 40 },
    { id: 2, label: "Plaisir", value: 30 },
  ]);
  const [newLabel, setNewLabel] = useState("");

  const updateWheelValue = (id: number, newValue: number) => {
    setWheels((prev) =>
      prev.map((wheel) => (wheel.id === id ? { ...wheel, value: newValue } : wheel))
    );
  };

  const addWheel = () => {
    if (newLabel.trim() === "") return;
    const newWheel: WheelData = {
      id: Date.now(),
      label: newLabel,
      value: 0,
    };
    setWheels((prev) => [...prev, newWheel]);
    setNewLabel("");
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#F5F5F5", minHeight: "100vh" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestion du Temps - Création de Roues Personnalisées
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <TextField
          label="Nom de la roue"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
        <Button variant="contained" onClick={addWheel}>
          Ajouter
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {wheels.map((wheel) => (
          <TimeWheel
            key={wheel.id}
            label={wheel.label}
            value={wheel.value}
            onChange={(newValue) => updateWheelValue(wheel.id, newValue)}
          />
        ))}
      </Box>
    </Box>
  );
};

export default WheelsManager;
