
import * as XLSX from 'xlsx';

interface ExcelSheet {
  sheetName: string;
  data: Array<any>;
}

/**
 * Exporta múltiples conjuntos de datos a un archivo Excel con hojas separadas
 * @param sheets - Array de objetos con nombre de hoja y datos
 * @param fileName - Nombre del archivo Excel (sin extensión)
 */
export function exportToExcel(sheets: ExcelSheet[], fileName: string) {
  // Crear un nuevo libro de Excel
  const workbook = XLSX.utils.book_new();

  // Agregar cada conjunto de datos como una hoja separada
  sheets.forEach((sheet) => {
    // Convertir los datos JSON a una hoja de Excel
    const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    
    // Calcular ancho automático de columnas (en caracteres, propiedad `wch`)
    try {
      if (Array.isArray(sheet.data) && sheet.data.length > 0) {
        const firstRow = sheet.data[0];
        const keys = Object.keys(firstRow);

        const cols = keys.map((key) => {
          // calcular máximo largo entre el nombre de la columna y todas las celdas
          const maxCellLength = sheet.data.reduce((max, row) => {
            const cell = row[key];
            const len = cell === null || cell === undefined ? 0 : String(cell).length;
            return Math.max(max, len);
          }, key.length);

          // añadir un pequeño padding y limitar a un rango razonable
          const width = Math.min(Math.max(maxCellLength + 2, 8), 60);
          return { wch: width };
        });

        worksheet["!cols"] = cols;
      }
    } catch (err) {
      // Si algo falla, no rompemos la exportación: seguimos sin `!cols`
      // Logueamos con console.warn para facilitar debugging en desarrollo
      console.warn("No se pudo calcular ancho de columnas para Excel:", err);
    }

    // Agregar la hoja al libro con su nombre
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  });

  // Generar el archivo Excel y descargarlo
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
