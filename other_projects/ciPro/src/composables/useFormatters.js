import moment from 'moment'

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

  const formatState = (data) => {
    if (!data) return ''
    if (data === 'STAYING') return 'Đang ở'
    if (data === 'COMMING') return 'Đang đến'
    if (data === 'STAYED') return 'Đã ở'
    return ''
  }

  const formatDate = (data, format = 'DD/MM/YYYY HH:mm') => {
    if (!data) return ''
    return moment(data).format(format)
  }

  const formatDateOnly = (data) => {
    if (!data) return ''
    return moment(data).format('DD/MM/YYYY')
  }

  const formatTime = (data) => {
    if (!data) return ''
    return moment(data).format('HH:mm:ss')
  }

  const formatNumber = (num, decimals = 0) => {
    if (!num && num !== 0) return '0'
    return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return {
    capitalize,
    formatCurrency,
    formatState,
    formatDate,
    formatDateOnly,
    formatTime,
    formatNumber
  }
}
