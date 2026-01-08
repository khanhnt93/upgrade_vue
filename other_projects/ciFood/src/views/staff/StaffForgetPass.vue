<template>
  <div class="app flex items-center justify-center is-fixed-page bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-1/3">
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6">
              <h1 class="text-2xl font-bold text-center mb-6">Quên Mật Khẩu</h1>
              
              <form @submit.prevent="update">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Số Điện Thoại<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    v-model="inputs.phone_number"
                    type="text"
                    autocomplete="new-password"
                    maxlength="15"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập số điện thoại"
                    @keyup="intergerOnly($event.target)"
                    @change="checkPhoneNumberFormat($event.target)">
                  <div v-if="errorPhone" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập số điện thoại
                  </div>
                  <div v-if="!phoneNumberCheckFlag" class="text-red-600 text-sm mt-1">
                    Số điện thoại không đúng
                  </div>
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu Mới<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="newPassword"
                    v-model="inputs.new_pass"
                    type="password"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập mật khẩu mới">
                  <div v-if="errorNewPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mật khẩu
                  </div>
                  <div v-if="errorLengthPassword" class="text-red-600 text-sm mt-1">
                    Mật khẩu phải ít nhất 6 kí tự
                  </div>
                </div>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Nhắc lại mật khẩu mới<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập lại mật khẩu">
                  <div v-if="errorconfirmPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập lại mật khẩu
                  </div>
                  <div v-if="errorMatch" class="text-red-600 text-sm mt-1">
                    Mật khẩu không khớp
                  </div>
                </div>

                <div class="mb-4">
                  <div id="recaptcha-container"></div>
                </div>

                <div class="text-center">
                  <button
                    id="btnUpdateStaff"
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
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import AuthenticationAPI from '@/api/authentication'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'

const router = useRouter()
const toast = useToast()

const inputs = ref({
  phone_number: null,
  new_pass: null
})

const confirmPassword = ref(null)
const click = ref(false)
const onUpdate = ref(false)
const errorMatch = ref(false)
const errorLengthPassword = ref(false)
const phoneNumberCheckFlag = ref(true)

const errorPhone = computed(() => {
  return checkInfo(inputs.value.phone_number)
})

const errorNewPassword = computed(() => {
  return !errorLengthPassword.value && checkInfo(inputs.value.new_pass)
})

const errorconfirmPassword = computed(() => {
  return checkInfo(confirmPassword.value)
})

watch(confirmPassword, () => {
  errorMatch.value = false
})

onMounted(() => {
  // Note: Firebase/reCAPTCHA implementation would go here
  // For now, we'll use invisible reCAPTCHA or handle it server-side
})

function checkLengthPassword() {
  if (errorNewPassword.value || !inputs.value.new_pass || inputs.value.new_pass.length >= 6) {
    return false
  }
  return true
}

function checkConfirmPassword() {
  return errorconfirmPassword.value || (inputs.value.new_pass === confirmPassword.value)
}

function checkInfo(info) {
  return (click.value && (info == null || info.length <= 0))
}

function checkValidate() {
  return !(errorPhone.value || errorNewPassword.value || errorconfirmPassword.value || 
           errorMatch.value || errorLengthPassword.value || !phoneNumberCheckFlag.value)
}

function changePass(recapchaToken) {
  inputs.value.captcha = recapchaToken
  AuthenticationAPI.staffUpdatePass(inputs.value).then(res => {
    if (res && res.data && res.data.status == 200) {
      toast.success('Cập nhật mật khẩu thành công!')
      Cookies.set('staffPhoneNumber', inputs.value.phone_number, { expires: 1 })
      router.push('/staff-activepass')
    }
    onUpdate.value = false
  }).catch(err => {
    onUpdate.value = false

    let message = ''
    if (err.response && err.response.data && err.response.data.status == 422) {
      message = err.response.data.mess
    } else {
      message = 'Lỗi hệ thống'
    }
    toast.error(message)
  })
}

function update() {
  click.value = true
  errorLengthPassword.value = checkLengthPassword()
  let result = checkValidate()
  errorMatch.value = !checkConfirmPassword()
  
  if (result && !errorMatch.value) {
    onUpdate.value = true
    // For now, call changePass directly without reCAPTCHA
    // In production, implement Firebase reCAPTCHA here
    changePass('')
  }
}

function checkPhoneNumberFormat(item) {
  let valueInput = item.value
  if (valueInput != null && valueInput != '') {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  } else {
    phoneNumberCheckFlag.value = true
  }
}

function intergerOnly(item) {
  let valueInput = item.value
  let result = commonFunc.intergerOnly(valueInput)
  item.value = result

  if (valueInput.length == 10) {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
