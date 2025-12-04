/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  mockGetActiveUsers,
  mockGetNewUsers,
  mockGetUserRetention,
} from "./mock";

/**
 * Obtiene datos de usuarios activos
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getActiveUsersData(timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/users/active?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetActiveUsers(timeframe);
}

/**
 * Obtiene datos de nuevos usuarios registrados
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getNewUsersData(timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/users/new?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetNewUsers(timeframe);
}

/**
 * Obtiene datos de retención de usuarios
 * En el futuro, esta función llamará a una API real
 * Por ahora, utiliza datos mock
 */
export function getUserRetentionData(timeframe: string): Array<any> {
  // TODO: Reemplazar con llamada a API real
  // const response = await fetch(`/api/metrics/users/retention?timeframe=${timeframe}`);
  // return await response.json();
  
  return mockGetUserRetention(timeframe);
}