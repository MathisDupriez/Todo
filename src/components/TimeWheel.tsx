import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import CircularSlider from "./CircularSlider";

export type TimeWheelProps = {
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

export default TimeWheel;
