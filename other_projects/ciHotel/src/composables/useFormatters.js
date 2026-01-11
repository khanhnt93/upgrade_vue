import { computed } from 'vue'

export function useFormatters() {
  /**
   * Format number as currency with thousands separator
   * @param {number|string} value - The value to format
   * @param {string} locale - Locale string (default: 'vi-VN')
   * @param {string} currency - Currency code (default: 'VND')
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (value, locale = 'vi-VN', currency = 'VND') => {
    if (value === null || value === undefined || value === '') return '0'

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0'

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue)
  }

  /**
   * Format number with thousands separator
   * @param {number|string} value - The value to format
   * @param {string} locale - Locale string (default: 'vi-VN')
   * @returns {string} Formatted number string
   */
  const formatNumber = (value, locale = 'vi-VN') => {
    if (value === null || value === undefined || value === '') return '0'

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0'

    return new Intl.NumberFormat(locale).format(numValue)
  }

  /**
   * Format date to localized string
   * @param {Date|string|number} date - The date to format
   * @param {string} locale - Locale string (default: 'vi-VN')
   * @param {object} options - Intl.DateTimeFormat options
   * @returns {string} Formatted date string
   */
  const formatDate = (date, locale = 'vi-VN', options = {}) => {
    if (!date) return ''

    const dateObj = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date

    if (isNaN(dateObj.getTime())) return ''

    const defaultOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    }

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)
  }

  /**
   * Format date and time to localized string
   * @param {Date|string|number} date - The date to format
   * @param {string} locale - Locale string (default: 'vi-VN')
   * @returns {string} Formatted datetime string
   */
  const formatDateTime = (date, locale = 'vi-VN') => {
    if (!date) return ''

    return formatDate(date, locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  /**
   * Format time to HH:MM:SS
   * @param {Date|string|number} date - The date to format
   * @param {string} locale - Locale string (default: 'vi-VN')
   * @returns {string} Formatted time string
   */
  const formatTime = (date, locale = 'vi-VN') => {
    if (!date) return ''

    const dateObj = typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date

    if (isNaN(dateObj.getTime())) return ''

    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(dateObj)
  }

  /**
   * Format percentage
   * @param {number} value - The value to format (e.g., 0.5 for 50%)
   * @param {number} decimals - Number of decimal places
   * @returns {string} Formatted percentage string
   */
  const formatPercent = (value, decimals = 2) => {
    if (value === null || value === undefined || value === '') return '0%'

    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue)) return '0%'

    return `${(numValue * 100).toFixed(decimals)}%`
  }

  /**
   * Truncate text with ellipsis
   * @param {string} text - The text to truncate
   * @param {number} length - Maximum length
   * @returns {string} Truncated text
   */
  const truncate = (text, length = 50) => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }

  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatTime,
    formatPercent,
    truncate
  }
}
