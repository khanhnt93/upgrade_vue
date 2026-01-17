<template>
  <div class="app flex items-center is-fixed-page">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2">
          <div class="bg-white rounded-lg shadow p-6">
            <form method="put" @submit.prevent="update">
              <h1 class="text-center text-2xl font-bold mb-6">
                Đổi Mật Khẩu
              </h1>

              <!-- Old Password -->
              <div class="mb-4">
                <label class="block mb-2">
                  Mật Khẩu Hiện Tại<span class="error-sybol"></span>
                </label>
                <input
                  id="oldPassword"
                  v-model="inputs.old_password"
                  type="password"
                  class="form-control w-full">
                <div v-if="errorOldPassword" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập mật khẩu hiện tại
                </div>
              </div>

              <!-- New Password -->
              <div class="mb-4">
                <label class="block mb-2">
                  Mật Khẩu Mới<span class="error-sybol"></span>
                </label>
                <input
                  id="newPassword"
                  v-model="inputs.new_password"
                  type="password"
                  class="form-control w-full">
                <div v-if="errorNewPassword" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập mật khẩu mới
                </div>
                <div v-if="errorNewPasswordCompare" class="text-red-600 text-sm mt-1">
                  Mật khẩu mới không được trùng mật khẩu cũ
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="mb-4">
                <label class="block mb-2">
                  Nhắc lại mật khẩu mới<span class="error-sybol"></span>
                </label>
                <input
                  id="confirmPassword"
                  v-model="confirmPass"
                  type="password"
                  class="form-control w-full">
                <div v-if="errorConfirmPassword" class="text-red-600 text-sm mt-1">
                  Vui lòng nhập lại mật khẩu mới
                </div>
                <div v-if="errorMatch" class="text-red-600 text-sm mt-1">
                  Nhắc lại mật khẩu không đúng
                </div>
              </div>

              <!-- Update Button -->
              <div class="text-center">
                <button
                  type="submit"
                  :disabled="onUpdate"
                  :class="[
                    'px-6 py-2 rounded default-btn-bg',
                    onUpdate ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
                  ]">
                  {{ onUpdate ? "Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthenticationAPI from '@/api/authentication'
import { Constant } from '@/common/constant'

// Router
const router = useRouter()

// Store
const authStore = useAuthStore()

// Data
const inputs = ref({
  new_password: null,
  old_password: null,
})

const confirmPass = ref(null)
const click = ref(false)
const onUpdate = ref(null)
const errorMatch = ref(null)

// Computed
const errorNewPassword = computed(() => {
  return checkInfo(inputs.value.new_password)
})

const errorNewPasswordCompare = computed(() => {
  return comparePass()
})

const errorConfirmPassword = computed(() => {
  return checkInfo(confirmPass.value)
})

const errorOldPassword = computed(() => {
  return checkInfo(inputs.value.old_password)
})

// Watch
watch(confirmPass, () => {
  errorMatch.value = false
})

// Methods
const checkConfirmPass = () => {
  return errorConfirmPassword.value || (inputs.value.new_password == confirmPass.value)
}

const comparePass = () => {
  return (click.value && (inputs.value.new_password != null && inputs.value.new_password.length > 0)
    && (inputs.value.old_password != null || inputs.value.old_password.length > 0)
    && (inputs.value.new_password == inputs.value.old_password))
}

const checkInfo = (info) => {
  return (click.value && (info == null || info.length <= 0))
}

const checkValidate = () => {
  return !(errorNewPassword.value || errorConfirmPassword.value || errorMatch.value || errorNewPasswordCompare.value)
}

const update = () => {
  if (onUpdate.value == true) {
    return
  }

  click.value = true
  let result = checkValidate()
  errorMatch.value = !checkConfirmPass()
  
  if (result && !errorMatch.value) {
    onUpdate.value = true

    AuthenticationAPI.staffChangePass(inputs.value).then(res => {
      if (res && res.data && res.data.status == 200) {
        // Redirect to active pass page
        authStore.logout()
        router.push('/staff-login')
      }
      onUpdate.value = false
    }).catch(err => {
      onUpdate.value = false

      let message = ""
      if (err.response.data.status == 422) {
        message = err.response.data.mess
      } else {
        message = "Lỗi hệ thống"
      }
      alert(message)
    })
  }
}
</script>
