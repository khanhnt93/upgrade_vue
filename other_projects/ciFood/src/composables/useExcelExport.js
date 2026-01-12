import * as XLSX from 'xlsx'

export function useExcelExport() {
  /**
   * Export data to Excel file
   * @param {Array} data - Array of objects to export
   * @param {Object} fields - Object mapping Excel column names to data keys
   * @param {String} filename - Name of the file to download
   * @param {String} sheetName - Optional name for the worksheet
   */
  const exportToExcel = (data, fields, filename = 'export.xls', sheetName = 'Sheet1') => {
    if (!data || data.length === 0) {
      console.warn('No data to export')
      return
    }

    // Ensure filename has .xls extension
    if (!filename.endsWith('.xls')) {
      filename = filename.replace(/\.(xlsx|xls)$/, '') + '.xls'
    }

    // Transform data according to fields mapping
    const transformedData = data.map(item => {
      const row = {}
      Object.keys(fields).forEach(header => {
        const key = fields[header]
        row[header] = item[key] !== undefined ? item[key] : ''
      })
      return row
    })

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(transformedData)

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, sheetName)

    // Generate Excel file and trigger download
    XLSX.writeFile(wb, filename, { bookType: 'xls' })
  }

  return {
    exportToExcel
  }
}
