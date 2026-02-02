<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="grid grid-cols-1 justify-center">
        <div class="w-full md:w-1/2 mx-auto">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <form @submit.prevent="logIn">
                <h1 class="text-center text-2xl font-bold mb-6">
                  Kích Hoạt Mật khẩu mới
                </h1>
                
                <div class="form-group mb-4">
                  <label class="form-label">Code<span class="error-sybol"></span></label>
                  <input class="form-control"
                    :class="{'border-red-500': errorCode}"
                    id="code"
                    type="text"
                    autocomplete="new-password"
                    placeholder="Nhập số code"
                    v-model="inputs.code"
                    @keyup="integerOnly($event.target)"
                    maxlength="6">
                  <div v-if="errorCode" class="text-red-600 text-sm mt-1">
                    Vui lòng nhập code
                  </div>
                </div>
                
                <button
                  @click.prevent="confirm"
                  class="btn btn-primary w-full"
                  :disabled="onConfirm">
                  {{ onConfirm ? "Xác nhận..." : "Xác nhận" }}
                </button>
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
              alert(message)
              this.$router.push('/staff-login')
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
          alert(message)
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
