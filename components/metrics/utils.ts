export const getISOWeek = (d: Date) => {
  // Devuelve la etiqueta de semana y mes según la regla:
  // "La primer semana es la primer semana que aparece completa en el mes."
  // Semanas cortadas pertenecen al mes donde arrancan.
  // Formato de salida: `4° Sem Nov`.

  // Normalizamos la fecha (sin hora)
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())

  // Calculamos el inicio de la semana (lunes)
  const jsDay = date.getDay() // 0 (dom) .. 6 (sáb)
  const diffToMonday = (jsDay + 6) % 7 // 0 => lunes, 1 => martes, ..., 6 => domingo
  const weekStart = new Date(date)
  weekStart.setDate(date.getDate() - diffToMonday)

  const year = weekStart.getFullYear()
  const month = weekStart.getMonth()
  const lastDay = new Date(year, month + 1, 0).getDate()

  // Recolectamos todos los lunes que caen dentro del mes
  const mondays: number[] = []
  for (let day = 1; day <= lastDay; day++) {
    const dt = new Date(year, month, day)
    if (dt.getDay() === 1) mondays.push(day)
  }

  // Encontrar la primer semana completa: primer lunes cuyo rango [lunes .. lunes+6] quede dentro del mes
  let firstFullWeekDay: number | null = null
  for (const m of mondays) {
    if (m + 6 <= lastDay) {
      firstFullWeekDay = m
      break
    }
  }
  // Si no hay lunes (raro) o no se encontró una semana completa, usamos el primer lunes disponible
  if (firstFullWeekDay === null) {
    firstFullWeekDay = mondays.length ? mondays[0] : 1
  }

  // Calculamos el número de semana relativo al firstFullWeekDay
  const diffDays = weekStart.getDate() - firstFullWeekDay
  const weekNumber = diffDays >= 0 ? Math.floor(diffDays / 7) + 1 : 0

  const months = [
    'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
  ]

  return `${weekNumber}° Sem ${months[month]}`
}