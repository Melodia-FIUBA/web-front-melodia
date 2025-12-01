/* eslint-disable @typescript-eslint/no-explicit-any */
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
    
    // Agregar la hoja al libro con su nombre
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  });

  // Generar el archivo Excel y descargarlo
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}
