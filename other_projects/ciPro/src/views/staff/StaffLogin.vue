<template>
  <div class="app flex items-center is-fixed-page">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2">
          <div class="bg-white rounded-lg shadow p-6">
            <form @submit.prevent="logIn">
              <!-- Logo -->
              <div class="mb-6 text-center">
                <img src="/static/img/project/home/logo_login.png" alt="logo" class="logo-login inline-block" />
              </div>

              <!-- Error Message -->
              <div v-if="!errorFlag" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ errorMess }}
              </div>

              <!-- Phone Number -->
              <div class="mb-4">
                <label class="block mb-2">Số Điện Thoại<span class="error-sybol"></span></label>
                <input
                  id="phone"
                  v-model="inputs.phone_number"
                  type="text"
                  maxlength="20"
                  autocomplete="new-password"
                  class="form-control w-full"
                  placeholder="Nhập số điện thoại"
                  @keyup="intergerOnly($event.target)"
                  @change="checkPhoneNumberFormat($event.target)">
                <div v-if="!phoneNumberCheckFlag" class="text-red-600 text-sm mt-1">
                  Số điện thoại không đúng
                </div>
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label class="block mb-2">Mật Khẩu<span class="error-sybol"></span></label>
                <input
                  id="password"
                  v-model="inputs.password"
                  type="password"
                  class="form-control w-full"
                  placeholder="Nhập mật khẩu">
              </div>

              <!-- Login Button -->
              <div class="mb-4 text-center">
                <button
                  type="submit"
                  class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed default-btn-bg"
                  :disabled="onLogin">
                  {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                </button>
              </div>

              <!-- Forget Password -->
              <div class="mb-2">
                <button @click.prevent="forgetpass" class="a-like-button text-blue-500 hover:underline">
                  Quên Mật Khẩu
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import StaffMapper from '@/mapper/staff'
import Staff from '@/api/staff'
import commonFunc from '@/common/commonFunc'

// Router
const router = useRouter()

// Store
const authStore = useAuthStore()

// Data
const inputs = ref({
  phone_number: '',
  password: '',
  fromWhere: "web",
})

const onLogin = ref(false)
const phoneNumberCheckFlag = ref(true)
const errorFlag = ref(true)
const errorMess = ref("")

// Methods
/**
 * Login
 */
const logIn = () => {
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

      // Check user and redirect
      if (usr.isSuper) {
        router.push("/home-sp-admin")
      } else {
        if (menu.length > 0 && menu[0].title == "Tổng quan") {
          router.push("/overview")
        } else {
          router.push("/")
        }
      }

      onLogin.value = false
    }).catch(err => {
      let message = ""
      if (err.response.data.status == 500) {
        message = "Lỗi hệ thống"
      } else {
        message = err.response.data.mess
      }
      errorFlag.value = false
      errorMess.value = message
      onLogin.value = false
    })
  }
}

/**
 * Check phone number
 */
const checkPhoneNumberFormat = (item) => {
  let valueInput = item.value
  if (valueInput != null && valueInput != "") {
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
const intergerOnly = (item) => {
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

/**
 * Forget password
 */
const forgetpass = () => {
  let message = "Hãy liên hệ với admin của bạn để được reset lại mật khẩu. Nếu bạn là chủ kinh doanh, hãy liên hệ với chúng tôi (ciinTech) theo thông tin ở màn hình \"Liên hệ\". Xin chân thành cảm ơn!"
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
