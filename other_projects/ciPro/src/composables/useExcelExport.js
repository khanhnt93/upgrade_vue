import * as XLSX from 'xlsx'

/**
 * Composable for exporting data to Excel using xlsx library
 */
export function useExcelExport() {
  /**
   * Export data to Excel file
   * @param {Array} data - Array of objects to export
   * @param {Object} fields - Object mapping Excel column names to data keys
   * @param {String} filename - Name of the file to download (default: 'export.xlsx')
   */
  const exportToExcel = (data, fields, filename = 'export.xlsx') => {
    if (!data || data.length === 0) {
      console.warn('No data to export')
      return
    }

    // Convert data to worksheet format using field mappings
    const worksheetData = []

    // Add header row
    const headers = Object.keys(fields)
    worksheetData.push(headers)

    // Add data rows
    data.forEach(item => {
      const row = headers.map(header => {
        const fieldKey = fields[header]
        return item[fieldKey] !== undefined ? item[fieldKey] : ''
      })
      worksheetData.push(row)
    })

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // Create workbook
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    // Ensure filename has .xls extension for compatibility
    const finalFilename = filename.endsWith('.xls') || filename.endsWith('.xlsx')
      ? filename
      : `${filename}.xls`

    // Write file
    XLSX.writeFile(workbook, finalFilename, { bookType: 'xls' })
  }

  return {
    exportToExcel
  }
}
