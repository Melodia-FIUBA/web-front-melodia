/* eslint-disable @typescript-eslint/no-explicit-any */

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

export function getArtistKPIData(timeframe: string): KPIData {
  const now = new Date();
  const lastUpdate = now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (timeframe === "diario") {
    return {
      monthlyListeners: 125000,
      previousMonthlyListeners: 118000,
      followers: 45230,
      previousFollowers: 44890,
      plays: 8543,
      previousPlays: 7821,
      saves: 324,
      previousSaves: 298,
      shares: 156,
      previousShares: 142,
      lastUpdate,
    };
  } else if (timeframe === "semanal") {
    return {
      monthlyListeners: 125000,
      previousMonthlyListeners: 115000,
      followers: 45230,
      previousFollowers: 43100,
      plays: 52340,
      previousPlays: 48920,
      saves: 2180,
      previousSaves: 1950,
      shares: 892,
      previousShares: 810,
      lastUpdate,
    };
  } else {
    // mensual
    return {
      monthlyListeners: 125000,
      previousMonthlyListeners: 98000,
      followers: 45230,
      previousFollowers: 38500,
      plays: 215430,
      previousPlays: 187650,
      saves: 9340,
      previousSaves: 7820,
      shares: 3680,
      previousShares: 3120,
      lastUpdate,
    };
  }
}

export function getTopSongsData(timeframe: string): Array<any> {
  if (timeframe === "diario") {
    return [
      { song: "Midnight Dreams", plays: 1543, saves: 87 },
      { song: "Electric Soul", plays: 1320, saves: 72 },
      { song: "Summer Vibes", plays: 1187, saves: 65 },
      { song: "Urban Nights", plays: 1056, saves: 58 },
      { song: "Echoes", plays: 982, saves: 51 },
      { song: "Neon Lights", plays: 894, saves: 43 },
      { song: "Rhythm & Blues", plays: 821, saves: 39 },
      { song: "Lost in Paradise", plays: 756, saves: 35 },
    ];
  } else if (timeframe === "semanal") {
    return [
      { song: "Midnight Dreams", plays: 9821, saves: 542 },
      { song: "Electric Soul", plays: 8543, saves: 478 },
      { song: "Summer Vibes", plays: 7892, saves: 423 },
      { song: "Urban Nights", plays: 6934, saves: 387 },
      { song: "Echoes", plays: 6321, saves: 351 },
      { song: "Neon Lights", plays: 5687, saves: 298 },
      { song: "Rhythm & Blues", plays: 5234, saves: 276 },
      { song: "Lost in Paradise", plays: 4821, saves: 254 },
    ];
  } else {
    // mensual
    return [
      { song: "Midnight Dreams", plays: 42340, saves: 2341 },
      { song: "Electric Soul", plays: 38920, saves: 2087 },
      { song: "Summer Vibes", plays: 35680, saves: 1876 },
      { song: "Urban Nights", plays: 31245, saves: 1654 },
      { song: "Echoes", plays: 28934, saves: 1532 },
      { song: "Neon Lights", plays: 25687, saves: 1398 },
      { song: "Rhythm & Blues", plays: 23456, saves: 1243 },
      { song: "Lost in Paradise", plays: 21098, saves: 1156 },
    ];
  }
}

export function getTopMarketsData(timeframe: string): Array<any> {
  if (timeframe === "diario") {
    return [
      { country: "Estados Unidos", listeners: 2843 },
      { country: "México", listeners: 1654 },
      { country: "España", listeners: 1432 },
      { country: "Argentina", listeners: 1287 },
      { country: "Colombia", listeners: 987 },
      { country: "Chile", listeners: 823 },
      { country: "Brasil", listeners: 765 },
      { country: "Perú", listeners: 654 },
    ];
  } else if (timeframe === "semanal") {
    return [
      { country: "Estados Unidos", listeners: 18234 },
      { country: "México", listeners: 11543 },
      { country: "España", listeners: 9876 },
      { country: "Argentina", listeners: 8432 },
      { country: "Colombia", listeners: 6543 },
      { country: "Chile", listeners: 5432 },
      { country: "Brasil", listeners: 4987 },
      { country: "Perú", listeners: 4234 },
    ];
  } else {
    // mensual
    return [
      { country: "Estados Unidos", listeners: 78234 },
      { country: "México", listeners: 48543 },
      { country: "España", listeners: 42876 },
      { country: "Argentina", listeners: 36432 },
      { country: "Colombia", listeners: 28543 },
      { country: "Chile", listeners: 23432 },
      { country: "Brasil", listeners: 21987 },
      { country: "Perú", listeners: 18234 },
    ];
  }
}

export function getTopPlaylistsData(timeframe: string): Array<any> {
  if (timeframe === "diario") {
    return [
      { playlist: "Top 50 Global", inclusions: 3, reach: 2543000 },
      { playlist: "Viral Hits", inclusions: 2, reach: 1876000 },
      { playlist: "Chill Vibes", inclusions: 5, reach: 987000 },
      { playlist: "Electronic Essentials", inclusions: 4, reach: 765000 },
      { playlist: "Night Drives", inclusions: 3, reach: 654000 },
      { playlist: "Indie Discovery", inclusions: 2, reach: 543000 },
    ];
  } else if (timeframe === "semanal") {
    return [
      { playlist: "Top 50 Global", inclusions: 3, reach: 2543000 },
      { playlist: "Viral Hits", inclusions: 2, reach: 1876000 },
      { playlist: "Chill Vibes", inclusions: 5, reach: 987000 },
      { playlist: "Electronic Essentials", inclusions: 4, reach: 765000 },
      { playlist: "Night Drives", inclusions: 3, reach: 654000 },
      { playlist: "Indie Discovery", inclusions: 2, reach: 543000 },
    ];
  } else {
    // mensual
    return [
      { playlist: "Top 50 Global", inclusions: 3, reach: 2543000 },
      { playlist: "Viral Hits", inclusions: 2, reach: 1876000 },
      { playlist: "Chill Vibes", inclusions: 5, reach: 987000 },
      { playlist: "Electronic Essentials", inclusions: 4, reach: 765000 },
      { playlist: "Night Drives", inclusions: 3, reach: 654000 },
      { playlist: "Indie Discovery", inclusions: 2, reach: 543000 },
    ];
  }
}
