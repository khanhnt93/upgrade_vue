<template>
  <div class="app flex items-center justify-center is-fixed-page bg-gray-100 min-h-screen">
    <div class="container-fluid mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-1/3">
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6">
              <h1 class="text-2xl font-bold text-center mb-6">Kích Hoạt Mật khẩu mới</h1>

              <form @submit.prevent="confirm">
                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Code<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="code"
                    v-model="inputs.code"
                    type="text"
                    autocomplete="new-password"
                    maxlength="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập số code"
                    @keyup="integerOnly($event.target)">
                  <div v-if="errorCode" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập code
                  </div>
                </div>

                <div class="text-center">
                  <button
                    type="button"
                    class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    @click="confirm"
                    :disabled="onConfirm">
                    {{ onConfirm ? 'Xác nhận...' : 'Xác nhận' }}
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import AuthenticationAPI from '@/api/authentication'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'

const router = useRouter()
const toast = useToast()

const inputs = ref({
  phone_number: null,
  code: null
})

const click = ref(false)
const onConfirm = ref(false)

const errorCode = computed(() => {
  return checkInfo(inputs.value.code)
})

function checkInfo(info) {
  return (click.value && (info == null || info.length <= 0))
}

function checkValidate() {
  return !errorCode.value
}

function confirm() {
  click.value = true
  let result = checkValidate()

  if (result) {
    onConfirm.value = true
    inputs.value.phone_number = Cookies.get('staffPhoneNumber')

    AuthenticationAPI.staffActivePass(inputs.value).then(res => {
      if (res && res.data) {
        let message = ''
        if (res.data.status == 200) {
          Cookies.remove('staffPhoneNumber')

          message = 'Tài khoản của bạn đã được kích hoạt'
          toast.success(message)
          router.push('/staff-login')
        }
      }
      onConfirm.value = false
    }).catch(err => {
      console.log(err)
      let message = ''
      if (err.response && err.response.data && err.response.data.status == 422) {
        message = err.response.data.mess
      } else {
        message = 'Lỗi hệ thống'
      }
      toast.error(message)
      onConfirm.value = false
    })
  }
}

function integerOnly(item) {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
