"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { getISOWeek as getWeekLabel } from "./utils";
import { Card, Heading } from "@chakra-ui/react";

interface NewUsersByRegionGraphProps {
  timeframe?: "diario" | "semanal" | "mensual";
  data?: Array<any>;
}

// Color palette for different regions
const REGION_COLORS = [
  "blue.solid",
  "green.solid",
  "purple.solid",
  "orange.solid",
  "red.solid",
  "teal.solid",
  "pink.solid",
  "cyan.solid",
];

export default function NewUsersByRegionGraph({ 
  timeframe = "mensual", 
  data = [] 
}: NewUsersByRegionGraphProps) {
  // Extract all region names (keys that are not date/weekStart/month)
  const regionNames = data.length > 0 
    ? Object.keys(data[0]).filter(key => !["date", "weekStart", "month"].includes(key))
    : [];

  // Build series dynamically based on regions present in data
  const series = regionNames.map((region, index) => ({
    name: region,
    color: REGION_COLORS[index % REGION_COLORS.length],
  }));

  const chart = useChart({
    data,
    series,
  });

  // Determine the key for X axis based on timeframe
  const xAxisKey: string = timeframe === "diario" 
    ? "date" 
    : timeframe === "semanal" 
    ? "weekStart" 
    : "month";

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Heading size="lg" color="white" mb={4}>
          Nuevos Registros de Usuarios (Desglosado por Región)
        </Heading>
      </Card.Body>

      <Chart.Root maxH="sm" chart={chart}>
        <LineChart data={chart.data}>
          <CartesianGrid stroke={chart.color("border")} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={chart.key(xAxisKey)}
            tickFormatter={(value) => {
              if (timeframe === "mensual") {
                return String(value);
              }
              const d = new Date(String(value));
              return timeframe === "diario" 
                ? d.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" })
                : `${getWeekLabel(d)}`;
            }}
            stroke={chart.color("border")}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            stroke={chart.color("border")}
          />
          <Tooltip
            animationDuration={100}
            cursor={false}
            content={<Chart.Tooltip />}
          />
          <Legend />
          {chart.series.map((item) => (
            <Line
              key={item.name as string}
              isAnimationActive={false}
              dataKey={chart.key(item.name) as string}
              stroke={chart.color(item.color)}
              strokeWidth={2}
              dot={false}
              name={item.name as string}
              connectNulls={true}
            />
          ))}
        </LineChart>
      </Chart.Root>
    </Card.Root>
  );
}
