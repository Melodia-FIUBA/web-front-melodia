"use client";

import ArtistKPIs from "@/components/metrics/artist_kpis";
import TopSongsChart from "@/components/metrics/top_songs_chart";
import TopMarketsChart from "@/components/metrics/top_markets_chart";
import TopPlaylistsChart from "@/components/metrics/top_playlists_chart";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import { Box, Flex, Heading, NativeSelect, Button } from "@chakra-ui/react";
import { FaFileExcel } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getTopSongsData, getTopMarketsData, getTopPlaylistsData } from "@/lib/metrics/artist_metrics";
import { exportToExcel } from "@/lib/utils/exportToExcel";

export default function PanelArtistPage() {
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<"diario" | "semanal" | "mensual">("mensual");

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  const handleExportToExcel = () => {
    const topSongsData = getTopSongsData(timeframe);
    const topMarketsData = getTopMarketsData(timeframe);
    const topPlaylistsData = getTopPlaylistsData(timeframe);

    exportToExcel(
      [
        { sheetName: "Top Canciones", data: topSongsData },
        { sheetName: "Top Mercados", data: topMarketsData },
        { sheetName: "Top Playlists", data: topPlaylistsData },
      ],
      `metricas-artista-${timeframe}`
    );
  };

  if (!isAdminLoggedIn()) {
    return null;
  }

  return (
    <Box minH="90vh" p={8}>
      <Flex direction="column" gap={6}>
        <Flex justify="space-between" align="center">
          <Heading size="2xl" color="white">
            Panel de Métricas del Artista
          </Heading>

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

        <ArtistKPIs timeframe={timeframe} />

        <TopSongsChart timeframe={timeframe} />
        <TopMarketsChart timeframe={timeframe} />
        <TopPlaylistsChart timeframe={timeframe} />

        <Flex justify="flex-end" mt={4}>
          <Button onClick={handleExportToExcel} colorScheme="green" size="lg">
            <FaFileExcel style={{ marginRight: '8px' }} />
            Exportar a Excel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
