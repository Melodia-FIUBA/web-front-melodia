"use client";

import { Box, Text, Flex, NativeSelect } from "@chakra-ui/react";
import { useState } from "react";
import SongMetrics from "@/components/metrics/song_metrics";
import CollectionMetrics from "@/components/metrics/collection_metrics";

interface CatalogMetricsTabProps {
    id: string;
    type: string;
}

export function CatalogMetricsTab({ id, type }: CatalogMetricsTabProps) {
  const [timeframe, setTimeframe] = useState<"diario" | "semanal" | "mensual">("mensual");

  if (type === "playlist") {
    return (
      <Box>
        <Text fontSize="md" color="gray.600">
          Las métricas no están disponibles para playlists.
        </Text>
      </Box>
    );
  }

  return (
    <Box>
      {/* Para canciones y colecciones los datos siempre vienen mensuales, ocultamos el selector */}
      {type !== "song" && type !== "collection" && (
        <Flex justify="flex-end" mb={6}>
          <NativeSelect.Root size="md" width="200px">
            <NativeSelect.Field 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as "diario" | "semanal" | "mensual")}
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>
      )}

      {type === "song" ? (
        <SongMetrics songId={id} />
      ) : type === "collection" ? (
        <CollectionMetrics collectionId={id} />
      ) : (
        <Box>
          <Text fontSize="md" color="gray.700">
            Tipo de ítem no reconocido: {type}
          </Text>
        </Box>
      )}
    </Box>
  );
}
