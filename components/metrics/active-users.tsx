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

export default function ActiveUsersGraph() {
  /*const data = [
      { sale: 10, month: "January" },
      { sale: 95, month: "February" },
      { sale: 87, month: "March" },
      { sale: 88, month: "May" },
      { sale: 65, month: "June" },
      { sale: 90, month: "August" },
    ];*/

  const data = [
    { usuarios: 10, weekStart: "2025-10-29" },
    { usuarios: 95, weekStart: "2025-11-05" },
    { usuarios: 87, weekStart: "2025-11-12" },
    { usuarios: 88, weekStart: "2025-11-19" },
    { usuarios: 65, weekStart: "2025-11-26" },
    { usuarios: 90, weekStart: "2025-12-03" },
  ];

  const chart = useChart({
    data,
    series: [{ name: "usuarios", color: "teal.solid" }],
  });

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Heading size="lg" color="white" mb={4}>
          Usuarios Activos
        </Heading>
      </Card.Body>

      <Chart.Root maxH="sm" chart={chart}>
        <LineChart data={chart.data}>
          <CartesianGrid stroke={chart.color("border")} vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={chart.key("weekStart")}
            tickFormatter={(value) => {
              const d = new Date(String(value));
              return `${getWeekLabel(d)}`;
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
              key={item.name}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
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
