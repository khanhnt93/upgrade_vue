import { ref } from 'vue'

// Module-level singleton state so all components share one modal
const visible = ref(false)
const message = ref('')
let resolveFn = null

export function useConfirm() {
  const confirmDialog = (msg) => {
    message.value = msg
    visible.value = true
    return new Promise((resolve) => {
      resolveFn = resolve
    })
  }

  const onConfirm = () => {
    visible.value = false
    if (resolveFn) resolveFn(true)
  }

  const onCancel = () => {
    visible.value = false
    if (resolveFn) resolveFn(false)
  }

  return { visible, message, confirmDialog, onConfirm, onCancel }
}
