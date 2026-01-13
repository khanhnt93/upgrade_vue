import { useToast as useVueToastification } from 'vue-toastification'

export function useToastNotification() {
  const toast = useVueToastification()

  const popToast = (variant, content, options = {}) => {
    const defaultOptions = {
      timeout: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
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
      default:
        toast.info(content, defaultOptions)
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
