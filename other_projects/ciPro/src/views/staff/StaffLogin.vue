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
                  <!--<h1 class="text-center">-->
                    <!--ciSale-->
                  <!--</h1>-->
                  <b-row>
                    <b-col class="text-center">
                      <img src="/static/img/project/home/logo_login.png" alt="logo" class="logo-login" />
                    </b-col>
                  </b-row>

                  <b-form-invalid-feedback  class="invalid-feedback" :state="errorFlag">
                      {{errorMess}}
                  </b-form-invalid-feedback>
                  <div class="form-group">
                    <label>Số Điện Thoại</label><span class="error-sybol"></span>
                    <input
                      id="phone"
                      v-model="inputs.phone_number"
                      type="text"
                      maxlength="20"
                      autocomplete="new-password"
                      class="form-control"
                      placeholder="Nhập số điện thoại" phoneNumberCheck
                      @keyup="intergerOnly($event.target)"
                      v-on:change="checkPhoneNumberFormat($event.target)">
                    <b-form-invalid-feedback  class="invalid-feedback" :state="phoneNumberCheckFlag">
                      Số điện thoại không đúng
                    </b-form-invalid-feedback>
                  </div>
                  <div class="form-group">
                    <label>Mật Khẩu</label><span class="error-sybol"></span>
                    <input
                      id="password"
                      v-model="inputs.password"
                      type="password"
                      class="form-control"
                      placeholder="Nhập mật khẩu">
                  </div>

                  <b-row>
                    <b-col
                      cols="12"
                      class="mb-2 text-center">
                      <b-button
                        variant="primary"
                        class="px-4 default-btn-bg"
                        @click.prevent="logIn"
                      :disabled="onLogin">
                        {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                      </b-button>
                    </b-col>
                  </b-row>

                  <b-row>
                    <b-col
                      cols="12"
                      class="mb-2">
                      <button @click.prevent="forgetpass" class="a-like-button">
                        Quên Mật Khẩu
                      </button>
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
import StaffMapper from '@/mapper/staff'
import Staff from '@/api/staff'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
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
      errorFlag: true,
      errorMess: ""
    }
  },
  methods: {
    /**
     *  Login
     */
     logIn () {
       if(this.phoneNumberCheckFlag) {
         this.onLogin = true
         this.errorMess = null
         Staff.logIn(this.inputs).then(res => {

          // Store token
          this.authStore.updateToken(res.data.data.token)

          // Store menu
          let menu = res.data.data.menu
          this.authStore.updateMenu(menu)

          // Store staff info
          const usr = StaffMapper.mapStaffModelToDto(res.data.data.staff_info)
          this.authStore.updateUser(usr)

           // Check user and redirect
           if(usr.isSuper) {
               this.$router.push("/home-sp-admin")
           } else {
               if(menu.length > 0 && menu[0].title == "Tổng quan") {
                   this.$router.push("/overview")
               } else {
                   this.$router.push("/")
               }

           }


          this.onLogin = false
         }).catch(err => {
           let message = ""
            if(err.response.data.status == 500) {
              message = "Lỗi hệ thống"
            } else {
              message = err.response.data.mess
            }
            this.errorFlag = false
            this.errorMess = message
            this.onLogin = false
         })
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
      let message = "Hãy liên hệ với admin của bạn để được reset lại mật khẩu. Nếu bạn là chủ kinh doanh, hãy liên hệ với chúng tôi (ciinTech) theo thông tin ở màn hình “Liên hệ”. Xin chân thành cảm ơn!"
      this.$bvModal.msgBoxOk(message, {
        title: "Quên Mật Khẩu",
        centered: true,
        size: 'sm',
        headerClass: 'bg-success',
      })
    },

  }
}
</script>

<style lang="scss">
  .logo-login {
    width: 32%;
    height: auto;
    text-align: center;
  }

</style>
