import { useToast as useToastification } from 'vue-toastification'
export function useToastNotification() {
    const toast = useToastification()
    function popToast(variant, content) {
        switch (variant) {
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
        }
    }
    return {
        popToast,
        toast,
        success: (msg) => toast.success(msg),
        error: (msg) => toast.error(msg),
        warning: (msg) => toast.warning(msg),
        info: (msg) => toast.info(msg)
    }
}