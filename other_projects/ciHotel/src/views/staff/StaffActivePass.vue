<template>
  <div class="flex flex-row items-center fixed top-0 left-0 right-0 bottom-0 bg-gray-100">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-2/5">
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6">
              <form @submit.prevent="confirm">
                <h1 class="text-2xl font-bold text-center mb-6">Kích Hoạt Mật khẩu mới</h1>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Code<span class="text-red-500"></span>
                  </label>
                  <input
                    id="code"
                    type="text"
                    autocomplete="new-password"
                    v-model="inputs.code"
                    maxlength="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorCode }"
                    placeholder="Nhập số code"
                    @keyup="integerOnly($event.target)">
                  <p v-if="errorCode" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập code
                  </p>
                </div>

                <div class="text-center">
                  <button
                    type="submit"
                    class="w-full bg-[#444444] hover:bg-[#333333] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="onConfirm">
                    {{ onConfirm ? "Xác nhận..." : "Xác nhận" }}
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
  name: 'ActiveAccount',
  data () {
    return {
      inputs: {
        phone_number: null,
        code: null
      },
      click: false,
      onConfirm: null,
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    errorCode: function () {
      return this.checkInfo(this.inputs.code)
    }
  },
  methods: {
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorCode)
    },
    confirm () {
      this.click = true
      let result = this.checkValidate()
      const { success, error } = useToast()
      
      if(result) {
        // get id account
        this.onConfirm = true
        this.inputs.phone_number = Cookies.get("staffPhoneNumber")

        AuthenticationAPI.staffActivePass(this.inputs).then(res => {
          if(res && res.data) {
            let message = ""
            if (res.data.status == 200) {
              Cookies.remove("staffPhoneNumber")

              // show popup success
              message = "Tài khoản của bạn đã được kích hoạt"
              success(message)
              
              setTimeout(() => {
                this.$router.push('/staff-login')
              }, 1500)
            }
          }
          this.onConfirm = false
        }).catch(err => {
          console.log(err)
          let message = ""
          if(err.response?.data?.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          error(message)
          this.onConfirm = false
        })
      }
    },

    /**
     * Only input integer
     */
     integerOnly(item) {
      let valueInput = item.value
      let result = commonFunc.intergerOnly(valueInput)
      item.value = result
    },
  }
}
</script>

<style lang="scss" scoped>
  // No custom styles needed - all using Tailwind
</style>
