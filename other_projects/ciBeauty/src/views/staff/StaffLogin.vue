<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="grid grid-cols-1 justify-center">
        <div class="w-full md:w-1/2 mx-auto">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="p-6">
              <form @submit.prevent="logIn">
                <div class="text-center mb-6">
                  <img src="/img/project/logo.png" alt="logo" class="logo-login mx-auto" />
                </div>
                
                <div v-if="errorMess" class="text-red-600 text-sm mb-4 text-center">
                  {{ errorMess }}
                </div>
                
                <div class="form-group mb-4">
                  <label class="form-label">Số Điện Thoại<span class="error-sybol"></span></label>
                  <input class="form-control"
                    :class="{'border-red-500': !phoneNumberCheckFlag}"
                    id="phone"
                    v-model="inputs.phone_number"
                    type="text"
                    maxlength="20"
                    autocomplete="new-password"
                    placeholder="Nhập số điện thoại"
                    @keyup="intergerOnly($event.target)"
                    @change="checkPhoneNumberFormat($event.target)">
                  <div v-if="!phoneNumberCheckFlag" class="text-red-600 text-sm mt-1">
                    Số điện thoại không đúng
                  </div>
                </div>
                
                <div class="form-group mb-4">
                  <label class="form-label">Mật Khẩu<span class="error-sybol"></span></label>
                  <input
                    id="password"
                    v-model="inputs.password"
                    type="password"
                    class="form-control"
                    placeholder="Nhập mật khẩu">
                </div>

                <div class="mb-4 text-center">
                  <button
                    class="btn btn-primary px-4"
                    @click.prevent="logIn"
                    :disabled="onLogin">
                    {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                  </button>
                </div>

                <div class="mb-2 text-center">
                  <button @click.prevent="forgetpass" class="forget-pass">
                    Quên Mật Khẩu
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
import { useUserStore } from '@/stores/user'
import StaffMapper from '@/mapper/staff'
import Staff from '@/api/staff'
import commonFunc from '@/common/commonFunc'

export default {
  name: 'Login',
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
         const userStore = useUserStore()
         
         Staff.logIn(this.inputs).then(res => {

          // Store token
          userStore.updateToken(res.data.data.token)

          // Store menu
          let menu = res.data.data.menu
          userStore.updateMenu(menu)

          // Store staff info
          const usr = StaffMapper.mapStaffModelToDto(res.data.data.staff_info)
          userStore.updateUser(usr)

          if(menu.length > 0) {
            if(menu[0].href) {
              this.$router.push(menu[0].href)
            } else {
              this.$router.push(menu[0].child[0].href)
            }
            
          } else {
            this.errorMess = "Bạn không có quyền truy cập ứng dụng này!"
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
      let message = 'Hãy liên hệ với admin của bạn để được reset lại mật khẩu. Nếu bạn là chủ kinh doanh, hãy liên hệ với chúng tôi (ciinTech) theo thông tin ở màn hình "Liên hệ". Xin chân thành cảm ơn!'
      alert(message)
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
