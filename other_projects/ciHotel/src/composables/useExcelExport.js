import * as XLSX from 'xlsx'

export function useExcelExport() {
  const exportToExcel = (data, fields, worksheetName = 'Sheet1', fileName = 'export.xls') => {
    // Transform data based on fields mapping
    const transformedData = data.map(row => {
      const transformedRow = {}
      Object.keys(fields).forEach(header => {
        const key = fields[header]
        transformedRow[header] = row[key] !== undefined ? row[key] : ''
      })
      return transformedRow
    })

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(transformedData)

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, worksheetName)

    // Generate file and trigger download
    XLSX.writeFile(wb, fileName)
  }

  return {
    exportToExcel
  }
}
