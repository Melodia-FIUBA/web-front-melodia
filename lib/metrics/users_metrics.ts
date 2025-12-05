

import { getRuntimeConfig } from "@/lib/config/envs";
import { adminLoginData } from "@/lib/log/cookies";

type UsersMetricsTimeframe = "diario" | "semanal" | "mensual";
type UsersMetricsPeriod = "daily" | "weekly" | "monthly";

interface UsersMetricApiEntry {
  period: string;
  count: number;
}

interface RegionalMetricEntry {
  region: string;
  metrics: UsersMetricApiEntry[];
}

interface UsersMetricsApiResponse {
  registered_users?: UsersMetricApiEntry[];
  users_logged_in?: UsersMetricApiEntry[];
  registered_users_by_region?: RegionalMetricEntry[];
}

const TIMEFRAME_TO_PERIOD: Record<UsersMetricsTimeframe, UsersMetricsPeriod> = {
  diario: "daily",
  semanal: "weekly",
  mensual: "monthly",
};

const CACHE_TTL_MS = 5 * 60 * 1000;

const responseCache = new Map<
  UsersMetricsTimeframe,
  { expiresAt: number; data: UsersMetricsApiResponse }
>();
const inflightRequests = new Map<UsersMetricsTimeframe, Promise<UsersMetricsApiResponse>>();

function normalizePeriod(period: string, timeframe: UsersMetricsTimeframe): string {
  if (timeframe === "mensual" && /^\d{4}-\d{2}$/.test(period)) {
    return `${period}-01`;
  }

  return period;
}

function capitalize(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMonthlyLabel(period: string): string {
  const normalized = normalizePeriod(period, "mensual");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    return period;
  }

  const monthName = date.toLocaleDateString("es-ES", { month: "long" });
  return capitalize(monthName);
}

function sortEntries(entries: UsersMetricApiEntry[], timeframe: UsersMetricsTimeframe) {
  return [...entries].sort((a, b) => {
    const first = new Date(normalizePeriod(a.period, timeframe)).getTime();
    const second = new Date(normalizePeriod(b.period, timeframe)).getTime();
    if (Number.isNaN(first) || Number.isNaN(second)) {
      return a.period.localeCompare(b.period);
    }
    return first - second;
  });
}

function transformEntries(
  entries: UsersMetricApiEntry[] = [],
  timeframe: UsersMetricsTimeframe
): Array<any> {
  const key =
    timeframe === "diario"
      ? "date"
      : timeframe === "semanal"
      ? "weekStart"
      : "month";

  return sortEntries(entries, timeframe).map((entry) => {
    const axisValue = timeframe === "mensual" ? formatMonthlyLabel(entry.period) : entry.period;

    return {
      usuarios: entry.count,
      [key]: axisValue,
    };
  });
}

async function fetchUsersMetrics(timeframe: UsersMetricsTimeframe): Promise<UsersMetricsApiResponse> {
  const cfg = await getRuntimeConfig();
  const [token] = adminLoginData();

  if (!cfg.MELODIA_USERS_BACKOFFICE_API_URL || !cfg.USERS_METRICS_PATH) {
    throw new Error("Faltan configuraciones para la API de métricas de usuarios");
  }

  const url = new URL(cfg.USERS_METRICS_PATH, cfg.MELODIA_USERS_BACKOFFICE_API_URL);
  url.searchParams.set("period", TIMEFRAME_TO_PERIOD[timeframe]);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error fetching users metrics (${response.status})`);
  }

  return (await response.json()) as UsersMetricsApiResponse;
}

async function getUsersMetrics(timeframe: UsersMetricsTimeframe): Promise<UsersMetricsApiResponse> {
  const cached = responseCache.get(timeframe);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  if (!inflightRequests.has(timeframe)) {
    inflightRequests.set(timeframe, fetchUsersMetrics(timeframe));
  }

  try {
    const data = await inflightRequests.get(timeframe)!;
    responseCache.set(timeframe, {
      data,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return data;
  } finally {
    inflightRequests.delete(timeframe);
  }
}

/**
 * Obtiene datos de usuarios activos desde la API real (fallback al mock ante errores)
 */
export async function getActiveUsersData(timeframe: UsersMetricsTimeframe): Promise<Array<any>> {
  try {
    const metrics = await getUsersMetrics(timeframe);
    return transformEntries(metrics.users_logged_in ?? [], timeframe);
  } catch (error) {
    console.error("Error obteniendo métricas de usuarios activos", error);
    return [];
  }
}

/**
 * Obtiene datos de nuevos usuarios registrados desde la API real (fallback al mock ante errores)
 */
export async function getNewUsersData(timeframe: UsersMetricsTimeframe): Promise<Array<any>> {
  try {
    const metrics = await getUsersMetrics(timeframe);
    return transformEntries(metrics.registered_users ?? [], timeframe);
  } catch (error) {
    console.error("Error obteniendo métricas de nuevos usuarios", error);
    return [];
  }
}

/**
 * Obtiene datos de nuevos usuarios registrados por región desde la API real
 */
export async function getNewUsersByRegionData(timeframe: UsersMetricsTimeframe): Promise<Array<any>> {
  try {
    const metrics = await getUsersMetrics(timeframe);
    const regionalData = metrics.registered_users_by_region ?? [];

    // Transform regional data into format suitable for multi-line chart
    const periodMap = new Map<string, any>();

    // Collect all unique periods and prepare data structure
    regionalData.forEach((regionEntry) => {
      const sortedMetrics = sortEntries(regionEntry.metrics, timeframe);
      // Convert "Sin región" to "Argentina"
      const regionName = regionEntry.region === "Sin región" ? "Argentina" : regionEntry.region;

      sortedMetrics.forEach((metricEntry) => {
        const axisValue = timeframe === "mensual" 
          ? formatMonthlyLabel(metricEntry.period) 
          : metricEntry.period;

        if (!periodMap.has(axisValue)) {
          const key = timeframe === "diario" 
            ? "date" 
            : timeframe === "semanal" 
            ? "weekStart" 
            : "month";
          
          periodMap.set(axisValue, { [key]: axisValue });
        }

        const periodData = periodMap.get(axisValue);
        periodData[regionName] = metricEntry.count;
      });
    });

    // Get all unique regions to ensure consistent data structure
    const allRegions = new Set<string>();
    regionalData.forEach((regionEntry) => {
      // Convert "Sin región" to "Argentina"
      const regionName = regionEntry.region === "Sin región" ? "Argentina" : regionEntry.region;
      allRegions.add(regionName);
    });

    // Convert map to array and fill missing values with 0
    const entries = Array.from(periodMap.values()).map((entry) => {
      const filledEntry = { ...entry };
      allRegions.forEach((region) => {
        if (filledEntry[region] === undefined) {
          filledEntry[region] = 0;
        }
      });
      return filledEntry;
    });
    
    return entries.sort((a, b) => {
      const keyA = a.date || a.weekStart || a.month;
      const keyB = b.date || b.weekStart || b.month;
      
      // For monthly data, compare by original format
      if (timeframe === "mensual") {
        return keyA.localeCompare(keyB);
      }
      
      const dateA = new Date(keyA).getTime();
      const dateB = new Date(keyB).getTime();
      
      if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
        return keyA.localeCompare(keyB);
      }
      
      return dateA - dateB;
    });
  } catch (error) {
    console.error("Error obteniendo métricas de nuevos usuarios por región", error);
    return [];
  }
}