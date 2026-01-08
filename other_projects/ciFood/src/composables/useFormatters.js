import moment from 'moment'

/**
 * Composable for formatting utilities (replaces Vue 2 filters)
 */
export function useFormatters() {
  /**
   * Format currency to VND
   * @param {number} value - The number to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (value) => {
    if (!value && value !== 0) return ''
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value)
  }

  /**
   * Format number with thousand separators
   * @param {number} value - The number to format
   * @returns {string} Formatted number string
   */
  const formatNumber = (value) => {
    if (!value && value !== 0) return ''
    return new Intl.NumberFormat('vi-VN').format(value)
  }

  /**
   * Format date using moment.js
   * @param {string|Date} value - The date to format
   * @param {string} format - The format string (default: 'DD/MM/YYYY')
   * @returns {string} Formatted date string
   */
  const formatDate = (value, format = 'DD/MM/YYYY') => {
    if (!value) return ''
    return moment(value).format(format)
  }

  /**
   * Format datetime using moment.js
   * @param {string|Date} value - The datetime to format
   * @param {string} format - The format string (default: 'DD/MM/YYYY HH:mm')
   * @returns {string} Formatted datetime string
   */
  const formatDateTime = (value, format = 'DD/MM/YYYY HH:mm') => {
    if (!value) return ''
    return moment(value).format(format)
  }

  /**
   * Format time using moment.js
   * @param {string|Date} value - The time to format
   * @param {string} format - The format string (default: 'HH:mm')
   * @returns {string} Formatted time string
   */
  const formatTime = (value, format = 'HH:mm') => {
    if (!value) return ''
    return moment(value).format(format)
  }

  /**
   * Truncate text to specified length
   * @param {string} text - The text to truncate
   * @param {number} length - Maximum length
   * @param {string} suffix - Suffix to add (default: '...')
   * @returns {string} Truncated text
   */
  const truncate = (text, length = 50, suffix = '...') => {
    if (!text) return ''
    if (text.length <= length) return text
    return text.substring(0, length) + suffix
  }

  /**
   * Uppercase first letter
   * @param {string} text - The text to capitalize
   * @returns {string} Capitalized text
   */
  const capitalize = (text) => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  /**
   * Format percentage
   * @param {number} value - The value to format as percentage
   * @param {number} decimals - Number of decimal places (default: 0)
   * @returns {string} Formatted percentage string
   */
  const formatPercent = (value, decimals = 0) => {
    if (!value && value !== 0) return '0%'
    return `${value.toFixed(decimals)}%`
  }

  return {
    formatCurrency,
    formatNumber,
    formatDate,
    formatDateTime,
    formatTime,
    truncate,
    capitalize,
    formatPercent,
  }
}
