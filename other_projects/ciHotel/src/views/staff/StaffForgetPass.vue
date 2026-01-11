<template>
  <div class="flex flex-row items-center fixed top-0 left-0 right-0 bottom-0 bg-gray-100">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-2/5">
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6">
              <form @submit.prevent="update">
                <h1 class="text-2xl font-bold text-center mb-6">Quên Mật Khẩu</h1>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Số Điện Thoại<span class="text-red-500"></span>
                  </label>
                  <input 
                    id="phone"
                    type="text"
                    autocomplete="new-password"
                    v-model="inputs.phone_number"
                    maxlength="15"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorPhone || !phoneNumberCheckFlag }"
                    @keyup="intergerOnly($event.target)"
                    @change="checkPhoneNumberFormat($event.target)">
                  <p v-if="errorPhone" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập số điện thoại
                  </p>
                  <p v-if="!phoneNumberCheckFlag" class="mt-1 text-sm text-red-600">
                    Số điện thoại không đúng
                  </p>
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu Mới<span class="text-red-500"></span>
                  </label>
                  <input 
                    id="newPassword"
                    type="password"
                    v-model="inputs.new_pass"
                    autocomplete="new-password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorNewPassword || errorLengthPassword }">
                  <p v-if="errorNewPassword" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập mật khẩu
                  </p>
                  <p v-if="errorLengthPassword" class="mt-1 text-sm text-red-600">
                    Mật khẩu phải ít nhất 6 kí tự
                  </p>
                </div>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Nhắc lại mật khẩu mới<span class="text-red-500"></span>
                  </label>
                  <input 
                    id="confirmPassword"
                    type="password"
                    v-model="confirmPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorconfirmPassword || errorMatch }">
                  <p v-if="errorconfirmPassword" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập lại mật khẩu
                  </p>
                  <p v-if="errorMatch" class="mt-1 text-sm text-red-600">
                    Mật khẩu không khớp
                  </p>
                </div>

                <div id="recaptcha-container" class="mb-4"></div>

                <div class="text-center">
                  <button
                    id="btnUpdateStaff"
                    type="submit"
                    class="w-full bg-[#444444] hover:bg-[#333333] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="onUpdate">
                    {{ onUpdate ? "Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu" }}
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
import AuthenticationAPI from '@/api/authentication'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      inputs: {
        phone_number: null,
        new_pass: null,
      },
      confirmPassword : null,
      click: false,
      onUpdate: null,
      errorMatch: null,
      errorLengthPassword: null,
      phoneNumberCheckFlag: true
    }
  },
  mounted () {
    this.getCaptcha()
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    errorPhone () {
      return this.checkInfo(this.inputs.phone_number)
    },
    errorNewPassword () {
      return !this.errorLengthPassword && this.checkInfo(this.inputs.new_pass)
    },
    errorconfirmPassword () {
      return this.checkInfo(this.confirmPassword)
    },
  },
  watch: {
    confirmPassword () {
      this.errorMatch = false
    }
  },
  methods: {
    checkLengthPassword () {
      if(this.errorNewPassword || this.inputs.new_pass.length >= 6)
        return false
      return true
    },
    checkConfirmPassword () {
      return this.errorconfirmPassword || (this.inputs.new_pass == this.confirmPassword)
    },
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorPhone || this.errorNewPassword || this.errorconfirmPassword || this.errorMatch
            || this.errorLengthPassword || !this.phoneNumberCheckFlag)
    },

    /**
     * Get captcha
     */
    getCaptcha() {
      // Note: Firebase recaptcha is commented out in original
      // Implement if needed with Firebase v9+ modular SDK
    },

    /**
     * Reset captcha
     */
    resetCaptcha() {
      setTimeout(function(){
        if (window.recaptchaVerifier && window.recaptchaWidgetId) {
          window.recaptchaVerifier.reset(window.recaptchaWidgetId);
        }
      }, 500);
    },

    /**
     *  Update pass
     */
    changePass (recapchaToken) {
      this.inputs.captcha = recapchaToken
      const { success, error } = useToast()
      
      AuthenticationAPI.staffUpdatePass(this.inputs).then(res => {
        if(res && res.data && res.data.status == 200) {
          success('Cập nhật mật khẩu thành công!')
          // Redirect to active password
          Cookies.set("staffPhoneNumber", this.inputs.phone_number, { expires: 1 })
          this.$router.push("/staff-activepass")
        }
        this.onUpdate = false
      }).catch(err => {
        this.onUpdate = false
        this.resetCaptcha()

        let message = ""
        if(err.response?.data?.status == 422) {
          message = err.response.data.mess
        } else {
          message = "Lỗi hệ thống"
        }
        error(message)
      })
    },

    update () {
      this.click = true
      this.errorLengthPassword = this.checkLengthPassword()
      let result = this.checkValidate()
      this.errorMatch = !this.checkConfirmPassword()
      if(result && !this.errorMatch) {
        this.onUpdate = true
        // Call changePass directly without recaptcha for now
        // TODO: Implement Firebase recaptcha v3 if needed
        this.changePass(null)
      } else {
        this.resetCaptcha()
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
  }
}
</script>

<style lang="scss" scoped>
  // No custom styles needed - all using Tailwind
</style>
