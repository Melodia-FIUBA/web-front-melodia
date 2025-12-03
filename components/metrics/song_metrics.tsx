"use client";

import { Card, SimpleGrid, Stat, Box, Text, Flex, Icon, Heading } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaPlay, FaHeart, FaShare } from "react-icons/fa";
import { getSongMetricsData } from "@/lib/metrics/catalog_metrics";

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

  return (
    <Box>
      <Heading size="lg" mb={4} color="white">
        Métricas de la Canción - Último Mes
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

      <Text fontSize="xs" color="gray.500" mt={4}>
        Última actualización: {kpiData.lastUpdate}
      </Text>
    </Box>
  );
}
