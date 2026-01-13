<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <b-row class="row justify-content-center">
        <b-col md="6">
          <b-card-group>
            <b-card
              no-body>
              <b-card-body>
                <b-form method="put">
                  <h1 class="text-center">
                    Đổi Mật Khẩu
                  </h1>
                  <div class="form-group">
                    <label>
                      Mật Khẩu Hiện Tại
                    </label><span class="error-sybol"></span>
                    <input id="oldPassword"
                      type="password"
                      class="form-control"
                      v-model="inputs.old_password">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorOldPassword">
                      Vui lòng nhập mật khẩu hiện tại
                    </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Mật Khẩu Mới
                    </label><span class="error-sybol"></span>
                    <input id="newPassword"
                      type="password"
                      class="form-control"
                      v-model="inputs.new_password">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorNewPassword">
                      Vui lòng nhập mật khẩu mới
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorNewPasswordCompare">
                      Mật khẩu mới không được trùng mật khẩu cũ
                    </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>
                      Nhắc lại mật khẩu mới
                    </label><span class="error-sybol"></span>
                    <input id="confirmPassword"
                      type="password"
                      class="form-control"
                      v-model="confirmPass">
                    <b-form-invalid-feedback class="invalid-feedback" :state="!errorConfirmPassword">
                      Vui lòng nhập lại mật khẩu mới
                    </b-form-invalid-feedback>
                    <b-form-invalid-feedback class="invalid-feedback" :state="!errorMatch">
                      Nhắc lại mật khẩu không đúng
                    </b-form-invalid-feedback>
                  </div>
                  <b-row>
                    <b-col cols="12" class="text-center">
                      <b-button
                        @click="update"
                        :disabled="onUpdate"
                        :variant="onUpdate ? '' : 'primary'" class="default-btn-bg">
                        {{ onUpdate ? "Cập Nhật Mật Khẩu..." : "Cập Nhật Mật Khẩu" }}
                      </b-button>
                    </b-col>
                  </b-row>
                </b-form>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import { useAuthStore } from '@/stores/auth'
import AuthenticationAPI from '@/api/authentication'
import {Constant} from '@/common/constant'


export default {
  setup() {
    const authStore = useAuthStore()
    return { authStore }
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
            this.authStore.logout()
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
          this.$bvModal.msgBoxOk(message, {
            title: "Cập nhật thất bại",
            centered: true,
            size: 'sm',
            headerClass: 'bg-danger',
          })
        })
      }
    }
  }
}
</script>
