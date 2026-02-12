import moment from 'moment'

export function useFormatters() {
  const formatCurrency = (value, decimals = 0) => {
    if (!value && value !== 0) return ''

    const num = parseFloat(value)
    if (isNaN(num)) return value

    return new Intl.NumberFormat('vi-VN', {
      style: 'decimal',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatDate = (value, format = 'DD/MM/YYYY') => {
    if (!value) return ''
    return moment(value).format(format)
  }

  const formatDateTime = (value, format = 'DD/MM/YYYY HH:mm') => {
    if (!value) return ''
    return moment(value).format(format)
  }

  const formatNumber = (value, decimals = 0) => {
    if (!value && value !== 0) return ''

    const num = parseFloat(value)
    if (isNaN(num)) return value

    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num)
  }

  const formatPercent = (value, decimals = 2) => {
    if (!value && value !== 0) return ''

    const num = parseFloat(value)
    if (isNaN(num)) return value

    return `${num.toFixed(decimals)}%`
  }

  return {
    formatCurrency,
    currencyFormat: formatCurrency,
    formatDate,
    formatDateTime,
    formatNumber,
    formatPercent
  }
}
