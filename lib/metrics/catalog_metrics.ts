/* eslint-disable @typescript-eslint/no-explicit-any */

import { getRuntimeConfig } from "@/lib/config/envs";
import { adminLoginData } from "@/lib/log/cookies";
import {
  mockGetSongPlaysOverTime,
  mockGetCollectionPlaysOverTime,
} from "./mock";

interface SongMetricsResponse {
  song_id: number;
  generated_at: string;
  metrics: {
    play_count: number | null;
    like_count: number | null;
    share_count: number | null;
  };
}

interface CollectionMetricsResponse {
  collection_id: number;
  generated_at: string;
  metrics: {
    total_plays: number | null;
    like_count: number | null;
    share_count: number | null;
  };
}

interface SongMetricsData {
  plays: number;
  likes: number;
  shares: number;
  lastUpdate: string;
}

interface CollectionMetricsData {
  totalPlays: number;
  likes: number;
  shares: number;
  lastUpdate: string;
}

function formatTimestamp(timestamp?: string): string {
  const date = timestamp ? new Date(timestamp) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Obtiene las métricas de una canción
 */
export async function getSongMetricsData(songId: string): Promise<SongMetricsData> {
  const cfg = await getRuntimeConfig();
  const [token] = adminLoginData();

  const url = new URL(
    cfg.SONG_METRICS_PATH.replace(":id", songId),
    cfg.MELODIA_SONGS_BACKOFFICE_API_URL
  );

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching song metrics (${response.status})`);
  }

  const data = (await response.json()) as SongMetricsResponse;

  return {
    plays: data.metrics.play_count ?? 0,
    likes: data.metrics.like_count ?? 0,
    shares: data.metrics.share_count ?? 0,
    lastUpdate: formatTimestamp(data.generated_at),
  };
}

/**
 * Obtiene las métricas de una colección/álbum
 */
export async function getCollectionMetricsData(collectionId: string): Promise<CollectionMetricsData> {
  const cfg = await getRuntimeConfig();
  const [token] = adminLoginData();

  const url = new URL(
    cfg.COLLECTION_METRICS_PATH.replace(":id", collectionId),
    cfg.MELODIA_SONGS_BACKOFFICE_API_URL
  );

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching collection metrics (${response.status})`);
  }

  const data = (await response.json()) as CollectionMetricsResponse;

  return {
    totalPlays: data.metrics.total_plays ?? 0,
    likes: data.metrics.like_count ?? 0,
    shares: data.metrics.share_count ?? 0,
    lastUpdate: formatTimestamp(data.generated_at),
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
