<template>
  <div class="app flex items-center justify-center">
    <div class="container-fluid">
      <div class="flex justify-center">
        <div class="w-full md:w-2/3 px-2">
          <div class="card">
            <div class="p-8">
              <form @submit.prevent="logIn">
                <!--<h1 class="text-center">-->
                  <!--ciSale-->
                <!--</h1>-->
                <div class="flex flex-wrap">
                  <div class="w-full text-center flex items-center justify-center">
                    <img src="/static/img/project/home/logo_login.png" alt="logo" class="logo-login" />
                  </div>
                </div>

                <div v-if="!errorFlag" class="invalid-feedback" style="display: block;">
                    {{errorMess}}
                </div>
                <div class="form-group">
                  <label>Số Điện Thoại</label><span class="error-sybol"></span>
                  <input
                    id="phone"
                    v-model="inputs.phone_number"
                    type="text"
                    maxlength="20"
                    autocomplete="new-password"
                    :class="['form-control', { 'is-invalid': !phoneNumberCheckFlag }]"
                    placeholder="Nhập số điện thoại"
                    @keyup="intergerOnly($event.target)"
                    v-on:change="checkPhoneNumberFormat($event.target)">
                  <div v-if="!phoneNumberCheckFlag" class="invalid-feedback" style="display: block;">
                    Số điện thoại không đúng
                  </div>
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

                <div class="flex flex-wrap">
                  <div class="w-full mb-2 mt-4 text-center">
                    <button
                      type="button"
                      class="btn btn-primary px-4 default-btn-bg"
                      @click.prevent="logIn"
                      :disabled="onLogin">
                      {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                    </button>
                  </div>
                </div>

                <div class="flex flex-wrap">
                  <div class="w-full mb-2">
                    <button @click.prevent="forgetpass" class="forget-pass">
                      Quên Mật Khẩu
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
import { useAuthStore } from '@/stores/auth'
import { useToastNotification } from '@/composables/useToast'
import { useRouter } from 'vue-router'
import StaffMapper from '@/mapper/staff'
import Staff from '@/api/staff'
import { Constant } from '@/common/constant'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const { popToast } = useToastNotification()
    const router = useRouter()
    return { authStore, popToast, router }
  },
  data() {
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
           console.log(usr)
           this.authStore.updateUser(usr)

           // Check user and redirect
           if(usr.isSuper) {
               this.router.push("/home-sp-admin")
           } else {
               if(menu.length > 0 && menu[0].title == "Tổng quan") {
                   this.router.push("/overview")
               } else {
                   this.router.push("/")
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
      this.popToast('info', message)
    },
  }
}
</script>

<style lang="scss">
  .logo-login {
    width: 80%;
    height: auto;
    text-align: center;
  }

  .forget-pass {
    background: none!important;
    border: none;
    padding: 0!important;
    /*optional*/
    font-family: arial, sans-serif;
    /*input has OS specific font-family*/
    color: #069;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
