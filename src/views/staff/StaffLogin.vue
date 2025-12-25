<template>
  <div class="app flex-row align-items-center is-fixed-page">
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group">
            <div class="card">
              <div class="card-body">
                <form @submit.prevent="logIn">
                  <h2 class="text-center">
                    FEM - QL Chi Tiêu
                  </h2>

                  <div v-if="!errorFlag" class="alert alert-danger" role="alert">
                    {{ errorMess }}
                  </div>
                  
                  <div class="form-group">
                    <label>Số Điện Thoại</label><span class="error-sybol"></span>
                    <input
                      id="phone"
                      v-model="inputs.phone_number"
                      type="text"
                      maxlength="20"
                      autocomplete="new-password"
                      class="form-control"
                      :class="{ 'is-invalid': !phoneNumberCheckFlag }"
                      placeholder="Nhập số điện thoại"
                      @keyup="integerOnly($event.target)"
                      @change="checkPhoneNumberFormat($event.target)">
                    <div v-if="!phoneNumberCheckFlag" class="invalid-feedback d-block">
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

                  <div class="row">
                    <div class="col-12 mb-2 text-center">
                      <button
                        type="button"
                        class="btn btn-primary px-4 default-btn-bg"
                        @click.prevent="logIn"
                        :disabled="onLogin">
                        {{ onLogin ? 'Đăng Nhập...' : 'Đăng Nhập' }}
                      </button>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12 mb-2">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Staff from '@/api/staff'
import commonFunc from '@/common/commonFunc'

const router = useRouter()
const authStore = useAuthStore()

const inputs = ref({
  phone_number: '',
  password: '',
})
const onLogin = ref(false)
const phoneNumberCheckFlag = ref(true)
const errorFlag = ref(true)
const errorMess = ref('')

/**
 * Login
 */
const logIn = () => {
  if (phoneNumberCheckFlag.value) {
    onLogin.value = true
    errorMess.value = ''
    errorFlag.value = true
    
    Staff.logIn(inputs.value).then(res => {
      // Store token
      authStore.updateToken(res.data.data.token)

      // Store menu
      let menu = res.data.data.menu
      authStore.updateMenu(menu)

      // Store staff info
      const usr = res.data.data.staff_info
      authStore.updateUser(usr)

      // Check user and redirect
      if (usr.is_super) {
        router.push('/home-sp-admin')
      } else {
        router.push('/over-view')
      }

      onLogin.value = false
    }).catch(err => {
      let message = ''
      if (err.response?.data?.status == 500) {
        message = 'Lỗi hệ thống'
      } else {
        message = err.response?.data?.mess || 'Đăng nhập thất bại'
      }
      errorFlag.value = false
      errorMess.value = message
      onLogin.value = false
    })
  }
}

/**
 * Check phone number format
 */
const checkPhoneNumberFormat = (item) => {
  let valueInput = item.value
  if (valueInput != null && valueInput != '') {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  } else {
    phoneNumberCheckFlag.value = true
  }
}

/**
 * Only input integer
 */
const integerOnly = (item) => {
  let valueInput = item.value
  let result = commonFunc.integerOnly(valueInput)
  item.value = result

  if (valueInput.length == 10) {
    if (commonFunc.phoneNumberCheck(valueInput)) {
      phoneNumberCheckFlag.value = true
    } else {
      phoneNumberCheckFlag.value = false
    }
  }
}

/**
 * Forget password
 */
const forgetpass = () => {
  let message = 'Hãy liên hệ với admin của bạn để được reset lại mật khẩu. Nếu bạn là admin, hãy liên hệ với chúng tôi (ciinTech) theo thông tin ở màn hình "Liên hệ". Xin chân thành cảm ơn!'
  alert(message)
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
