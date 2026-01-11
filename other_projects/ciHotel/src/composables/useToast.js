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
  const popToast = (variant, content, options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      pauseOnHover: true,
      draggable: true,
      draggablePercent: 0.6,
      showCloseButtonOnHover: false,
      hideProgressBar: false,
      closeButton: 'button',
      icon: true,
      rtl: false,
      ...options
    }

    switch (variant) {
      case 'success':
        toast.success(content, defaultOptions)
        break
      case 'danger':
      case 'error':
        toast.error(content, defaultOptions)
        break
      case 'warning':
        toast.warning(content, defaultOptions)
        break
      case 'info':
        toast.info(content, defaultOptions)
        break
      default:
        toast(content, defaultOptions)
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
