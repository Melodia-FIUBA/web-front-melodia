"use client";

import ArtistKPIs from "@/components/metrics/artist_kpis";
import TopSongsChart from "@/components/metrics/top_songs_chart";
import TopMarketsChart from "@/components/metrics/top_markets_chart";
import TopPlaylistsChart from "@/components/metrics/top_playlists_chart";
import { isAdminLoggedIn } from "@/lib/log/cookies";
import {
  Box,
  Flex,
  Heading,
  NativeSelect,
  Button,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { FaFileExcel } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getArtistKPIData,
  getTopSongsData,
  getTopMarketsData,
  getTopPlaylistsData,
} from "@/lib/metrics/artist_metrics";
import { exportToExcel } from "@/lib/utils/exportToExcel";
import LoadBackgroundElement from "@/components/ui/loadElements";

interface KPIData {
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

export default function PanelArtistPage() {
  const router = useRouter();
  const params = useParams();
  const artistId = params.id as string;

  const [timeframe, setTimeframe] = useState<"diario" | "semanal" | "mensual">(
    "mensual"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topSongs, setTopSongs] = useState<Array<any>>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topMarkets, setTopMarkets] = useState<Array<any>>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [topPlaylists, setTopPlaylists] = useState<Array<any>>([]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!artistId) return;

      setLoading(true);
      setError(null);

      try {
        const [kpis, songs, markets, playlists] = await Promise.all([
          getArtistKPIData(artistId, timeframe),
          getTopSongsData(artistId, timeframe),
          getTopMarketsData(artistId, timeframe),
          getTopPlaylistsData(artistId, timeframe),
        ]);

        console.log("DEBUG - Top Songs:", songs);
        console.log("DEBUG - Top Markets:", markets);
        console.log("DEBUG - Top Playlists:", playlists);

        setKpiData(kpis);
        setTopSongs(songs);
        setTopMarkets(markets);
        setTopPlaylists(playlists);
      } catch {
        //console.error("Error fetching artist metrics:", err);
        setError("Error al cargar las métricas del artista");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId, timeframe]);

  const handleExportToExcel = () => {
    if (!topSongs.length && !topMarkets.length && !topPlaylists.length) {
      return;
    }

    exportToExcel(
      [
        { sheetName: "Top Canciones", data: topSongs },
        { sheetName: "Top Mercados", data: topMarkets },
        { sheetName: "Top Playlists", data: topPlaylists },
      ],
      `metricas-artista-${timeframe}`
    );
  };

  if (!isAdminLoggedIn()) {
    return null;
  }

  if (loading) {
    return (
      <Box p={6} borderRadius="lg" textAlign="center" py={8}>
        <Spinner />
        <Text mt={2} color="gray.600">
          Cargando políticas del contenido...
        </Text>
        <LoadBackgroundElement size="users_menu"></LoadBackgroundElement>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        minH="90vh"
        p={8}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="red.400" fontSize="xl">
          {error}
        </Text>
      </Box>
    );
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
              onChange={(e) =>
                setTimeframe(e.target.value as "diario" | "semanal" | "mensual")
              }
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </Flex>

        {kpiData && (
          <ArtistKPIs
            monthlyListeners={kpiData.monthlyListeners}
            previousMonthlyListeners={kpiData.previousMonthlyListeners}
            plays={kpiData.plays}
            previousPlays={kpiData.previousPlays}
            playsDelta={kpiData.playsDelta}
            playsDeltaPercent={kpiData.playsDeltaPercent}
            saves={kpiData.saves}
            previousSaves={kpiData.previousSaves}
            savesDelta={kpiData.savesDelta}
            savesDeltaPercent={kpiData.savesDeltaPercent}
            shares={kpiData.shares}
            previousShares={kpiData.previousShares}
            sharesDelta={kpiData.sharesDelta}
            sharesDeltaPercent={kpiData.sharesDeltaPercent}
            lastUpdate={kpiData.lastUpdate}
          />
        )}

        {topSongs.length > 0 && <TopSongsChart data={topSongs} />}
        {topMarkets.length > 0 && <TopMarketsChart data={topMarkets} />}
        {topPlaylists.length > 0 && <TopPlaylistsChart data={topPlaylists} />}

        {topSongs.length === 0 &&
          topMarkets.length === 0 &&
          topPlaylists.length === 0 && (
            <Box
              bg="gray.800"
              borderColor="gray.700"
              borderWidth="1px"
              borderRadius="md"
              p={8}
              textAlign="center"
            >
              <Text color="gray.400" fontSize="lg">
                No hay datos de breakdowns disponibles para el período
                seleccionado
              </Text>
            </Box>
          )}

        <Flex justify="flex-end" mt={4}>
          <Button
            onClick={handleExportToExcel}
            colorScheme="green"
            size="lg"
            disabled={
              !topSongs.length && !topMarkets.length && !topPlaylists.length
            }
          >
            <FaFileExcel style={{ marginRight: "8px" }} />
            Exportar a Excel
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
