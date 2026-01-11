<template>
  <div class="flex flex-row items-center fixed top-0 left-0 right-0 bottom-0 bg-gray-100">
    <div class="container mx-auto px-4">
      <div class="flex justify-center">
        <div class="w-full md:w-1/2 lg:w-2/5">
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6">
              <form @submit.prevent="update">
                <h1 class="text-2xl font-bold text-center mb-6">Đổi Mật Khẩu</h1>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu Hiện Tại<span class="text-red-500"></span>
                  </label>
                  <input 
                    id="oldPassword" 
                    type="password"
                    v-model="inputs.old_password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorOldPassword }">
                  <p v-if="errorOldPassword" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập mật khẩu hiện tại
                  </p>
                </div>

                <div class="mb-4">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Mật Khẩu Mới<span class="text-red-500"></span>
                  </label>
                  <input 
                    id="newPassword"
                    type="password"
                    v-model="inputs.new_password"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorNewPassword || errorNewPasswordCompare }">
                  <p v-if="errorNewPassword" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập mật khẩu mới
                  </p>
                  <p v-if="errorNewPasswordCompare" class="mt-1 text-sm text-red-600">
                    Mật khẩu mới không được trùng mật khẩu cũ
                  </p>
                </div>

                <div class="mb-6">
                  <label class="block text-gray-700 text-sm font-bold mb-2">
                    Nhắc lại mật khẩu mới<span class="text-red-500"></span>
                  </label>
                  <input 
                    id="confirmPassword"
                    type="password"
                    v-model="confirmPass"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-red-500': errorConfirmPassword || errorMatch }">
                  <p v-if="errorConfirmPassword" class="mt-1 text-sm text-red-600">
                    Vui lòng nhập lại mật khẩu mới
                  </p>
                  <p v-if="errorMatch" class="mt-1 text-sm text-red-600">
                    Nhắc lại mật khẩu không đúng
                  </p>
                </div>

                <div class="text-center">
                  <button
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

export default {
  data () {
    return {  
      inputs: {
        new_password: null,
        old_password: null,
      },
      confirmPass : null,
      click: false,
      onUpdate: null,
      errorMatch: null,
    }
  },
  computed: {
    authStore() {
      return useAuthStore()
    },
    errorNewPassword () {
      return this.checkInfo(this.inputs.new_password)
    },
    errorNewPasswordCompare () {
      return this.comparePass()
    },
    errorConfirmPassword () {
      return this.checkInfo(this.confirmPass)
    },
    errorOldPassword () {
      return this.checkInfo(this.inputs.old_password)
    }
  },
  watch: {
    confirmPass () {
      this.errorMatch = false
    }
  },
  methods: {
    checkConfirmPass () {
      return this.errorConfirmPassword || (this.inputs.new_password == this.confirmPass)
    },
    comparePass () {
      return (this.click && (this.inputs.new_password != null && this.inputs.new_password.length > 0)
      && (this.inputs.old_password != null || this.inputs.old_password.length > 0)
      && (this.inputs.new_password == this.inputs.old_password))
    },
    checkInfo (info) {
      return (this.click && (info == null || info.length <= 0))
    },
    checkValidate () {
      return !(this.errorNewPassword || this.errorConfirmPassword || this.errorMatch || this.errorNewPasswordCompare)
    },
    update () {
      if(this.onUpdate == true) {
        return
      }

      this.click = true
      let result = this.checkValidate()
      this.errorMatch = !this.checkConfirmPass()
      const { success, error } = useToast()
      
      if(result && !this.errorMatch) {
        this.onUpdate = true

        AuthenticationAPI.staffChangePass(this.inputs).then(res => {
          if(res && res.data && res.data.status == 200) {
            success('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.')
            // Redirect to login page
            this.authStore.removeToken()
            this.$router.push('/staff-login')
          }
          this.onUpdate = false
        }).catch(err => {
          this.onUpdate = false

          let message = ""
          if(err.response?.data?.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          error(message)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // No custom styles needed - all using Tailwind
</style>
