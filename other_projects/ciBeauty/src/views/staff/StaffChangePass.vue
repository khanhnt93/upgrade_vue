<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="grid grid-cols-1 justify-center">
        <div class="w-full md:w-1/2 mx-auto">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <form method="put">
                <h1 class="text-center text-2xl font-bold mb-6">
                  Đổi Mật Khẩu
                </h1>
                
                <div class="form-group mb-4">
                  <label class="form-label">
                    Mật Khẩu Hiện Tại<span class="error-sybol"></span>
                  </label>
                  <input class="form-control"
                    :class="{'border-red-500': errorOldPassword}"
                    id="oldPassword"  
                    type="password"
                    v-model="inputs.old_password">
                  <div v-if="errorOldPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mật khẩu hiện tại
                  </div>
                </div>
                
                <div class="form-group mb-4">
                  <label class="form-label">
                    Mật Khẩu Mới<span class="error-sybol"></span>
                  </label>
                  <input class="form-control"
                    :class="{'border-red-500': errorNewPassword || errorNewPasswordCompare}"
                    id="newPassword"
                    type="password"
                    v-model="inputs.new_password">
                  <div v-if="errorNewPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập mật khẩu mới
                  </div>
                  <div v-if="errorNewPasswordCompare" class="text-red-600 text-sm mt-1">
                    Mật khẩu mới không được trùng mật khẩu cũ
                  </div>
                </div>
                
                <div class="form-group mb-4">
                  <label class="form-label">
                    Nhắc lại mật khẩu mới<span class="error-sybol"></span>
                  </label>
                  <input class="form-control"
                    :class="{'border-red-500': errorConfirmPassword || errorMatch}"
                    id="confirmPassword"
                    type="password"
                    v-model="confirmPass">
                  <div v-if="errorConfirmPassword" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập lại mật khẩu mới
                  </div>
                  <div v-if="errorMatch" class="text-red-600 text-sm mt-1">
                    Nhắc lại mật khẩu không đúng
                  </div>
                </div>
                
                <div class="text-center">
                  <button
                    @click.prevent="update" 
                    :disabled="onUpdate"
                    class="btn btn-primary px-4">
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
import { useAuthStore } from '@/stores/auth'
import AuthenticationAPI from '@/api/authentication'
import {Constant} from '@/common/constant'


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
      if(result && !this.errorMatch) {
        this.onUpdate = true
        const authStore = useAuthStore()

        AuthenticationAPI.staffChangePass(this.inputs).then(res => {
          if(res && res.data && res.data.status == 200) {
            // Redirect to login page
            authStore.logout()
            this.$router.push('/staff-login')
          }
          this.onUpdate = false
        }).catch(err => {
          this.onUpdate = false

          let message = ""
          if(err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          alert(message)
        })
      }
    }
  }
}
</script>
