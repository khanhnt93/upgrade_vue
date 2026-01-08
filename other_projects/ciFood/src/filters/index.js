// Vue 3 doesn't support global filters anymore
// These filters have been moved to useFormatters composable
// Import and use: import { useFormatters } from '@/composables/useFormatters'

export const capitalize = (value) => {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const format_currency = (num) => {
  if (!num) return '0'
  let result = '0';
  if (num) {
    result = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return result
}
