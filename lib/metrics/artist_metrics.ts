/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  mockGetArtistKPI,
  mockGetTopSongs,
  mockGetTopMarkets,
  mockGetTopPlaylists,
} from "./mock";

interface KPIData {
  monthlyListeners: number;
  previousMonthlyListeners: number;
  followers: number;
  previousFollowers: number;
  plays: number;
  previousPlays: number;
  saves: number;
  previousSaves: number;
  shares: number;
  previousShares: number;
  lastUpdate: string;
}

/**
 * Obtiene los KPIs del artista
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getArtistKPIData(timeframe: string): KPIData {
  const now = new Date();
  const lastUpdate = now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/artist/kpi?timeframe=${timeframe}`);
  // const data = await response.json();
  
  const mockData = mockGetArtistKPI(timeframe);

  return {
    ...mockData,
    lastUpdate,
  };
}

/**
 * Obtiene las canciones más populares del artista
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getTopSongsData(timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/artist/top-songs?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetTopSongs(timeframe);
}

/**
 * Obtiene los principales mercados del artista
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getTopMarketsData(timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/artist/top-markets?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetTopMarkets(timeframe);
}

/**
 * Obtiene las playlists principales donde aparece el artista
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getTopPlaylistsData(timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/artist/top-playlists?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetTopPlaylists(timeframe);
}
