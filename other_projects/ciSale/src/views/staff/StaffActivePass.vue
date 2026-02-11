<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="flex flex-wrap justify-content-center">
        <div class="w-full md:w-1/2 px-2">
          <div class="card">
            <div class="p-4">
              <form @submit.prevent="logIn">
                <h1 class="text-center">
                  Kích Hoạt Mật khẩu mới
                </h1>
                <div class="form-group">
                  <label>Code</label><span class="error-sybol"></span>
                  <input
                    id="code"
                    type="text"
                    autocomplete="new-password"
                    :class="['form-control', { 'is-invalid': errorCode }]"
                    placeholder="Nhập số code"
                    v-model="inputs.code"
                    @keyup="integerOnly($event.target)"
                    maxlength="6">
                  <div v-if="errorCode" class="invalid-feedback" style="display: block;">
                    Vui lòng nhập code
                  </div>
                </div>
                <button
                  type="button"
                  @click="confirm"
                  class="btn btn-primary pull-right default-btn-bg"
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
import { useToast } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import AuthenticationAPI from '@/api/authentication'
import commonFunc from '@/common/commonFunc'
import Cookies from 'js-cookie'

export default {
  name: 'ActiveAccount',
  setup() {
    const { popToast } = useToast()
    const router = useRouter()
    return { popToast, router }
  },
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
            if (res.data.status == 200) {
              Cookies.remove("staffPhoneNumber")

              // show popup success
              this.popToast('success', 'Tài khoản của bạn đã được kích hoạt')

              // Navigate to login after short delay
              setTimeout(() => {
                this.router.push('/staff-login')
              }, 1500)
            }
          }
        }).catch(err => {
          console.log(err)
          let message = ""
          if(err.response && err.response.data && err.response.data.status == 422) {
            message = err.response.data.mess
          } else {
            message = "Lỗi hệ thống"
          }
          this.popToast('error', message)
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
