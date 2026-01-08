<template>
  <div class="app flex items-center justify-center is-fixed-page bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-1/3">
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6">
              <h1 class="text-2xl font-bold text-center mb-6">Đổi Mật Khẩu</h1>
              
              <form @submit.prevent="update">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu Hiện Tại<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="oldPassword"
                    v-model="inputs.old_password"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập mật khẩu hiện tại">
                  <div v-if="errorOldPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mật khẩu hiện tại
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu Mới<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="newPassword"
                    v-model="inputs.new_password"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập mật khẩu mới">
                  <div v-if="errorNewPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mật khẩu mới
                  </div>
                  <div v-if="errorNewPasswordCompare" class="text-red-600 text-sm mt-1">
                    Mật khẩu mới không được trùng mật khẩu cũ
                  </div>
                </div>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Nhắc lại mật khẩu mới<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    v-model="confirmPass"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập lại mật khẩu mới">
                  <div v-if="errorConfirmPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập lại mật khẩu mới
                  </div>
                  <div v-if="errorMatch" class="text-red-600 text-sm mt-1">
                    Nhắc lại mật khẩu không đúng
                  </div>
                </div>

                <div class="text-center">
                  <button
                    type="button"
                    class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="update"
                    :disabled="onUpdate">
                    {{ onUpdate ? 'Cập Nhật Mật Khẩu...' : 'Cập Nhật Mật Khẩu' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/composables/useToast'
import AuthenticationAPI from '@/api/authentication'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const inputs = ref({
  new_password: null,
  old_password: null
})

const confirmPass = ref(null)
const click = ref(false)
const onUpdate = ref(false)
const errorMatch = ref(false)

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

watch(confirmPass, () => {
  errorMatch.value = false
})

function checkConfirmPass() {
  return errorConfirmPassword.value || (inputs.value.new_password === confirmPass.value)
}

function comparePass() {
  return (click.value && 
    (inputs.value.new_password != null && inputs.value.new_password.length > 0) &&
    (inputs.value.old_password != null || inputs.value.old_password.length > 0) &&
    (inputs.value.new_password === inputs.value.old_password))
}

function checkInfo(info) {
  return (click.value && (info == null || info.length <= 0))
}

function checkValidate() {
  return !(errorNewPassword.value || errorConfirmPassword.value || errorMatch.value || errorNewPasswordCompare.value)
}

function update() {
  if (onUpdate.value === true) {
    return
  }

  click.value = true
  let result = checkValidate()
  errorMatch.value = !checkConfirmPass()
  
  if (result && !errorMatch.value) {
    onUpdate.value = true

    AuthenticationAPI.staffChangePass(inputs.value).then(res => {
      if (res && res.data && res.data.status == 200) {
        toast.success('Đổi mật khẩu thành công!')
        authStore.removeToken()
        router.push('/staff-login')
      }
      onUpdate.value = false
    }).catch(err => {
      onUpdate.value = false

      let message = ''
      if (err.response.data.status == 422) {
        message = err.response.data.mess
      } else {
        message = 'Lỗi hệ thống'
      }
      toast.error(message)
    })
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
