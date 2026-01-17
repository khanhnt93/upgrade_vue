import { useToast as useVueToastification } from 'vue-toastification'

/**
 * Composable for toast notifications
 * Provides a unified interface for showing toast messages
 */
export function useToast() {
  const toast = useVueToastification()

  /**
   * Display toast notification based on variant
   * @param {string} variant - The type of toast (success, danger, warning, info)
   * @param {string} message - The message to display
   * @param {Object} options - Additional toast options
   */
  const popToast = (variant, content = '', options = {}) => {
    // Set default message if content is null, undefined, or empty
    const message = content || 'Thông báo'

    const defaultOptions = {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options
    }

    switch (variant) {
      case 'success':
        toast.success(message, defaultOptions)
        break
      case 'danger':
      case 'error':
        toast.error(message, defaultOptions)
        break
      case 'warning':
        toast.warning(message, defaultOptions)
        break
      case 'info':
      default:
        toast.info(message, defaultOptions)
    }
  }

  /**
   * Show success toast
   * @param {string} message - Success message
   * @param {Object} options - Additional options
   */
  const success = (message, options = {}) => {
    toast.success(message, options)
  }

  /**
   * Show error toast
   * @param {string} message - Error message
   * @param {Object} options - Additional options
   */
  const error = (message, options = {}) => {
    toast.error(message, options)
  }

  /**
   * Show warning toast
   * @param {string} message - Warning message
   * @param {Object} options - Additional options
   */
  const warning = (message, options = {}) => {
    toast.warning(message, options)
  }

  /**
   * Show info toast
   * @param {string} message - Info message
   * @param {Object} options - Additional options
   */
  const info = (message, options = {}) => {
    toast.info(message, options)
  }

  /**
   * Clear all toasts
   */
  const clear = () => {
    toast.clear()
  }

  return {
    popToast,
    success,
    error,
    warning,
    info,
    clear,
  }
}
