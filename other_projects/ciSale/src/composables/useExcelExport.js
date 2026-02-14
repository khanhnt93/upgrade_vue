import * as XLSX from 'xlsx'

export function useExcelExport() {
  const exportToExcel = (data, fields, filename = 'export.xls') => {
    if (!data || data.length === 0) {
      console.warn('No data provided for Excel export')
      return
    }

    // Convert data using field mapping
    const mappedData = data.map(item => {
      const mappedItem = {}
      Object.keys(fields).forEach(columnName => {
        const dataKey = fields[columnName]
        mappedItem[columnName] = item[dataKey] || ''
      })
      return mappedItem
    })

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(mappedData)
    const wb = XLSX.utils.book_new()

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

    // Ensure filename has .xls extension for compatibility
    const finalFilename = filename.endsWith('.xls') || filename.endsWith('.xlsx')
      ? filename
      : `${filename}.xls`

    // Write and download file
    XLSX.writeFile(wb, finalFilename)
  }

  return {
    exportToExcel
  }
}
