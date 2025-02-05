import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import TimeWheel from "./TimeWheel";

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
