<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="flex flex-wrap justify-content-center">
        <div class="w-full md:w-1/2 px-2">
          <div class="card">
            <div class="p-4">
              <form method="put">
                <h1 class="text-center">
                  Đổi Mật Khẩu
                </h1>
                <div class="form-group">
                  <label>
                    Mật Khẩu Hiện Tại
                  </label><span class="error-sybol"></span>
                  <input id="oldPassword"
                    type="password"
                    :class="['form-control', { 'is-invalid': errorOldPassword }]"
                    v-model="inputs.old_password">
                  <div v-if="errorOldPassword" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập mật khẩu hiện tại
                  </div>
                </div>
                <div class="form-group">
                  <label>
                    Mật Khẩu Mới
                  </label><span class="error-sybol"></span>
                  <input id="newPassword"
                    type="password"
                    :class="['form-control', { 'is-invalid': errorNewPassword || errorNewPasswordCompare }]"
                    v-model="inputs.new_password">
                  <div v-if="errorNewPassword" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập mật khẩu mới
                  </div>
                  <div v-if="errorNewPasswordCompare" class="invalid-feedback" style="display: block;">
                    Mật khẩu mới không được trùng mật khẩu cũ
                  </div>
                </div>
                <div class="form-group">
                  <label>
                    Nhắc lại mật khẩu mới
                  </label><span class="error-sybol"></span>
                  <input id="confirmPassword"
                    type="password"
                    :class="['form-control', { 'is-invalid': errorConfirmPassword || errorMatch }]"
                    v-model="confirmPass">
                  <div v-if="errorConfirmPassword" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập lại mật khẩu mới
                  </div>
                  <div v-if="errorMatch" class="invalid-feedback" style="display: block;">
                    Nhắc lại mật khẩu không đúng
                  </div>
                </div>
                <div class="flex flex-wrap">
                  <div class="w-full text-center">
                    <button
                      type="button"
                      @click="update"
                      :disabled="onUpdate"
                      class="btn btn-primary default-btn-bg">
                      {{ onUpdate ? "Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu" }}
                    </button>
                  </div>
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
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import AuthenticationAPI from '@/api/authentication'
import {Constant} from '@/common/constant'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const authStore = useAuthStore()
    const { popToast } = useToast()
    const router = useRouter()

    return {
      authStore,
      popToast,
      router
    }
  },
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

        AuthenticationAPI.staffChangePass(this.inputs).then(res => {
          if(res && res.data && res.data.status == 200) {
            // Redirect to active pass page
            this.authStore.removeToken()
            this.router.push('/staff-login')
          }
          this.onUpdate = false
        }).catch(err => {
          this.onUpdate = false

          let message = ""
          if(err.response && err.response.data && err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.popToast('error', message)
        })
      }
    }
  }
}
</script>
