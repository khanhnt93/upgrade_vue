<template>
  <div class="app flex items-center justify-center is-fixed-page bg-gray-100">
    <div class="container-fluid mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full">
          <div class="bg-white rounded-lg shadow-lg">
            <div class="p-6">
              <form @submit.prevent="logIn">
                <div class="text-center mb-6">
                  <img src="/static/img/project/logo.png" alt="logo" class="logo-login mx-auto" />
                </div>

                <div v-if="!errorFlag" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {{ errorMess }}
                </div>

                <div class="form-group mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Số Điện Thoại<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    v-model="inputs.phone_number"
                    type="text"
                    maxlength="20"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập số điện thoại"
                    @keyup="intergerOnly($event.target)"
                    @change="checkPhoneNumberFormat($event.target)">
                  <div v-if="!phoneNumberCheckFlag" class="text-red-600 text-sm mt-1">
                    Số điện thoại không đúng
                  </div>
                </div>

                <div class="form-group mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu<span class="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    v-model="inputs.password"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nhập mật khẩu">
                </div>

                <div class="mb-4">
                  <div class="text-center">
                    <button
                      type="button"
                      class="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      @click.prevent="logIn"
                      :disabled="onLogin">
                      {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                    </button>
                  </div>
                </div>

                <div>
                  <button @click.prevent="forgetpass" class="text-blue-600 hover:text-blue-800 underline text-sm">
                    Quên Mật Khẩu
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { useToast } from '@/composables/useToast'
import StaffMapper from '@/mapper/staff'
import Staff from '@/api/staff'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const inputs = ref({
  phone_number: '',
  password: '',
  fromWhere: 'web'
})

const onLogin = ref(false)
const phoneNumberCheckFlag = ref(true)
const errorFlag = ref(true)
const errorMess = ref('')

onMounted(() => {
  if (authStore.token) {
    router.push('/')
  }
})

/**
 * Login
 */
function logIn() {
  if (phoneNumberCheckFlag.value) {
    onLogin.value = true
    errorMess.value = null

    Staff.logIn(inputs.value).then(res => {
      // Store token
      authStore.updateToken(res.data.data.token)

      // Store menu
      let menu = res.data.data.menu
      authStore.updateMenu(menu)

      // Store staff info
      const usr = StaffMapper.mapStaffModelToDto(res.data.data.staff_info)
      authStore.updateUser(usr)

      toast.success('Đăng nhập thành công!')
      router.push('/')

      onLogin.value = false
    }).catch(err => {
      let message = ''
      if (err.response.data.status == 500) {
        message = 'Lỗi hệ thống'
      } else {
        message = err.response.data.mess
      }
      errorFlag.value = false
      errorMess.value = message
      onLogin.value = false
      toast.error(message)
    })
  }
}

/**
 * Check phone number
 */
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

/**
 * Only input integer
 */
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

function forgetpass() {
  let message = 'Hãy liên hệ với admin của bạn để được reset lại mật khẩu. Nếu bạn là chủ kinh doanh, hãy liên hệ với chúng tôi (ciinTech) theo thông tin ở màn hình "Liên hệ". Xin chân thành cảm ơn!'
  alert(message)
}
</script>

<style lang="scss">
.logo-login {
  width: 32%;
  height: auto;
  text-align: center;
}
</style>
