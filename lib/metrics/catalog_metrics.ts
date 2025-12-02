/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  mockGetSongMetrics,
  mockGetCollectionMetrics,
  mockGetSongPlaysOverTime,
  mockGetCollectionPlaysOverTime,
} from "./mock";

interface SongMetricsData {
  plays: number;
  previousPlays: number;
  likes: number;
  previousLikes: number;
  shares: number;
  previousShares: number;
  lastUpdate: string;
}

interface CollectionMetricsData {
  totalPlays: number;
  previousTotalPlays: number;
  likes: number;
  previousLikes: number;
  shares: number;
  previousShares: number;
  lastUpdate: string;
}

/**
 * Obtiene las métricas de una canción
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getSongMetricsData(songId: string, timeframe: string): SongMetricsData {
  const now = new Date();
  const lastUpdate = now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/catalog/songs/${songId}/metrics?timeframe=${timeframe}`);
  // const data = await response.json();
  
  const mockData = mockGetSongMetrics(songId, timeframe);

  return {
    ...mockData,
    lastUpdate,
  };
}

/**
 * Obtiene las métricas de una colección/álbum
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getCollectionMetricsData(collectionId: string, timeframe: string): CollectionMetricsData {
  const now = new Date();
  const lastUpdate = now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/catalog/collections/${collectionId}/metrics?timeframe=${timeframe}`);
  // const data = await response.json();
  
  const mockData = mockGetCollectionMetrics(collectionId, timeframe);

  return {
    ...mockData,
    lastUpdate,
  };
}

/**
 * Obtiene el historial de reproducciones de una canción
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getSongPlaysOverTimeData(songId: string, timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/catalog/songs/${songId}/plays-history?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetSongPlaysOverTime(songId, timeframe);
}

/**
 * Obtiene el historial de reproducciones de una colección/álbum
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getCollectionPlaysOverTimeData(collectionId: string, timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/catalog/collections/${collectionId}/plays-history?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetCollectionPlaysOverTime(collectionId, timeframe);
}
