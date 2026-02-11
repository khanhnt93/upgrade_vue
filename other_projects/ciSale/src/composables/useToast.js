import { useToast as useVueToastification } from 'vue-toastification'

export function useToastNotification() {
  const toast = useVueToastification()

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

  const showSuccess = (message, options = {}) => {
    toast.success(message, options)
  }

  const showError = (message, options = {}) => {
    toast.error(message, options)
  }

  const showWarning = (message, options = {}) => {
    toast.warning(message, options)
  }

  const showInfo = (message, options = {}) => {
    toast.info(message, options)
  }

  return {
    popToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    toast
  }
}

// Export as useToast for backward compatibility
export { useToastNotification as useToast }
