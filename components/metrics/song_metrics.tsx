"use client";

import { Card, SimpleGrid, Stat, Box, Text, Flex, Icon, Heading } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaPlay, FaHeart, FaShare } from "react-icons/fa";
import { Chart, useChart } from "@chakra-ui/charts";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { getISOWeek as getWeekLabel } from "./utils";
import { getSongMetricsData, getSongPlaysOverTimeData } from "@/lib/metrics/catalog_metrics";

interface SongMetricsProps {
  songId: string;
  timeframe?: "diario" | "semanal" | "mensual";
}

interface KPICardProps {
  label: string;
  icon: React.ReactElement;
  value: number;
  previousValue: number;
  formatValue?: (val: number) => string;
}

function KPICard({ label, icon, value, previousValue, formatValue }: KPICardProps) {
  const delta = value - previousValue;
  const percentChange = previousValue > 0 ? ((delta / previousValue) * 100) : 0;
  const isPositive = delta >= 0;

  const formattedValue = formatValue ? formatValue(value) : value.toLocaleString("es-ES");
  const formattedDelta = formatValue ? formatValue(Math.abs(delta)) : Math.abs(delta).toLocaleString("es-ES");

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Stat.Root>
          <Flex align="center" gap={2} mb={2}>
            <Icon fontSize="lg" color="teal.400">
              {icon}
            </Icon>
            <Stat.Label color="gray.400" fontSize="sm">
              {label}
            </Stat.Label>
          </Flex>
          <Stat.ValueText color="white" fontSize="3xl" fontWeight="bold" mb={2}>
            {formattedValue}
          </Stat.ValueText>
          <Flex align="center" gap={2}>
            <Flex
              align="center"
              gap={1}
              color={isPositive ? "green.400" : "red.400"}
              fontSize="sm"
              fontWeight="medium"
            >
              <Icon fontSize="xs">
                {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              </Icon>
              <Text>{formattedDelta}</Text>
            </Flex>
            <Text
              color={isPositive ? "green.400" : "red.400"}
              fontSize="sm"
              fontWeight="medium"
            >
              ({isPositive ? "+" : "-"}
              {Math.abs(percentChange).toFixed(1)}%)
            </Text>
          </Flex>
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

export default function SongMetrics({ songId, timeframe = "mensual" }: SongMetricsProps) {
  const kpiData = getSongMetricsData(songId, timeframe);
  const playsData = getSongPlaysOverTimeData(songId, timeframe);

  const chart = useChart({
    data: playsData,
    series: [{ name: "plays", color: "teal.solid" }],
  });

  const xAxisKey: string = timeframe === "diario" ? "date" : timeframe === "semanal" ? "weekStart" : "month";

  return (
    <Box>
      <Heading size="lg" mb={4} color="white">
        Métricas de la Canción
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
        <KPICard
          label="Reproducciones"
          icon={<FaPlay />}
          value={kpiData.plays}
          previousValue={kpiData.previousPlays}
        />
        <KPICard
          label="Me Gusta"
          icon={<FaHeart />}
          value={kpiData.likes}
          previousValue={kpiData.previousLikes}
        />
        <KPICard
          label="Veces Compartida"
          icon={<FaShare />}
          value={kpiData.shares}
          previousValue={kpiData.previousShares}
        />
      </SimpleGrid>

      <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
        <Card.Body>
          <Heading size="lg" color="white" mb={4}>
            Reproducciones en el Tiempo
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
            <Line
              dataKey={chart.key("plays")}
              fill={chart.color("teal.solid")}
              stroke={chart.color("teal.solid")}
              strokeWidth={2}
              type="monotone"
            />
            <Tooltip
              animationDuration={100}
              cursor={false}
              content={<Chart.Tooltip />}
            />
          </LineChart>
        </Chart.Root>
      </Card.Root>

      <Text fontSize="xs" color="gray.500" mt={4}>
        Última actualización: {kpiData.lastUpdate}
      </Text>
    </Box>
  );
}
