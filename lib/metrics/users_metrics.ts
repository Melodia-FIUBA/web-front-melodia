/* eslint-disable @typescript-eslint/no-explicit-any */


export function getActiveUsersData(timeframe: string) : Array<any> {
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
  } else  { //if (timeframe === "mensual")
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

export function getNewUsersData(timeframe: string) : Array<any> {
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
  } else  { //if (timeframe === "mensual")
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

export function getUserRetentionData(timeframe: string) : Array<any> {
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
  } else  { //if (timeframe === "mensual")
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