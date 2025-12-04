/* eslint-disable @typescript-eslint/no-explicit-any */

// Mock data for Song Metrics - simulates API response
export function mockGetSongMetrics(songId: string, timeframe: string) {
  const seed = songId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const multiplier = 1 + (seed % 5) / 10;

  if (timeframe === "diario") {
    return {
      plays: Math.floor(2543 * multiplier),
      previousPlays: Math.floor(2321 * multiplier),
      likes: Math.floor(142 * multiplier),
      previousLikes: Math.floor(128 * multiplier),
      shares: Math.floor(38 * multiplier),
      previousShares: Math.floor(34 * multiplier),
    };
  } else if (timeframe === "semanal") {
    return {
      plays: Math.floor(15840 * multiplier),
      previousPlays: Math.floor(14320 * multiplier),
      likes: Math.floor(892 * multiplier),
      previousLikes: Math.floor(810 * multiplier),
      shares: Math.floor(234 * multiplier),
      previousShares: Math.floor(215 * multiplier),
    };
  } else {
    // mensual
    return {
      plays: Math.floor(68430 * multiplier),
      previousPlays: Math.floor(61250 * multiplier),
      likes: Math.floor(3680 * multiplier),
      previousLikes: Math.floor(3320 * multiplier),
      shares: Math.floor(987 * multiplier),
      previousShares: Math.floor(890 * multiplier),
    };
  }
}

// Mock data for Collection Metrics - simulates API response
export function mockGetCollectionMetrics(collectionId: string, timeframe: string) {
  const seed = collectionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const multiplier = 1 + (seed % 5) / 10;

  if (timeframe === "diario") {
    return {
      totalPlays: Math.floor(12543 * multiplier),
      previousTotalPlays: Math.floor(11321 * multiplier),
      likes: Math.floor(542 * multiplier),
      previousLikes: Math.floor(498 * multiplier),
      shares: Math.floor(156 * multiplier),
      previousShares: Math.floor(142 * multiplier),
    };
  } else if (timeframe === "semanal") {
    return {
      totalPlays: Math.floor(78340 * multiplier),
      previousTotalPlays: Math.floor(71820 * multiplier),
      likes: Math.floor(3420 * multiplier),
      previousLikes: Math.floor(3120 * multiplier),
      shares: Math.floor(892 * multiplier),
      previousShares: Math.floor(810 * multiplier),
    };
  } else {
    // mensual
    return {
      totalPlays: Math.floor(325430 * multiplier),
      previousTotalPlays: Math.floor(298650 * multiplier),
      likes: Math.floor(14680 * multiplier),
      previousLikes: Math.floor(13320 * multiplier),
      shares: Math.floor(3680 * multiplier),
      previousShares: Math.floor(3320 * multiplier),
    };
  }
}

// Mock data for Song Plays Over Time - simulates API response
export function mockGetSongPlaysOverTime(songId: string, timeframe: string): Array<any> {
  const seed = songId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseMultiplier = 1 + (seed % 5) / 10;

  if (timeframe === "diario") {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2024, 5, i + 1);
      const variationMultiplier = baseMultiplier * (0.8 + Math.random() * 0.4);
      return {
        plays: Math.floor(2000 * variationMultiplier),
        date: date.toISOString().split('T')[0],
      };
    });
  } else if (timeframe === "semanal") {
    return Array.from({ length: 17 }, (_, i) => {
      const date = new Date(2024, 2, 4 + (i * 7));
      const variationMultiplier = baseMultiplier * (0.8 + Math.random() * 0.4);
      return {
        plays: Math.floor(14000 * variationMultiplier),
        weekStart: date.toISOString().split('T')[0],
      };
    });
  } else {
    // mensual
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
    return months.map((month) => {
      const variationMultiplier = baseMultiplier * (0.8 + Math.random() * 0.4);
      return {
        plays: Math.floor(60000 * variationMultiplier),
        month,
      };
    });
  }
}

// Mock data for Collection Plays Over Time - simulates API response
export function mockGetCollectionPlaysOverTime(collectionId: string, timeframe: string): Array<any> {
  const seed = collectionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseMultiplier = 1 + (seed % 5) / 10;

  if (timeframe === "diario") {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(2024, 5, i + 1);
      const variationMultiplier = baseMultiplier * (0.8 + Math.random() * 0.4);
      return {
        plays: Math.floor(10000 * variationMultiplier),
        date: date.toISOString().split('T')[0],
      };
    });
  } else if (timeframe === "semanal") {
    return Array.from({ length: 17 }, (_, i) => {
      const date = new Date(2024, 2, 4 + (i * 7));
      const variationMultiplier = baseMultiplier * (0.8 + Math.random() * 0.4);
      return {
        plays: Math.floor(70000 * variationMultiplier),
        weekStart: date.toISOString().split('T')[0],
      };
    });
  } else {
    // mensual
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"];
    return months.map((month) => {
      const variationMultiplier = baseMultiplier * (0.8 + Math.random() * 0.4);
      return {
        plays: Math.floor(300000 * variationMultiplier),
        month,
      };
    });
  }
}

// ============================================================================
// USERS METRICS MOCK DATA
// ============================================================================

// Mock data for Active Users - simulates API response
export function mockGetActiveUsers(timeframe: string): Array<any> {
  if (timeframe === "diario") {
    return [
      { usuarios: 45, date: "2024-06-01" },
      { usuarios: 52, date: "2024-06-02" },
      { usuarios: 48, date: "2024-06-03" },
      { usuarios: 61, date: "2024-06-04" },
      { usuarios: 58, date: "2024-06-05" },
      { usuarios: 43, date: "2024-06-06" },
      { usuarios: 39, date: "2024-06-07" },
      { usuarios: 55, date: "2024-06-08" },
      { usuarios: 62, date: "2024-06-09" },
      { usuarios: 49, date: "2024-06-10" },
      { usuarios: 57, date: "2024-06-11" },
      { usuarios: 64, date: "2024-06-12" },
      { usuarios: 51, date: "2024-06-13" },
      { usuarios: 47, date: "2024-06-14" },
      { usuarios: 59, date: "2024-06-15" },
      { usuarios: 68, date: "2024-06-16" },
      { usuarios: 54, date: "2024-06-17" },
      { usuarios: 63, date: "2024-06-18" },
      { usuarios: 58, date: "2024-06-19" },
      { usuarios: 50, date: "2024-06-20" },
      { usuarios: 44, date: "2024-06-21" },
      { usuarios: 56, date: "2024-06-22" },
      { usuarios: 61, date: "2024-06-23" },
      { usuarios: 53, date: "2024-06-24" },
      { usuarios: 65, date: "2024-06-25" },
      { usuarios: 59, date: "2024-06-26" },
      { usuarios: 48, date: "2024-06-27" },
      { usuarios: 42, date: "2024-06-28" },
      { usuarios: 57, date: "2024-06-29" },
      { usuarios: 66, date: "2024-06-30" },
    ];
  } else if (timeframe === "semanal") {
    return [
      { usuarios: 280, weekStart: "2024-03-04" },
      { usuarios: 295, weekStart: "2024-03-11" },
      { usuarios: 310, weekStart: "2024-03-18" },
      { usuarios: 325, weekStart: "2024-03-25" },
      { usuarios: 305, weekStart: "2024-04-01" },
      { usuarios: 340, weekStart: "2024-04-08" },
      { usuarios: 315, weekStart: "2024-04-15" },
      { usuarios: 360, weekStart: "2024-04-22" },
      { usuarios: 335, weekStart: "2024-04-29" },
      { usuarios: 320, weekStart: "2024-05-06" },
      { usuarios: 375, weekStart: "2024-05-13" },
      { usuarios: 350, weekStart: "2024-05-20" },
      { usuarios: 320, weekStart: "2024-05-27" },
      { usuarios: 346, weekStart: "2024-06-03" },
      { usuarios: 298, weekStart: "2024-06-10" },
      { usuarios: 412, weekStart: "2024-06-17" },
      { usuarios: 385, weekStart: "2024-06-24" },
    ];
  } else {
    // mensual
    return [
      { usuarios: 1250, month: "Enero" },
      { usuarios: 1420, month: "Febrero" },
      { usuarios: 1580, month: "Marzo" },
      { usuarios: 1380, month: "Abril" },
      { usuarios: 1690, month: "Mayo" },
      { usuarios: 1540, month: "Junio" },
    ];
  }
}

// Mock data for New Users - simulates API response
export function mockGetNewUsers(timeframe: string): Array<any> {
  if (timeframe === "diario") {
    return [
      { usuarios: 8, date: "2024-06-01" },
      { usuarios: 12, date: "2024-06-02" },
      { usuarios: 10, date: "2024-06-03" },
      { usuarios: 15, date: "2024-06-04" },
      { usuarios: 11, date: "2024-06-05" },
      { usuarios: 9, date: "2024-06-06" },
      { usuarios: 7, date: "2024-06-07" },
      { usuarios: 13, date: "2024-06-08" },
      { usuarios: 14, date: "2024-06-09" },
      { usuarios: 10, date: "2024-06-10" },
      { usuarios: 12, date: "2024-06-11" },
      { usuarios: 16, date: "2024-06-12" },
      { usuarios: 11, date: "2024-06-13" },
      { usuarios: 9, date: "2024-06-14" },
      { usuarios: 13, date: "2024-06-15" },
      { usuarios: 17, date: "2024-06-16" },
      { usuarios: 11, date: "2024-06-17" },
      { usuarios: 14, date: "2024-06-18" },
      { usuarios: 12, date: "2024-06-19" },
      { usuarios: 10, date: "2024-06-20" },
      { usuarios: 8, date: "2024-06-21" },
      { usuarios: 13, date: "2024-06-22" },
      { usuarios: 15, date: "2024-06-23" },
      { usuarios: 11, date: "2024-06-24" },
      { usuarios: 16, date: "2024-06-25" },
      { usuarios: 13, date: "2024-06-26" },
      { usuarios: 10, date: "2024-06-27" },
      { usuarios: 9, date: "2024-06-28" },
      { usuarios: 12, date: "2024-06-29" },
      { usuarios: 15, date: "2024-06-30" },
    ];
  } else if (timeframe === "semanal") {
    return [
      { usuarios: 65, weekStart: "2024-03-04" },
      { usuarios: 72, weekStart: "2024-03-11" },
      { usuarios: 68, weekStart: "2024-03-18" },
      { usuarios: 78, weekStart: "2024-03-25" },
      { usuarios: 70, weekStart: "2024-04-01" },
      { usuarios: 85, weekStart: "2024-04-08" },
      { usuarios: 73, weekStart: "2024-04-15" },
      { usuarios: 92, weekStart: "2024-04-22" },
      { usuarios: 80, weekStart: "2024-04-29" },
      { usuarios: 75, weekStart: "2024-05-06" },
      { usuarios: 95, weekStart: "2024-05-13" },
      { usuarios: 88, weekStart: "2024-05-20" },
      { usuarios: 76, weekStart: "2024-05-27" },
      { usuarios: 82, weekStart: "2024-06-03" },
      { usuarios: 71, weekStart: "2024-06-10" },
      { usuarios: 98, weekStart: "2024-06-17" },
      { usuarios: 90, weekStart: "2024-06-24" },
    ];
  } else {
    // mensual
    return [
      { usuarios: 285, month: "Enero" },
      { usuarios: 320, month: "Febrero" },
      { usuarios: 365, month: "Marzo" },
      { usuarios: 310, month: "Abril" },
      { usuarios: 390, month: "Mayo" },
      { usuarios: 355, month: "Junio" },
    ];
  }
}

// Mock data for User Retention - simulates API response
export function mockGetUserRetention(timeframe: string): Array<any> {
  if (timeframe === "diario") {
    return [
      { usuarios: 38, date: "2024-06-01" },
      { usuarios: 42, date: "2024-06-02" },
      { usuarios: 40, date: "2024-06-03" },
      { usuarios: 49, date: "2024-06-04" },
      { usuarios: 46, date: "2024-06-05" },
      { usuarios: 35, date: "2024-06-06" },
      { usuarios: 32, date: "2024-06-07" },
      { usuarios: 44, date: "2024-06-08" },
      { usuarios: 50, date: "2024-06-09" },
      { usuarios: 41, date: "2024-06-10" },
      { usuarios: 47, date: "2024-06-11" },
      { usuarios: 52, date: "2024-06-12" },
      { usuarios: 43, date: "2024-06-13" },
      { usuarios: 39, date: "2024-06-14" },
      { usuarios: 48, date: "2024-06-15" },
      { usuarios: 55, date: "2024-06-16" },
      { usuarios: 45, date: "2024-06-17" },
      { usuarios: 51, date: "2024-06-18" },
      { usuarios: 48, date: "2024-06-19" },
      { usuarios: 42, date: "2024-06-20" },
      { usuarios: 37, date: "2024-06-21" },
      { usuarios: 46, date: "2024-06-22" },
      { usuarios: 50, date: "2024-06-23" },
      { usuarios: 44, date: "2024-06-24" },
      { usuarios: 53, date: "2024-06-25" },
      { usuarios: 49, date: "2024-06-26" },
      { usuarios: 40, date: "2024-06-27" },
      { usuarios: 35, date: "2024-06-28" },
      { usuarios: 47, date: "2024-06-29" },
      { usuarios: 54, date: "2024-06-30" },
    ];
  } else if (timeframe === "semanal") {
    return [
      { usuarios: 240, weekStart: "2024-03-04" },
      { usuarios: 255, weekStart: "2024-03-11" },
      { usuarios: 268, weekStart: "2024-03-18" },
      { usuarios: 280, weekStart: "2024-03-25" },
      { usuarios: 265, weekStart: "2024-04-01" },
      { usuarios: 295, weekStart: "2024-04-08" },
      { usuarios: 275, weekStart: "2024-04-15" },
      { usuarios: 310, weekStart: "2024-04-22" },
      { usuarios: 290, weekStart: "2024-04-29" },
      { usuarios: 280, weekStart: "2024-05-06" },
      { usuarios: 325, weekStart: "2024-05-13" },
      { usuarios: 305, weekStart: "2024-05-20" },
      { usuarios: 278, weekStart: "2024-05-27" },
      { usuarios: 300, weekStart: "2024-06-03" },
      { usuarios: 260, weekStart: "2024-06-10" },
      { usuarios: 358, weekStart: "2024-06-17" },
      { usuarios: 335, weekStart: "2024-06-24" },
    ];
  } else {
    // mensual
    return [
      { usuarios: 1080, month: "Enero" },
      { usuarios: 1230, month: "Febrero" },
      { usuarios: 1370, month: "Marzo" },
      { usuarios: 1195, month: "Abril" },
      { usuarios: 1465, month: "Mayo" },
      { usuarios: 1335, month: "Junio" },
    ];
  }
}

// ============================================================================
// ARTIST METRICS MOCK DATA
// ============================================================================

// Mock data for Artist KPI - simulates API response
export function mockGetArtistKPI(timeframe: string) {
  if (timeframe === "diario") {
    return {
      monthlyListeners: 125000,
      previousMonthlyListeners: 118000,
      plays: 8543,
      previousPlays: 7821,
      playsDelta: 722,
      playsDeltaPercent: 9.2,
      saves: 324,
      previousSaves: 298,
      savesDelta: 26,
      savesDeltaPercent: 8.7,
      shares: 156,
      previousShares: 142,
      sharesDelta: 14,
      sharesDeltaPercent: 9.9,
    };
  } else if (timeframe === "semanal") {
    return {
      monthlyListeners: 125000,
      previousMonthlyListeners: 115000,
      plays: 52340,
      previousPlays: 48920,
      playsDelta: 3420,
      playsDeltaPercent: 7.0,
      saves: 2180,
      previousSaves: 1950,
      savesDelta: 230,
      savesDeltaPercent: 11.8,
      shares: 892,
      previousShares: 810,
      sharesDelta: 82,
      sharesDeltaPercent: 10.1,
    };
  } else {
    // mensual
    return {
      monthlyListeners: 125000,
      previousMonthlyListeners: 98000,
      plays: 215430,
      previousPlays: 187650,
      playsDelta: 27780,
      playsDeltaPercent: 14.8,
      saves: 9340,
      previousSaves: 7820,
      savesDelta: 1520,
      savesDeltaPercent: 19.4,
      shares: 3680,
      previousShares: 3120,
      sharesDelta: 560,
      sharesDeltaPercent: 18.0,
    };
  }
}

// Mock data for Top Songs - simulates API response
export function mockGetTopSongs(timeframe: string): Array<any> {
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

// Mock data for Top Markets - simulates API response
export function mockGetTopMarkets(timeframe: string): Array<any> {
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

// Mock data for Top Playlists - simulates API response
export function mockGetTopPlaylists(timeframe: string): Array<any> {
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
