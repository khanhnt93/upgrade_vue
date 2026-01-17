import { useToast } from 'vue-toastification'

/**
 * Toast Notification Composable
 * Provides a consistent interface for showing toast notifications
 */
export function useToastNotification() {
  const toast = useToast()

  /**
   * Show a toast notification
   * @param {string} variant - The toast variant: 'success', 'danger', 'warning', 'info'
   * @param {string} content - The message content
   * @param {object} options - Additional toast options
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
   * Show a success toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  const success = (message, options = {}) => {
    popToast('success', message, options)
  }

  /**
   * Show an error toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  const error = (message, options = {}) => {
    popToast('danger', message, options)
  }

  /**
   * Show a warning toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  const warning = (message, options = {}) => {
    popToast('warning', message, options)
  }

  /**
   * Show an info toast
   * @param {string} message - The message to display
   * @param {object} options - Additional options
   */
  const info = (message, options = {}) => {
    popToast('info', message, options)
  }

  return {
    popToast,
    success,
    error,
    warning,
    info,
    toast // Expose the raw toast instance for advanced usage
  }
}

// Export as useToast for convenience (alias)
export { useToastNotification as useToast }
