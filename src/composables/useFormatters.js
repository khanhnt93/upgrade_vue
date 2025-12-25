export function useFormatters() {
  const capitalize = (value) => {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  const formatCurrency = (num) => {
    if (!num) return '0'
    let result = '0'
    if (num) {
      result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return result
  }

  const formatNumber = (value) => {
    if (!value) return '0'
    return parseFloat(value).toLocaleString()
  }

  const formatDate = (value, format = 'default') => {
    if (!value) return ''
    const date = new Date(value)
    if (format === 'default') {
      return date.toLocaleDateString()
    }
    return date.toLocaleString()
  }

  return {
    capitalize,
    formatCurrency,
    formatNumber,
    formatDate
  }
}
