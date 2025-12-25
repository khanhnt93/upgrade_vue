/**
 * Toast notification composable using vue-toastification
 * 
 * Usage in Composition API:
 * import { useToastNotification } from '@/composables/useToast'
 * const { popToast } = useToastNotification()
 * popToast('success', 'Operation completed!')
 * 
 * Usage in Options API:
 * import { popToast } from '@/composables/useToast'
 * popToast.call(this, 'success', 'Operation completed!')
 */

import { useToast } from 'vue-toastification'

/**
 * Composable for toast notifications (Composition API)
 */
export function useToastNotification() {
  const toast = useToast()

  /**
   * Show toast notification
   * @param {string} variant - Type: 'success', 'danger', 'warning', 'info'
   * @param {string} content - Message to display
   */
  const popToast = (variant, content) => {
    switch(variant) {
      case 'success':
        toast.success(content)
        break
      case 'danger':
      case 'error':
        toast.error(content)
        break
      case 'warning':
        toast.warning(content)
        break
      case 'info':
      default:
        toast.info(content)
        break
    }
  }

  return {
    popToast,
    toast // Expose toast instance for advanced usage
  }
}

/**
 * Standalone function for Options API
 * Usage: this.$toast.success('message') or popToast.call(this, 'success', 'message')
 */
export function popToast(variant, content) {
  if (!this || !this.$toast) {
    // If not called from Vue component context, use global toast
    const toast = useToast()
    switch(variant) {
      case 'success':
        toast.success(content)
        break
      case 'danger':
      case 'error':
        toast.error(content)
        break
      case 'warning':
        toast.warning(content)
        break
      case 'info':
      default:
        toast.info(content)
        break
    }
  } else {
    // Called from Vue component context
    switch(variant) {
      case 'success':
        this.$toast.success(content)
        break
      case 'danger':
      case 'error':
        this.$toast.error(content)
        break
      case 'warning':
        this.$toast.warning(content)
        break
      case 'info':
      default:
        this.$toast.info(content)
        break
    }
  }
}
