"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getISOWeek as getWeekLabel } from "./utils";
import { Card, Heading } from "@chakra-ui/react";
import { getUserRetentionData } from "@/lib/metrics/users_metrics";

interface UserRetentionGraphProps {
  timeframe?: "diario" | "semanal" | "mensual";
}

export default function UserRetentionGraph({ timeframe = "mensual" }: UserRetentionGraphProps) {

  const data = getUserRetentionData(timeframe);

  const chart = useChart({
    data,
    series: [{ name: "usuarios", color: "purple.solid" }],
  });

  // Determinar la key del eje X según el timeframe
  const xAxisKey: string = timeframe === "diario" ? "date" : timeframe === "semanal" ? "weekStart" : "month";

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Heading size="lg" color="white" mb={4}>
          Retención de Usuarios
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
          {chart.series.map((item) => (
            <Line
              key={item.name as string}
              isAnimationActive={false}
              dataKey={chart.key(item.name) as string}
              stroke={chart.color(item.color)}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </Chart.Root>
    </Card.Root>
  );
}
