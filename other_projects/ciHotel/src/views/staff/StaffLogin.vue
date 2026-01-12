<template>
  <div class="flex flex-row items-center fixed top-0 left-0 right-0 bottom-0 bg-gray-100">
    <div class="container-fluid mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-2/5">
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6">
              <form @submit.prevent="logIn">
                <div class="flex justify-center mb-6">
                  <img src="/img/project/logo.png" alt="logo" class="w-1/3 h-auto" />
                </div>

                <div v-if="errorMess" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {{ errorMess }}
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Số Điện Thoại<span class="text-red-500"></span>
                  </label>
                  <input
                    id="phone"
                    v-model="inputs.phone_number"
                    type="text"
                    maxlength="20"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': !phoneNumberCheckFlag }"
                    placeholder="Nhập số điện thoại"
                    @keyup="intergerOnly($event.target)"
                    @change="checkPhoneNumberFormat($event.target)">
                  <p v-if="!phoneNumberCheckFlag" class="mt-1 text-sm text-red-600">
                    Số điện thoại không đúng
                  </p>
                </div>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu<span class="text-red-500"></span>
                  </label>
                  <input
                    id="password"
                    v-model="inputs.password"
                    type="password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mật khẩu">
                </div>

                <div class="mb-4 text-center">
                  <button
                    type="submit"
                    class="w-full bg-[#444444] hover:bg-[#333333] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="onLogin">
                    {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                  </button>
                </div>

                <div class="text-center">
                  <button
                    @click.prevent="forgetpass"
                    class="text-blue-600 hover:text-blue-800 underline text-sm">
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

<script>
import { useRouter } from 'vue-router'
import StaffMapper from '@/mapper/staff'
import Staff from '@/api/staff'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { success, error, info } = useToast()

    return {
      router,
      authStore,
      toastSuccess: success,
      toastError: error,
      toastInfo: info
    }
  },
  data () {
    return {
      inputs: {
        phone_number: '',
        password: '',
        fromWhere: "web",
      },
      code: '',
      onLogin: false,
      selected: '',
      phoneNumberCheckFlag: true,
      errorMess: ""
    }
  },
  methods: {
    /**
     *  Login
     */
     logIn () {
       console.log('Login method called')
       console.log('Phone check flag:', this.phoneNumberCheckFlag)
       console.log('Inputs:', this.inputs)

       if(this.phoneNumberCheckFlag) {
         this.onLogin = true
         this.errorMess = null

         console.log('Making API call...')
         Staff.logIn(this.inputs).then(res => {
          console.log('Login response:', res)
          // Store token
          this.authStore.updateToken(res.data.data.token)

          // Store menu
          let menu = res.data.data.menu
          this.authStore.updateMenu(menu)

          // Store staff info
          const usr = StaffMapper.mapStaffModelToDto(res.data.data.staff_info)
          this.authStore.updateUser(usr)

          this.toastSuccess('Đăng nhập thành công!')
          this.router.push("/")

          this.onLogin = false
         }).catch(err => {
           console.error('Login error:', err)
           let message = ""
            if(err.response?.data?.status == 500) {
              message = "Lỗi hệ thống"
            } else {
              message = err.response?.data?.mess || "Lỗi đăng nhập"
            }
            this.errorMess = message
            this.toastError(message)
            this.onLogin = false
         })
       } else {
         console.log('Phone validation failed')
         this.toastError('Số điện thoại không hợp lệ')
       }
     },

    /**
     * Check phone number
     */
    checkPhoneNumberFormat(item) {
      let valueInput = item.value
      if (valueInput != null && valueInput != "") {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      } else {
        this.phoneNumberCheckFlag = true
      }
    },

    /**
     * Only input integer
     */
     intergerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result

      if(valueInput.length == 10) {
        if (commonFunc.phoneNumberCheck(valueInput)) {
          this.phoneNumberCheckFlag = true
        } else {
          this.phoneNumberCheckFlag = false
        }
      }
    },

    forgetpass() {
      let message = "Hãy liên hệ với admin của bạn để được reset lại mật khẩu. Nếu bạn là chủ kinh doanh, hãy liên hệ với chúng tôi (ciinTech) theo thông tin ở màn hình \"Liên hệ\". Xin chân thành cảm ơn!"
      this.toastInfo(message)
    },
  }
}
</script>

<style lang="scss" scoped>
  // No custom styles needed - all using Tailwind
</style>
