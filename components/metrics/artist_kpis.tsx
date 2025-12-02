"use client";

import { Card, SimpleGrid, Stat, Box, Text, Flex, Icon } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { getArtistKPIData } from "@/lib/metrics/artist_metrics";

interface ArtistKPIsProps {
  timeframe?: "diario" | "semanal" | "mensual";
}

interface KPICardProps {
  label: string;
  value: number;
  previousValue: number;
  formatValue?: (val: number) => string;
}

function KPICard({ label, value, previousValue, formatValue }: KPICardProps) {
  const delta = value - previousValue;
  const percentChange = previousValue > 0 ? ((delta / previousValue) * 100) : 0;
  const isPositive = delta >= 0;

  const formattedValue = formatValue ? formatValue(value) : value.toLocaleString("es-ES");
  const formattedDelta = formatValue ? formatValue(Math.abs(delta)) : Math.abs(delta).toLocaleString("es-ES");

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Stat.Root>
          <Stat.Label color="gray.400" fontSize="sm" mb={2}>
            {label}
          </Stat.Label>
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

export default function ArtistKPIs({ timeframe = "mensual" }: ArtistKPIsProps) {
  const data = getArtistKPIData(timeframe);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString("es-ES");
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 5 }} gap={4} mb={4}>
        <KPICard
          label="Oyentes Mensuales"
          value={data.monthlyListeners}
          previousValue={data.previousMonthlyListeners}
          formatValue={formatNumber}
        />
        <KPICard
          label="Seguidores"
          value={data.followers}
          previousValue={data.previousFollowers}
          formatValue={formatNumber}
        />
        <KPICard
          label="Reproducciones"
          value={data.plays}
          previousValue={data.previousPlays}
          formatValue={formatNumber}
        />
        <KPICard
          label="Guardados"
          value={data.saves}
          previousValue={data.previousSaves}
          formatValue={formatNumber}
        />
        <KPICard
          label="Compartidos"
          value={data.shares}
          previousValue={data.previousShares}
          formatValue={formatNumber}
        />
      </SimpleGrid>
      <Text color="gray.500" fontSize="xs" textAlign="right">
        Última actualización: {data.lastUpdate}
      </Text>
    </Box>
  );
}
