"use client";

import { Card, SimpleGrid, Stat, Box, Text, Flex, Icon } from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface ArtistKPIsProps {
  monthlyListeners: number;
  previousMonthlyListeners: number | null;
  plays: number;
  previousPlays: number | null;
  playsDelta: number | null;
  playsDeltaPercent: number | null;
  saves: number;
  previousSaves: number | null;
  savesDelta: number | null;
  savesDeltaPercent: number | null;
  shares: number;
  previousShares: number | null;
  sharesDelta: number | null;
  sharesDeltaPercent: number | null;
  lastUpdate: string;
}

interface KPICardProps {
  label: string;
  value: number;
  previousValue?: number | null;
  formatValue?: (val: number) => string;
  showDelta?: boolean;
  deltaOverride?: number | null;
  percentOverride?: number | null;
  labelFontSize?: string | number;
  valueFontSize?: string | number;
}

function KPICard({ label, value, previousValue, formatValue, showDelta = true, deltaOverride, percentOverride, labelFontSize, valueFontSize }: KPICardProps) {
  const previous = typeof previousValue === "number" ? previousValue : null;
  const delta = typeof deltaOverride === "number" ? deltaOverride : previous !== null ? value - previous : null;
  const percentChange =
    typeof percentOverride === "number"
      ? percentOverride
      : delta !== null && previous !== null && previous !== 0
        ? (delta / previous) * 100
        : null;
  const trendColor = delta !== null
    ? delta >= 0 ? "green.400" : "red.400"
    : percentChange !== null
      ? percentChange >= 0 ? "green.400" : "red.400"
      : "gray.400";

  const formattedValue = formatValue ? formatValue(value) : value.toLocaleString("es-ES");
  const formattedDelta = delta !== null
    ? (formatValue ? formatValue(Math.abs(delta)) : Math.abs(delta).toLocaleString("es-ES"))
    : null;

  return (
    <Card.Root bg="gray.800" borderColor="gray.700" p={6}>
      <Card.Body>
        <Stat.Root>
          <Text as="div" color="gray.400" fontSize={labelFontSize ?? "xl"} mb={2}>
            {label}
          </Text>
          <Text as="div" color="white" fontSize={valueFontSize ?? "4xl"} fontWeight="bold" mb={2}>
            {formattedValue}
          </Text>
          {showDelta && (formattedDelta !== null || percentChange !== null) && (
            <Flex align="center" gap={2}>
              {formattedDelta !== null && (
                <Flex
                  align="center"
                  gap={1}
                  color={trendColor}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <Icon fontSize="xs">
                    {delta !== null && delta >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  </Icon>
                  <Text>{formattedDelta}</Text>
                </Flex>
              )}
              {percentChange !== null && (
                <Text
                  color={trendColor}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  ({percentChange >= 0 ? "+" : "-"}
                  {Math.abs(percentChange).toFixed(1)}%)
                </Text>
              )}
            </Flex>
          )}
        </Stat.Root>
      </Card.Body>
    </Card.Root>
  );
}

export default function ArtistKPIs({
  monthlyListeners,
  previousMonthlyListeners,
  plays,
  previousPlays,
  playsDelta,
  playsDeltaPercent,
  saves,
  previousSaves,
  savesDelta,
  savesDeltaPercent,
  shares,
  previousShares,
  sharesDelta,
  sharesDeltaPercent,
  lastUpdate,
}: ArtistKPIsProps) {
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
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap={4} mb={4}>
        <KPICard
          label="Oyentes Mensuales"
          value={monthlyListeners}
          previousValue={previousMonthlyListeners}
          formatValue={formatNumber}
          showDelta={false}
          valueFontSize="6xl"
        />
        <KPICard
          label="Reproducciones"
          value={plays}
          previousValue={previousPlays}
          formatValue={formatNumber}
          deltaOverride={playsDelta}
          percentOverride={playsDeltaPercent}
        />
        <KPICard
          label="Likes"
          value={saves}
          previousValue={previousSaves}
          formatValue={formatNumber}
          deltaOverride={savesDelta}
          percentOverride={savesDeltaPercent}
        />
        <KPICard
          label="Compartidos"
          value={shares}
          previousValue={previousShares}
          formatValue={formatNumber}
          deltaOverride={sharesDelta}
          percentOverride={sharesDeltaPercent}
        />
      </SimpleGrid>
      <Text color="gray.500" fontSize="xs" textAlign="right">
        Última actualización: {lastUpdate}
      </Text>
    </Box>
  );
}
