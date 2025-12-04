"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Heading } from "@chakra-ui/react";

interface TopMarketsChartProps {
  data: Array<{ country: string; listeners: number }>;
}

export default function TopMarketsChart({ data }: TopMarketsChartProps) {
  // Data already in correct format from artist_metrics.ts

  const chart = useChart({
    data,
    series: [{ name: "listeners", color: "blue.solid" }],
  });

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Heading size="lg" color="white" mb={4}>
          Top Mercados (por Oyentes)
        </Heading>
      </Card.Body>

      <Chart.Root maxH="md" chart={chart}>
        <BarChart data={chart.data} layout="vertical" margin={{ left: 120 }}>
          <CartesianGrid stroke={chart.color("border")} horizontal={false} />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            stroke={chart.color("border")}
          />
          <YAxis
            type="category"
            dataKey={chart.key("country")}
            axisLine={false}
            tickLine={false}
            width={110}
            stroke={chart.color("border")}
          />
          <Tooltip
            animationDuration={100}
            cursor={false}
            content={<Chart.Tooltip />}
          />
          {chart.series.map((item) => (
            <Bar
              key={item.name as string}
              isAnimationActive={false}
              dataKey={chart.key(item.name) as string}
              fill={chart.color(item.color)}
              radius={[0, 4, 4, 0]}
            />
          ))}
        </BarChart>
      </Chart.Root>
    </Card.Root>
  );
}
