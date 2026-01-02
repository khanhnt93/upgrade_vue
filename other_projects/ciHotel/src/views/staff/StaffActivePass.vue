<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <b-row class="row justify-content-center">
        <b-col md="6">
          <b-card-group>
            <b-card
              no-body>
              <b-card-body>
                <b-form @submit.prevent="logIn">
                  <h1 class="text-center">
                  Kích Hoạt Mật khẩu mới
                  </h1>
                  <div class="form-group">
                    <label>Code</label><span class="error-sybol"></span>
                    <input
                      id="code"
                      type="text"
                      autocomplete="new-password"
                      class="form-control"
                      placeholder="Nhập số code"
                      v-model="inputs.code"
                      @keyup="integerOnly($event.target)"
                      maxlength="6">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="!errorCode">
                      Vui lòng nhập code
                    </b-form-invalid-feedback>
                  </div>
                  <b-button
                    @click="confirm"
                    :variant="onConfirm ? '' : 'primary'"
                    class="pull-right default-btn-bg"
                    :disabled="onConfirm">
                    {{ onConfirm ? "Xác nhận..." : "Xác nhận" }}
                  </b-button>
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
import AuthenticationAPI from '@/api/authentication'
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
    errorCode: function () {
      return this.checkInfo(this.inputs.code)
    }
  },
  mounted () {
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
              this.$bvModal.msgBoxOk(message, {
                title: "Kích hoạt tài khoản thành công",
                centered: true,
                size: 'sm',
                headerClass: 'bg-success',
              }).then(res => {
                if(res) {
                  this.$router.push('/staff-login')
                }
              })
            }
          }
        }).catch(err => {
          console.log(err)
          let message = ""
          if(err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.$bvModal.msgBoxOk(message, {
            title: "Update failed!",
            centered: true,
            size: 'sm',
            headerClass: 'bg-danger',
          })
        })
        this.onConfirm = false

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
