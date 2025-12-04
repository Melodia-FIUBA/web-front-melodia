/* eslint-disable @typescript-eslint/no-explicit-any */

import { getRuntimeConfig } from "@/lib/config/envs";
import { adminLoginData } from "@/lib/log/cookies";

// Estructura que esperan los componentes (compatible con mock)
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

// Estructura de la API real
interface APITopSong {
  song_id: number;
  title: string;
  collection_id: number;
  cover_url: string | null;
  period_plays: number;
  total_plays: number;
  total_likes: number;
}

interface APITopMarket {
  region: string;
  plays: number;
}

interface APITopPlaylist {
  playlist_id: number;
  name: string;
  owner_id: string;
  artist_song_count: number;
  total_songs: number;
  like_count: number;
  cover_url: string | null;
}

interface ArtistMetricsResponse {
  artist_id: string;
  period: string;
  generated_at: string;
  region_filter: string | null;
  kpis: {
    monthly_listeners: {
      count: number;
      period: {
        start: string;
        end: string;
      };
    };
    plays: {
      current: number;
      previous: number;
      delta: number;
      delta_percent: number;
      period: {
        current: { start: string; end: string };
        previous: { start: string; end: string };
      };
    };
    likes: {
      current: number;
      previous: number;
      delta: number;
      delta_percent: number;
      period: {
        current: { start: string; end: string };
        previous: { start: string; end: string };
      };
    };
    shares: {
      current: number | null;
      previous: number | null;
      delta: number | null;
      delta_percent: number | null;
      period: {
        current: { start: string; end: string };
        previous: { start: string; end: string };
      };
    };
  };
  breakdowns: {
    top_songs: APITopSong[];
    top_markets: APITopMarket[];
    top_playlists: APITopPlaylist[];
  };
}

/**
 * Mapea el timeframe del frontend al período de la API
 */
function mapTimeframeToPeriod(timeframe: string): string {
  const mapping: Record<string, string> = {
    diario: "daily",
    semanal: "weekly",
    mensual: "monthly",
  };
  return mapping[timeframe] || "monthly";
}

/**
 * Obtiene las métricas completas del artista desde la API
 */
export async function getArtistMetrics(
  artistId: string,
  timeframe: string,
  region?: string
): Promise<ArtistMetricsResponse> {
  const cfg = await getRuntimeConfig();
  const [token] = adminLoginData();
  const period = mapTimeframeToPeriod(timeframe);
  
  const url = new URL(
    cfg.ARTIST_METRICS_PATH.replace(":id", artistId),
    cfg.MELODIA_SONGS_BACKOFFICE_API_URL
  );
  url.searchParams.append("period", period);
  if (region) {
    url.searchParams.append("region", region);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching artist metrics: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Obtiene los KPIs del artista
 * Transforma la respuesta de la API al formato esperado por los componentes
 */
export async function getArtistKPIData(
  artistId: string,
  timeframe: string,
  region?: string
): Promise<KPIData> {
  const data = await getArtistMetrics(artistId, timeframe, region);
  
  const lastUpdate = new Date(data.generated_at).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const plays = data.kpis.plays;
  const likes = data.kpis.likes;
  const shares = data.kpis.shares;

  return {
    monthlyListeners: data.kpis.monthly_listeners.count,
    previousMonthlyListeners: null, // La API no provee este dato
    plays: plays.current,
    previousPlays: plays.previous ?? null,
    playsDelta: plays.delta ?? null,
    playsDeltaPercent: plays.delta_percent ?? null,
    saves: likes.current, // La API usa "likes" como "saves"
    previousSaves: likes.previous ?? null,
    savesDelta: likes.delta ?? null,
    savesDeltaPercent: likes.delta_percent ?? null,
    shares: shares?.current ?? 0,
    previousShares: shares?.previous ?? null,
    sharesDelta: shares?.delta ?? null,
    sharesDeltaPercent: shares?.delta_percent ?? null,
    lastUpdate,
  };
}

/**
 * Obtiene las canciones más populares del artista
 * Transforma la respuesta de la API al formato esperado por los componentes
 */
export async function getTopSongsData(
  artistId: string,
  timeframe: string,
  region?: string
): Promise<Array<any>> {
  const data = await getArtistMetrics(artistId, timeframe, region);
  
  // Transformar de API format a componente format
  return data.breakdowns.top_songs.map(song => ({
    song: song.title,
    plays: song.period_plays, // Usar period_plays para el período actual
    saves: song.total_likes, // La API usa "total_likes" como "saves"
  }));
}

/**
 * Obtiene los principales mercados del artista
 * Transforma la respuesta de la API al formato esperado por los componentes
 */
export async function getTopMarketsData(
  artistId: string,
  timeframe: string,
  region?: string
): Promise<Array<any>> {
  const data = await getArtistMetrics(artistId, timeframe, region);
  
  // Transformar de API format a componente format
  return data.breakdowns.top_markets.map(market => ({
    country: market.region === "Unknown" ? "Argentina" : market.region,
    listeners: market.plays,
  }));
}

/**
 * Obtiene las playlists principales donde aparece el artista
 * Transforma la respuesta de la API al formato esperado por los componentes
 */
export async function getTopPlaylistsData(
  artistId: string,
  timeframe: string,
  region?: string
): Promise<Array<any>> {
  const data = await getArtistMetrics(artistId, timeframe, region);
  
  // Transformar de API format a componente format
  return data.breakdowns.top_playlists.map(playlist => ({
    playlist: playlist.name,
    inclusions: playlist.artist_song_count,
    reach: 0, // API no provee este dato
  }));
}
